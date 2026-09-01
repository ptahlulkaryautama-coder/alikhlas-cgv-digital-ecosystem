-- READ-ONLY verification after migration 007.
select 'article writes disabled' as check_name,
       coalesce((select not enabled from public.integration_feature_flags where key='content_article_writes_enabled'),false) as pass
union all
select 'article RLS enabled', coalesce((select relrowsecurity from pg_class where oid='public.content_articles'::regclass),false)
union all
select 'no browser article mutation grants', not exists (
  select 1 from information_schema.role_table_grants where table_schema='public' and table_name in ('content_articles','content_article_command_receipts')
  and grantee in ('anon','authenticated') and privilege_type in ('INSERT','UPDATE','DELETE','TRUNCATE')
)
union all
select 'public policy is publication scoped', exists (
  select 1 from pg_policies where schemaname='public' and tablename='content_articles' and policyname='content_articles_public_read'
  and roles::text like '%anon%' and qual like '%Siap publik%' and qual like '%Publik%' and qual like '%archived_at%'
)
union all
select 'command RPC is not public', not has_function_privilege('public','public.command_content_article(text,uuid,uuid,integer,jsonb,text)','execute');

