do $$ begin
  if (select public from storage.buckets where id='content-article-test-media') then raise exception 'ARTICLE_MEDIA_BUCKET_MUST_BE_PRIVATE'; end if;
  if not exists(select 1 from pg_policies where schemaname='storage' and tablename='objects' and policyname='content_article_test_media_insert') then raise exception 'ARTICLE_MEDIA_POLICY_MISSING'; end if;
end $$;
update public.integration_feature_flags set enabled=true,updated_at=now()
where key in('content_article_writes_enabled','content_article_test_mode_enabled','content_article_media_test_enabled');
select key,enabled from public.integration_feature_flags where key like 'content_article_%enabled' order by key;
