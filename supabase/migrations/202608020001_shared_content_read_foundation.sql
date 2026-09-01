-- Shared Web + Dashboard + TPQ read foundation.
-- Contains public-safe content only: no finance rows and no TPQ personal records.

begin;

create table public.content_programs (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 160),
  category text not null check (char_length(category) between 1 and 80),
  pillar text not null default 'Ilmu' check (char_length(pillar) between 1 and 80),
  description text not null default '' check (char_length(description) <= 2000),
  schedule_day text not null default '' check (char_length(schedule_day) <= 80),
  schedule_time text not null default '' check (char_length(schedule_time) <= 80),
  location text not null default '' check (char_length(location) <= 120),
  speaker_label text not null default '' check (char_length(speaker_label) <= 120),
  poster_url text not null default '' check (char_length(poster_url) <= 500),
  visibility text not null default 'Pengurus' check (visibility in ('Publik', 'Pengurus')),
  status text not null default 'Draft' check (status in ('Draft', 'Dalam peninjauan', 'Siap publik', 'Arsip')),
  source_verified boolean not null default false,
  version integer not null default 1 check (version > 0),
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.content_agenda (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 160),
  category text not null check (char_length(category) between 1 and 80),
  description text not null default '' check (char_length(description) <= 2000),
  event_date date,
  event_time text not null default '' check (char_length(event_time) <= 80),
  location text not null default '' check (char_length(location) <= 120),
  visibility text not null default 'Pengurus' check (visibility in ('Publik', 'Pengurus')),
  status text not null default 'Draft' check (status in ('Draft', 'Dalam peninjauan', 'Siap publik', 'Dibatalkan', 'Arsip')),
  source_verified boolean not null default false,
  version integer not null default 1 check (version > 0),
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.tpq_public_schedule (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 160),
  level_label text not null default '' check (char_length(level_label) <= 160),
  day_label text not null default '' check (char_length(day_label) <= 80),
  time_label text not null default '' check (char_length(time_label) <= 80),
  room_label text not null default '' check (char_length(room_label) <= 120),
  audience_label text not null default '' check (char_length(audience_label) <= 160),
  teacher_role_label text not null default '' check (char_length(teacher_role_label) <= 160),
  description text not null default '' check (char_length(description) <= 2000),
  learning_focus text[] not null default '{}',
  display_order integer not null default 0,
  is_published boolean not null default false,
  source_verified boolean not null default false,
  updated_at timestamptz not null default now()
);

create table public.tpq_public_agenda (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 160),
  event_date date,
  time_label text not null default '' check (char_length(time_label) <= 80),
  location_label text not null default '' check (char_length(location_label) <= 160),
  category text not null default '' check (char_length(category) <= 80),
  description text not null default '' check (char_length(description) <= 2000),
  status text not null default 'Draft' check (status in ('Draft', 'Siap publik', 'Arsip')),
  is_published boolean not null default false,
  source_verified boolean not null default false,
  updated_at timestamptz not null default now()
);

create table public.tpq_public_learning_focus (
  id uuid primary key default gen_random_uuid(),
  level_label text not null check (char_length(level_label) between 1 and 80),
  name text not null check (char_length(name) between 1 and 160),
  category text not null default '' check (char_length(category) <= 80),
  description text not null default '' check (char_length(description) <= 2000),
  target_label text not null default '' check (char_length(target_label) <= 500),
  display_order integer not null default 0,
  is_published boolean not null default false,
  source_verified boolean not null default false,
  updated_at timestamptz not null default now()
);

create index content_programs_public_idx on public.content_programs (visibility, status) where archived_at is null;
create index content_agenda_public_idx on public.content_agenda (event_date, visibility, status) where archived_at is null;
create index tpq_public_schedule_order_idx on public.tpq_public_schedule (display_order) where is_published;
create index tpq_public_agenda_date_idx on public.tpq_public_agenda (event_date) where is_published;
create index tpq_public_learning_order_idx on public.tpq_public_learning_focus (display_order) where is_published;

alter table public.content_programs enable row level security;
alter table public.content_agenda enable row level security;
alter table public.tpq_public_schedule enable row level security;
alter table public.tpq_public_agenda enable row level security;
alter table public.tpq_public_learning_focus enable row level security;

revoke all on table public.content_programs from anon, authenticated;
revoke all on table public.content_agenda from anon, authenticated;
revoke all on table public.tpq_public_schedule from anon, authenticated;
revoke all on table public.tpq_public_agenda from anon, authenticated;
revoke all on table public.tpq_public_learning_focus from anon, authenticated;

grant select on table public.content_programs to anon, authenticated;
grant select on table public.content_agenda to anon, authenticated;
grant select on table public.tpq_public_schedule to anon, authenticated;
grant select on table public.tpq_public_agenda to anon, authenticated;
grant select on table public.tpq_public_learning_focus to anon, authenticated;

create policy content_programs_public_read on public.content_programs for select to anon, authenticated
using (visibility = 'Publik' and status = 'Siap publik' and archived_at is null);
create policy content_programs_authorized_read on public.content_programs for select to authenticated
using (public.has_permission('content:read'));

create policy content_agenda_public_read on public.content_agenda for select to anon, authenticated
using (visibility = 'Publik' and status = 'Siap publik' and archived_at is null);
create policy content_agenda_authorized_read on public.content_agenda for select to authenticated
using (public.has_permission('content:read'));

create policy tpq_schedule_public_read on public.tpq_public_schedule for select to anon, authenticated
using (is_published);
create policy tpq_schedule_authorized_read on public.tpq_public_schedule for select to authenticated
using (public.has_permission('tpq:read'));

create policy tpq_agenda_public_read on public.tpq_public_agenda for select to anon, authenticated
using (is_published);
create policy tpq_agenda_authorized_read on public.tpq_public_agenda for select to authenticated
using (public.has_permission('tpq:read'));

create policy tpq_learning_public_read on public.tpq_public_learning_focus for select to anon, authenticated
using (is_published);
create policy tpq_learning_authorized_read on public.tpq_public_learning_focus for select to authenticated
using (public.has_permission('tpq:read'));

-- No browser mutation grants or INSERT/UPDATE/DELETE policies exist in this phase.
commit;
