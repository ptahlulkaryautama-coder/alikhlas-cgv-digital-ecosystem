-- Explicitly remove anonymous execution from the editorial grant command.
begin;

revoke all on function public.set_user_content_permission(uuid,text,boolean) from public;
revoke all on function public.set_user_content_permission(uuid,text,boolean) from anon;
grant execute on function public.set_user_content_permission(uuid,text,boolean) to authenticated;

commit;
