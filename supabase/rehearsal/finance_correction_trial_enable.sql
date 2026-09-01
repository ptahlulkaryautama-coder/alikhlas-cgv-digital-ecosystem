do $$
begin
  if not (select relrowsecurity from pg_class where oid='public.finance_correction_entries'::regclass) then raise exception 'FINANCE_CORRECTION_RLS_NOT_READY'; end if;
  if has_function_privilege('anon','public.command_finance_correction(text,uuid,uuid,integer,jsonb,text)','EXECUTE') then raise exception 'FINANCE_CORRECTION_RPC_EXPOSED'; end if;
  if exists(select 1 from information_schema.role_table_grants where table_schema='public' and table_name in('finance_correction_entries','finance_correction_command_receipts') and grantee in('anon','authenticated') and privilege_type in('INSERT','UPDATE','DELETE')) then raise exception 'FINANCE_CORRECTION_BROWSER_MUTATION_EXPOSED'; end if;
end $$;
update public.integration_feature_flags set enabled=true,updated_at=now(),updated_by=auth.uid() where key in('finance_correction_writes_enabled','finance_correction_test_mode_enabled');
