-- Read-only evidence for the most recently updated test article.
with latest as (
  select id,slug,title,environment,workflow_status,visibility,created_by,reviewed_by,version
  from public.content_articles
  where environment='test'
  order by updated_at desc
  limit 1
)
select
  l.id,
  l.slug,
  l.title,
  l.environment,
  l.workflow_status,
  l.visibility,
  l.version,
  (l.created_by is not null) as has_creator,
  (l.reviewed_by is not null) as has_reviewer,
  (l.created_by is distinct from l.reviewed_by) as separation_of_duties,
  not exists(
    select 1 from public.content_articles a
    where a.id=l.id
      and a.environment='production'
      and a.workflow_status='Siap publik'
      and a.visibility='Publik'
      and a.archived_at is null
  ) as excluded_from_public_projection,
  (select count(*) from public.audit_events e where e.entity_type='content_article' and e.entity_id=l.id) as audit_event_count
from latest l;
