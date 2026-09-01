-- Recoverable account removal and audited test-content maintenance.
begin;
create or replace function public.suspend_user_account(p_user_id uuid,p_reason text)
returns jsonb language plpgsql security definer set search_path=public as $$
declare before_state jsonb;
begin
 if auth.uid() is null then raise exception 'AUTHENTICATION_REQUIRED';end if;
 if not public.has_role('super_admin') or not public.has_permission('users:manage') then raise exception 'SUPER_ADMIN_REQUIRED';end if;
 if p_user_id=auth.uid() then raise exception 'CANNOT_SUSPEND_OWN_ACCOUNT';end if;
 if p_reason is null or char_length(trim(p_reason)) not between 5 and 300 then raise exception 'SUSPENSION_REASON_REQUIRED';end if;
 if not exists(select 1 from public.profiles where id=p_user_id and status='active') then raise exception 'ACTIVE_USER_REQUIRED';end if;
 if exists(select 1 from public.user_roles where user_id=p_user_id and role='super_admin') then raise exception 'SUPER_ADMIN_ACCOUNT_PROTECTED';end if;
 select jsonb_build_object('profile',to_jsonb(p),'roles',coalesce((select jsonb_agg(role) from public.user_roles where user_id=p_user_id),'[]'::jsonb),'grants',coalesce((select jsonb_agg(permission) from public.user_permission_grants where user_id=p_user_id),'[]'::jsonb)) into before_state from public.profiles p where p.id=p_user_id;
 delete from public.user_roles where user_id=p_user_id;delete from public.user_permission_grants where user_id=p_user_id;
 update public.profiles set status='suspended',updated_at=now() where id=p_user_id;
 insert into public.audit_events(actor_user_id,action,entity_type,entity_id,before_snapshot,after_snapshot) values(auth.uid(),'access.account.suspend','profile',p_user_id,before_state,jsonb_build_object('status','suspended','reason',trim(p_reason)));
 return jsonb_build_object('user_id',p_user_id,'status','suspended');
end;$$;
revoke all on function public.suspend_user_account(uuid,text) from public,anon;
grant execute on function public.suspend_user_account(uuid,text) to authenticated;

create or replace function public.manage_test_content(p_entity_type text,p_source_test_id uuid,p_expected_version integer,p_action text,p_reason text default null)
returns jsonb language plpgsql security definer set search_path=public as $$
declare result jsonb;before_state jsonb;
begin
 if auth.uid() is null then raise exception 'AUTHENTICATION_REQUIRED';end if;
 if not public.has_permission('content:release') then raise exception 'TRIAL_MANAGEMENT_FORBIDDEN';end if;
 if not coalesce((select enabled from public.integration_feature_flags where key='content_production_release_enabled'),false) then raise exception 'TRIAL_MANAGEMENT_DISABLED';end if;
 if p_action not in('reopen','archive') then raise exception 'UNKNOWN_TRIAL_ACTION';end if;
 if p_action='archive' and(p_reason is null or char_length(trim(p_reason)) not between 5 and 300) then raise exception 'ARCHIVE_REASON_REQUIRED';end if;
 perform set_config('app.content_production_release','authorized',true);
 if p_entity_type='article' then
  select to_jsonb(a) into before_state from public.content_articles a where a.id=p_source_test_id and a.environment='test' and a.version=p_expected_version and a.archived_at is null for update;if not found then raise exception 'ARTICLE_TRIAL_NOT_FOUND_OR_CHANGED';end if;
  update public.content_articles set workflow_status=case when p_action='reopen' then 'Draft' else 'Arsip' end,source_verified=false,reviewed_by=null,reviewed_at=null,published_by=null,published_at=null,archived_by=case when p_action='archive' then auth.uid() else null end,archived_at=case when p_action='archive' then now() else null end,version=version+1,updated_at=now() where id=p_source_test_id;
  select jsonb_build_object('id',id,'status',workflow_status,'version',version) into result from public.content_articles where id=p_source_test_id;
 elsif p_entity_type='program' then
  select to_jsonb(p) into before_state from public.content_programs p where p.id=p_source_test_id and p.environment='test' and p.version=p_expected_version and p.archived_at is null for update;if not found then raise exception 'PROGRAM_TRIAL_NOT_FOUND_OR_CHANGED';end if;
  update public.content_programs set status=case when p_action='reopen' then 'Draft' else 'Arsip' end,source_verified=false,reviewed_by=null,reviewed_at=null,archived_by=case when p_action='archive' then auth.uid() else null end,archived_at=case when p_action='archive' then now() else null end,version=version+1,updated_at=now() where id=p_source_test_id;
  select jsonb_build_object('id',id,'status',status,'version',version) into result from public.content_programs where id=p_source_test_id;
 elsif p_entity_type='agenda' then
  select to_jsonb(a) into before_state from public.content_agenda a where a.id=p_source_test_id and a.environment='test' and a.version=p_expected_version and a.archived_at is null for update;if not found then raise exception 'AGENDA_TRIAL_NOT_FOUND_OR_CHANGED';end if;
  update public.content_agenda set status=case when p_action='reopen' then 'Draft' else 'Arsip' end,source_verified=false,reviewed_by=null,reviewed_at=null,archived_by=case when p_action='archive' then auth.uid() else null end,archived_at=case when p_action='archive' then now() else null end,version=version+1,updated_at=now() where id=p_source_test_id;
  select jsonb_build_object('id',id,'status',status,'version',version) into result from public.content_agenda where id=p_source_test_id;
 else raise exception 'UNKNOWN_TRIAL_ENTITY';end if;
 insert into public.audit_events(actor_user_id,action,entity_type,entity_id,before_snapshot,after_snapshot) values(auth.uid(),'content.trial.'||p_action,'content_'||p_entity_type,p_source_test_id,before_state,result||jsonb_build_object('reason',p_reason));return result;
end;$$;
revoke all on function public.manage_test_content(text,uuid,integer,text,text) from public,anon;
grant execute on function public.manage_test_content(text,uuid,integer,text,text) to authenticated;
commit;
