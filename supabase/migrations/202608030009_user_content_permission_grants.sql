-- Super Admin managed per-user editorial grants without changing primary roles.
begin;

alter table public.user_permission_grants
  drop constraint if exists user_permission_grants_permission_check;
alter table public.user_permission_grants
  add constraint user_permission_grants_permission_check
  check (permission in ('finance:approve','tpq_finance:approve','content:read','content:write','content:approve'));

create or replace function public.set_user_content_permission(
  p_user_id uuid,
  p_permission text,
  p_enabled boolean
) returns jsonb language plpgsql security definer set search_path=public as $$
declare
  v_before jsonb;
  v_needs_read boolean;
begin
  if auth.uid() is null then raise exception 'AUTHENTICATION_REQUIRED'; end if;
  if not public.has_role('super_admin') or not public.has_permission('users:manage') then raise exception 'SUPER_ADMIN_REQUIRED'; end if;
  if not exists(select 1 from public.profiles where id=p_user_id and status='active') then raise exception 'ACTIVE_USER_REQUIRED'; end if;
  if p_permission not in ('content:write','content:approve') then raise exception 'PERMISSION_NOT_ASSIGNABLE'; end if;

  v_before := (select jsonb_agg(to_jsonb(g)) from public.user_permission_grants g where user_id=p_user_id and permission like 'content:%');
  if p_enabled then
    insert into public.user_permission_grants(user_id,permission,assigned_by)
    values(p_user_id,p_permission,auth.uid())
    on conflict(user_id,permission) do update set assigned_by=excluded.assigned_by,assigned_at=now();
    insert into public.user_permission_grants(user_id,permission,assigned_by)
    values(p_user_id,'content:read',auth.uid())
    on conflict(user_id,permission) do update set assigned_by=excluded.assigned_by,assigned_at=now();
  else
    delete from public.user_permission_grants where user_id=p_user_id and permission=p_permission;
    select exists(select 1 from public.user_permission_grants where user_id=p_user_id and permission in ('content:write','content:approve')) into v_needs_read;
    if not v_needs_read then delete from public.user_permission_grants where user_id=p_user_id and permission='content:read'; end if;
  end if;

  insert into public.audit_events(actor_user_id,action,entity_type,entity_id,before_snapshot,after_snapshot)
  values(auth.uid(),case when p_enabled then 'content.permission.grant' else 'content.permission.revoke' end,
    'user_permission_grant',p_user_id,v_before,jsonb_build_object('permission',p_permission,'enabled',p_enabled));
  return jsonb_build_object('user_id',p_user_id,'permission',p_permission,'enabled',p_enabled);
end;
$$;

revoke all on function public.set_user_content_permission(uuid,text,boolean) from public;
grant execute on function public.set_user_content_permission(uuid,text,boolean) to authenticated;

commit;
