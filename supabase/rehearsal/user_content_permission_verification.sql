select 'content permissions assignable' as check_name,
  exists(select 1 from pg_constraint where conrelid='public.user_permission_grants'::regclass and contype='c' and pg_get_constraintdef(oid) like '%content:approve%') as pass
union all select 'content permission RPC protected',
  not has_function_privilege('anon','public.set_user_content_permission(uuid,text,boolean)','EXECUTE')
  and has_function_privilege('authenticated','public.set_user_content_permission(uuid,text,boolean)','EXECUTE')
union all select 'no browser mutation grants',
  not exists(select 1 from information_schema.role_table_grants where table_schema='public' and table_name='user_permission_grants' and grantee in ('anon','authenticated') and privilege_type in ('INSERT','UPDATE','DELETE'));
