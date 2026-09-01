-- Enable isolated manual-finance trial only after security gates pass.
begin;
do $$ begin
  if not (select relrowsecurity from pg_class where oid='public.finance_manual_entries'::regclass) then raise exception 'MANUAL_FINANCE_RLS_NOT_READY'; end if;
  if has_function_privilege('anon','public.command_finance_manual_entry(text,uuid,uuid,integer,jsonb,text)','EXECUTE') then raise exception 'MANUAL_FINANCE_RPC_EXPOSED'; end if;
  if exists(select 1 from information_schema.role_table_grants where table_schema='public' and table_name in('finance_manual_entries','finance_manual_command_receipts') and grantee in('anon','authenticated') and privilege_type in('INSERT','UPDATE','DELETE')) then raise exception 'MANUAL_FINANCE_BROWSER_MUTATION_EXPOSED'; end if;
end $$;
update public.integration_feature_flags set enabled=true,updated_at=now() where key in('finance_manual_writes_enabled','finance_manual_test_mode_enabled');
do $$ begin if(select count(*) from public.integration_feature_flags where key in('finance_manual_writes_enabled','finance_manual_test_mode_enabled') and enabled)<>2 then raise exception 'MANUAL_FINANCE_FLAGS_NOT_ENABLED';end if;end $$;
commit;
select key,enabled from public.integration_feature_flags where key in('finance_manual_writes_enabled','finance_manual_test_mode_enabled') order by key;
