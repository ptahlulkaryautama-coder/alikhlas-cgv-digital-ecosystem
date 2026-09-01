-- Kabar Masjid article workflow. Writes remain disabled by default.
begin;

insert into public.integration_feature_flags (key, enabled)
values ('content_article_writes_enabled', false)
on conflict (key) do update set enabled = false, updated_at = now(), updated_by = null;

create table public.content_articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$' and char_length(slug) <= 160),
  title text not null check (char_length(title) between 5 and 180),
  excerpt text not null default '' check (char_length(excerpt) <= 500),
  body text not null default '' check (char_length(body) <= 30000),
  category text not null check (char_length(category) between 1 and 80),
  tags text[] not null default '{}' check (cardinality(tags) <= 12 and char_length(array_to_string(tags, '')) <= 480),
  cover_image_url text not null default '' check (char_length(cover_image_url) <= 500 and (cover_image_url = '' or cover_image_url ~ '^https://')),
  author_label text not null default '' check (char_length(author_label) <= 120),
  visibility text not null default 'Pengurus' check (visibility in ('Publik', 'Pengurus')),
  workflow_status text not null default 'Draft' check (workflow_status in ('Draft', 'Dalam peninjauan', 'Siap publik', 'Ditolak', 'Arsip')),
  source_verified boolean not null default false,
  version integer not null default 1 check (version > 0),
  created_by uuid not null references public.profiles(id),
  reviewed_by uuid references public.profiles(id),
  published_by uuid references public.profiles(id),
  archived_by uuid references public.profiles(id),
  rejection_reason text check (rejection_reason is null or char_length(rejection_reason) between 5 and 500),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  reviewed_at timestamptz,
  published_at timestamptz,
  archived_at timestamptz
);

create table public.content_article_command_receipts (
  actor_user_id uuid not null references public.profiles(id),
  idempotency_key uuid not null,
  action text not null,
  article_id uuid not null references public.content_articles(id),
  result jsonb not null,
  created_at timestamptz not null default now(),
  primary key (actor_user_id, idempotency_key)
);

create index content_articles_public_idx on public.content_articles (workflow_status, visibility, published_at desc);
create index content_articles_admin_idx on public.content_articles (workflow_status, updated_at desc);
create index content_article_receipts_actor_time_idx on public.content_article_command_receipts (actor_user_id, created_at desc);

alter table public.content_articles enable row level security;
alter table public.content_article_command_receipts enable row level security;
revoke all on table public.content_articles from anon, authenticated;
revoke all on table public.content_article_command_receipts from anon, authenticated;
grant select on table public.content_articles to anon, authenticated;

create policy content_articles_public_read on public.content_articles for select to anon
using (workflow_status = 'Siap publik' and visibility = 'Publik' and archived_at is null);

create policy content_articles_admin_read on public.content_articles for select to authenticated
using (public.has_permission('content:read'));

-- No browser INSERT/UPDATE/DELETE policies. All commands pass through the RPC below.

create or replace function public.content_article_capabilities()
returns jsonb language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'writes_enabled', coalesce((select enabled from public.integration_feature_flags where key='content_article_writes_enabled'), false),
    'can_write', public.has_permission('content:write'),
    'can_approve', public.has_permission('content:approve')
  );
$$;
revoke all on function public.content_article_capabilities() from public;
grant execute on function public.content_article_capabilities() to authenticated;

create or replace function public.command_content_article(
  p_action text,
  p_idempotency_key uuid,
  p_article_id uuid default null,
  p_expected_version integer default null,
  p_payload jsonb default '{}'::jsonb,
  p_reason text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_article public.content_articles%rowtype;
  v_before jsonb;
  v_result jsonb;
  v_new_id uuid;
begin
  if auth.uid() is null then raise exception 'AUTHENTICATION_REQUIRED'; end if;
  if not coalesce((select enabled from public.integration_feature_flags where key = 'content_article_writes_enabled'), false) then
    raise exception 'ARTICLE_WRITES_DISABLED';
  end if;
  if p_idempotency_key is null then raise exception 'IDEMPOTENCY_KEY_REQUIRED'; end if;
  select result into v_result from public.content_article_command_receipts
   where actor_user_id = auth.uid() and idempotency_key = p_idempotency_key;
  if found then return v_result; end if;
  if (select count(*) from public.content_article_command_receipts where actor_user_id=auth.uid() and created_at > now()-interval '15 minutes') >= 30 then
    raise exception 'ARTICLE_RATE_LIMITED';
  end if;

  if p_action = 'create' then
    if not public.has_permission('content:write') then raise exception 'ARTICLE_FORBIDDEN'; end if;
    insert into public.content_articles (slug,title,excerpt,body,category,tags,cover_image_url,author_label,visibility,created_by)
    values (
      trim(p_payload->>'slug'), trim(p_payload->>'title'), coalesce(trim(p_payload->>'excerpt'), ''),
      coalesce(p_payload->>'body', ''), trim(p_payload->>'category'),
      coalesce(array(select jsonb_array_elements_text(coalesce(p_payload->'tags','[]'::jsonb))), '{}'),
      coalesce(trim(p_payload->>'cover_image_url'), ''), coalesce(trim(p_payload->>'author_label'), ''),
      coalesce(p_payload->>'visibility', 'Pengurus'), auth.uid()
    ) returning id into v_new_id;
  else
    if p_article_id is null or p_expected_version is null then raise exception 'ARTICLE_ID_AND_VERSION_REQUIRED'; end if;
    select * into v_article from public.content_articles where id = p_article_id for update;
    if not found then raise exception 'ARTICLE_NOT_FOUND'; end if;
    if v_article.version <> p_expected_version then raise exception 'ARTICLE_VERSION_CONFLICT'; end if;
    v_before := to_jsonb(v_article);
    v_new_id := v_article.id;

    if p_action = 'update' then
      if not public.has_permission('content:write') then raise exception 'ARTICLE_FORBIDDEN'; end if;
      if v_article.workflow_status not in ('Draft','Ditolak') then raise exception 'ARTICLE_NOT_EDITABLE'; end if;
      update public.content_articles set
        slug=trim(p_payload->>'slug'), title=trim(p_payload->>'title'), excerpt=coalesce(trim(p_payload->>'excerpt'),''),
        body=coalesce(p_payload->>'body',''), category=trim(p_payload->>'category'),
        tags=coalesce(array(select jsonb_array_elements_text(coalesce(p_payload->'tags','[]'::jsonb))), '{}'),
        cover_image_url=coalesce(trim(p_payload->>'cover_image_url'),''), author_label=coalesce(trim(p_payload->>'author_label'),''),
        visibility=coalesce(p_payload->>'visibility','Pengurus'), workflow_status='Draft', rejection_reason=null,
        version=version+1, updated_at=now()
      where id=v_new_id;
    elsif p_action = 'submit_review' then
      if not public.has_permission('content:write') or v_article.created_by <> auth.uid() then raise exception 'ARTICLE_FORBIDDEN'; end if;
      if v_article.workflow_status not in ('Draft','Ditolak') then raise exception 'INVALID_ARTICLE_TRANSITION'; end if;
      update public.content_articles set workflow_status='Dalam peninjauan',rejection_reason=null,version=version+1,updated_at=now() where id=v_new_id;
    elsif p_action in ('approve','reject') then
      if not public.has_permission('content:approve') then raise exception 'ARTICLE_REVIEW_FORBIDDEN'; end if;
      if v_article.created_by = auth.uid() then raise exception 'SELF_APPROVAL_FORBIDDEN'; end if;
      if v_article.workflow_status <> 'Dalam peninjauan' then raise exception 'INVALID_ARTICLE_TRANSITION'; end if;
      if p_action='reject' and (p_reason is null or char_length(trim(p_reason)) not between 5 and 500) then raise exception 'REJECTION_REASON_REQUIRED'; end if;
      update public.content_articles set workflow_status=case when p_action='approve' then 'Siap publik' else 'Ditolak' end,
        source_verified=(p_action='approve'), reviewed_by=auth.uid(), reviewed_at=now(),
        published_by=case when p_action='approve' then auth.uid() else null end,
        published_at=case when p_action='approve' then now() else null end,
        rejection_reason=case when p_action='reject' then trim(p_reason) else null end,
        version=version+1,updated_at=now() where id=v_new_id;
    elsif p_action = 'archive' then
      if not public.has_permission('content:write') then raise exception 'ARTICLE_FORBIDDEN'; end if;
      if v_article.created_by <> auth.uid() and not public.has_permission('content:approve') then raise exception 'ARTICLE_ARCHIVE_FORBIDDEN'; end if;
      update public.content_articles set workflow_status='Arsip',archived_by=auth.uid(),archived_at=now(),version=version+1,updated_at=now() where id=v_new_id;
    elsif p_action = 'restore' then
      if not public.has_permission('content:write') or v_article.workflow_status <> 'Arsip' then raise exception 'ARTICLE_RESTORE_FORBIDDEN'; end if;
      if v_article.created_by <> auth.uid() and not public.has_permission('content:approve') then raise exception 'ARTICLE_RESTORE_FORBIDDEN'; end if;
      update public.content_articles set workflow_status='Draft',source_verified=false,archived_by=null,archived_at=null,version=version+1,updated_at=now() where id=v_new_id;
    else raise exception 'UNKNOWN_ARTICLE_ACTION';
    end if;
  end if;

  select jsonb_build_object('id',id,'slug',slug,'workflow_status',workflow_status,'version',version) into v_result
  from public.content_articles where id=v_new_id;
  insert into public.audit_events(actor_user_id,action,entity_type,entity_id,before_snapshot,after_snapshot)
  select auth.uid(),'content.article.'||p_action,'content_article',v_new_id,v_before,to_jsonb(a) from public.content_articles a where a.id=v_new_id;
  insert into public.content_article_command_receipts(actor_user_id,idempotency_key,action,article_id,result)
  values(auth.uid(),p_idempotency_key,p_action,v_new_id,v_result);
  return v_result;
end;
$$;

revoke all on function public.command_content_article(text,uuid,uuid,integer,jsonb,text) from public;
grant execute on function public.command_content_article(text,uuid,uuid,integer,jsonb,text) to authenticated;

commit;
