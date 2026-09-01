import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import test from 'node:test';
import { hasPermission, ROUTE_PERMISSIONS } from '../src/services/accessPolicy.js';

const MIGRATION = 'supabase/migrations/202608010001_auth_permissions_audit_foundation.sql';

test('Supabase scaffold contains config and an ordered SQL migration', async () => {
  assert.equal((await stat('supabase')).isDirectory(), true);
  assert.equal((await stat('supabase/config.toml')).isFile(), true);
  assert.equal((await stat(MIGRATION)).isFile(), true);
});

test('foundation migration enables RLS and defines no finance or TPQ personal tables', async () => {
  const sql = await readFile(MIGRATION, 'utf8');
  for (const table of ['profiles', 'role_permissions', 'user_roles', 'audit_events']) {
    assert.match(sql, new RegExp(`alter table public\\.${table} enable row level security`, 'i'));
  }
  for (const prohibitedTable of [
    'finance_transactions', 'tpq_students', 'tpq_guardians', 'tpq_attendance', 'tpq_grades', 'tpq_payments',
  ]) {
    assert.doesNotMatch(sql, new RegExp(`create table public\\.${prohibitedTable}`, 'i'));
  }
});

test('audit events cannot be mutated directly by browser roles', async () => {
  const sql = await readFile(MIGRATION, 'utf8');
  assert.match(sql, /revoke all on table public\.audit_events from anon, authenticated/i);
  assert.match(sql, /grant select on table public\.audit_events to authenticated/i);
  assert.doesNotMatch(sql, /grant\s+(?:insert|update|delete)[^;]*audit_events/i);
  assert.doesNotMatch(sql, /on public\.audit_events for (?:insert|update|delete|all)/i);
});

test('frontend Supabase config exposes no service-role credential name', async () => {
  const files = ['.env.example', 'vite.config.js', 'src/services/supabaseClient.js'];
  const content = (await Promise.all(files.map((file) => readFile(file, 'utf8')))).join('\n');
  assert.match(content, /VITE_SUPABASE_PUBLISHABLE_KEY/);
  assert.doesNotMatch(content, /SERVICE_ROLE/i);
});

test('dashboard login uses Supabase password auth and contains no prototype PIN gate', async () => {
  const files = [
    '.env.example',
    'vite.config.js',
    'src/pages/Login.jsx',
    'src/components/common/ProtectedRoute.jsx',
    'src/context/AuthContext.jsx',
  ];
  const content = (await Promise.all(files.map((file) => readFile(file, 'utf8')))).join('\n');
  assert.match(content, /signInWithPassword/);
  assert.match(content, /profiles/);
  assert.match(content, /user_roles/);
  assert.doesNotMatch(content, /VITE_ADMIN_PIN|sessionStorage|attemptLogin|PIN Admin/);
});

test('dashboard route policy separates content, finance, TPQ, and user administration', () => {
  assert.equal(ROUTE_PERMISSIONS['/app/keuangan'], 'finance:read');
  assert.equal(ROUTE_PERMISSIONS['/app/program'], 'content:read');
  assert.equal(ROUTE_PERMISSIONS['/app/tpq'], 'tpq:read');
  assert.equal(ROUTE_PERMISSIONS['/app/pengaturan'], 'users:read');
  assert.equal(hasPermission(['content:read'], 'content:read'), true);
  assert.equal(hasPermission(['content:read'], 'finance:read'), false);
  assert.equal(hasPermission([], undefined), true);
});

test('protected routes and sidebar consume the same permission policy', async () => {
  const app = await readFile('src/App.jsx', 'utf8');
  const sidebar = await readFile('src/components/dashboard/Sidebar.jsx', 'utf8');
  const guard = await readFile('src/components/common/ProtectedRoute.jsx', 'utf8');
  assert.match(app, /requiredPermission=\{ROUTE_PERMISSIONS\['\/app\/tpq'\]\}/);
  assert.match(sidebar, /ROUTE_PERMISSIONS\[item\.route\]/);
  assert.match(guard, /hasPermission\(permissions, requiredPermission\)/);
});
