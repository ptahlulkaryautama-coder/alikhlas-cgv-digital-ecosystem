-- Admin-driven user creation for Super Admin directly inside dashboard.
-- Allows Super Admin to register and assign roles to new DKM/TPQ administrators.

begin;

create or replace function public.admin_create_user_account(
  p_email text,
  p_password text,
  p_display_name text default '',
  p_roles public.app_role[] default array[]::public.app_role[]
)
returns jsonb
language plpgsql
security definer
set search_path = public, auth, extensions
as $$
declare
  new_user_id uuid;
  assigned_role public.app_role;
  clean_email text;
  clean_name text;
begin
  if auth.uid() is null then
    raise exception 'AUTHENTICATION_REQUIRED';
  end if;

  if not public.has_role('super_admin') or not public.has_permission('users:manage') then
    raise exception 'SUPER_ADMIN_REQUIRED';
  end if;

  clean_email := lower(trim(coalesce(p_email, '')));
  clean_name := trim(coalesce(p_display_name, ''));

  if clean_email = '' or clean_email !~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' then
    raise exception 'INVALID_EMAIL_FORMAT';
  end if;

  if p_password is null or char_length(p_password) < 6 then
    raise exception 'PASSWORD_TOO_SHORT';
  end if;

  if exists (select 1 from auth.users where lower(email) = clean_email) or
     exists (select 1 from public.profiles where email = clean_email::citext) then
    raise exception 'EMAIL_ALREADY_EXISTS';
  end if;

  new_user_id := gen_random_uuid();

  insert into auth.users (
    id,
    instance_id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at
  ) values (
    new_user_id,
    '00000000-0000-0000-0000-000000000000'::uuid,
    'authenticated',
    'authenticated',
    clean_email,
    crypt(p_password, gen_salt('bf')),
    now(),
    jsonb_build_object('provider', 'email', 'providers', jsonb_build_array('email')),
    jsonb_build_object('display_name', clean_name),
    now(),
    now()
  );

  insert into public.profiles (id, display_name, email, status)
  values (new_user_id, clean_name, clean_email::citext, 'active')
  on conflict (id) do update set
    display_name = excluded.display_name,
    email = excluded.email,
    status = 'active',
    updated_at = now();

  if p_roles is not null and array_length(p_roles, 1) > 0 then
    foreach assigned_role in array p_roles loop
      if assigned_role != 'super_admin' then
        insert into public.user_roles (user_id, role, assigned_by)
        values (new_user_id, assigned_role, auth.uid())
        on conflict (user_id, role) do nothing;
      end if;
    end loop;
  end if;

  insert into public.audit_events (
    actor_user_id,
    action,
    entity_type,
    entity_id,
    before_snapshot,
    after_snapshot
  ) values (
    auth.uid(),
    'access.user.create',
    'profile',
    new_user_id,
    null,
    jsonb_build_object(
      'email', clean_email,
      'display_name', clean_name,
      'roles', coalesce(p_roles, array[]::public.app_role[])
    )
  );

  return jsonb_build_object(
    'user_id', new_user_id,
    'email', clean_email,
    'display_name', clean_name,
    'status', 'active'
  );
end;
$$;

revoke all on function public.admin_create_user_account(text, text, text, public.app_role[]) from public, anon;
grant execute on function public.admin_create_user_account(text, text, text, public.app_role[]) to authenticated;

commit;
