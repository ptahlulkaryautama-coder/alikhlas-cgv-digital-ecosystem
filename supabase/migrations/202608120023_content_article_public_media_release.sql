-- Public media promotion for production article release.
begin;

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('content-article-public-media','content-article-public-media',true,5242880,array['image/jpeg','image/png','image/webp'])
on conflict(id) do update set public=true,file_size_limit=5242880,allowed_mime_types=excluded.allowed_mime_types;

drop policy if exists content_article_public_media_insert on storage.objects;
create policy content_article_public_media_insert on storage.objects for insert to authenticated
with check(
  bucket_id='content-article-public-media'
  and name ~ '^articles/[0-9a-f-]{36}/cover\.(jpg|jpeg|png|webp)$'
  and public.has_permission('content:release')
  and coalesce((select enabled from public.integration_feature_flags where key='content_production_release_enabled'),false)
);

drop policy if exists content_article_public_media_delete_unreleased on storage.objects;
create policy content_article_public_media_delete_unreleased on storage.objects for delete to authenticated
using(
  bucket_id='content-article-public-media'
  and public.has_permission('content:release')
  and coalesce((select enabled from public.integration_feature_flags where key='content_production_release_enabled'),false)
  and not exists(
    select 1 from public.content_articles a
    where a.environment='production'
      and a.cover_image_url='supabase-storage://content-article-public-media/'||storage.objects.name
      and a.archived_at is null
  )
);

create or replace function public.content_article_public_media_path(p_source_test_id uuid,p_private_path text)
returns text language sql immutable as $$
  select case
    when coalesce(p_private_path,'')='' then ''
    else 'articles/'||p_source_test_id::text||'/cover.'||lower(regexp_replace(p_private_path,'^.*\.([A-Za-z0-9]+)$','\1'))
  end;
$$;
revoke all on function public.content_article_public_media_path(uuid,text) from public,anon,authenticated;

create or replace function public.content_production_release_capabilities() returns jsonb language sql stable security definer set search_path=public as $$
 select jsonb_build_object(
   'release_enabled',coalesce((select enabled from public.integration_feature_flags where key='content_production_release_enabled'),false),
   'can_release',public.has_permission('content:release'),
   'public_media_bucket','content-article-public-media'
 );
$$;
revoke all on function public.content_production_release_capabilities() from public,anon;
grant execute on function public.content_production_release_capabilities() to authenticated;

drop function if exists public.list_content_production_candidates();
create function public.list_content_production_candidates()
returns table(entity_type text,source_test_id uuid,title text,version integer,visibility text,media_blocked boolean,already_released boolean,media_source_path text,media_public_path text)
language sql stable security definer set search_path=public,storage as $$
 select 'article',a.id,a.title,a.version,a.visibility,
   (a.cover_image_path<>'' and not exists(
      select 1 from storage.objects o
      where o.bucket_id='content-article-public-media'
        and o.name=public.content_article_public_media_path(a.id,a.cover_image_path)
   )),
   exists(select 1 from public.content_articles p where p.released_from_test_id=a.id),
   a.cover_image_path,
   public.content_article_public_media_path(a.id,a.cover_image_path)
 from public.content_articles a where a.environment='test' and a.workflow_status='Siap publik' and a.archived_at is null and public.has_permission('content:release')
 union all
 select 'program',p.id,p.title,p.version,p.visibility,false,exists(select 1 from public.content_programs x where x.released_from_test_id=p.id),'',''
 from public.content_programs p where p.environment='test' and p.status='Siap publik' and p.archived_at is null and public.has_permission('content:release')
 union all
 select 'agenda',a.id,a.title,a.version,a.visibility,false,exists(select 1 from public.content_agenda x where x.released_from_test_id=a.id),'',''
 from public.content_agenda a where a.environment='test' and a.status='Siap publik' and a.archived_at is null and public.has_permission('content:release');
$$;
revoke all on function public.list_content_production_candidates() from public,anon;
grant execute on function public.list_content_production_candidates() to authenticated;

create or replace function public.release_content_to_production(p_entity_type text,p_source_test_id uuid,p_expected_version integer,p_idempotency_key uuid)
returns jsonb language plpgsql security definer set search_path=public,storage as $$
declare result jsonb; production_id uuid; v_public_media_url text; v_public_media_path text;
begin
 if auth.uid() is null then raise exception 'AUTHENTICATION_REQUIRED';end if;
 if not public.has_permission('content:release') then raise exception 'PRODUCTION_RELEASE_FORBIDDEN';end if;
 if not coalesce((select enabled from public.integration_feature_flags where key='content_production_release_enabled'),false) then raise exception 'PRODUCTION_RELEASE_DISABLED';end if;
 if p_idempotency_key is null then raise exception 'IDEMPOTENCY_KEY_REQUIRED';end if;
 select r.result into result from public.content_production_release_receipts r where r.actor_user_id=auth.uid() and r.idempotency_key=p_idempotency_key;if found then return result;end if;
 if(select count(*) from public.content_production_release_receipts where actor_user_id=auth.uid() and created_at>now()-interval '15 minutes')>=15 then raise exception 'PRODUCTION_RELEASE_RATE_LIMITED';end if;
 perform set_config('app.content_production_release','authorized',true);
 if p_entity_type='article' then
  if not exists(select 1 from public.content_articles where id=p_source_test_id and environment='test' and workflow_status='Siap publik' and visibility='Publik' and version=p_expected_version and archived_at is null) then raise exception 'ARTICLE_NOT_RELEASE_READY';end if;
  select public.content_article_public_media_path(id,cover_image_path) into v_public_media_path from public.content_articles where id=p_source_test_id;
  if coalesce(v_public_media_path,'')<>'' then
    if not exists(select 1 from storage.objects o where o.bucket_id='content-article-public-media' and o.name=v_public_media_path) then raise exception 'ARTICLE_PUBLIC_MEDIA_REQUIRED';end if;
    v_public_media_url:='supabase-storage://content-article-public-media/'||v_public_media_path;
  else
    v_public_media_url:='';
  end if;
  insert into public.content_articles(slug,title,excerpt,body,category,tags,cover_image_url,author_label,visibility,workflow_status,source_verified,version,created_by,reviewed_by,published_by,reviewed_at,published_at,environment,released_from_test_id)
  select slug,title,excerpt,body,category,tags,coalesce(nullif(v_public_media_url,''),cover_image_url),author_label,'Publik','Siap publik',true,1,created_by,auth.uid(),auth.uid(),now(),now(),'production',id from public.content_articles where id=p_source_test_id returning id into production_id;
 elsif p_entity_type='program' then
  if not exists(select 1 from public.content_programs where id=p_source_test_id and environment='test' and status='Siap publik' and visibility='Publik' and version=p_expected_version and archived_at is null) then raise exception 'PROGRAM_NOT_RELEASE_READY';end if;
  insert into public.content_programs(title,category,pillar,description,schedule_day,schedule_time,location,speaker_label,poster_url,visibility,status,source_verified,version,environment,created_by,reviewed_by,reviewed_at,released_from_test_id)
  select title,category,pillar,description,schedule_day,schedule_time,location,speaker_label,poster_url,'Publik','Siap publik',true,1,'production',created_by,auth.uid(),now(),id from public.content_programs where id=p_source_test_id returning id into production_id;
 elsif p_entity_type='agenda' then
  if not exists(select 1 from public.content_agenda where id=p_source_test_id and environment='test' and status='Siap publik' and visibility='Publik' and version=p_expected_version and archived_at is null) then raise exception 'AGENDA_NOT_RELEASE_READY';end if;
  insert into public.content_agenda(title,category,description,event_date,event_time,location,visibility,status,source_verified,version,environment,created_by,reviewed_by,reviewed_at,released_from_test_id)
  select title,category,description,event_date,event_time,location,'Publik','Siap publik',true,1,'production',created_by,auth.uid(),now(),id from public.content_agenda where id=p_source_test_id returning id into production_id;
 else raise exception 'UNKNOWN_RELEASE_ENTITY';end if;
 result:=jsonb_build_object('entity_type',p_entity_type,'source_test_id',p_source_test_id,'production_id',production_id,'released',true,'public_media_path',v_public_media_path);
 insert into public.audit_events(actor_user_id,action,entity_type,entity_id,before_snapshot,after_snapshot) values(auth.uid(),'content.production.release','content_'||p_entity_type,production_id,jsonb_build_object('source_test_id',p_source_test_id),result);
 insert into public.content_production_release_receipts values(auth.uid(),p_idempotency_key,p_entity_type,p_source_test_id,production_id,result,now());
 return result;
end;$$;
revoke all on function public.release_content_to_production(text,uuid,integer,uuid) from public,anon;
grant execute on function public.release_content_to_production(text,uuid,integer,uuid) to authenticated;

commit;
