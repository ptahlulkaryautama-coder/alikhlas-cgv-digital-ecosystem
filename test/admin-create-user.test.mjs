import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const read = (p) => readFile(new URL(`../${p}`, import.meta.url), 'utf8');

test('admin_create_user_account migration is RPC-only, audited, and strictly enforces super admin', async () => {
  const sql = await read('supabase/migrations/202609020029_admin_create_user_account.sql');
  assert.match(sql, /create or replace function public\.admin_create_user_account/i);
  assert.match(sql, /SUPER_ADMIN_REQUIRED/);
  assert.match(sql, /AUTHENTICATION_REQUIRED/);
  assert.match(sql, /INVALID_EMAIL_FORMAT/);
  assert.match(sql, /PASSWORD_TOO_SHORT/);
  assert.match(sql, /EMAIL_ALREADY_EXISTS/);
  assert.match(sql, /crypt\(p_password,\s*gen_salt\('bf'\)\)/i);
  assert.match(sql, /access\.user\.create/);
  assert.match(sql, /revoke all on function public\.admin_create_user_account.*from public,\s*anon/i);
  assert.match(sql, /grant execute on function public\.admin_create_user_account.*to authenticated/i);
});

test('operational role admin UI exposes user creation form, random password, and initial roles', async () => {
  const ui = await read('src/components/settings/OperationalRoleAdminPanel.jsx');
  assert.match(ui, /Tambah Akun Pengurus/);
  assert.match(ui, /admin_create_user_account/);
  assert.match(ui, /generateRandomPassword/);
  assert.match(ui, /Pendaftaran Akun Pengurus Baru/);
  assert.match(ui, /type="email"/);
  assert.match(ui, /handleCreateUser/);
  assert.match(ui, /formatSupabaseError/);
});
