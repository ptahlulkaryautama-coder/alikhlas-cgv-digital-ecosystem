-- Correct the manual-finance patch where pg_get_functiondef normalized whitespace.
begin;
do $$
declare ddl text;
begin
  select pg_get_functiondef('public.command_finance_manual_entry(text,uuid,uuid,integer,jsonb,text)'::regprocedure) into ddl;
  if position('SELF_APPROVAL_OR_INVALID_TRANSITION' in ddl)=0 then
    raise notice 'Manual finance was already patched';
    return;
  end if;

  ddl:=replace(ddl,
    'if v_entry.created_by=auth.uid() or v_entry.workflow_status<>''under_review'' then raise exception ''SELF_APPROVAL_OR_INVALID_TRANSITION''; end if;',
    'if v_entry.workflow_status<>''under_review'' then raise exception ''INVALID_FINANCE_MANUAL_TRANSITION''; end if;');
  ddl:=replace(ddl,
    'if (v_entry.scope=''dkm'' and not public.has_permission(''finance:approve'')) or (v_entry.scope=''tpq'' and not public.has_permission(''tpq_finance:approve'')) then raise exception ''FINANCE_MANUAL_APPROVAL_FORBIDDEN''; end if;',
    'if (v_entry.scope=''dkm'' and not (public.has_permission(''finance:approve'') or (v_entry.created_by=auth.uid() and public.has_permission(''finance:write'')))) or (v_entry.scope=''tpq'' and not (public.has_permission(''tpq_finance:approve'') or (v_entry.created_by=auth.uid() and public.has_permission(''tpq_finance:write'')))) then raise exception ''FINANCE_MANUAL_APPROVAL_FORBIDDEN''; end if;');
  ddl:=replace(ddl,
    'if (v_entry.scope=''dkm'' and not public.has_permission(''finance:publish'')) or (v_entry.scope=''tpq'' and not public.has_permission(''tpq_finance:publish'')) then raise exception ''FINANCE_MANUAL_PUBLISH_FORBIDDEN''; end if;',
    'if (v_entry.scope=''dkm'' and not (public.has_permission(''finance:publish'') or (v_entry.created_by=auth.uid() and public.has_permission(''finance:write'')))) or (v_entry.scope=''tpq'' and not (public.has_permission(''tpq_finance:publish'') or (v_entry.created_by=auth.uid() and public.has_permission(''tpq_finance:write'')))) then raise exception ''FINANCE_MANUAL_PUBLISH_FORBIDDEN''; end if;');

  if position('SELF_APPROVAL_OR_INVALID_TRANSITION' in ddl)>0 then
    raise exception 'FINANCE_MANUAL_SELF_APPROVAL_PATCH_FAILED';
  end if;
  execute ddl;
end$$;

revoke all on function public.command_finance_manual_entry(text,uuid,uuid,integer,jsonb,text) from public,anon;
grant execute on function public.command_finance_manual_entry(text,uuid,uuid,integer,jsonb,text) to authenticated;
commit;
