-- Finance correction/reversal foundation.
-- Default locked. No production finance numbers are changed by this migration.

begin;

insert into public.integration_feature_flags(key,enabled)
values ('finance_correction_writes_enabled',false),('finance_correction_test_mode_enabled',false)
on conflict(key) do update set enabled=false,updated_at=now(),updated_by=null;

do $$
declare constraint_name text;
begin
  select c.conname into constraint_name
  from pg_constraint c
  where c.conrelid='public.finance_import_batches'::regclass
    and c.contype='c'
    and pg_get_constraintdef(c.oid) like '%source_kind%';
  if constraint_name is not null then
    execute format('alter table public.finance_import_batches drop constraint %I', constraint_name);
  end if;
end $$;

alter table public.finance_import_batches
  add constraint finance_import_batches_source_kind_check
  check(source_kind in('import','manual','correction'));

alter table public.finance_transactions
  add column if not exists correction_kind text check(correction_kind is null or correction_kind in('reversal','replacement')),
  add column if not exists source_transaction_id uuid references public.finance_transactions(id);

create index if not exists finance_transactions_source_correction_idx
on public.finance_transactions(source_transaction_id)
where source_transaction_id is not null;

create table public.finance_correction_entries(
  id uuid primary key default gen_random_uuid(),
  scope public.finance_scope not null,
  environment text not null default 'test' check(environment='test'),
  source_transaction_id uuid not null references public.finance_transactions(id),
  period date not null check(period=date_trunc('month',period)::date),
  reason text not null check(char_length(reason) between 10 and 500),
  evidence_label text check(evidence_label is null or char_length(evidence_label) between 3 and 160),
  replacement_payload jsonb,
  workflow_status text not null default 'draft' check(workflow_status in('draft','under_review','approved','rejected','published','archived')),
  rejection_reason text check(rejection_reason is null or char_length(rejection_reason) between 5 and 500),
  version integer not null default 1 check(version>0),
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  reviewed_by uuid references public.profiles(id),
  reviewed_at timestamptz,
  published_by uuid references public.profiles(id),
  published_at timestamptz,
  archived_by uuid references public.profiles(id),
  archived_at timestamptz,
  updated_at timestamptz not null default now(),
  ledger_batch_id uuid references public.finance_import_batches(id),
  constraint finance_correction_replacement_object check(replacement_payload is null or jsonb_typeof(replacement_payload)='object')
);

create unique index finance_correction_one_active_per_source
on public.finance_correction_entries(source_transaction_id)
where workflow_status in('draft','under_review','approved','published');

create index finance_correction_scope_period_idx
on public.finance_correction_entries(scope,period,workflow_status,updated_at desc);

create table public.finance_correction_command_receipts(
  actor_user_id uuid not null references public.profiles(id),
  idempotency_key uuid not null,
  action text not null,
  correction_id uuid not null references public.finance_correction_entries(id),
  result jsonb not null,
  created_at timestamptz not null default now(),
  primary key(actor_user_id,idempotency_key)
);

alter table public.finance_correction_entries enable row level security;
alter table public.finance_correction_command_receipts enable row level security;

revoke all on table public.finance_correction_entries,public.finance_correction_command_receipts from anon,authenticated;
grant select on table public.finance_correction_entries to authenticated;

create policy finance_correction_read_scoped
on public.finance_correction_entries for select to authenticated
using (
  (scope='dkm' and (public.has_permission('finance:write') or public.has_permission('finance:approve') or public.has_permission('finance:publish')))
  or (scope='tpq' and (public.has_permission('tpq_finance:write') or public.has_permission('tpq_finance:approve') or public.has_permission('tpq_finance:publish')))
);

create or replace function public.finance_correction_capabilities(p_scope public.finance_scope)
returns jsonb language sql stable security definer set search_path=public as $$
  select jsonb_build_object(
    'writes_enabled',coalesce((select enabled from public.integration_feature_flags where key='finance_correction_writes_enabled'),false),
    'test_mode_enabled',coalesce((select enabled from public.integration_feature_flags where key='finance_correction_test_mode_enabled'),false),
    'can_prepare',case when p_scope='dkm' then public.has_permission('finance:write') else public.has_permission('tpq_finance:write') end,
    'can_approve',case when p_scope='dkm' then public.has_permission('finance:approve') else public.has_permission('tpq_finance:approve') end,
    'can_publish',case when p_scope='dkm' then public.has_permission('finance:publish') else public.has_permission('tpq_finance:publish') end
  );
$$;

create or replace function public.command_finance_correction(
  p_action text,
  p_idempotency_key uuid,
  p_correction_id uuid default null,
  p_expected_version integer default null,
  p_payload jsonb default '{}'::jsonb,
  p_reason text default null
) returns jsonb language plpgsql security definer set search_path=public as $$
declare
  c public.finance_correction_entries%rowtype;
  src public.finance_transactions%rowtype;
  cid uuid;
  before_row jsonb;
  answer jsonb;
  batch_id uuid;
  replacement jsonb;
  replacement_direction public.finance_direction;
  reversal_direction public.finance_direction;
  replacement_amount numeric(16,2);
  replacement_total_income numeric(16,2):=0;
  replacement_total_expense numeric(16,2):=0;
  reversal_total_income numeric(16,2):=0;
  reversal_total_expense numeric(16,2):=0;
  row_count integer:=1;
  hash_value text;
begin
  if auth.uid() is null then raise exception 'AUTHENTICATION_REQUIRED'; end if;
  if not coalesce((select enabled from public.integration_feature_flags where key='finance_correction_writes_enabled'),false)
    or not coalesce((select enabled from public.integration_feature_flags where key='finance_correction_test_mode_enabled'),false) then
    raise exception 'FINANCE_CORRECTION_DISABLED';
  end if;
  select result into answer from public.finance_correction_command_receipts where actor_user_id=auth.uid() and idempotency_key=p_idempotency_key;
  if found then return answer; end if;
  if (select count(*) from public.finance_correction_command_receipts where actor_user_id=auth.uid() and created_at>now()-interval '15 minutes')>=30 then
    raise exception 'FINANCE_CORRECTION_RATE_LIMITED';
  end if;

  if p_action='create' then
    if p_payload->>'source_transaction_id' is null then raise exception 'SOURCE_TRANSACTION_REQUIRED'; end if;
    select * into src from public.finance_transactions where id=(p_payload->>'source_transaction_id')::uuid for update;
    if not found then raise exception 'SOURCE_TRANSACTION_NOT_FOUND'; end if;
    if src.record_status<>'Terverifikasi' then raise exception 'SOURCE_TRANSACTION_NOT_PUBLISHED'; end if;
    if (src.scope='dkm' and not public.has_permission('finance:write')) or (src.scope='tpq' and not public.has_permission('tpq_finance:write')) then raise exception 'FINANCE_CORRECTION_FORBIDDEN'; end if;
    if coalesce(p_payload->>'reason','')='' or char_length(trim(p_payload->>'reason')) not between 10 and 500 then raise exception 'CORRECTION_REASON_REQUIRED'; end if;
    replacement:=p_payload->'replacement';
    if replacement is not null then
      if jsonb_typeof(replacement)<>'object' then raise exception 'INVALID_REPLACEMENT'; end if;
      if not exists(select 1 from public.finance_category_catalog fc where fc.scope=src.scope and fc.direction::text=replacement->>'direction' and lower(fc.category)=lower(trim(replacement->>'category')) and fc.active) then raise exception 'INVALID_FINANCE_CATEGORY'; end if;
      if (replacement->>'amount')::numeric<=0 then raise exception 'INVALID_REPLACEMENT_AMOUNT'; end if;
    end if;
    insert into public.finance_correction_entries(scope,source_transaction_id,period,reason,evidence_label,replacement_payload,created_by)
    values(src.scope,src.id,date_trunc('month',src.transaction_date)::date,trim(p_payload->>'reason'),nullif(trim(coalesce(p_payload->>'evidence_label','')),''),replacement,auth.uid())
    returning id into cid;
  else
    if p_correction_id is null or p_expected_version is null then raise exception 'CORRECTION_ID_AND_VERSION_REQUIRED'; end if;
    select * into c from public.finance_correction_entries where id=p_correction_id for update;
    if not found then raise exception 'FINANCE_CORRECTION_NOT_FOUND'; end if;
    if c.version<>p_expected_version then raise exception 'FINANCE_CORRECTION_VERSION_CONFLICT'; end if;
    before_row:=to_jsonb(c);
    cid:=c.id;
    select * into src from public.finance_transactions where id=c.source_transaction_id for update;
    if not found then raise exception 'SOURCE_TRANSACTION_NOT_FOUND'; end if;

    if p_action='update' then
      if c.created_by<>auth.uid() or c.workflow_status not in('draft','rejected') then raise exception 'FINANCE_CORRECTION_EDIT_FORBIDDEN'; end if;
      if (c.scope='dkm' and not public.has_permission('finance:write')) or (c.scope='tpq' and not public.has_permission('tpq_finance:write')) then raise exception 'FINANCE_CORRECTION_FORBIDDEN'; end if;
      replacement:=p_payload->'replacement';
      if replacement is not null and not exists(select 1 from public.finance_category_catalog fc where fc.scope=c.scope and fc.direction::text=replacement->>'direction' and lower(fc.category)=lower(trim(replacement->>'category')) and fc.active) then raise exception 'INVALID_FINANCE_CATEGORY'; end if;
      update public.finance_correction_entries set reason=trim(p_payload->>'reason'),evidence_label=nullif(trim(coalesce(p_payload->>'evidence_label','')),''),replacement_payload=replacement,workflow_status='draft',rejection_reason=null,version=version+1,updated_at=now() where id=cid;
    elsif p_action='submit_review' then
      if c.created_by<>auth.uid() or c.workflow_status not in('draft','rejected') then raise exception 'FINANCE_CORRECTION_TRANSITION_FORBIDDEN'; end if;
      update public.finance_correction_entries set workflow_status='under_review',rejection_reason=null,version=version+1,updated_at=now() where id=cid;
    elsif p_action in('approve','reject') then
      if c.workflow_status<>'under_review' then raise exception 'INVALID_FINANCE_CORRECTION_TRANSITION'; end if;
      if (c.scope='dkm' and not public.has_permission('finance:approve')) or (c.scope='tpq' and not public.has_permission('tpq_finance:approve')) then raise exception 'FINANCE_CORRECTION_APPROVAL_FORBIDDEN'; end if;
      if p_action='reject' and (p_reason is null or char_length(trim(p_reason)) not between 5 and 500) then raise exception 'REJECTION_REASON_REQUIRED'; end if;
      update public.finance_correction_entries set workflow_status=case when p_action='approve' then 'approved' else 'rejected' end,reviewed_by=auth.uid(),reviewed_at=now(),rejection_reason=case when p_action='reject' then trim(p_reason) else null end,version=version+1,updated_at=now() where id=cid;
    elsif p_action='publish' then
      if c.workflow_status<>'approved' then raise exception 'INVALID_FINANCE_CORRECTION_TRANSITION'; end if;
      if (c.scope='dkm' and not public.has_permission('finance:publish')) or (c.scope='tpq' and not public.has_permission('tpq_finance:publish')) then raise exception 'FINANCE_CORRECTION_PUBLISH_FORBIDDEN'; end if;
      if exists(select 1 from public.finance_transactions t where t.source_transaction_id=src.id and t.correction_kind='reversal') then raise exception 'SOURCE_ALREADY_CORRECTED'; end if;
      reversal_direction:=case when src.direction='income' then 'expense'::public.finance_direction else 'income'::public.finance_direction end;
      if reversal_direction='income' then reversal_total_income:=src.amount; else reversal_total_expense:=src.amount; end if;
      replacement:=c.replacement_payload;
      if replacement is not null then
        replacement_direction:=(replacement->>'direction')::public.finance_direction;
        replacement_amount:=(replacement->>'amount')::numeric;
        row_count:=2;
        if replacement_direction='income' then replacement_total_income:=replacement_amount; else replacement_total_expense:=replacement_amount; end if;
      end if;
      hash_value:=encode(extensions.digest(c.id::text||':'||c.version::text||':correction','sha256'),'hex');
      insert into public.finance_import_batches(scope,period,opening_balance,file_name,file_sha256,row_count,total_income,total_expense,status,created_by,environment,workflow_status,reviewed_by,reviewed_at,approved_by,approved_at,published_by,published_at,source_kind)
      values(c.scope,c.period,0,'correction-'||c.id::text,hash_value,row_count,reversal_total_income+replacement_total_income,reversal_total_expense+replacement_total_expense,'committed',c.created_by,'test','published',c.reviewed_by,c.reviewed_at,c.reviewed_by,c.reviewed_at,auth.uid(),now(),'correction')
      returning id into batch_id;
      insert into public.finance_transactions(batch_id,scope,transaction_date,direction,category,subcategory,fund_purpose,student_code,public_description,payment_method,amount,external_reference,record_status,internal_note,correction_kind,source_transaction_id)
      values(batch_id,src.scope,src.transaction_date,reversal_direction,src.category,src.subcategory,src.fund_purpose,src.student_code,'Koreksi pembalik: '||coalesce(src.public_description,'transaksi sumber'),src.payment_method,src.amount,null,'Terverifikasi','Reversal otomatis untuk koreksi: '||c.reason,'reversal',src.id);
      if replacement is not null then
        insert into public.finance_transactions(batch_id,scope,transaction_date,direction,category,subcategory,fund_purpose,student_code,public_description,payment_method,amount,external_reference,record_status,internal_note,correction_kind,source_transaction_id)
        values(batch_id,c.scope,coalesce(nullif(replacement->>'transaction_date','')::date,src.transaction_date),(replacement->>'direction')::public.finance_direction,trim(replacement->>'category'),trim(replacement->>'subcategory'),trim(replacement->>'fund_purpose'),nullif(trim(coalesce(replacement->>'student_code','')),''),trim(replacement->>'public_description'),nullif(trim(coalesce(replacement->>'payment_method','')),''),(replacement->>'amount')::numeric,nullif(trim(coalesce(replacement->>'external_reference','')),''),'Terverifikasi',nullif(trim(coalesce(replacement->>'internal_note','')),''),'replacement',src.id);
      end if;
      update public.finance_correction_entries set workflow_status='published',published_by=auth.uid(),published_at=now(),ledger_batch_id=batch_id,version=version+1,updated_at=now() where id=cid;
    elsif p_action='archive' then
      if c.created_by<>auth.uid() or c.workflow_status not in('draft','rejected') then raise exception 'FINANCE_CORRECTION_ARCHIVE_FORBIDDEN'; end if;
      update public.finance_correction_entries set workflow_status='archived',archived_by=auth.uid(),archived_at=now(),version=version+1,updated_at=now() where id=cid;
    else
      raise exception 'UNKNOWN_FINANCE_CORRECTION_ACTION';
    end if;
  end if;

  select jsonb_build_object('id',id,'workflow_status',workflow_status,'version',version,'ledger_batch_id',ledger_batch_id) into answer
  from public.finance_correction_entries where id=cid;
  insert into public.audit_events(actor_user_id,action,entity_type,entity_id,before_snapshot,after_snapshot)
  select auth.uid(),'finance.correction.'||p_action,'finance_correction_entry',cid,before_row,to_jsonb(x) from public.finance_correction_entries x where x.id=cid;
  insert into public.finance_correction_command_receipts(actor_user_id,idempotency_key,action,correction_id,result)
  values(auth.uid(),p_idempotency_key,p_action,cid,answer);
  return answer;
exception when unique_violation then raise exception 'DUPLICATE_CORRECTION_OR_COMMAND';
end;
$$;

revoke all on function public.finance_correction_capabilities(public.finance_scope) from public,anon;
revoke all on function public.command_finance_correction(text,uuid,uuid,integer,jsonb,text) from public,anon;
grant execute on function public.finance_correction_capabilities(public.finance_scope) to authenticated;
grant execute on function public.command_finance_correction(text,uuid,uuid,integer,jsonb,text) to authenticated;

commit;
