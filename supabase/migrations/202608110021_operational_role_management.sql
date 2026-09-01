-- Audited operational role management for DKM, Media, Finance, and TPQ teams.
begin;
insert into public.role_permissions(role,permission) values
 ('super_admin','content:release'),('ketua_dkm','content:release'),
 ('sekretaris','users:read'),('sekretaris','content:release'),
 ('humas','users:read'),('humas','content:release'),
 ('bendahara','users:read'),('kepala_tpq','users:read') on conflict do nothing;
revoke insert,update,delete on table public.user_roles from authenticated;
create or replace function public.set_user_operational_role(p_user_id uuid,p_role public.app_role,p_enabled boolean)
returns jsonb language plpgsql security definer set search_path=public as $$
declare before_state jsonb;after_state jsonb;
begin
 if auth.uid() is null then raise exception 'AUTHENTICATION_REQUIRED';end if;
 if not public.has_role('super_admin') or not public.has_permission('users:manage') then raise exception 'SUPER_ADMIN_REQUIRED';end if;
 if p_user_id is null or not exists(select 1 from public.profiles where id=p_user_id and status='active') then raise exception 'ACTIVE_USER_REQUIRED';end if;
 if p_role='super_admin' then raise exception 'SUPER_ADMIN_ROLE_NOT_ASSIGNABLE_HERE';end if;
 select coalesce(jsonb_agg(role order by role),'[]'::jsonb) into before_state from public.user_roles where user_id=p_user_id;
 if p_enabled then insert into public.user_roles(user_id,role,assigned_by) values(p_user_id,p_role,auth.uid()) on conflict(user_id,role) do nothing;
 else delete from public.user_roles where user_id=p_user_id and role=p_role;end if;
 select coalesce(jsonb_agg(role order by role),'[]'::jsonb) into after_state from public.user_roles where user_id=p_user_id;
 insert into public.audit_events(actor_user_id,action,entity_type,entity_id,before_snapshot,after_snapshot)
 values(auth.uid(),'access.operational_role.set','user_role',p_user_id,jsonb_build_object('roles',before_state),jsonb_build_object('roles',after_state,'changed_role',p_role,'enabled',p_enabled));
 return jsonb_build_object('user_id',p_user_id,'roles',after_state);
end;$$;
revoke all on function public.set_user_operational_role(uuid,public.app_role,boolean) from public,anon;
grant execute on function public.set_user_operational_role(uuid,public.app_role,boolean) to authenticated;
do $$declare ddl text;patched text;begin
 select pg_get_functiondef('public.content_production_release_capabilities()'::regprocedure) into ddl;patched:=replace(ddl,'users:manage','content:release');if patched=ddl then raise exception 'RELEASE_CAPABILITY_ROLE_PATCH_FAILED';end if;execute patched;
 select pg_get_functiondef('public.list_content_production_candidates()'::regprocedure) into ddl;patched:=replace(ddl,'users:manage','content:release');if patched=ddl then raise exception 'RELEASE_LIST_ROLE_PATCH_FAILED';end if;execute patched;
 select pg_get_functiondef('public.release_content_to_production(text,uuid,integer,uuid)'::regprocedure) into ddl;patched:=replace(ddl,'users:manage','content:release');if patched=ddl then raise exception 'RELEASE_COMMAND_ROLE_PATCH_FAILED';end if;execute patched;
end$$;
revoke all on function public.content_production_release_capabilities(),public.list_content_production_candidates(),public.release_content_to_production(text,uuid,integer,uuid) from public,anon;
grant execute on function public.content_production_release_capabilities(),public.list_content_production_candidates(),public.release_content_to_production(text,uuid,integer,uuid) to authenticated;
commit;
