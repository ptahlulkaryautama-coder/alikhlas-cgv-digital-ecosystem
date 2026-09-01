-- Recover suspended dashboard accounts without restoring old roles automatically.
begin;

create or replace function public.restore_user_account(p_user_id uuid, p_reason text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  before_state jsonb;
  after_state jsonb;
begin
  if auth.uid() is null then
    raise exception 'AUTHENTICATION_REQUIRED';
  end if;

  if not public.has_role('super_admin') or not public.has_permission('users:manage') then
    raise exception 'SUPER_ADMIN_REQUIRED';
  end if;

  if p_reason is null or char_length(trim(p_reason)) not between 5 and 300 then
    raise exception 'RESTORE_REASON_REQUIRED';
  end if;

  select jsonb_build_object(
    'profile', to_jsonb(p),
    'roles', coalesce((select jsonb_agg(role order by role) from public.user_roles where user_id = p_user_id), '[]'::jsonb),
    'grants', coalesce((select jsonb_agg(permission order by permission) from public.user_permission_grants where user_id = p_user_id), '[]'::jsonb)
  )
  into before_state
  from public.profiles p
  where p.id = p_user_id
    and p.status = 'suspended'
  for update;

  if before_state is null then
    raise exception 'SUSPENDED_USER_REQUIRED';
  end if;

  update public.profiles
  set status = 'active',
      updated_at = now()
  where id = p_user_id;

  after_state := jsonb_build_object(
    'status', 'active',
    'roles_restored', false,
    'grants_restored', false,
    'reason', trim(p_reason)
  );

  insert into public.audit_events(
    actor_user_id,
    action,
    entity_type,
    entity_id,
    before_snapshot,
    after_snapshot
  )
  values(
    auth.uid(),
    'access.account.restore',
    'profile',
    p_user_id,
    before_state,
    after_state
  );

  return jsonb_build_object(
    'user_id', p_user_id,
    'status', 'active',
    'roles_restored', false,
    'grants_restored', false
  );
end;
$$;

revoke all on function public.restore_user_account(uuid, text) from public, anon;
grant execute on function public.restore_user_account(uuid, text) to authenticated;

commit;
