import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

import sheetsProxy from '../netlify/functions/sheets-proxy.mjs';
import integrationHealth from '../netlify/functions/integration-health.mjs';
import adminSession from '../netlify/functions/admin-session.mjs';
import {
  SESSION_COOKIE_NAME,
  createSessionToken,
} from '../netlify/functions/_lib/admin-auth.mjs';
import { readByDataSource, requestProxyJson } from '../src/services/dataSource.js';

const ORIGINAL_ENV = { ...process.env };

function restoreEnvironment() {
  for (const key of Object.keys(process.env)) {
    if (!(key in ORIGINAL_ENV)) delete process.env[key];
  }
  Object.assign(process.env, ORIGINAL_ENV);
}

test.afterEach(restoreEnvironment);

test('invalid and unapproved sheets are rejected', async () => {
  for (const sheet of ['INVALID', 'TEST_01_Program_Kajian', '02_Keuangan']) {
    const response = await sheetsProxy(new Request(`http://localhost/api/sheets?sheet=${sheet}`));
    assert.equal(response.status, 400);
    assert.deepEqual(Object.keys(await response.json()).sort(), ['error', 'ok']);
  }
});

test('health response is privacy-safe and contains no secrets', async () => {
  process.env.GAS_URL = '';
  process.env.ADMIN_PASSWORD_HASH = 'secret-marker-password-hash';
  process.env.ADMIN_SESSION_SECRET = 'secret-marker-session-secret-000000000000';
  const response = await integrationHealth(new Request('http://localhost/api/integration/health'));
  assert.equal(response.status, 200);
  const text = await response.text();
  const payload = JSON.parse(text);
  assert.deepEqual(Object.keys(payload).sort(), [
    'agendaReadAvailable',
    'configured',
    'environment',
    'ok',
    'programReadAvailable',
    'timestamp',
  ]);
  assert.equal(payload.configured, false);
  assert.equal(text.includes('secret-marker'), false);
});

test('local data mode returns fallback without a network fetch', async () => {
  let calls = 0;
  const result = await readByDataSource({
    mode: 'local',
    local: () => ({ source: 'fallback', data: ['approved local data'] }),
    proxy: async () => {
      calls += 1;
      throw new Error('network must not be called');
    },
  });
  assert.equal(result.source, 'fallback');
  assert.deepEqual(result.data, ['approved local data']);
  assert.equal(calls, 0);
});

test('proxy mode rejects an HTML response before JSON parsing', async () => {
  let jsonCalled = false;
  const fetchImpl = async () => new Response('<!doctype html>', {
    status: 200,
    headers: { 'Content-Type': 'text/html' },
  });
  const response = await fetchImpl();
  response.json = async () => {
    jsonCalled = true;
    throw new Error('must not parse');
  };

  await assert.rejects(
    requestProxyJson({
      path: '/api/sheets?sheet=01_Program_Kajian',
      origin: 'http://localhost',
      fetchImpl: async () => response,
    }),
    /expected JSON/i,
  );
  assert.equal(jsonCalled, false);
});

test('unauthenticated and invalid admin sessions return 401', async () => {
  process.env.ADMIN_SESSION_SECRET = 'test-session-secret-that-is-at-least-32-bytes';
  const unauthenticated = await adminSession(new Request('http://localhost/api/admin/session'));
  assert.equal(unauthenticated.status, 401);

  const invalid = await adminSession(new Request('http://localhost/api/admin/session', {
    headers: { Cookie: `${SESSION_COOKIE_NAME}=invalid.token` },
  }));
  assert.equal(invalid.status, 401);
});

test('a valid signed test session can access the protected endpoint', async () => {
  process.env.ADMIN_SESSION_SECRET = 'test-session-secret-that-is-at-least-32-bytes';
  process.env.INTEGRATION_ENV = 'test';
  const token = createSessionToken();
  const response = await adminSession(new Request('http://localhost/api/admin/session', {
    headers: { Cookie: `${SESSION_COOKIE_NAME}=${encodeURIComponent(token)}` },
  }));
  assert.equal(response.status, 200);
  const payload = await response.json();
  assert.equal(payload.authenticated, true);
  assert.equal(payload.environment, 'test');
});

test('no Sheet mutation endpoint is registered', async () => {
  const config = await readFile('netlify.toml', 'utf8');
  assert.equal(/\/api\/(?:program|agenda|kabar).*command/i.test(config), false);
  const files = await readdir('netlify/functions');
  assert.equal(files.some((name) => /program|agenda|mutation|command/i.test(name)), false);
});

async function listFiles(root) {
  const entries = await readdir(root, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async (entry) => {
    const fullPath = path.join(root, entry.name);
    return entry.isDirectory() ? listFiles(fullPath) : [fullPath];
  }));
  return nested.flat();
}

test('frontend bundle contains no backend URL or admin secret identifiers', async () => {
  const files = await listFiles('dist');
  const textFiles = files.filter((file) => /\.(?:js|css|html)$/.test(file));
  const bundle = (await Promise.all(textFiles.map((file) => readFile(file, 'utf8')))).join('\n');
  for (const forbidden of [
    'GAS_URL', 'ADMIN_PASSWORD_HASH', 'ADMIN_SESSION_SECRET', 'ADMIN_SESSION_VERSION',
    'ADMIN_USER_ID', 'PROGRAM_TRIAL_WRITES_ENABLED', 'script.google.com',
  ]) {
    assert.equal(bundle.includes(forbidden), false, `frontend bundle contains ${forbidden}`);
  }
});
