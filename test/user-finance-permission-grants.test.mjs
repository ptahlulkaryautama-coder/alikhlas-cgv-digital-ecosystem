import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const MIGRATION = 'supabase/migrations/202608020005_user_finance_approval_grants.sql';

test('only Super Admin can grant per-user finance approval permissions', async () => {
  const sql = await readFile(MIGRATION, 'utf8');
  assert.match(sql, /public\.has_role\('super_admin'\)/);
  assert.match(sql, /SUPER_ADMIN_REQUIRED/);
  assert.match(sql, /permission in \('finance:approve', 'tpq_finance:approve'\)/);
  assert.match(sql, /PERMISSION_NOT_ASSIGNABLE/);
});

test('per-user finance permissions are RPC-only and audited', async () => {
  const sql = await readFile(MIGRATION, 'utf8');
  assert.match(sql, /revoke all on table public\.user_permission_grants from anon, authenticated/i);
  assert.doesNotMatch(sql, /grant (?:insert|update|delete)[^;]*user_permission_grants/i);
  assert.match(sql, /finance\.permission\.grant/);
  assert.match(sql, /finance\.permission\.revoke/);
  assert.match(sql, /insert into public\.audit_events/);
});

test('Super Admin UI lists users and exposes separate DKM and TPQ approval toggles', async () => {
  const [ui, auth] = await Promise.all([
    readFile('src/components/settings/FinancePermissionAdminPanel.jsx', 'utf8'),
    readFile('src/context/AuthContext.jsx', 'utf8'),
  ]);
  assert.match(ui, /users:manage/);
  assert.match(ui, /finance:approve/);
  assert.match(ui, /tpq_finance:approve/);
  assert.match(ui, /set_user_finance_approval_permission/);
  assert.match(auth, /user_permission_grants/);
  assert.match(auth, /grantsResult\.data/);
});
