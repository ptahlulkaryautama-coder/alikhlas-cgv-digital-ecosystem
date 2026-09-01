-- Finance approval workflow and separation of duties.
-- This migration does not enable finance import writes.

begin;

insert into public.role_permissions (role, permission) values
  ('super_admin', 'finance:approve'), ('super_admin', 'finance:publish'),
  ('super_admin', 'tpq_finance:write'), ('super_admin', 'tpq_finance:approve'), ('super_admin', 'tpq_finance:publish'),
  ('bendahara', 'finance:approve'), ('bendahara', 'tpq_finance:approve'),
  ('ketua_dkm', 'finance:publish'), ('ketua_dkm', 'tpq_finance:publish'),
  ('kepala_tpq', 'tpq_finance:write')
on conflict do nothing;

alter table public.finance_import_batches
  add column workflow_status text not null default 'draft'
    check (workflow_status in ('draft', 'under_review', 'approved', 'rejected', 'published')),
  add column reviewed_by uuid references public.profiles(id) on delete set null,
  add column reviewed_at timestamptz,
  add column approved_by uuid references public.profiles(id) on delete set null,
  add column approved_at timestamptz,
  add column published_by uuid references public.profiles(id) on delete set null,
  add column published_at timestamptz,
  add column rejection_reason text check (rejection_reason is null or char_length(rejection_reason) between 5 and 500);

create index finance_batches_workflow_idx
on public.finance_import_batches (scope, workflow_status, period desc);

create or replace function public.finance_workflow_capabilities(p_scope public.finance_scope)
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select jsonb_build_object(
    'can_prepare', case when p_scope = 'dkm' then public.has_permission('finance:write') else public.has_permission('tpq_finance:write') end,
    'can_approve', case when p_scope = 'dkm' then public.has_permission('finance:approve') else public.has_permission('tpq_finance:approve') end,
    'can_publish', case when p_scope = 'dkm' then public.has_permission('finance:publish') else public.has_permission('tpq_finance:publish') end
  );
$$;

create or replace function public.transition_finance_import_batch(
  p_batch_id uuid,
  p_action text,
  p_reason text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_batch public.finance_import_batches%rowtype;
  v_before jsonb;
  v_next text;
begin
  if auth.uid() is null then raise exception 'AUTHENTICATION_REQUIRED'; end if;
  select * into v_batch from public.finance_import_batches where id = p_batch_id for update;
  if not found then raise exception 'FINANCE_BATCH_NOT_FOUND'; end if;
  v_before := to_jsonb(v_batch) - 'file_sha256';

  if p_action = 'submit_review' then
    if v_batch.workflow_status not in ('draft', 'rejected') then raise exception 'INVALID_WORKFLOW_TRANSITION'; end if;
    if v_batch.created_by <> auth.uid() then raise exception 'ONLY_CREATOR_CAN_SUBMIT'; end if;
    if (v_batch.scope = 'dkm' and not public.has_permission('finance:write'))
      or (v_batch.scope = 'tpq' and not public.has_permission('tpq_finance:write')) then raise exception 'FINANCE_WORKFLOW_FORBIDDEN'; end if;
    v_next := 'under_review';
    update public.finance_import_batches set workflow_status = v_next, rejection_reason = null where id = p_batch_id;
  elsif p_action in ('approve', 'reject') then
    if v_batch.workflow_status <> 'under_review' then raise exception 'INVALID_WORKFLOW_TRANSITION'; end if;
    if v_batch.created_by = auth.uid() then raise exception 'SELF_APPROVAL_FORBIDDEN'; end if;
    if (v_batch.scope = 'dkm' and not public.has_permission('finance:approve'))
      or (v_batch.scope = 'tpq' and not public.has_permission('tpq_finance:approve')) then raise exception 'FINANCE_WORKFLOW_FORBIDDEN'; end if;
    if p_action = 'reject' and (p_reason is null or char_length(trim(p_reason)) not between 5 and 500) then raise exception 'REJECTION_REASON_REQUIRED'; end if;
    v_next := case when p_action = 'approve' then 'approved' else 'rejected' end;
    update public.finance_import_batches set
      workflow_status = v_next, reviewed_by = auth.uid(), reviewed_at = now(),
      approved_by = case when p_action = 'approve' then auth.uid() else null end,
      approved_at = case when p_action = 'approve' then now() else null end,
      rejection_reason = case when p_action = 'reject' then trim(p_reason) else null end
    where id = p_batch_id;
  elsif p_action = 'publish' then
    if v_batch.workflow_status <> 'approved' then raise exception 'INVALID_WORKFLOW_TRANSITION'; end if;
    if (v_batch.scope = 'dkm' and not public.has_permission('finance:publish'))
      or (v_batch.scope = 'tpq' and not public.has_permission('tpq_finance:publish')) then raise exception 'FINANCE_WORKFLOW_FORBIDDEN'; end if;
    v_next := 'published';
    update public.finance_import_batches set workflow_status = v_next, published_by = auth.uid(), published_at = now() where id = p_batch_id;
  else
    raise exception 'UNKNOWN_WORKFLOW_ACTION';
  end if;

  insert into public.audit_events (actor_user_id, action, entity_type, entity_id, before_snapshot, after_snapshot)
  select auth.uid(), 'finance.workflow.' || p_action, 'finance_import_batch', p_batch_id, v_before,
    to_jsonb(b) - 'file_sha256' from public.finance_import_batches b where b.id = p_batch_id;

  return (select jsonb_build_object('id', id, 'workflow_status', workflow_status) from public.finance_import_batches where id = p_batch_id);
end;
$$;

create or replace function public.finance_import_capabilities(p_scope public.finance_scope)
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select jsonb_build_object(
    'writes_enabled', coalesce((select enabled from public.integration_feature_flags where key = 'finance_import_writes_enabled'), false),
    'can_commit', case when p_scope = 'dkm' then public.has_permission('finance:write') else public.has_permission('tpq_finance:write') end
  );
$$;

revoke all on function public.finance_workflow_capabilities(public.finance_scope) from public;
revoke all on function public.transition_finance_import_batch(uuid, text, text) from public;
grant execute on function public.finance_workflow_capabilities(public.finance_scope) to authenticated;
grant execute on function public.transition_finance_import_batch(uuid, text, text) to authenticated;

-- Phase 2 keeps all finance commits unavailable. Phase 3 must replace the
-- commit RPC with the new TPQ-finance permission boundary before re-granting it.
revoke execute on function public.commit_finance_import(public.finance_scope, date, numeric, text, text, jsonb) from authenticated;

commit;
