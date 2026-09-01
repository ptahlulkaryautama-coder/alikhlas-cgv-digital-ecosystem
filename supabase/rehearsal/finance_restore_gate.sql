-- READ-ONLY restore gate. Run only against the isolated restore target.
-- Every check must return pass = true before the rehearsal may be approved.

select 'finance writes disabled' as check_name,
       coalesce((select not enabled from public.integration_feature_flags where key = 'finance_import_writes_enabled'), false) as pass
union all
select 'finance test mode disabled',
       coalesce((select not enabled from public.integration_feature_flags where key = 'finance_import_test_mode_enabled'), false)
union all
select 'manual finance writes disabled',
       coalesce((select not enabled from public.integration_feature_flags where key = 'finance_manual_writes_enabled'), false)
union all
select 'manual finance test mode disabled',
       coalesce((select not enabled from public.integration_feature_flags where key = 'finance_manual_test_mode_enabled'), false)
union all
select 'transactions have a batch',
       not exists (
         select 1 from public.finance_transactions t
         left join public.finance_import_batches b on b.id = t.batch_id
         where b.id is null
       )
union all
select 'transaction scope matches batch scope',
       not exists (
         select 1 from public.finance_transactions t
         join public.finance_import_batches b on b.id = t.batch_id
         where t.scope <> b.scope
       )
union all
select 'batch totals match transactions',
       not exists (
         select 1
         from public.finance_import_batches b
         left join lateral (
           select
             coalesce(sum(t.amount) filter (where t.direction = 'income'), 0) as total_income,
             coalesce(sum(t.amount) filter (where t.direction = 'expense'), 0) as total_expense,
             count(*) as row_count
           from public.finance_transactions t where t.batch_id = b.id
         ) totals on true
         where b.total_income <> totals.total_income
            or b.total_expense <> totals.total_expense
            or b.row_count <> totals.row_count
       )
union all
select 'published manual entries have one ledger transaction',
       not exists (
         select 1
         from public.finance_manual_entries m
         left join lateral (
           select count(*) as transaction_count
           from public.finance_transactions t
           where t.batch_id = m.ledger_batch_id
         ) projected on true
         where m.workflow_status = 'published'
           and (m.ledger_batch_id is null or projected.transaction_count <> 1)
       )
union all
select 'manual ledger batches carry source marker',
       not exists (
         select 1
         from public.finance_manual_entries m
         join public.finance_import_batches b on b.id = m.ledger_batch_id
         where m.workflow_status = 'published'
           and b.source_kind <> 'manual'
       )
union all
select 'no browser mutation grants on finance tables',
       not exists (
         select 1 from information_schema.role_table_grants
         where grantee in ('anon', 'authenticated')
           and table_schema = 'public'
           and table_name in ('finance_import_batches', 'finance_transactions', 'finance_manual_entries', 'finance_manual_command_receipts', 'audit_events')
           and privilege_type in ('INSERT', 'UPDATE', 'DELETE', 'TRUNCATE')
       );
