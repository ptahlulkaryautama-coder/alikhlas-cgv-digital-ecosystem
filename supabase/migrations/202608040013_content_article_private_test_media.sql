-- Private, test-only article media. Disabled by default.
begin;

insert into public.integration_feature_flags(key,enabled)
values('content_article_media_test_enabled',false)
on conflict(key) do nothing;

alter table public.content_articles
  add column if not exists cover_image_path text not null default ''
  check (char_length(cover_image_path)<=300);

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('content-article-test-media','content-article-test-media',false,5242880,array['image/jpeg','image/png','image/webp'])
on conflict(id) do update set public=false,file_size_limit=5242880,allowed_mime_types=excluded.allowed_mime_types;

drop policy if exists content_article_test_media_read on storage.objects;
create policy content_article_test_media_read on storage.objects for select to authenticated
using(bucket_id='content-article-test-media' and public.has_permission('content:read'));

drop policy if exists content_article_test_media_insert on storage.objects;
create policy content_article_test_media_insert on storage.objects for insert to authenticated
with check(
  bucket_id='content-article-test-media'
  and (storage.foldername(name))[1]=auth.uid()::text
  and public.has_permission('content:write')
  and coalesce((select enabled from public.integration_feature_flags where key='content_article_writes_enabled'),false)
  and coalesce((select enabled from public.integration_feature_flags where key='content_article_test_mode_enabled'),false)
  and coalesce((select enabled from public.integration_feature_flags where key='content_article_media_test_enabled'),false)
);

drop policy if exists content_article_test_media_delete_orphan on storage.objects;
create policy content_article_test_media_delete_orphan on storage.objects for delete to authenticated
using(
  bucket_id='content-article-test-media'
  and (storage.foldername(name))[1]=auth.uid()::text
  and public.has_permission('content:write')
  and coalesce((select enabled from public.integration_feature_flags where key='content_article_media_test_enabled'),false)
  and not exists(select 1 from public.content_articles a where a.cover_image_path=storage.objects.name)
);

create or replace function public.attach_content_article_test_media(
  p_article_id uuid,
  p_expected_version integer,
  p_object_path text,
  p_idempotency_key uuid
) returns jsonb language plpgsql security definer set search_path=public,storage as $$
declare a public.content_articles%rowtype; result jsonb; before_row jsonb;
begin
  if auth.uid() is null then raise exception 'AUTHENTICATION_REQUIRED'; end if;
  if p_idempotency_key is null then raise exception 'IDEMPOTENCY_KEY_REQUIRED'; end if;
  select r.result into result from public.content_article_command_receipts r where r.actor_user_id=auth.uid() and r.idempotency_key=p_idempotency_key;
  if found then return result; end if;
  if not public.has_permission('content:write') then raise exception 'ARTICLE_MEDIA_FORBIDDEN'; end if;
  if not coalesce((select enabled from public.integration_feature_flags where key='content_article_writes_enabled'),false)
     or not coalesce((select enabled from public.integration_feature_flags where key='content_article_test_mode_enabled'),false)
     or not coalesce((select enabled from public.integration_feature_flags where key='content_article_media_test_enabled'),false)
  then raise exception 'ARTICLE_MEDIA_DISABLED'; end if;
  if p_object_path !~ ('^'||auth.uid()::text||'/[0-9a-f-]{36}\.(jpg|jpeg|png|webp)$') then raise exception 'ARTICLE_MEDIA_PATH_INVALID'; end if;
  if not exists(select 1 from storage.objects o where o.bucket_id='content-article-test-media' and o.name=p_object_path)
  then raise exception 'ARTICLE_MEDIA_NOT_FOUND'; end if;
  select * into a from public.content_articles where id=p_article_id for update;
  if not found then raise exception 'ARTICLE_NOT_FOUND'; end if;
  if a.version<>p_expected_version then raise exception 'ARTICLE_VERSION_CONFLICT'; end if;
  if a.environment<>'test' or a.created_by<>auth.uid() or a.workflow_status not in('Draft','Ditolak')
  then raise exception 'ARTICLE_MEDIA_NOT_EDITABLE'; end if;
  before_row:=to_jsonb(a);
  update public.content_articles set cover_image_path=p_object_path,cover_image_url='',version=version+1,updated_at=now() where id=a.id;
  select jsonb_build_object('id',id,'version',version,'cover_image_path',cover_image_path) into result from public.content_articles where id=a.id;
  insert into public.audit_events(actor_user_id,action,entity_type,entity_id,before_snapshot,after_snapshot)
  select auth.uid(),'content.article.media.attach','content_article',a.id,before_row,to_jsonb(n) from public.content_articles n where n.id=a.id;
  insert into public.content_article_command_receipts(actor_user_id,idempotency_key,action,article_id,result)
  values(auth.uid(),p_idempotency_key,'media_attach',a.id,result);
  return result;
end;$$;

revoke all on function public.attach_content_article_test_media(uuid,integer,text,uuid) from public,anon;
grant execute on function public.attach_content_article_test_media(uuid,integer,text,uuid) to authenticated;

create or replace function public.content_article_capabilities()
returns jsonb language sql stable security definer set search_path=public as $$
  select jsonb_build_object(
    'writes_enabled',coalesce((select enabled from public.integration_feature_flags where key='content_article_writes_enabled'),false),
    'test_mode_enabled',coalesce((select enabled from public.integration_feature_flags where key='content_article_test_mode_enabled'),false),
    'media_test_enabled',coalesce((select enabled from public.integration_feature_flags where key='content_article_media_test_enabled'),false),
    'can_write',public.has_permission('content:write'),
    'can_approve',public.has_permission('content:approve')
  );
$$;
revoke all on function public.content_article_capabilities() from public,anon;
grant execute on function public.content_article_capabilities() to authenticated;

commit;
