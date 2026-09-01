select 'correction writes disabled' as check_name, coalesce((select not enabled from public.integration_feature_flags where key='finance_correction_writes_enabled'),false) as pass
union all select 'correction test mode disabled', coalesce((select not enabled from public.integration_feature_flags where key='finance_correction_test_mode_enabled'),false)
union all select 'correction RLS enabled',(select relrowsecurity from pg_class where oid='public.finance_correction_entries'::regclass)
union all select 'no correction browser mutations',not exists(select 1 from information_schema.role_table_grants where table_schema='public' and table_name in('finance_correction_entries','finance_correction_command_receipts') and grantee in('anon','authenticated') and privilege_type in('INSERT','UPDATE','DELETE'))
union all select 'correction command anonymous blocked',not has_function_privilege('anon','public.command_finance_correction(text,uuid,uuid,integer,jsonb,text)','EXECUTE')
union all select 'ledger source marker allows correction', exists(select 1 from pg_constraint where conrelid='public.finance_import_batches'::regclass and pg_get_constraintdef(oid) like '%correction%')
union all select 'transaction correction linkage installed', exists(select 1 from information_schema.columns where table_schema='public' and table_name='finance_transactions' and column_name='source_transaction_id');
