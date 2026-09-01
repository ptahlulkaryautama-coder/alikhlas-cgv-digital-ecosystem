select 'private upload predicate installed' check_name,
  exists(select 1 from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='public' and p.proname='content_article_media_upload_allowed') pass
union all select 'public release media predicate installed',
  exists(select 1 from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='public' and p.proname='content_article_public_media_release_allowed')
union all select 'private insert policy uses protected predicate',
  exists(select 1 from pg_policies where schemaname='storage' and tablename='objects' and policyname='content_article_test_media_insert' and qual is null and with_check like '%content_article_media_upload_allowed()%')
union all select 'private delete policy uses protected predicate',
  exists(select 1 from pg_policies where schemaname='storage' and tablename='objects' and policyname='content_article_test_media_delete_orphan' and qual like '%content_article_media_upload_allowed()%')
union all select 'public insert policy uses protected predicate',
  exists(select 1 from pg_policies where schemaname='storage' and tablename='objects' and policyname='content_article_public_media_insert' and with_check like '%content_article_public_media_release_allowed()%')
union all select 'public delete policy uses protected predicate',
  exists(select 1 from pg_policies where schemaname='storage' and tablename='objects' and policyname='content_article_public_media_delete_unreleased' and qual like '%content_article_public_media_release_allowed()%')
union all select 'storage policies no direct feature flag reads',
  not exists(
    select 1 from pg_policies
    where schemaname='storage'
      and tablename='objects'
      and policyname in(
        'content_article_test_media_insert',
        'content_article_test_media_delete_orphan',
        'content_article_public_media_insert',
        'content_article_public_media_delete_unreleased'
      )
      and coalesce(qual,'')||coalesce(with_check,'') like '%integration_feature_flags%'
  );
