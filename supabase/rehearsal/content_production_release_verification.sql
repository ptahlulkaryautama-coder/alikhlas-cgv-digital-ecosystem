select 'production release disabled' check_name,coalesce((select not enabled from public.integration_feature_flags where key='content_production_release_enabled'),false) pass
union all select 'release RPC anonymous blocked',not has_function_privilege('anon','public.release_content_to_production(text,uuid,integer,uuid)','EXECUTE')
union all select 'candidate RPC anonymous blocked',not has_function_privilege('anon','public.list_content_production_candidates()','EXECUTE')
union all select 'article source linkage installed',exists(select 1 from information_schema.columns where table_schema='public' and table_name='content_articles' and column_name='released_from_test_id')
union all select 'program source linkage installed',exists(select 1 from information_schema.columns where table_schema='public' and table_name='content_programs' and column_name='released_from_test_id')
union all select 'agenda source linkage installed',exists(select 1 from information_schema.columns where table_schema='public' and table_name='content_agenda' and column_name='released_from_test_id');
