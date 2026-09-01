select 'manual command sees extensions schema' as check_name,
  coalesce((select array_to_string(proconfig,',') like '%search_path=public, extensions%'
    from pg_proc where oid='public.command_finance_manual_entry(text,uuid,uuid,integer,jsonb,text)'::regprocedure),false) as pass
union all select 'pgcrypto digest available',
  to_regprocedure('extensions.digest(text,text)') is not null;
