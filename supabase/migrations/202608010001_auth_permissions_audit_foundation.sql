-- Masjid Al Ikhlas CGV: production identity, authorization, and audit foundation.
-- This migration creates no finance or TPQ personal records.

begin;

create extension if not exists pgcrypto;
create extension if not exists citext;

create type public.app_role as enum (
  'super_admin',
  'ketua_dkm',
  'sekretaris',
  'bendahara',
  'humas',
  'kepala_tpq',
  'guru_tpq',
  'viewer'
);

create type public.user_status as enum ('invited', 'active', 'suspended');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '' check (char_length(display_name) <= 120),
  email citext unique,
  status public.user_status not null default 'invited',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.role_permissions (
  role public.app_role not null,
  permission text not null check (permission ~ '^[a-z_]+:[a-z_]+$'),
  created_at timestamptz not null default now(),
  primary key (role, permission)
);

create table public.user_roles (
  user_id uuid not null references public.profiles(id) on delete cascade,
  role public.app_role not null,
  assigned_by uuid references public.profiles(id) on delete set null,
  assigned_at timestamptz not null default now(),
  primary key (user_id, role)
);

create table public.audit_events (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid references public.profiles(id) on delete set null,
  action text not null check (char_length(action) between 1 and 100),
  entity_type text not null check (char_length(entity_type) between 1 and 80),
  entity_id uuid,
  request_id text check (request_id is null or char_length(request_id) <= 120),
  before_snapshot jsonb,
  after_snapshot jsonb,
  occurred_at timestamptz not null default now()
);

create index profiles_email_idx on public.profiles (email);
create index user_roles_role_idx on public.user_roles (role);
create index audit_events_actor_time_idx on public.audit_events (actor_user_id, occurred_at desc);
create index audit_events_entity_idx on public.audit_events (entity_type, entity_id, occurred_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, email, status)
  values (
    new.id,
    left(coalesce(new.raw_user_meta_data ->> 'display_name', ''), 120),
    new.email,
    'invited'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_auth_user();

create or replace function public.has_role(target_role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles ur
    join public.profiles p on p.id = ur.user_id
    where ur.user_id = auth.uid()
      and ur.role = target_role
      and p.status = 'active'
  );
$$;

create or replace function public.has_permission(target_permission text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles ur
    join public.role_permissions rp on rp.role = ur.role
    join public.profiles p on p.id = ur.user_id
    where ur.user_id = auth.uid()
      and rp.permission = target_permission
      and p.status = 'active'
  );
$$;

revoke all on function public.has_role(public.app_role) from public;
revoke all on function public.has_permission(text) from public;
grant execute on function public.has_role(public.app_role) to authenticated;
grant execute on function public.has_permission(text) to authenticated;

insert into public.role_permissions (role, permission) values
  ('super_admin', 'users:read'),
  ('super_admin', 'users:manage'),
  ('super_admin', 'content:read'),
  ('super_admin', 'content:write'),
  ('super_admin', 'content:approve'),
  ('super_admin', 'tpq:read'),
  ('super_admin', 'tpq:write'),
  ('super_admin', 'finance:read'),
  ('super_admin', 'finance:write'),
  ('super_admin', 'audit:read'),
  ('ketua_dkm', 'users:read'),
  ('ketua_dkm', 'content:read'),
  ('ketua_dkm', 'content:write'),
  ('ketua_dkm', 'content:approve'),
  ('ketua_dkm', 'tpq:read'),
  ('ketua_dkm', 'finance:read'),
  ('ketua_dkm', 'audit:read'),
  ('sekretaris', 'content:read'),
  ('sekretaris', 'content:write'),
  ('humas', 'content:read'),
  ('humas', 'content:write'),
  ('humas', 'content:approve'),
  ('bendahara', 'finance:read'),
  ('bendahara', 'finance:write'),
  ('kepala_tpq', 'tpq:read'),
  ('kepala_tpq', 'tpq:write'),
  ('guru_tpq', 'tpq:read'),
  ('guru_tpq', 'tpq:write'),
  ('viewer', 'content:read')
on conflict do nothing;

alter table public.profiles enable row level security;
alter table public.role_permissions enable row level security;
alter table public.user_roles enable row level security;
alter table public.audit_events enable row level security;

revoke all on table public.profiles from anon, authenticated;
revoke all on table public.role_permissions from anon, authenticated;
revoke all on table public.user_roles from anon, authenticated;
revoke all on table public.audit_events from anon, authenticated;

grant select on table public.profiles to authenticated;
grant update (display_name) on table public.profiles to authenticated;
grant select on table public.role_permissions to authenticated;
grant select, insert, update, delete on table public.user_roles to authenticated;
grant select on table public.audit_events to authenticated;

create policy profiles_read_own_or_user_admin
on public.profiles for select to authenticated
using (id = auth.uid() or public.has_permission('users:read'));

create policy profiles_update_own_display_name
on public.profiles for update to authenticated
using (id = auth.uid() and status = 'active')
with check (id = auth.uid() and status = 'active');

create policy role_permissions_read_authenticated
on public.role_permissions for select to authenticated
using (true);

create policy user_roles_read_own_or_user_admin
on public.user_roles for select to authenticated
using (user_id = auth.uid() or public.has_permission('users:read'));

create policy user_roles_manage_super_admin
on public.user_roles for all to authenticated
using (public.has_permission('users:manage'))
with check (public.has_permission('users:manage'));

create policy audit_events_read_authorized
on public.audit_events for select to authenticated
using (public.has_permission('audit:read'));

-- No client INSERT/UPDATE/DELETE policy exists for audit_events.
-- Future SECURITY DEFINER command functions must create audit events atomically.

commit;
