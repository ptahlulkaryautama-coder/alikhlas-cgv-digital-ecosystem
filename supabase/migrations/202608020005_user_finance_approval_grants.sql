-- Per-user finance approval grants managed only by Super Admin.
begin;
create table public.user_permission_grants (
  user_id uuid not null references public.profiles(id) on delete cascade,
  permission text not null check (permission in ('finance:approve', 'tpq_finance:approve')),
  assigned_by uuid not null references public.profiles(id),
  assigned_at timestamptz not null default now(),
  primary key (user_id, permission)
);
alter table public.user_permission_grants enable row level security;
revoke all on table public.user_permission_grants from anon, authenticated;
grant select on table public.user_permission_grants to authenticated;
create policy user_permission_grants_read_own_or_admin on public.user_permission_grants for select to authenticated
using (user_id = auth.uid() or public.has_permission('users:manage'));

create or replace function public.has_permission(target_permission text) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles p where p.id = auth.uid() and p.status = 'active' and (
    exists (select 1 from public.user_roles ur join public.role_permissions rp on rp.role = ur.role where ur.user_id = auth.uid() and rp.permission = target_permission)
    or exists (select 1 from public.user_permission_grants g where g.user_id = auth.uid() and g.permission = target_permission)
  ));
$$;

create or replace function public.set_user_finance_approval_permission(p_user_id uuid, p_permission text, p_enabled boolean)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_before jsonb;
begin
  if auth.uid() is null then raise exception 'AUTHENTICATION_REQUIRED'; end if;
  if not public.has_role('super_admin') or not public.has_permission('users:manage') then raise exception 'SUPER_ADMIN_REQUIRED'; end if;
  if not exists (select 1 from public.profiles where id = p_user_id and status = 'active') then raise exception 'ACTIVE_USER_REQUIRED'; end if;
  if p_permission not in ('finance:approve', 'tpq_finance:approve') then raise exception 'PERMISSION_NOT_ASSIGNABLE'; end if;
  v_before := (select to_jsonb(g) from public.user_permission_grants g where user_id = p_user_id and permission = p_permission);
  if p_enabled then
    insert into public.user_permission_grants (user_id, permission, assigned_by) values (p_user_id, p_permission, auth.uid())
    on conflict (user_id, permission) do update set assigned_by = excluded.assigned_by, assigned_at = now();
  else delete from public.user_permission_grants where user_id = p_user_id and permission = p_permission;
  end if;
  insert into public.audit_events (actor_user_id, action, entity_type, entity_id, before_snapshot, after_snapshot)
  values (auth.uid(), case when p_enabled then 'finance.permission.grant' else 'finance.permission.revoke' end,
    'user_permission_grant', p_user_id, v_before, jsonb_build_object('permission', p_permission, 'enabled', p_enabled));
  return jsonb_build_object('user_id', p_user_id, 'permission', p_permission, 'enabled', p_enabled);
end;
$$;
revoke all on function public.set_user_finance_approval_permission(uuid, text, boolean) from public;
grant execute on function public.set_user_finance_approval_permission(uuid, text, boolean) to authenticated;
commit;
