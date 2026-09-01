select 'account restore anonymous blocked' check_name,
       not has_function_privilege('anon', 'public.restore_user_account(uuid,text)', 'EXECUTE') pass
union all
select 'account restore requires super admin',
       pg_get_functiondef('public.restore_user_account(uuid,text)'::regprocedure) like '%SUPER_ADMIN_REQUIRED%'
union all
select 'account restore requires suspended profile',
       pg_get_functiondef('public.restore_user_account(uuid,text)'::regprocedure) like '%SUSPENDED_USER_REQUIRED%'
union all
select 'account restore does not restore old roles',
       pg_get_functiondef('public.restore_user_account(uuid,text)'::regprocedure) like '%roles_restored%' and
       pg_get_functiondef('public.restore_user_account(uuid,text)'::regprocedure) not like '%insert into public.user_roles%'
union all
select 'account restore audited',
       pg_get_functiondef('public.restore_user_account(uuid,text)'::regprocedure) like '%access.account.restore%';
