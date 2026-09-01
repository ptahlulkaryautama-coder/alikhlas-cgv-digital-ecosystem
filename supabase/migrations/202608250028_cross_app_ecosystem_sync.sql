-- Cross-App Ecosystem Sync & Unified Views Foundation.
-- Connects Public Website, Transparency Portal, Internal Dashboard, and Jemaah/Wali Portal.

begin;

-- 1. View Rangkuman Portal Jemaah & Wali Santri (jamaah.alikhlascgv.co.id)
create or replace view public.v_jemaah_portal_summary as
select
  p.id as program_id,
  p.title as program_title,
  p.category as program_category,
  p.speaker_label as speaker,
  p.schedule_day,
  p.schedule_time,
  p.location as program_location,
  p.poster_url,
  a.id as agenda_id,
  a.title as agenda_title,
  a.event_date as agenda_date,
  a.event_time as agenda_time,
  a.location as agenda_location
from public.content_programs p
left join public.content_agenda a on a.visibility = 'Publik' and a.status = 'Siap publik' and a.archived_at is null
where p.visibility = 'Publik'
  and p.status = 'Siap publik'
  and p.archived_at is null;

-- 2. View Rangkuman Portal Transparansi (portal.alikhlascgv.co.id)
create or replace view public.v_transparency_summary as
select
  (select count(*) from public.content_programs where visibility = 'Publik' and status = 'Siap publik' and archived_at is null) as total_public_programs,
  (select count(*) from public.content_agenda where visibility = 'Publik' and status = 'Siap publik' and archived_at is null) as total_public_agenda,
  (select count(*) from public.tpq_public_schedule where is_published) as total_published_tpq_classes,
  (select count(*) from public.tpq_public_learning_focus where is_published) as total_published_tpq_focus,
  coalesce((select enabled from public.integration_feature_flags where key='tpq_private_read_enabled'), false) as tpq_vault_read_active,
  coalesce((select enabled from public.integration_feature_flags where key='tpq_private_writes_enabled'), false) as tpq_vault_writes_active,
  now() as calculated_at;

-- 3. RPC Health Check Ekosistem Digital (4 Pilar Domain)
create or replace function public.get_ecosystem_health()
returns jsonb
language sql
stable
security definer
set search_path=public
as $$
  select jsonb_build_object(
    'ecosystem_name', 'Al Ikhlas Digital Ecosystem',
    'timestamp', now(),
    'pillars', jsonb_build_object(
      'public_website', jsonb_build_object('domain', 'alikhlascgv.co.id', 'status', 'active', 'public_programs', (select count(*) from public.content_programs where visibility='Publik')),
      'transparency_portal', jsonb_build_object('domain', 'portal.alikhlascgv.co.id', 'status', 'active', 'verification', 'pending_bendahara_approval'),
      'internal_dashboard', jsonb_build_object('domain', 'app.alikhlascgv.co.id', 'status', 'active', 'roles_configured', (select count(*) from public.role_permissions)),
      'jemaah_portal', jsonb_build_object('domain', 'jamaah.alikhlascgv.co.id', 'status', 'active', 'tpq_vault_ready', coalesce((select enabled from public.integration_feature_flags where key='tpq_private_read_enabled'), false))
    )
  );
$$;

-- 4. Otorisasi & Access Control Grants
grant select on public.v_jemaah_portal_summary to anon, authenticated;
grant select on public.v_transparency_summary to anon, authenticated;
grant execute on function public.get_ecosystem_health() to anon, authenticated;

commit;
