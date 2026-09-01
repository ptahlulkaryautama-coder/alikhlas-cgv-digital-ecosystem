select 'role assignment anonymous blocked' check_name,not has_function_privilege('anon','public.set_user_operational_role(uuid,public.app_role,boolean)','EXECUTE') pass
union all select 'browser role table mutations removed',not has_table_privilege('authenticated','public.user_roles','INSERT') and not has_table_privilege('authenticated','public.user_roles','UPDATE') and not has_table_privilege('authenticated','public.user_roles','DELETE')
union all select 'ketua can release content',exists(select 1 from public.role_permissions where role='ketua_dkm' and permission='content:release')
union all select 'secretary can release content',exists(select 1 from public.role_permissions where role='sekretaris' and permission='content:release')
union all select 'media can release content',exists(select 1 from public.role_permissions where role='humas' and permission='content:release')
union all select 'release no longer tied to user management',pg_get_functiondef('public.release_content_to_production(text,uuid,integer,uuid)'::regprocedure) like '%content:release%' and pg_get_functiondef('public.release_content_to_production(text,uuid,integer,uuid)'::regprocedure) not like '%users:manage%';
