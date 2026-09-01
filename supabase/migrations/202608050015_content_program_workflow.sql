-- Test-only Program & Kegiatan workflow. Existing rows remain production and immutable.
begin;

insert into public.integration_feature_flags(key,enabled) values
  ('content_program_writes_enabled',false),
  ('content_program_test_mode_enabled',false)
on conflict(key) do nothing;

alter table public.content_programs
  add column if not exists environment text not null default 'production' check(environment in('test','production')),
  add column if not exists created_by uuid references public.profiles(id),
  add column if not exists reviewed_by uuid references public.profiles(id),
  add column if not exists rejection_reason text check(rejection_reason is null or char_length(rejection_reason) between 5 and 500),
  add column if not exists reviewed_at timestamptz,
  add column if not exists archived_by uuid references public.profiles(id);

alter table public.content_programs drop constraint if exists content_programs_status_check;
alter table public.content_programs add constraint content_programs_status_check
  check(status in('Draft','Dalam peninjauan','Siap publik','Ditolak','Arsip'));
alter table public.content_programs add constraint content_programs_poster_https_check
  check(poster_url='' or poster_url~'^https://') not valid;

create table if not exists public.content_program_command_receipts(
  actor_user_id uuid not null references public.profiles(id),
  idempotency_key uuid not null,
  action text not null,
  program_id uuid not null references public.content_programs(id),
  result jsonb not null,
  created_at timestamptz not null default now(),
  primary key(actor_user_id,idempotency_key)
);
alter table public.content_program_command_receipts enable row level security;
revoke all on table public.content_program_command_receipts from anon,authenticated;

drop policy if exists content_programs_public_read on public.content_programs;
create policy content_programs_public_read on public.content_programs for select to anon,authenticated
using(environment='production' and visibility='Publik' and status='Siap publik' and archived_at is null);

create or replace function public.require_content_program_test_mode()
returns trigger language plpgsql security definer set search_path=public as $$
begin
  if new.environment<>'test' then raise exception 'PROGRAM_PRODUCTION_WRITE_DISABLED'; end if;
  if not coalesce((select enabled from public.integration_feature_flags where key='content_program_test_mode_enabled'),false)
  then raise exception 'PROGRAM_TEST_MODE_DISABLED'; end if;
  return new;
end;$$;
revoke all on function public.require_content_program_test_mode() from public;
drop trigger if exists content_programs_require_test_mode on public.content_programs;
create trigger content_programs_require_test_mode before insert or update on public.content_programs
for each row execute function public.require_content_program_test_mode();

create or replace function public.content_program_capabilities()
returns jsonb language sql stable security definer set search_path=public as $$
select jsonb_build_object(
  'writes_enabled',coalesce((select enabled from public.integration_feature_flags where key='content_program_writes_enabled'),false),
  'test_mode_enabled',coalesce((select enabled from public.integration_feature_flags where key='content_program_test_mode_enabled'),false),
  'can_write',public.has_permission('content:write'),
  'can_approve',public.has_permission('content:approve'));
$$;
revoke all on function public.content_program_capabilities() from public,anon;
grant execute on function public.content_program_capabilities() to authenticated;

create or replace function public.command_content_program(
  p_action text,p_idempotency_key uuid,p_program_id uuid default null,
  p_expected_version integer default null,p_payload jsonb default '{}'::jsonb,p_reason text default null
) returns jsonb language plpgsql security definer set search_path=public as $$
declare p public.content_programs%rowtype; before_row jsonb; result jsonb; target_id uuid;
begin
  if auth.uid() is null then raise exception 'AUTHENTICATION_REQUIRED'; end if;
  if not coalesce((select enabled from public.integration_feature_flags where key='content_program_writes_enabled'),false)
     or not coalesce((select enabled from public.integration_feature_flags where key='content_program_test_mode_enabled'),false)
  then raise exception 'PROGRAM_WRITES_DISABLED'; end if;
  if p_idempotency_key is null then raise exception 'IDEMPOTENCY_KEY_REQUIRED'; end if;
  select r.result into result from public.content_program_command_receipts r where r.actor_user_id=auth.uid() and r.idempotency_key=p_idempotency_key;
  if found then return result; end if;
  if (select count(*) from public.content_program_command_receipts where actor_user_id=auth.uid() and created_at>now()-interval '15 minutes')>=30
  then raise exception 'PROGRAM_RATE_LIMITED'; end if;

  if p_action='create' then
    if not public.has_permission('content:write') then raise exception 'PROGRAM_FORBIDDEN'; end if;
    insert into public.content_programs(title,category,pillar,description,schedule_day,schedule_time,location,speaker_label,poster_url,visibility,status,source_verified,environment,created_by)
    values(trim(p_payload->>'title'),trim(p_payload->>'category'),coalesce(trim(p_payload->>'pillar'),'Ilmu'),coalesce(trim(p_payload->>'description'),''),coalesce(trim(p_payload->>'schedule_day'),''),coalesce(trim(p_payload->>'schedule_time'),''),coalesce(trim(p_payload->>'location'),''),coalesce(trim(p_payload->>'speaker_label'),''),coalesce(trim(p_payload->>'poster_url'),''),coalesce(p_payload->>'visibility','Pengurus'),'Draft',false,'test',auth.uid())
    returning id into target_id;
  else
    if p_program_id is null or p_expected_version is null then raise exception 'PROGRAM_ID_AND_VERSION_REQUIRED'; end if;
    select * into p from public.content_programs where id=p_program_id for update;
    if not found then raise exception 'PROGRAM_NOT_FOUND'; end if;
    if p.environment<>'test' then raise exception 'PROGRAM_PRODUCTION_WRITE_DISABLED'; end if;
    if p.version<>p_expected_version then raise exception 'PROGRAM_VERSION_CONFLICT'; end if;
    before_row:=to_jsonb(p);target_id:=p.id;
    if p_action='update' then
      if not public.has_permission('content:write') or p.created_by<>auth.uid() or p.status not in('Draft','Ditolak') then raise exception 'PROGRAM_NOT_EDITABLE'; end if;
      update public.content_programs set title=trim(p_payload->>'title'),category=trim(p_payload->>'category'),pillar=coalesce(trim(p_payload->>'pillar'),'Ilmu'),description=coalesce(trim(p_payload->>'description'),''),schedule_day=coalesce(trim(p_payload->>'schedule_day'),''),schedule_time=coalesce(trim(p_payload->>'schedule_time'),''),location=coalesce(trim(p_payload->>'location'),''),speaker_label=coalesce(trim(p_payload->>'speaker_label'),''),poster_url=coalesce(trim(p_payload->>'poster_url'),''),visibility=coalesce(p_payload->>'visibility','Pengurus'),status='Draft',rejection_reason=null,version=version+1,updated_at=now() where id=target_id;
    elsif p_action='submit_review' then
      if not public.has_permission('content:write') or p.created_by<>auth.uid() or p.status not in('Draft','Ditolak') then raise exception 'PROGRAM_NOT_SUBMITTABLE'; end if;
      update public.content_programs set status='Dalam peninjauan',rejection_reason=null,version=version+1,updated_at=now() where id=target_id;
    elsif p_action in('approve','reject') then
      if not public.has_permission('content:approve') or p.created_by=auth.uid() or p.status<>'Dalam peninjauan' then raise exception 'PROGRAM_REVIEW_FORBIDDEN'; end if;
      if p_action='reject' and (p_reason is null or char_length(trim(p_reason)) not between 5 and 500) then raise exception 'REJECTION_REASON_REQUIRED'; end if;
      update public.content_programs set status=case when p_action='approve' then 'Siap publik' else 'Ditolak' end,source_verified=(p_action='approve'),reviewed_by=auth.uid(),reviewed_at=now(),rejection_reason=case when p_action='reject' then trim(p_reason) else null end,version=version+1,updated_at=now() where id=target_id;
    elsif p_action='archive' then
      if not public.has_permission('content:write') or (p.created_by<>auth.uid() and not public.has_permission('content:approve')) then raise exception 'PROGRAM_ARCHIVE_FORBIDDEN'; end if;
      update public.content_programs set status='Arsip',archived_by=auth.uid(),archived_at=now(),version=version+1,updated_at=now() where id=target_id;
    elsif p_action='restore' then
      if not public.has_permission('content:write') or p.status<>'Arsip' or (p.created_by<>auth.uid() and not public.has_permission('content:approve')) then raise exception 'PROGRAM_RESTORE_FORBIDDEN'; end if;
      update public.content_programs set status='Draft',source_verified=false,archived_by=null,archived_at=null,version=version+1,updated_at=now() where id=target_id;
    else raise exception 'UNKNOWN_PROGRAM_ACTION'; end if;
  end if;
  select jsonb_build_object('id',id,'status',status,'version',version,'environment',environment) into result from public.content_programs where id=target_id;
  insert into public.audit_events(actor_user_id,action,entity_type,entity_id,before_snapshot,after_snapshot)
  select auth.uid(),'content.program.'||p_action,'content_program',target_id,before_row,to_jsonb(n) from public.content_programs n where n.id=target_id;
  insert into public.content_program_command_receipts(actor_user_id,idempotency_key,action,program_id,result)
  values(auth.uid(),p_idempotency_key,p_action,target_id,result);
  return result;
end;$$;
revoke all on function public.command_content_program(text,uuid,uuid,integer,jsonb,text) from public,anon;
grant execute on function public.command_content_program(text,uuid,uuid,integer,jsonb,text) to authenticated;

commit;
