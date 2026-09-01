-- Enable only the isolated article trial. Test articles remain hidden from anon/public reads.
begin;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'content_articles'
      and policyname = 'content_articles_public_read'
      and qual like '%production%'
  ) then
    raise exception 'PUBLIC_ARTICLE_TEST_ISOLATION_NOT_READY';
  end if;

  if not exists (
    select 1 from information_schema.triggers
    where event_object_schema = 'public'
      and event_object_table = 'content_articles'
      and trigger_name = 'content_articles_require_test_mode'
  ) then
    raise exception 'ARTICLE_TEST_MODE_TRIGGER_NOT_READY';
  end if;
end;
$$;

update public.integration_feature_flags
set enabled = true, updated_at = now()
where key in ('content_article_writes_enabled', 'content_article_test_mode_enabled');

do $$
begin
  if (select count(*) from public.integration_feature_flags
      where key in ('content_article_writes_enabled', 'content_article_test_mode_enabled')
        and enabled) <> 2 then
    raise exception 'ARTICLE_TRIAL_FLAGS_NOT_ENABLED';
  end if;
end;
$$;

commit;

select key, enabled
from public.integration_feature_flags
where key in ('content_article_writes_enabled', 'content_article_test_mode_enabled')
order by key;
