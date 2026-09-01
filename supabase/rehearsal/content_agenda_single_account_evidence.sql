-- READ-ONLY evidence for the latest test Agenda.
with latest as (
  select * from public.content_agenda
  where environment='test'
  order by updated_at desc
  limit 1
)
select
  a.id,
  a.title,
  a.event_date,
  a.environment,
  a.status,
  a.visibility,
  a.version,
  a.created_by is not null as has_operator,
  a.created_by=a.reviewed_by as single_account_release,
  not (a.environment='production' and a.status='Siap publik' and a.visibility='Publik' and a.archived_at is null) as excluded_from_public_projection,
  (select count(*) from public.audit_events e where e.entity_type='content_agenda' and e.entity_id=a.id) as audit_event_count,
  coalesce((select enabled from public.integration_feature_flags where key='content_agenda_writes_enabled'),false) as writes_enabled,
  coalesce((select enabled from public.integration_feature_flags where key='content_agenda_test_mode_enabled'),false) as test_mode_enabled
from latest a;
