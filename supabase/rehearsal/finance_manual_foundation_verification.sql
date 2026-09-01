select 'manual finance writes disabled' as check_name,coalesce((select not enabled from public.integration_feature_flags where key='finance_manual_writes_enabled'),false) as pass
union all select 'manual finance test mode disabled',coalesce((select not enabled from public.integration_feature_flags where key='finance_manual_test_mode_enabled'),false)
union all select 'manual finance RLS enabled',(select relrowsecurity from pg_class where oid='public.finance_manual_entries'::regclass)
union all select 'no manual browser mutations',not exists(select 1 from information_schema.role_table_grants where table_schema='public' and table_name in ('finance_manual_entries','finance_manual_command_receipts') and grantee in ('anon','authenticated') and privilege_type in ('INSERT','UPDATE','DELETE'))
union all select 'manual command anonymous blocked',not has_function_privilege('anon','public.command_finance_manual_entry(text,uuid,uuid,integer,jsonb,text)','EXECUTE')
union all select 'manual ledger source marker installed',exists(select 1 from information_schema.columns where table_schema='public' and table_name='finance_import_batches' and column_name='source_kind');
