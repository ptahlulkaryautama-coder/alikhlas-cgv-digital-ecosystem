-- Read-only verification after migration 013. Every row must pass.
select 'media test switch disabled' as check_name,
  coalesce((select not enabled from public.integration_feature_flags where key='content_article_media_test_enabled'),false) as pass
union all
select 'media bucket private',
  coalesce((select not public from storage.buckets where id='content-article-test-media'),false)
union all
select 'media bucket size limited to 5 MB',
  coalesce((select file_size_limit=5242880 from storage.buckets where id='content-article-test-media'),false)
union all
select 'media MIME types constrained',
  coalesce((select allowed_mime_types @> array['image/jpeg','image/png','image/webp']::text[] and cardinality(allowed_mime_types)=3 from storage.buckets where id='content-article-test-media'),false)
union all
select 'article media path installed',
  exists(select 1 from information_schema.columns where table_schema='public' and table_name='content_articles' and column_name='cover_image_path')
union all
select 'private read policy installed',
  exists(select 1 from pg_policies where schemaname='storage' and tablename='objects' and policyname='content_article_test_media_read' and roles @> array['authenticated']::name[])
union all
select 'scoped insert policy installed',
  exists(select 1 from pg_policies where schemaname='storage' and tablename='objects' and policyname='content_article_test_media_insert' and cmd='INSERT')
union all
select 'no media update policy',
  not exists(select 1 from pg_policies where schemaname='storage' and tablename='objects' and policyname like 'content_article_test_media%' and cmd='UPDATE')
union all
select 'media attach anonymous blocked',
  not has_function_privilege('anon','public.attach_content_article_test_media(uuid,integer,text,uuid)','EXECUTE')
union all
select 'media attach authenticated allowed',
  has_function_privilege('authenticated','public.attach_content_article_test_media(uuid,integer,text,uuid)','EXECUTE');
