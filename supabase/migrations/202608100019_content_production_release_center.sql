-- Intentional production release for public-safe content. Disabled by default.
begin;

insert into public.integration_feature_flags(key,enabled)
values('content_production_release_enabled',false)
on conflict(key) do update set enabled=false,updated_at=now(),updated_by=null;

alter table public.content_articles add column if not exists released_from_test_id uuid references public.content_articles(id);
alter table public.content_programs add column if not exists released_from_test_id uuid references public.content_programs(id);
alter table public.content_agenda add column if not exists released_from_test_id uuid references public.content_agenda(id);

alter table public.content_articles drop constraint if exists content_articles_slug_key;
create unique index if not exists content_articles_environment_slug_key on public.content_articles(environment,slug);
create unique index if not exists content_articles_release_source_key on public.content_articles(released_from_test_id) where released_from_test_id is not null;
create unique index if not exists content_programs_release_source_key on public.content_programs(released_from_test_id) where released_from_test_id is not null;
create unique index if not exists content_agenda_release_source_key on public.content_agenda(released_from_test_id) where released_from_test_id is not null;

create table if not exists public.content_production_release_receipts(
 actor_user_id uuid not null references public.profiles(id),idempotency_key uuid not null,
 entity_type text not null check(entity_type in('article','program','agenda')),
 source_test_id uuid not null,production_id uuid not null,result jsonb not null,
 created_at timestamptz not null default now(),primary key(actor_user_id,idempotency_key)
);
alter table public.content_production_release_receipts enable row level security;
revoke all on table public.content_production_release_receipts from anon,authenticated;

create or replace function public.require_content_article_test_mode() returns trigger language plpgsql security definer set search_path=public as $$
begin
 if new.environment='production' and current_setting('app.content_production_release',true)='authorized' then return new; end if;
 if new.environment<>'test' then raise exception 'ARTICLE_PRODUCTION_WRITE_DISABLED';end if;
 if not coalesce((select enabled from public.integration_feature_flags where key='content_article_test_mode_enabled'),false) then raise exception 'ARTICLE_TEST_MODE_DISABLED';end if;
 return new;
end;$$;
create or replace function public.require_content_program_test_mode() returns trigger language plpgsql security definer set search_path=public as $$
begin
 if new.environment='production' and current_setting('app.content_production_release',true)='authorized' then return new; end if;
 if new.environment<>'test' then raise exception 'PROGRAM_PRODUCTION_WRITE_DISABLED';end if;
 if not coalesce((select enabled from public.integration_feature_flags where key='content_program_test_mode_enabled'),false) then raise exception 'PROGRAM_TEST_MODE_DISABLED';end if;
 return new;
end;$$;
create or replace function public.require_content_agenda_test_mode() returns trigger language plpgsql security definer set search_path=public as $$
begin
 if new.environment='production' and current_setting('app.content_production_release',true)='authorized' then return new; end if;
 if new.environment<>'test' then raise exception 'AGENDA_PRODUCTION_WRITE_DISABLED';end if;
 if not coalesce((select enabled from public.integration_feature_flags where key='content_agenda_test_mode_enabled'),false) then raise exception 'AGENDA_TEST_MODE_DISABLED';end if;
 return new;
end;$$;
revoke all on function public.require_content_article_test_mode(),public.require_content_program_test_mode(),public.require_content_agenda_test_mode() from public,anon,authenticated;

create or replace function public.content_production_release_capabilities() returns jsonb language sql stable security definer set search_path=public as $$
 select jsonb_build_object('release_enabled',coalesce((select enabled from public.integration_feature_flags where key='content_production_release_enabled'),false),'can_release',public.has_permission('users:manage'));
$$;
revoke all on function public.content_production_release_capabilities() from public,anon;
grant execute on function public.content_production_release_capabilities() to authenticated;

create or replace function public.list_content_production_candidates()
returns table(entity_type text,source_test_id uuid,title text,version integer,visibility text,media_blocked boolean,already_released boolean)
language sql stable security definer set search_path=public as $$
 select 'article',a.id,a.title,a.version,a.visibility,(a.cover_image_path<>''),exists(select 1 from public.content_articles p where p.released_from_test_id=a.id)
 from public.content_articles a where a.environment='test' and a.workflow_status='Siap publik' and a.archived_at is null and public.has_permission('users:manage')
 union all
 select 'program',p.id,p.title,p.version,p.visibility,false,exists(select 1 from public.content_programs x where x.released_from_test_id=p.id)
 from public.content_programs p where p.environment='test' and p.status='Siap publik' and p.archived_at is null and public.has_permission('users:manage')
 union all
 select 'agenda',a.id,a.title,a.version,a.visibility,false,exists(select 1 from public.content_agenda x where x.released_from_test_id=a.id)
 from public.content_agenda a where a.environment='test' and a.status='Siap publik' and a.archived_at is null and public.has_permission('users:manage');
$$;
revoke all on function public.list_content_production_candidates() from public,anon;
grant execute on function public.list_content_production_candidates() to authenticated;

create or replace function public.release_content_to_production(p_entity_type text,p_source_test_id uuid,p_expected_version integer,p_idempotency_key uuid)
returns jsonb language plpgsql security definer set search_path=public as $$
declare result jsonb; production_id uuid;
begin
 if auth.uid() is null then raise exception 'AUTHENTICATION_REQUIRED';end if;
 if not public.has_permission('users:manage') then raise exception 'PRODUCTION_RELEASE_FORBIDDEN';end if;
 if not coalesce((select enabled from public.integration_feature_flags where key='content_production_release_enabled'),false) then raise exception 'PRODUCTION_RELEASE_DISABLED';end if;
 if p_idempotency_key is null then raise exception 'IDEMPOTENCY_KEY_REQUIRED';end if;
 select r.result into result from public.content_production_release_receipts r where r.actor_user_id=auth.uid() and r.idempotency_key=p_idempotency_key;if found then return result;end if;
 if(select count(*) from public.content_production_release_receipts where actor_user_id=auth.uid() and created_at>now()-interval '15 minutes')>=15 then raise exception 'PRODUCTION_RELEASE_RATE_LIMITED';end if;
 perform set_config('app.content_production_release','authorized',true);
 if p_entity_type='article' then
  if not exists(select 1 from public.content_articles where id=p_source_test_id and environment='test' and workflow_status='Siap publik' and visibility='Publik' and version=p_expected_version and archived_at is null) then raise exception 'ARTICLE_NOT_RELEASE_READY';end if;
  if exists(select 1 from public.content_articles where id=p_source_test_id and cover_image_path<>'') then raise exception 'ARTICLE_PRIVATE_MEDIA_REQUIRES_PUBLIC_PROMOTION';end if;
  insert into public.content_articles(slug,title,excerpt,body,category,tags,cover_image_url,author_label,visibility,workflow_status,source_verified,version,created_by,reviewed_by,published_by,reviewed_at,published_at,environment,released_from_test_id)
  select slug,title,excerpt,body,category,tags,cover_image_url,author_label,'Publik','Siap publik',true,1,created_by,auth.uid(),auth.uid(),now(),now(),'production',id from public.content_articles where id=p_source_test_id returning id into production_id;
 elsif p_entity_type='program' then
  if not exists(select 1 from public.content_programs where id=p_source_test_id and environment='test' and status='Siap publik' and visibility='Publik' and version=p_expected_version and archived_at is null) then raise exception 'PROGRAM_NOT_RELEASE_READY';end if;
  insert into public.content_programs(title,category,pillar,description,schedule_day,schedule_time,location,speaker_label,poster_url,visibility,status,source_verified,version,environment,created_by,reviewed_by,reviewed_at,released_from_test_id)
  select title,category,pillar,description,schedule_day,schedule_time,location,speaker_label,poster_url,'Publik','Siap publik',true,1,'production',created_by,auth.uid(),now(),id from public.content_programs where id=p_source_test_id returning id into production_id;
 elsif p_entity_type='agenda' then
  if not exists(select 1 from public.content_agenda where id=p_source_test_id and environment='test' and status='Siap publik' and visibility='Publik' and version=p_expected_version and archived_at is null) then raise exception 'AGENDA_NOT_RELEASE_READY';end if;
  insert into public.content_agenda(title,category,description,event_date,event_time,location,visibility,status,source_verified,version,environment,created_by,reviewed_by,reviewed_at,released_from_test_id)
  select title,category,description,event_date,event_time,location,'Publik','Siap publik',true,1,'production',created_by,auth.uid(),now(),id from public.content_agenda where id=p_source_test_id returning id into production_id;
 else raise exception 'UNKNOWN_RELEASE_ENTITY';end if;
 result:=jsonb_build_object('entity_type',p_entity_type,'source_test_id',p_source_test_id,'production_id',production_id,'released',true);
 insert into public.audit_events(actor_user_id,action,entity_type,entity_id,before_snapshot,after_snapshot) values(auth.uid(),'content.production.release','content_'||p_entity_type,production_id,jsonb_build_object('source_test_id',p_source_test_id),result);
 insert into public.content_production_release_receipts values(auth.uid(),p_idempotency_key,p_entity_type,p_source_test_id,production_id,result,now());
 return result;
end;$$;
revoke all on function public.release_content_to_production(text,uuid,integer,uuid) from public,anon;
grant execute on function public.release_content_to_production(text,uuid,integer,uuid) to authenticated;

commit;
