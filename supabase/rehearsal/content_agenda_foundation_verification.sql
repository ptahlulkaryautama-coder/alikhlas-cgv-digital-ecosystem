select 'agenda writes disabled' as check_name,coalesce((select not enabled from public.integration_feature_flags where key='content_agenda_writes_enabled'),false) as pass
union all select 'agenda test mode disabled',coalesce((select not enabled from public.integration_feature_flags where key='content_agenda_test_mode_enabled'),false)
union all select 'agenda RLS enabled',(select relrowsecurity from pg_class where oid='public.content_agenda'::regclass)
union all select 'no agenda browser mutations',not exists(select 1 from information_schema.role_table_grants where table_schema='public' and table_name in('content_agenda','content_agenda_command_receipts') and grantee in('anon','authenticated') and privilege_type in('INSERT','UPDATE','DELETE'))
union all select 'agenda command anonymous blocked',not has_function_privilege('anon','public.command_content_agenda(text,uuid,uuid,integer,jsonb,text)','EXECUTE')
union all select 'public agenda projection production only',exists(select 1 from pg_policies where schemaname='public' and tablename='content_agenda' and policyname='content_agenda_public_read' and qual ilike '%environment%production%');
