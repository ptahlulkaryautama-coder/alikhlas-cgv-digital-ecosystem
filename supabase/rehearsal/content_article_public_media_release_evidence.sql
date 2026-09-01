select
  a.id,
  a.slug,
  a.environment,
  a.workflow_status,
  a.visibility,
  a.version,
  a.released_from_test_id,
  (a.cover_image_url like 'supabase-storage://content-article-public-media/%') as uses_public_storage_pointer,
  exists(
    select 1
    from storage.objects o
    where o.bucket_id='content-article-public-media'
      and o.name=replace(a.cover_image_url,'supabase-storage://content-article-public-media/','')
  ) as public_storage_object_exists,
  exists(
    select 1
    from public.content_articles t
    where t.id=a.released_from_test_id
      and t.environment='test'
      and t.cover_image_path<>''
  ) as source_test_article_has_private_media,
  coalesce((select public from storage.buckets where id='content-article-public-media'),false) as bucket_is_public,
  coalesce((select count(*) from public.audit_events e where e.entity_type='content_article' and e.entity_id=a.id and e.action='content.production.release'),0) as release_audit_count,
  coalesce((select enabled from public.integration_feature_flags where key='content_production_release_enabled'),false) as release_enabled
from public.content_articles a
where a.environment='production'
  and a.released_from_test_id is not null
  and a.cover_image_url like 'supabase-storage://content-article-public-media/%'
order by a.published_at desc nulls last
limit 10;
