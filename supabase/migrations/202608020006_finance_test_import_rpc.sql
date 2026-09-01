-- Phase 3: test-only finance import RPC. Production writes remain unavailable.
begin;

insert into public.integration_feature_flags (key, enabled)
values ('finance_import_test_mode_enabled', false)
on conflict (key) do update set enabled = false, updated_at = now(), updated_by = null;

alter table public.finance_import_batches
  add column expected_closing_balance numeric(16,2) check (expected_closing_balance >= 0),
  add column calculated_closing_balance numeric(16,2),
  add column environment text not null default 'test' check (environment = 'test');

drop policy if exists finance_batches_read_by_scope on public.finance_import_batches;
create policy finance_batches_read_test_by_scope on public.finance_import_batches for select to authenticated using (
  (scope = 'dkm' and (public.has_permission('finance:write') or public.has_permission('finance:approve') or public.has_permission('finance:publish')))
  or (scope = 'tpq' and (public.has_permission('tpq_finance:write') or public.has_permission('tpq_finance:approve') or public.has_permission('tpq_finance:publish')))
);
drop policy if exists finance_transactions_read_by_scope on public.finance_transactions;
create policy finance_transactions_read_test_by_scope on public.finance_transactions for select to authenticated using (
  (scope = 'dkm' and (public.has_permission('finance:write') or public.has_permission('finance:approve') or public.has_permission('finance:publish')))
  or (scope = 'tpq' and (public.has_permission('tpq_finance:write') or public.has_permission('tpq_finance:approve') or public.has_permission('tpq_finance:publish')))
);

drop function if exists public.commit_finance_import(public.finance_scope, date, numeric, text, text, jsonb);

create or replace function public.commit_finance_test_import(
  p_scope public.finance_scope,
  p_period date,
  p_opening_balance numeric,
  p_expected_closing_balance numeric,
  p_file_name text,
  p_file_sha256 text,
  p_rows jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_batch_id uuid;
  v_row_count integer;
  v_total_income numeric(16,2);
  v_total_expense numeric(16,2);
  v_calculated_closing numeric(16,2);
begin
  if auth.uid() is null then raise exception 'AUTHENTICATION_REQUIRED'; end if;
  if not coalesce((select enabled from public.integration_feature_flags where key = 'finance_import_writes_enabled'), false)
    or not coalesce((select enabled from public.integration_feature_flags where key = 'finance_import_test_mode_enabled'), false) then
    raise exception 'FINANCE_TEST_IMPORT_DISABLED';
  end if;
  if (p_scope = 'dkm' and not public.has_permission('finance:write'))
    or (p_scope = 'tpq' and not public.has_permission('tpq_finance:write')) then raise exception 'FINANCE_IMPORT_FORBIDDEN'; end if;
  if (select count(*) from public.finance_import_batches where created_by = auth.uid() and created_at > now() - interval '15 minutes') >= 5 then
    raise exception 'FINANCE_IMPORT_RATE_LIMITED';
  end if;
  if p_period <> date_trunc('month', p_period)::date then raise exception 'PERIOD_MUST_BE_FIRST_DAY'; end if;
  if p_opening_balance < 0 or p_expected_closing_balance < 0 then raise exception 'INVALID_BALANCE'; end if;
  if p_file_name is null or char_length(p_file_name) not between 1 and 180 then raise exception 'INVALID_FILE_NAME'; end if;
  if p_file_sha256 !~ '^[0-9a-f]{64}$' then raise exception 'INVALID_FILE_HASH'; end if;
  if jsonb_typeof(p_rows) <> 'array' then raise exception 'ROWS_MUST_BE_ARRAY'; end if;
  v_row_count := jsonb_array_length(p_rows);
  if v_row_count not between 1 and 500 then raise exception 'ROW_LIMIT_EXCEEDED'; end if;

  if exists (
    select 1 from jsonb_to_recordset(p_rows) as r(
      transaction_date date, direction text, category text, subcategory text, fund_purpose text,
      student_code text, public_description text, payment_method text, amount numeric,
      external_reference text, record_status text, internal_note text
    )
    left join public.finance_category_catalog c on c.scope = p_scope and c.direction::text = r.direction
      and lower(c.category) = lower(trim(r.category)) and c.active
    where r.transaction_date is null or date_trunc('month', r.transaction_date)::date <> p_period
      or r.direction not in ('income', 'expense') or c.category is null
      or r.subcategory is null or char_length(trim(r.subcategory)) not between 1 and 100
      or r.fund_purpose is null or char_length(trim(r.fund_purpose)) not between 1 and 100
      or r.amount is null or r.amount <= 0 or r.record_status <> 'Draft'
      or (p_scope = 'dkm' and nullif(trim(r.student_code), '') is not null)
      or (c.student_code_required and nullif(trim(r.student_code), '') is null)
  ) then raise exception 'INVALID_IMPORT_ROW'; end if;

  select coalesce(sum(amount) filter (where direction = 'income'), 0),
    coalesce(sum(amount) filter (where direction = 'expense'), 0)
  into v_total_income, v_total_expense
  from jsonb_to_recordset(p_rows) as r(direction public.finance_direction, amount numeric);
  v_calculated_closing := p_opening_balance + v_total_income - v_total_expense;
  if v_calculated_closing <> p_expected_closing_balance then raise exception 'RECONCILIATION_MISMATCH'; end if;

  insert into public.finance_import_batches (
    scope, period, opening_balance, expected_closing_balance, calculated_closing_balance,
    environment, file_name, file_sha256, row_count, total_income, total_expense, created_by
  ) values (
    p_scope, p_period, p_opening_balance, p_expected_closing_balance, v_calculated_closing,
    'test', p_file_name, p_file_sha256, v_row_count, v_total_income, v_total_expense, auth.uid()
  ) returning id into v_batch_id;

  insert into public.finance_transactions (
    batch_id, scope, transaction_date, direction, category, subcategory, fund_purpose,
    student_code, public_description, payment_method, amount, external_reference, record_status, internal_note
  ) select v_batch_id, p_scope, r.transaction_date, r.direction::public.finance_direction,
    trim(r.category), trim(r.subcategory), trim(r.fund_purpose), nullif(trim(r.student_code), ''),
    nullif(trim(r.public_description), ''), nullif(trim(r.payment_method), ''), r.amount,
    nullif(trim(r.external_reference), ''), 'Draft', nullif(trim(r.internal_note), '')
  from jsonb_to_recordset(p_rows) as r(
    transaction_date date, direction text, category text, subcategory text, fund_purpose text,
    student_code text, public_description text, payment_method text, amount numeric,
    external_reference text, record_status text, internal_note text
  );

  insert into public.audit_events (actor_user_id, action, entity_type, entity_id, after_snapshot)
  values (auth.uid(), 'finance.test_import.commit', 'finance_import_batch', v_batch_id,
    jsonb_build_object('scope', p_scope, 'period', p_period, 'environment', 'test', 'row_count', v_row_count,
      'total_income', v_total_income, 'total_expense', v_total_expense, 'closing_balance', v_calculated_closing));
  return v_batch_id;
exception when unique_violation then raise exception 'DUPLICATE_IMPORT_OR_REFERENCE';
end;
$$;

create or replace function public.finance_import_capabilities(p_scope public.finance_scope)
returns jsonb language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'writes_enabled', coalesce((select enabled from public.integration_feature_flags where key = 'finance_import_writes_enabled'), false),
    'test_mode_enabled', coalesce((select enabled from public.integration_feature_flags where key = 'finance_import_test_mode_enabled'), false),
    'can_commit', case when p_scope = 'dkm' then public.has_permission('finance:write') else public.has_permission('tpq_finance:write') end
  );
$$;

revoke all on function public.commit_finance_test_import(public.finance_scope, date, numeric, numeric, text, text, jsonb) from public;
grant execute on function public.commit_finance_test_import(public.finance_scope, date, numeric, numeric, text, text, jsonb) to authenticated;
commit;
