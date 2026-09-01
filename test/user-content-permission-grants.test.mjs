import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('only Super Admin can manage audited per-user content grants',async()=>{
  const sql=await readFile('supabase/migrations/202608030009_user_content_permission_grants.sql','utf8');
  assert.match(sql,/has_role\('super_admin'\)/);
  assert.match(sql,/users:manage/);
  assert.match(sql,/content:write/);
  assert.match(sql,/content:approve/);
  assert.match(sql,/content\.permission\.grant/);
  assert.match(sql,/revoke all on function public\.set_user_content_permission/);
});

test('content grant automatically preserves read access and has no direct browser writes',async()=>{
  const [sql,verify]=await Promise.all([readFile('supabase/migrations/202608030009_user_content_permission_grants.sql','utf8'),readFile('supabase/rehearsal/user_content_permission_verification.sql','utf8')]);
  assert.match(sql,/content:read/);
  assert.match(verify,/no browser mutation grants/);
  assert.doesNotMatch(sql,/grant (insert|update|delete).*user_permission_grants/i);
});

test('anonymous execution is explicitly revoked from the content permission RPC',async()=>{
  const sql=await readFile('supabase/migrations/202608030010_lock_content_permission_rpc.sql','utf8');
  assert.match(sql,/from anon/);
  assert.match(sql,/to authenticated/);
});

test('Super Admin settings exposes self-publish and cross-operator content permissions',async()=>{
  const [panel,page]=await Promise.all([readFile('src/components/settings/ContentPermissionAdminPanel.jsx','utf8'),readFile('src/pages/SettingsAdmin.jsx','utf8')]);
  assert.match(panel,/Kelola Konten/);
  assert.match(panel,/Kelola Konten Lain/);
  assert.match(panel,/set_user_content_permission/);
  assert.match(page,/ContentPermissionAdminPanel/);
});
