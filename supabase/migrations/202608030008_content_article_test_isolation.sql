-- Isolate article workflow trials from production/public content.
begin;

insert into public.integration_feature_flags (key, enabled)
values ('content_article_test_mode_enabled',false)
on conflict (key) do nothing;

alter table public.content_articles
  add column environment text not null default 'test'
  check (environment in ('test','production'));

drop policy if exists content_articles_public_read on public.content_articles;
create policy content_articles_public_read on public.content_articles for select to anon
using (environment='production' and workflow_status='Siap publik' and visibility='Publik' and archived_at is null);

create or replace function public.require_content_article_test_mode()
returns trigger language plpgsql security definer set search_path=public as $$
begin
  if new.environment <> 'test' then
    raise exception 'ARTICLE_PRODUCTION_WRITE_DISABLED';
  end if;
  if not coalesce((select enabled from public.integration_feature_flags where key='content_article_test_mode_enabled'),false) then
    raise exception 'ARTICLE_TEST_MODE_DISABLED';
  end if;
  return new;
end;
$$;

revoke all on function public.require_content_article_test_mode() from public;

drop trigger if exists content_articles_require_test_mode on public.content_articles;
create trigger content_articles_require_test_mode
before insert or update on public.content_articles
for each row execute function public.require_content_article_test_mode();

create or replace function public.content_article_capabilities()
returns jsonb language sql stable security definer set search_path=public as $$
  select jsonb_build_object(
    'writes_enabled',coalesce((select enabled from public.integration_feature_flags where key='content_article_writes_enabled'),false),
    'test_mode_enabled',coalesce((select enabled from public.integration_feature_flags where key='content_article_test_mode_enabled'),false),
    'can_write',public.has_permission('content:write'),
    'can_approve',public.has_permission('content:approve')
  );
$$;

revoke all on function public.content_article_capabilities() from public;
grant execute on function public.content_article_capabilities() to authenticated;

commit;
