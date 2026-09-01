-- Private TPQ vault foundation.
-- This prepares a locked, audited boundary for future individual TPQ records.
-- It intentionally stores only opaque IDs plus sealed payload metadata; no raw child/family fields are modeled here.

begin;

insert into public.integration_feature_flags(key,enabled)
values
  ('tpq_private_read_enabled',false),
  ('tpq_private_writes_enabled',false)
on conflict(key) do nothing;

insert into public.role_permissions(role,permission) values
  ('super_admin','tpq:private_read'),
  ('super_admin','tpq:private_write'),
  ('kepala_tpq','tpq:private_read'),
  ('kepala_tpq','tpq:private_write')
on conflict do nothing;

do $$ begin
  create type public.tpq_private_record_kind as enum ('learner_profile','family_contact','attendance_note','progress_note','document_note');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.tpq_private_record_status as enum ('active','archived');
exception when duplicate_object then null; end $$;

create table if not exists public.tpq_private_records (
  id uuid primary key default gen_random_uuid(),
  opaque_code text not null unique check (opaque_code ~ '^tpq_[a-z0-9_\\-]{8,80}$'),
  record_kind public.tpq_private_record_kind not null,
  record_status public.tpq_private_record_status not null default 'active',
  sealed_payload jsonb not null check (
    jsonb_typeof(sealed_payload)='object'
    and sealed_payload ? 'ciphertext'
    and sealed_payload ? 'algorithm'
    and sealed_payload ? 'key_version'
    and char_length(coalesce(sealed_payload->>'ciphertext','')) between 16 and 20000
    and char_length(coalesce(sealed_payload->>'algorithm','')) between 3 and 60
    and char_length(coalesce(sealed_payload->>'key_version','')) between 1 and 80
  ),
  source_label text check (source_label is null or char_length(source_label) <= 160),
  retention_until date,
  consent_recorded_at timestamptz,
  created_by uuid references public.profiles(id) on delete set null,
  updated_by uuid references public.profiles(id) on delete set null,
  archived_by uuid references public.profiles(id) on delete set null,
  archived_at timestamptz,
  version integer not null default 1 check (version >= 1),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists tpq_private_records_kind_status_idx
on public.tpq_private_records(record_kind,record_status,updated_at desc);

alter table public.tpq_private_records enable row level security;
revoke all on table public.tpq_private_records from anon,authenticated;
grant select on table public.tpq_private_records to authenticated;

drop policy if exists tpq_private_records_read_authorized on public.tpq_private_records;
create policy tpq_private_records_read_authorized
on public.tpq_private_records for select to authenticated
using (
  coalesce((select enabled from public.integration_feature_flags where key='tpq_private_read_enabled'),false)
  and public.has_permission('tpq:private_read')
);

create or replace function public.tpq_private_capabilities()
returns jsonb
language sql
stable
security definer
set search_path=public
as $$
  select jsonb_build_object(
    'read_enabled',coalesce((select enabled from public.integration_feature_flags where key='tpq_private_read_enabled'),false),
    'writes_enabled',coalesce((select enabled from public.integration_feature_flags where key='tpq_private_writes_enabled'),false),
    'can_private_read',public.has_permission('tpq:private_read'),
    'can_private_write',public.has_permission('tpq:private_write')
  );
$$;

create or replace function public.command_tpq_private_record(
  p_action text,
  p_record_id uuid default null,
  p_expected_version integer default null,
  p_payload jsonb default '{}'::jsonb
)
returns jsonb
language plpgsql
security definer
set search_path=public
as $$
declare
  before_row jsonb;
  after_row jsonb;
  target_id uuid;
begin
  if auth.uid() is null then raise exception 'AUTHENTICATION_REQUIRED'; end if;
  if not coalesce((select enabled from public.integration_feature_flags where key='tpq_private_writes_enabled'),false) then
    raise exception 'TPQ_PRIVATE_WRITES_DISABLED';
  end if;
  if not public.has_permission('tpq:private_write') then raise exception 'TPQ_PRIVATE_WRITE_FORBIDDEN'; end if;
  if p_action not in ('create','update','archive') then raise exception 'UNSUPPORTED_TPQ_PRIVATE_ACTION'; end if;

  if p_action='create' then
    insert into public.tpq_private_records(opaque_code,record_kind,sealed_payload,source_label,retention_until,consent_recorded_at,created_by,updated_by)
    values(
      trim(p_payload->>'opaque_code'),
      (p_payload->>'record_kind')::public.tpq_private_record_kind,
      p_payload->'sealed_payload',
      nullif(trim(coalesce(p_payload->>'source_label','')),''),
      nullif(p_payload->>'retention_until','')::date,
      nullif(p_payload->>'consent_recorded_at','')::timestamptz,
      auth.uid(),
      auth.uid()
    )
    returning id into target_id;
  else
    select to_jsonb(x),x.id into before_row,target_id
    from public.tpq_private_records x
    where x.id=p_record_id
    for update;
    if target_id is null then raise exception 'TPQ_PRIVATE_RECORD_NOT_FOUND'; end if;
    if p_expected_version is null or p_expected_version <> (before_row->>'version')::integer then raise exception 'VERSION_CONFLICT'; end if;
    if p_action='update' then
      update public.tpq_private_records
      set sealed_payload=p_payload->'sealed_payload',
          source_label=nullif(trim(coalesce(p_payload->>'source_label','')),''),
          retention_until=nullif(p_payload->>'retention_until','')::date,
          consent_recorded_at=nullif(p_payload->>'consent_recorded_at','')::timestamptz,
          updated_by=auth.uid(),
          version=version+1,
          updated_at=now()
      where id=target_id;
    elsif p_action='archive' then
      update public.tpq_private_records
      set record_status='archived',
          archived_by=auth.uid(),
          archived_at=now(),
          updated_by=auth.uid(),
          version=version+1,
          updated_at=now()
      where id=target_id;
    end if;
  end if;

  select to_jsonb(x) into after_row from public.tpq_private_records x where x.id=target_id;
  insert into public.audit_events(actor_user_id,action,entity_type,entity_id,before_snapshot,after_snapshot)
  values(auth.uid(),'tpq.private_record.'||p_action,'tpq_private_record',target_id,before_row,after_row);

  return jsonb_build_object('id',target_id,'version',(after_row->>'version')::integer,'status',after_row->>'record_status');
end;
$$;

revoke all on function public.tpq_private_capabilities() from public,anon;
revoke all on function public.command_tpq_private_record(text,uuid,integer,jsonb) from public,anon;
grant execute on function public.tpq_private_capabilities() to authenticated;
grant execute on function public.command_tpq_private_record(text,uuid,integer,jsonb) to authenticated;

commit;
