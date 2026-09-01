-- Adds standardized category classification without enabling finance writes.

begin;

create table public.finance_category_catalog (
  scope public.finance_scope not null,
  direction public.finance_direction not null,
  category text not null check (char_length(category) between 1 and 80),
  student_code_required boolean not null default false,
  active boolean not null default true,
  primary key (scope, direction, category)
);

insert into public.finance_category_catalog (scope, direction, category, student_code_required) values
  ('dkm', 'income', 'Infaq', false), ('dkm', 'income', 'Sedekah', false),
  ('dkm', 'income', 'Donasi', false), ('dkm', 'income', 'Zakat', false),
  ('dkm', 'income', 'Fidyah', false), ('dkm', 'income', 'Wakaf', false),
  ('dkm', 'income', 'Penerimaan Kegiatan', false), ('dkm', 'income', 'Pendapatan Lainnya', false),
  ('dkm', 'expense', 'Operasional Masjid', false), ('dkm', 'expense', 'Listrik dan Utilitas', false),
  ('dkm', 'expense', 'Kebersihan', false), ('dkm', 'expense', 'Pemeliharaan', false),
  ('dkm', 'expense', 'Bisyaroh', false), ('dkm', 'expense', 'Kegiatan Dakwah', false),
  ('dkm', 'expense', 'Sosial dan Santunan', false), ('dkm', 'expense', 'Pembangunan dan Renovasi', false),
  ('dkm', 'expense', 'Perlengkapan', false), ('dkm', 'expense', 'Administrasi', false),
  ('dkm', 'expense', 'Penyaluran Zakat', false), ('dkm', 'expense', 'Penyaluran Fidyah', false),
  ('dkm', 'expense', 'Penggunaan Wakaf', false), ('dkm', 'expense', 'Pengeluaran Lainnya', false),
  ('tpq', 'income', 'SPP', true), ('tpq', 'income', 'Pendaftaran', true),
  ('tpq', 'income', 'Buku Prestasi', true), ('tpq', 'income', 'Seragam', true),
  ('tpq', 'income', 'Infaq TPQ', false), ('tpq', 'income', 'Donasi Kegiatan', false),
  ('tpq', 'income', 'Bantuan/Subsidi', false), ('tpq', 'income', 'Pemasukan Lainnya', false),
  ('tpq', 'expense', 'Honor Pengajar', false), ('tpq', 'expense', 'Buku dan Bahan Ajar', false),
  ('tpq', 'expense', 'ATK', false), ('tpq', 'expense', 'Seragam', false),
  ('tpq', 'expense', 'Konsumsi', false), ('tpq', 'expense', 'Kegiatan Santri', false),
  ('tpq', 'expense', 'Sarana dan Peralatan', false), ('tpq', 'expense', 'Kebersihan', false),
  ('tpq', 'expense', 'Listrik dan Operasional', false), ('tpq', 'expense', 'Transportasi', false),
  ('tpq', 'expense', 'Pengembalian Pembayaran', false), ('tpq', 'expense', 'Pengeluaran Lainnya', false);

alter table public.finance_transactions
  add column subcategory text not null default 'Belum diklasifikasi'
    check (char_length(subcategory) between 1 and 100),
  add column fund_purpose text not null default 'Belum diklasifikasi'
    check (char_length(fund_purpose) between 1 and 100);

alter table public.finance_category_catalog enable row level security;
revoke all on table public.finance_category_catalog from anon, authenticated;
grant select on table public.finance_category_catalog to authenticated;

create policy finance_category_catalog_read_by_scope
on public.finance_category_catalog for select to authenticated
using (
  (scope = 'dkm' and public.has_permission('finance:read'))
  or (scope = 'tpq' and public.has_permission('tpq:read'))
);

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
    select 1
    from jsonb_to_recordset(p_rows) as r(
      transaction_date date, direction text, category text, subcategory text, fund_purpose text,
      student_code text, public_description text, payment_method text, amount numeric,
      external_reference text, record_status text, internal_note text
    )
    left join public.finance_category_catalog c
      on c.scope = p_scope and c.direction::text = r.direction
      and lower(c.category) = lower(trim(r.category)) and c.active
    where r.transaction_date is null or r.direction not in ('income', 'expense')
      or c.category is null
      or r.subcategory is null or char_length(trim(r.subcategory)) not between 1 and 100
      or r.fund_purpose is null or char_length(trim(r.fund_purpose)) not between 1 and 100
      or r.amount is null or r.amount <= 0
      or r.record_status not in ('Draft', 'Terverifikasi', 'Ditolak')
      or (p_scope = 'dkm' and nullif(trim(r.student_code), '') is not null)
      or (c.student_code_required and nullif(trim(r.student_code), '') is null)
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
    batch_id, scope, transaction_date, direction, category, subcategory, fund_purpose,
    student_code, public_description, payment_method, amount, external_reference, record_status, internal_note
  )
  select v_batch_id, p_scope, r.transaction_date, r.direction::public.finance_direction,
    trim(r.category), trim(r.subcategory), trim(r.fund_purpose), nullif(trim(r.student_code), ''),
    nullif(trim(r.public_description), ''), nullif(trim(r.payment_method), ''), r.amount,
    nullif(trim(r.external_reference), ''), r.record_status, nullif(trim(r.internal_note), '')
  from jsonb_to_recordset(p_rows) as r(
    transaction_date date, direction text, category text, subcategory text, fund_purpose text,
    student_code text, public_description text, payment_method text, amount numeric,
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

revoke all on function public.commit_finance_import(public.finance_scope, date, numeric, text, text, jsonb) from public;
grant execute on function public.commit_finance_import(public.finance_scope, date, numeric, text, text, jsonb) to authenticated;

commit;
