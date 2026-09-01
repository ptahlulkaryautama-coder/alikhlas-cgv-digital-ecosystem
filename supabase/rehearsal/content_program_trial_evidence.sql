-- Read-only evidence for the latest test Program.
with p as (
  select * from public.content_programs
  where environment='test' and title='Uji Integrasi Program Masjid'
  order by updated_at desc limit 1
)
select
  p.id,p.title,p.environment,p.status,p.visibility,p.version,
  (p.created_by is not null) as has_creator,
  (p.reviewed_by is not null) as has_reviewer,
  (p.created_by is not null and p.reviewed_by is not null and p.created_by<>p.reviewed_by) as separation_of_duties,
  not(p.environment='production' and p.status='Siap publik' and p.visibility='Publik' and p.archived_at is null) as excluded_from_public_projection,
  (select count(*) from public.audit_events a where a.entity_type='content_program' and a.entity_id=p.id) as audit_event_count,
  coalesce((select enabled from public.integration_feature_flags where key='content_program_writes_enabled'),false) as writes_enabled,
  coalesce((select enabled from public.integration_feature_flags where key='content_program_test_mode_enabled'),false) as test_mode_enabled
from p;
