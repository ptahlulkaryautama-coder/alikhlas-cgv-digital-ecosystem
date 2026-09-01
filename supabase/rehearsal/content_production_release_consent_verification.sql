select 'source visibility no longer blocks explicit release' check_name,
  pg_get_functiondef('public.release_content_to_production(text,uuid,integer,uuid)'::regprocedure) not like '%visibility=''Publik''%' pass
union all select 'release remains super admin only',
  pg_get_functiondef('public.release_content_to_production(text,uuid,integer,uuid)'::regprocedure) like '%users:manage%'
union all select 'release remains anonymous blocked',
  not has_function_privilege('anon','public.release_content_to_production(text,uuid,integer,uuid)','EXECUTE')
union all select 'production switch remains enabled',
  coalesce((select enabled from public.integration_feature_flags where key='content_production_release_enabled'),false);
