select 'public media bucket exists' check_name,
  exists(select 1 from storage.buckets where id='content-article-public-media') pass
union all select 'public media bucket is public',
  coalesce((select public from storage.buckets where id='content-article-public-media'),false)
union all select 'public media bucket size limited to 5 MB',
  coalesce((select file_size_limit=5242880 from storage.buckets where id='content-article-public-media'),false)
union all select 'public media MIME types constrained',
  coalesce((select allowed_mime_types @> array['image/jpeg','image/png','image/webp']::text[] and cardinality(allowed_mime_types)=3 from storage.buckets where id='content-article-public-media'),false)
union all select 'public media insert scoped to release permission',
  exists(select 1 from pg_policies where schemaname='storage' and tablename='objects' and policyname='content_article_public_media_insert' and roles @> array['authenticated']::name[])
union all select 'release requires public media when article has private media',
  exists(select 1 from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='public' and p.proname='release_content_to_production' and pg_get_functiondef(p.oid) like '%ARTICLE_PUBLIC_MEDIA_REQUIRED%')
union all select 'release stores production storage pointer',
  exists(select 1 from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='public' and p.proname='release_content_to_production' and pg_get_functiondef(p.oid) like '%supabase-storage://content-article-public-media/%')
union all select 'release remains content release protected',
  exists(select 1 from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='public' and p.proname='release_content_to_production' and pg_get_functiondef(p.oid) like '%has_permission(''content:release'')%')
union all select 'anonymous release remains blocked',
  not exists(select 1 from information_schema.routine_privileges where routine_schema='public' and routine_name='release_content_to_production' and grantee in('PUBLIC','anon'));
