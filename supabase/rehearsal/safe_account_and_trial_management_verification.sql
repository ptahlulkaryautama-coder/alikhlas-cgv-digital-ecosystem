select 'account suspension anonymous blocked' check_name,not has_function_privilege('anon','public.suspend_user_account(uuid,text)','EXECUTE') pass
union all select 'trial management anonymous blocked',not has_function_privilege('anon','public.manage_test_content(text,uuid,integer,text,text)','EXECUTE')
union all select 'account suspension protects own account',pg_get_functiondef('public.suspend_user_account(uuid,text)'::regprocedure) like '%CANNOT_SUSPEND_OWN_ACCOUNT%'
union all select 'super admin accounts protected',pg_get_functiondef('public.suspend_user_account(uuid,text)'::regprocedure) like '%SUPER_ADMIN_ACCOUNT_PROTECTED%'
union all select 'trial removal is archive only',pg_get_functiondef('public.manage_test_content(text,uuid,integer,text,text)'::regprocedure) not like '%delete from public.content_%'
union all select 'trial actions audited',pg_get_functiondef('public.manage_test_content(text,uuid,integer,text,text)'::regprocedure) like '%content.trial.%';
