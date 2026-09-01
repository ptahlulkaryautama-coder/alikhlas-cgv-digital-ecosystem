import assert from 'node:assert/strict';
import { createHmac, scryptSync } from 'node:crypto';
import test from 'node:test';

import adminHealth, { areProgramTrialWritesEnabled } from '../netlify/functions/admin-integration-health.mjs';
import adminLogin from '../netlify/functions/admin-login.mjs';
import adminLogout from '../netlify/functions/admin-logout.mjs';
import adminSession from '../netlify/functions/admin-session.mjs';
import {
  SESSION_COOKIE_NAME,
  createSessionToken,
} from '../netlify/functions/_lib/admin-auth.mjs';
import { resetLoginRateLimitsForTests } from '../netlify/functions/_lib/login-rate-limit.mjs';

const ORIGINAL_ENV = { ...process.env };
const ORIGIN = 'http://localhost';
const TEST_SECRET = 'isolated-test-session-secret-at-least-32-bytes';
const TEST_PASSWORD = 'correct horse battery staple';

function passwordHash(password = TEST_PASSWORD) {
  const N = 1024;
  const r = 8;
  const p = 1;
  const salt = Buffer.from('isolated-test-salt');
  const digest = scryptSync(password, salt, 32, { N, r, p });
  return `scrypt$${N}$${r}$${p}$${salt.toString('base64url')}$${digest.toString('base64url')}`;
}

function configureAuth() {
  resetLoginRateLimitsForTests();
  process.env.ADMIN_PASSWORD_HASH = passwordHash();
  process.env.ADMIN_SESSION_SECRET = TEST_SECRET;
  process.env.ADMIN_SESSION_VERSION = 'test-v1';
  process.env.ADMIN_USER_ID = 'usr_trial_test';
  process.env.INTEGRATION_ENV = 'test';
  delete process.env.PROGRAM_TRIAL_WRITES_ENABLED;
  delete process.env.GAS_URL;
}

test('login rate limit blocks repeated failures and returns retry guidance', async () => {
  process.env.ADMIN_LOGIN_RATE_LIMIT_MAX_FAILURES = '2';
  process.env.ADMIN_LOGIN_RATE_LIMIT_WINDOW_SECONDS = '60';
  const options = {
    method: 'POST',
    headers: { Origin: ORIGIN, 'Content-Type': 'application/json', 'x-nf-client-connection-ip': '192.0.2.10' },
    body: JSON.stringify({ password: 'wrong' }),
  };

  assert.equal((await adminLogin(request('/api/admin/login', options))).status, 401);
  assert.equal((await adminLogin(request('/api/admin/login', options))).status, 401);
  const blocked = await adminLogin(request('/api/admin/login', options));
  assert.equal(blocked.status, 429);
  assert.equal(blocked.headers.get('retry-after'), '60');
  assert.deepEqual(await blocked.json(), { ok: false, error: 'Too many login attempts' });
});

test('successful login clears failures for the client', async () => {
  process.env.ADMIN_LOGIN_RATE_LIMIT_MAX_FAILURES = '2';
  const headers = { Origin: ORIGIN, 'Content-Type': 'application/json', 'x-nf-client-connection-ip': '192.0.2.11' };
  const login = (password) => adminLogin(request('/api/admin/login', {
    method: 'POST', headers, body: JSON.stringify({ password }),
  }));

  assert.equal((await login('wrong')).status, 401);
  assert.equal((await login(TEST_PASSWORD)).status, 200);
  assert.equal((await login('wrong')).status, 401);
  assert.equal((await login('wrong')).status, 401);
  assert.equal((await login(TEST_PASSWORD)).status, 429);
});

function request(path, options = {}) {
  return new Request(`${ORIGIN}${path}`, options);
}

function cookiePair(setCookie) {
  return setCookie.split(';', 1)[0];
}

function signedUnsupportedRoleToken() {
  const now = Math.floor(Date.now() / 1000);
  const payload = Buffer.from(JSON.stringify({
    uid: 'usr_read_only', role: 'read_only', iat: now, exp: now + 900, ver: 'test-v1',
  })).toString('base64url');
  const signature = createHmac('sha256', TEST_SECRET).update(payload).digest('base64url');
  return `${payload}.${signature}`;
}

test.beforeEach(configureAuth);
test.afterEach(() => {
  for (const key of Object.keys(process.env)) if (!(key in ORIGINAL_ENV)) delete process.env[key];
  Object.assign(process.env, ORIGINAL_ENV);
});

test('login rejects missing and invalid credentials', async () => {
  for (const body of [{}, { password: 'wrong' }]) {
    const response = await adminLogin(request('/api/admin/login', {
      method: 'POST', headers: { Origin: ORIGIN, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }));
    assert.equal(response.status, 401);
  }
});

test('valid credentials issue a signed short-lived HttpOnly cookie', async () => {
  const response = await adminLogin(request('/api/admin/login', {
    method: 'POST', headers: { Origin: ORIGIN, 'Content-Type': 'application/json' },
    body: JSON.stringify({ password: TEST_PASSWORD }),
  }));
  assert.equal(response.status, 200);
  const cookie = response.headers.get('set-cookie');
  assert.match(cookie, new RegExp(`^${SESSION_COOKIE_NAME}=`));
  for (const directive of ['HttpOnly', 'SameSite=Strict', 'Path=/', 'Max-Age=900', 'Expires=']) {
    assert.ok(cookie.includes(directive), `cookie missing ${directive}`);
  }
  const payload = await response.json();
  assert.equal(payload.role, 'super_admin_trial');
});

test('session rejects missing, altered, expired, and wrong-version cookies', async () => {
  const missing = await adminSession(request('/api/admin/session'));
  assert.equal(missing.status, 401);

  const token = createSessionToken({ userId: 'usr_trial_test' });
  const altered = await adminSession(request('/api/admin/session', {
    headers: { Cookie: `${SESSION_COOKIE_NAME}=${encodeURIComponent(`${token}x`)}` },
  }));
  assert.equal(altered.status, 401);

  const expiredToken = createSessionToken({ userId: 'usr_trial_test', now: Date.now() - 20 * 60 * 1000 });
  const expired = await adminSession(request('/api/admin/session', {
    headers: { Cookie: `${SESSION_COOKIE_NAME}=${encodeURIComponent(expiredToken)}` },
  }));
  assert.equal(expired.status, 401);

  const oldVersionToken = createSessionToken({ userId: 'usr_trial_test' });
  process.env.ADMIN_SESSION_VERSION = 'test-v2';
  const revoked = await adminSession(request('/api/admin/session', {
    headers: { Cookie: `${SESSION_COOKIE_NAME}=${encodeURIComponent(oldVersionToken)}` },
  }));
  assert.equal(revoked.status, 401);
});

test('session accepts a valid versioned role session', async () => {
  const token = createSessionToken({ userId: 'usr_trial_test', role: 'super_admin_trial' });
  const response = await adminSession(request('/api/admin/session', {
    headers: { Cookie: `${SESSION_COOKIE_NAME}=${encodeURIComponent(token)}` },
  }));
  assert.equal(response.status, 200);
  const payload = await response.json();
  assert.equal(payload.authenticated, true);
  assert.equal(payload.userId, 'usr_trial_test');
  assert.equal(payload.role, 'super_admin_trial');
});

test('a valid signature with an insufficient role receives 403', async () => {
  const token = signedUnsupportedRoleToken();
  const response = await adminSession(request('/api/admin/session', {
    headers: { Cookie: `${SESSION_COOKIE_NAME}=${encodeURIComponent(token)}` },
  }));
  assert.equal(response.status, 403);
});

test('logout clears the current browser cookie', async () => {
  const token = createSessionToken({ userId: 'usr_trial_test' });
  const response = await adminLogout(request('/api/admin/logout', {
    method: 'POST',
    headers: { Origin: ORIGIN, Cookie: `${SESSION_COOKIE_NAME}=${encodeURIComponent(token)}` },
  }));
  assert.equal(response.status, 200);
  const cookie = response.headers.get('set-cookie');
  assert.ok(cookie.includes('Max-Age=0'));
  assert.ok(cookie.includes('Expires=Thu, 01 Jan 1970 00:00:00 GMT'));
  assert.equal(cookiePair(cookie), `${SESSION_COOKIE_NAME}=`);
});

test('protected integration health requires auth and exposes only safe state', async () => {
  assert.equal((await adminHealth(request('/api/admin/integration-health'))).status, 401);
  process.env.ADMIN_PASSWORD_HASH = 'secret-marker-hash';
  process.env.GAS_URL = '';
  const token = createSessionToken({ userId: 'usr_trial_test' });
  const response = await adminHealth(request('/api/admin/integration-health', {
    headers: { Cookie: `${SESSION_COOKIE_NAME}=${encodeURIComponent(token)}` },
  }));
  assert.equal(response.status, 200);
  const text = await response.text();
  assert.equal(text.includes('secret-marker'), false);
  const payload = JSON.parse(text);
  assert.deepEqual(Object.keys(payload).sort(), [
    'agendaReadStatus', 'authenticated', 'environment', 'mutationEnabled',
    'programReadStatus', 'readProxyConfigured', 'role', 'testSheetProvisioned', 'timestamp',
  ]);
  assert.equal(payload.mutationEnabled, false);
  assert.equal(payload.testSheetProvisioned, false);
});

test('cross-origin admin requests are rejected', async () => {
  const response = await adminLogin(request('/api/admin/login', {
    method: 'POST', headers: { Origin: 'https://attacker.invalid' }, body: '{}',
  }));
  assert.equal(response.status, 403);
});

test('unsupported methods return 405 JSON', async () => {
  for (const [handler, path, method] of [
    [adminLogin, '/api/admin/login', 'GET'],
    [adminLogout, '/api/admin/logout', 'GET'],
    [adminSession, '/api/admin/session', 'POST'],
    [adminHealth, '/api/admin/integration-health', 'POST'],
  ]) {
    const response = await handler(request(path, { method }));
    assert.equal(response.status, 405);
    assert.match(response.headers.get('content-type'), /application\/json/);
  }
});

test('Program trial write kill switch defaults off and requires explicit true', () => {
  delete process.env.PROGRAM_TRIAL_WRITES_ENABLED;
  assert.equal(areProgramTrialWritesEnabled(), false);
  process.env.PROGRAM_TRIAL_WRITES_ENABLED = 'false';
  assert.equal(areProgramTrialWritesEnabled(), false);
  process.env.PROGRAM_TRIAL_WRITES_ENABLED = 'true';
  assert.equal(areProgramTrialWritesEnabled(), true);
});
