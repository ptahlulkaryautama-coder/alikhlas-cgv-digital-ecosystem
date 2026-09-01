select 'article writes disabled' as check_name,coalesce((select not enabled from public.integration_feature_flags where key='content_article_writes_enabled'),false) as pass
union all select 'article test mode disabled',coalesce((select not enabled from public.integration_feature_flags where key='content_article_test_mode_enabled'),false)
union all select 'all existing articles isolated as test',not exists(select 1 from public.content_articles where environment<>'test')
union all select 'public policy requires production',exists(select 1 from pg_policies where schemaname='public' and tablename='content_articles' and policyname='content_articles_public_read' and qual like '%production%')
union all select 'test mode trigger installed',exists(select 1 from information_schema.triggers where event_object_schema='public' and event_object_table='content_articles' and trigger_name='content_articles_require_test_mode');

