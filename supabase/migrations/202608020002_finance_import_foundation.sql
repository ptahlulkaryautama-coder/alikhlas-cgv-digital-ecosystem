-- Finance import foundation for DKM and TPQ.
-- Writes remain disabled until finance_import_writes_enabled is manually approved.

begin;

create type public.finance_scope as enum ('dkm', 'tpq');
create type public.finance_direction as enum ('income', 'expense');
create type public.finance_import_status as enum ('committed', 'reverted');

create table public.integration_feature_flags (
  key text primary key check (key ~ '^[a-z0-9_]+$'),
  enabled boolean not null default false,
  updated_at timestamptz not null default now(),
  updated_by uuid references public.profiles(id) on delete set null
);

insert into public.integration_feature_flags (key, enabled)
values ('finance_import_writes_enabled', false);

create table public.finance_import_batches (
  id uuid primary key default gen_random_uuid(),
  scope public.finance_scope not null,
  period date not null check (period = date_trunc('month', period)::date),
  opening_balance numeric(16,2) not null check (opening_balance >= 0),
  file_name text not null check (char_length(file_name) between 1 and 180),
  file_sha256 text not null check (file_sha256 ~ '^[0-9a-f]{64}$'),
  row_count integer not null check (row_count between 1 and 500),
  total_income numeric(16,2) not null default 0 check (total_income >= 0),
  total_expense numeric(16,2) not null default 0 check (total_expense >= 0),
  status public.finance_import_status not null default 'committed',
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  reverted_at timestamptz,
  reverted_by uuid references public.profiles(id),
  unique (scope, file_sha256)
);

create table public.finance_transactions (
  id uuid primary key default gen_random_uuid(),
  batch_id uuid not null references public.finance_import_batches(id),
  scope public.finance_scope not null,
  transaction_date date not null,
  direction public.finance_direction not null,
  category text not null check (char_length(category) between 1 and 80),
  student_code text check (student_code is null or char_length(student_code) <= 50),
  public_description text check (public_description is null or char_length(public_description) <= 240),
  payment_method text check (payment_method is null or char_length(payment_method) <= 60),
  amount numeric(16,2) not null check (amount > 0),
  external_reference text check (external_reference is null or char_length(external_reference) <= 120),
  record_status text not null default 'Draft' check (record_status in ('Draft', 'Terverifikasi', 'Ditolak')),
  internal_note text check (internal_note is null or char_length(internal_note) <= 500),
  created_at timestamptz not null default now(),
  constraint student_code_only_for_tpq check (scope = 'tpq' or student_code is null),
  unique (scope, external_reference)
);

create index finance_batches_scope_period_idx on public.finance_import_batches (scope, period desc);
create index finance_transactions_scope_date_idx on public.finance_transactions (scope, transaction_date desc);
create index finance_transactions_batch_idx on public.finance_transactions (batch_id);

alter table public.integration_feature_flags enable row level security;
alter table public.finance_import_batches enable row level security;
alter table public.finance_transactions enable row level security;

revoke all on table public.integration_feature_flags from anon, authenticated;
revoke all on table public.finance_import_batches from anon, authenticated;
revoke all on table public.finance_transactions from anon, authenticated;
grant select on table public.finance_import_batches to authenticated;
grant select on table public.finance_transactions to authenticated;

create policy finance_batches_read_by_scope
on public.finance_import_batches for select to authenticated
using (
  (scope = 'dkm' and public.has_permission('finance:read'))
  or (scope = 'tpq' and public.has_permission('tpq:read'))
);

create policy finance_transactions_read_by_scope
on public.finance_transactions for select to authenticated
using (
  (scope = 'dkm' and public.has_permission('finance:read'))
  or (scope = 'tpq' and public.has_permission('tpq:read'))
);

create or replace function public.finance_import_capabilities(p_scope public.finance_scope)
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select jsonb_build_object(
    'writes_enabled', coalesce((select enabled from public.integration_feature_flags where key = 'finance_import_writes_enabled'), false),
    'can_commit', case
      when p_scope = 'dkm' then public.has_permission('finance:write')
      when p_scope = 'tpq' then public.has_permission('tpq:write')
      else false
    end
  );
$$;

create or replace function public.commit_finance_import(
  p_scope public.finance_scope,
  p_period date,
  p_opening_balance numeric,
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
begin
  if auth.uid() is null then raise exception 'AUTHENTICATION_REQUIRED'; end if;
  if not coalesce((select enabled from public.integration_feature_flags where key = 'finance_import_writes_enabled'), false) then
    raise exception 'FINANCE_IMPORT_WRITES_DISABLED';
  end if;
  if (p_scope = 'dkm' and not public.has_permission('finance:write'))
    or (p_scope = 'tpq' and not public.has_permission('tpq:write')) then
    raise exception 'FINANCE_IMPORT_FORBIDDEN';
  end if;
  if p_period <> date_trunc('month', p_period)::date then raise exception 'PERIOD_MUST_BE_FIRST_DAY'; end if;
  if p_opening_balance < 0 then raise exception 'INVALID_OPENING_BALANCE'; end if;
  if p_file_name is null or char_length(p_file_name) not between 1 and 180 then raise exception 'INVALID_FILE_NAME'; end if;
  if p_file_sha256 !~ '^[0-9a-f]{64}$' then raise exception 'INVALID_FILE_HASH'; end if;
  if jsonb_typeof(p_rows) <> 'array' then raise exception 'ROWS_MUST_BE_ARRAY'; end if;

  v_row_count := jsonb_array_length(p_rows);
  if v_row_count not between 1 and 500 then raise exception 'ROW_LIMIT_EXCEEDED'; end if;

  if exists (
    select 1 from jsonb_to_recordset(p_rows) as r(
      transaction_date date, direction text, category text, student_code text,
      public_description text, payment_method text, amount numeric,
      external_reference text, record_status text, internal_note text
    )
    where transaction_date is null or direction not in ('income', 'expense')
      or category is null or char_length(trim(category)) not between 1 and 80
      or amount is null or amount <= 0
      or record_status not in ('Draft', 'Terverifikasi', 'Ditolak')
      or (p_scope = 'dkm' and student_code is not null)
      or (p_scope = 'tpq' and lower(category) = 'spp' and nullif(trim(student_code), '') is null)
  ) then raise exception 'INVALID_IMPORT_ROW'; end if;

  select
    coalesce(sum(amount) filter (where direction = 'income'), 0),
    coalesce(sum(amount) filter (where direction = 'expense'), 0)
  into v_total_income, v_total_expense
  from jsonb_to_recordset(p_rows) as r(direction public.finance_direction, amount numeric);

  insert into public.finance_import_batches (
    scope, period, opening_balance, file_name, file_sha256, row_count,
    total_income, total_expense, created_by
  ) values (
    p_scope, p_period, p_opening_balance, p_file_name, p_file_sha256, v_row_count,
    v_total_income, v_total_expense, auth.uid()
  ) returning id into v_batch_id;

  insert into public.finance_transactions (
    batch_id, scope, transaction_date, direction, category, student_code,
    public_description, payment_method, amount, external_reference, record_status, internal_note
  )
  select v_batch_id, p_scope, r.transaction_date, r.direction::public.finance_direction,
    trim(r.category), nullif(trim(r.student_code), ''), nullif(trim(r.public_description), ''),
    nullif(trim(r.payment_method), ''), r.amount, nullif(trim(r.external_reference), ''),
    r.record_status, nullif(trim(r.internal_note), '')
  from jsonb_to_recordset(p_rows) as r(
    transaction_date date, direction text, category text, student_code text,
    public_description text, payment_method text, amount numeric,
    external_reference text, record_status text, internal_note text
  );

  insert into public.audit_events (actor_user_id, action, entity_type, entity_id, after_snapshot)
  values (auth.uid(), 'finance.import.commit', 'finance_import_batch', v_batch_id,
    jsonb_build_object('scope', p_scope, 'period', p_period, 'row_count', v_row_count,
      'total_income', v_total_income, 'total_expense', v_total_expense));
  return v_batch_id;
exception
  when unique_violation then raise exception 'DUPLICATE_IMPORT_OR_REFERENCE';
end;
$$;

revoke all on function public.finance_import_capabilities(public.finance_scope) from public;
revoke all on function public.commit_finance_import(public.finance_scope, date, numeric, text, text, jsonb) from public;
grant execute on function public.finance_import_capabilities(public.finance_scope) to authenticated;
grant execute on function public.commit_finance_import(public.finance_scope, date, numeric, text, text, jsonb) to authenticated;

commit;
