-- Storage RLS cannot read private feature flags as the authenticated role.
-- Resolve the decision through a narrowly scoped security-definer predicate.
begin;

create or replace function public.content_article_media_upload_allowed()
returns boolean language sql stable security definer set search_path=public as $$
  select auth.uid() is not null
    and public.has_permission('content:write')
    and coalesce((select enabled from public.integration_feature_flags where key='content_article_writes_enabled'),false)
    and coalesce((select enabled from public.integration_feature_flags where key='content_article_test_mode_enabled'),false)
    and coalesce((select enabled from public.integration_feature_flags where key='content_article_media_test_enabled'),false);
$$;
revoke all on function public.content_article_media_upload_allowed() from public,anon;
grant execute on function public.content_article_media_upload_allowed() to authenticated;

drop policy if exists content_article_test_media_insert on storage.objects;
create policy content_article_test_media_insert on storage.objects for insert to authenticated
with check(
  bucket_id='content-article-test-media'
  and (storage.foldername(name))[1]=auth.uid()::text
  and public.content_article_media_upload_allowed()
);

drop policy if exists content_article_test_media_delete_orphan on storage.objects;
create policy content_article_test_media_delete_orphan on storage.objects for delete to authenticated
using(
  bucket_id='content-article-test-media'
  and (storage.foldername(name))[1]=auth.uid()::text
  and public.content_article_media_upload_allowed()
  and not exists(select 1 from public.content_articles a where a.cover_image_path=storage.objects.name)
);

commit;
