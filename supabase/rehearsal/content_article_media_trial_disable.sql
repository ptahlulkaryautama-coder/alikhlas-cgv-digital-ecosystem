update public.integration_feature_flags set enabled=false,updated_at=now()
where key in('content_article_writes_enabled','content_article_test_mode_enabled','content_article_media_test_enabled');
select key,enabled from public.integration_feature_flags where key like 'content_article_%enabled' order by key;
