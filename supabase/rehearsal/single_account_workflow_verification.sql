select 'article single-account release installed' check_name,
  pg_get_functiondef('public.command_content_article(text,uuid,uuid,integer,jsonb,text)'::regprocedure) not like '%SELF_APPROVAL_FORBIDDEN%' pass
union all select 'program single-account release installed',
  pg_get_functiondef('public.command_content_program(text,uuid,uuid,integer,jsonb,text)'::regprocedure) like '%p.status not in%'
union all select 'agenda single-account release installed',
  pg_get_functiondef('public.command_content_agenda(text,uuid,uuid,integer,jsonb,text)'::regprocedure) like '%a.status not in%'
union all select 'finance import self approval removed',
  pg_get_functiondef('public.transition_finance_import_batch(uuid,text,text)'::regprocedure) not like '%SELF_APPROVAL_FORBIDDEN%'
union all select 'finance manual self approval removed',
  pg_get_functiondef('public.command_finance_manual_entry(text,uuid,uuid,integer,jsonb,text)'::regprocedure) not like '%SELF_APPROVAL_OR_INVALID_TRANSITION%'
union all select 'anonymous remains blocked',
  not has_function_privilege('anon','public.command_content_article(text,uuid,uuid,integer,jsonb,text)','EXECUTE')
  and not has_function_privilege('anon','public.command_content_program(text,uuid,uuid,integer,jsonb,text)','EXECUTE')
  and not has_function_privilege('anon','public.command_content_agenda(text,uuid,uuid,integer,jsonb,text)','EXECUTE')
  and not has_function_privilege('anon','public.transition_finance_import_batch(uuid,text,text)','EXECUTE')
  and not has_function_privilege('anon','public.command_finance_manual_entry(text,uuid,uuid,integer,jsonb,text)','EXECUTE');
