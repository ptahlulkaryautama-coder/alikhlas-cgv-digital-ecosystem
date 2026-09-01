-- Read-only evidence for the isolated media article trial.
with a as (
  select * from public.content_articles where slug='uji-media-artikel-masjid' limit 1
)
select
  a.id,
  a.slug,
  a.environment,
  a.workflow_status,
  a.visibility,
  a.version,
  (a.cover_image_path<>'') as has_private_media_path,
  exists(select 1 from storage.objects o where o.bucket_id='content-article-test-media' and o.name=a.cover_image_path) as storage_object_exists,
  coalesce((select not b.public from storage.buckets b where b.id='content-article-test-media'),false) as bucket_is_private,
  (a.created_by is not null and a.reviewed_by is not null and a.created_by<>a.reviewed_by) as separation_of_duties,
  not (a.environment='production' and a.workflow_status='Siap publik' and a.visibility='Publik' and a.archived_at is null) as excluded_from_public_projection,
  (select count(*) from public.audit_events e where e.entity_type='content_article' and e.entity_id=a.id) as audit_event_count,
  (select count(*) from public.audit_events e where e.entity_type='content_article' and e.entity_id=a.id and e.action='content.article.media.attach') as media_attach_audit_count,
  coalesce((select enabled from public.integration_feature_flags where key='content_article_writes_enabled'),false) as writes_enabled,
  coalesce((select enabled from public.integration_feature_flags where key='content_article_test_mode_enabled'),false) as test_mode_enabled,
  coalesce((select enabled from public.integration_feature_flags where key='content_article_media_test_enabled'),false) as media_test_enabled
from a;
