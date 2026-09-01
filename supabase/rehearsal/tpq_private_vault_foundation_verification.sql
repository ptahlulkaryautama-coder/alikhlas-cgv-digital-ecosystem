select 'tpq private read disabled' as check_name,
  coalesce((select not enabled from public.integration_feature_flags where key='tpq_private_read_enabled'),false) as pass
union all select 'tpq private writes disabled',
  coalesce((select not enabled from public.integration_feature_flags where key='tpq_private_writes_enabled'),false)
union all select 'tpq private RLS enabled',
  (select relrowsecurity from pg_class where oid='public.tpq_private_records'::regclass)
union all select 'no tpq private browser mutations',
  not exists(
    select 1 from information_schema.role_table_grants
    where table_schema='public'
      and table_name='tpq_private_records'
      and grantee in('anon','authenticated')
      and privilege_type in('INSERT','UPDATE','DELETE')
  )
union all select 'tpq private command anonymous blocked',
  not has_function_privilege('anon','public.command_tpq_private_record(text,uuid,integer,jsonb)','EXECUTE')
union all select 'tpq private capabilities authenticated only',
  has_function_privilege('authenticated','public.tpq_private_capabilities()','EXECUTE')
  and not has_function_privilege('anon','public.tpq_private_capabilities()','EXECUTE')
union all select 'sealed payload required',
  exists(
    select 1 from pg_constraint
    where conrelid='public.tpq_private_records'::regclass
      and pg_get_constraintdef(oid) ilike '%sealed_payload%'
      and pg_get_constraintdef(oid) ilike '%ciphertext%'
  );
