select 'program writes disabled' as check_name,coalesce((select not enabled from public.integration_feature_flags where key='content_program_writes_enabled'),false) as pass
union all select 'program test mode disabled',coalesce((select not enabled from public.integration_feature_flags where key='content_program_test_mode_enabled'),false)
union all select 'program RLS enabled',(select relrowsecurity from pg_class where oid='public.content_programs'::regclass)
union all select 'no program browser mutations',not exists(select 1 from information_schema.role_table_grants where table_schema='public' and table_name in('content_programs','content_program_command_receipts') and grantee in('anon','authenticated') and privilege_type in('INSERT','UPDATE','DELETE'))
union all select 'program command anonymous blocked',not has_function_privilege('anon','public.command_content_program(text,uuid,uuid,integer,jsonb,text)','EXECUTE')
union all select 'public program projection production only',exists(select 1 from pg_policies where schemaname='public' and tablename='content_programs' and policyname='content_programs_public_read' and qual ilike '%environment%production%');
