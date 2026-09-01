-- Single-account operating policy for social content, finance, and future TPQ modules.
-- Authentication, scoped permissions, kill switches, version checks, reconciliation,
-- idempotency, RLS, audit events, archive semantics, and public/test isolation remain.
begin;

do $$
declare ddl text;
begin
  select pg_get_functiondef('public.command_content_article(text,uuid,uuid,integer,jsonb,text)'::regprocedure) into ddl;
  if position('SELF_APPROVAL_FORBIDDEN' in ddl)=0 then raise exception 'ARTICLE_FUNCTION_SHAPE_CHANGED'; end if;
  ddl:=replace(ddl,
    'if not public.has_permission(''content:approve'') then raise exception ''ARTICLE_REVIEW_FORBIDDEN''; end if;',
    'if not public.has_permission(''content:approve'') and not (v_article.created_by=auth.uid() and public.has_permission(''content:write'')) then raise exception ''ARTICLE_REVIEW_FORBIDDEN''; end if;');
  ddl:=replace(ddl,'if v_article.created_by = auth.uid() then raise exception ''SELF_APPROVAL_FORBIDDEN''; end if;','');
  ddl:=replace(ddl,
    'if v_article.workflow_status <> ''Dalam peninjauan'' then raise exception ''INVALID_ARTICLE_TRANSITION''; end if;',
    'if v_article.workflow_status not in (''Draft'',''Ditolak'',''Dalam peninjauan'') then raise exception ''INVALID_ARTICLE_TRANSITION''; end if;');
  execute ddl;

  select pg_get_functiondef('public.command_content_program(text,uuid,uuid,integer,jsonb,text)'::regprocedure) into ddl;
  if position('p.created_by=auth.uid()' in ddl)=0 then raise exception 'PROGRAM_FUNCTION_SHAPE_CHANGED'; end if;
  ddl:=replace(ddl,
    'if not public.has_permission(''content:approve'') or p.created_by=auth.uid() or p.status<>''Dalam peninjauan'' then raise exception ''PROGRAM_REVIEW_FORBIDDEN''; end if;',
    'if (not public.has_permission(''content:approve'') and not (p.created_by=auth.uid() and public.has_permission(''content:write''))) or p.status not in(''Draft'',''Ditolak'',''Dalam peninjauan'') then raise exception ''PROGRAM_REVIEW_FORBIDDEN''; end if;');
  execute ddl;

  select pg_get_functiondef('public.command_content_agenda(text,uuid,uuid,integer,jsonb,text)'::regprocedure) into ddl;
  if position('a.created_by=auth.uid()' in ddl)=0 then raise exception 'AGENDA_FUNCTION_SHAPE_CHANGED'; end if;
  ddl:=replace(ddl,
    'if not public.has_permission(''content:approve'') or a.created_by=auth.uid() or a.status<>''Dalam peninjauan'' then raise exception ''AGENDA_REVIEW_FORBIDDEN'';end if;',
    'if (not public.has_permission(''content:approve'') and not (a.created_by=auth.uid() and public.has_permission(''content:write''))) or a.status not in(''Draft'',''Ditolak'',''Dalam peninjauan'') then raise exception ''AGENDA_REVIEW_FORBIDDEN'';end if;');
  execute ddl;

  select pg_get_functiondef('public.transition_finance_import_batch(uuid,text,text)'::regprocedure) into ddl;
  if position('SELF_APPROVAL_FORBIDDEN' in ddl)=0 then raise exception 'FINANCE_IMPORT_FUNCTION_SHAPE_CHANGED'; end if;
  ddl:=replace(ddl,'if v_batch.created_by = auth.uid() then raise exception ''SELF_APPROVAL_FORBIDDEN''; end if;','');
  ddl:=replace(ddl,
    'if (v_batch.scope = ''dkm'' and not public.has_permission(''finance:approve''))',
    'if (v_batch.scope = ''dkm'' and not (public.has_permission(''finance:approve'') or (v_batch.created_by=auth.uid() and public.has_permission(''finance:write''))))');
  ddl:=replace(ddl,
    'or (v_batch.scope = ''tpq'' and not public.has_permission(''tpq_finance:approve''))',
    'or (v_batch.scope = ''tpq'' and not (public.has_permission(''tpq_finance:approve'') or (v_batch.created_by=auth.uid() and public.has_permission(''tpq_finance:write''))))');
  ddl:=replace(ddl,
    'if (v_batch.scope = ''dkm'' and not public.has_permission(''finance:publish''))',
    'if (v_batch.scope = ''dkm'' and not (public.has_permission(''finance:publish'') or (v_batch.created_by=auth.uid() and public.has_permission(''finance:write''))))');
  ddl:=replace(ddl,
    'or (v_batch.scope = ''tpq'' and not public.has_permission(''tpq_finance:publish''))',
    'or (v_batch.scope = ''tpq'' and not (public.has_permission(''tpq_finance:publish'') or (v_batch.created_by=auth.uid() and public.has_permission(''tpq_finance:write''))))');
  execute ddl;

  select pg_get_functiondef('public.command_finance_manual_entry(text,uuid,uuid,integer,jsonb,text)'::regprocedure) into ddl;
  if position('SELF_APPROVAL_OR_INVALID_TRANSITION' in ddl)=0 then raise exception 'FINANCE_MANUAL_FUNCTION_SHAPE_CHANGED'; end if;
  ddl:=replace(ddl,
    'if e.created_by=auth.uid() or e.workflow_status<>''under_review'' then raise exception ''SELF_APPROVAL_OR_INVALID_TRANSITION'';end if;',
    'if e.workflow_status<>''under_review'' then raise exception ''INVALID_FINANCE_MANUAL_TRANSITION'';end if;');
  ddl:=replace(ddl,
    'if(e.scope=''dkm'' and not public.has_permission(''finance:approve'')) or(e.scope=''tpq'' and not public.has_permission(''tpq_finance:approve'')) then raise exception ''FINANCE_MANUAL_APPROVAL_FORBIDDEN'';end if;',
    'if(e.scope=''dkm'' and not (public.has_permission(''finance:approve'') or (e.created_by=auth.uid() and public.has_permission(''finance:write'')))) or(e.scope=''tpq'' and not (public.has_permission(''tpq_finance:approve'') or (e.created_by=auth.uid() and public.has_permission(''tpq_finance:write'')))) then raise exception ''FINANCE_MANUAL_APPROVAL_FORBIDDEN'';end if;');
  ddl:=replace(ddl,
    'if(e.scope=''dkm'' and not public.has_permission(''finance:publish'')) or(e.scope=''tpq'' and not public.has_permission(''tpq_finance:publish'')) then raise exception ''FINANCE_MANUAL_PUBLISH_FORBIDDEN'';end if;',
    'if(e.scope=''dkm'' and not (public.has_permission(''finance:publish'') or (e.created_by=auth.uid() and public.has_permission(''finance:write'')))) or(e.scope=''tpq'' and not (public.has_permission(''tpq_finance:publish'') or (e.created_by=auth.uid() and public.has_permission(''tpq_finance:write'')))) then raise exception ''FINANCE_MANUAL_PUBLISH_FORBIDDEN'';end if;');
  execute ddl;
end$$;

-- Preserve the existing restrictive grants after function replacement.
revoke all on function public.command_content_article(text,uuid,uuid,integer,jsonb,text) from public,anon;
revoke all on function public.command_content_program(text,uuid,uuid,integer,jsonb,text) from public,anon;
revoke all on function public.command_content_agenda(text,uuid,uuid,integer,jsonb,text) from public,anon;
revoke all on function public.transition_finance_import_batch(uuid,text,text) from public,anon;
revoke all on function public.command_finance_manual_entry(text,uuid,uuid,integer,jsonb,text) from public,anon;
grant execute on function public.command_content_article(text,uuid,uuid,integer,jsonb,text) to authenticated;
grant execute on function public.command_content_program(text,uuid,uuid,integer,jsonb,text) to authenticated;
grant execute on function public.command_content_agenda(text,uuid,uuid,integer,jsonb,text) to authenticated;
grant execute on function public.transition_finance_import_batch(uuid,text,text) to authenticated;
grant execute on function public.command_finance_manual_entry(text,uuid,uuid,integer,jsonb,text) to authenticated;

commit;
