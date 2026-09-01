import { requireAdminSession, validateAdminRequestContext } from './_lib/admin-auth.mjs';
import { getRuntimeEnvironment, jsonResponse } from './_lib/http.mjs';

export default async function handler(req) {
  if (req.method !== 'GET') {
    return jsonResponse({ ok: false, error: 'Method not allowed' }, 405, { Allow: 'GET' });
  }
  if (!validateAdminRequestContext(req)) {
    return jsonResponse({ ok: false, error: 'Origin rejected' }, 403);
  }

  const auth = requireAdminSession(req);
  if (!auth.ok) return jsonResponse({ ok: false, error: auth.error }, auth.status);
  const { session } = auth;

  return jsonResponse({
    ok: true,
    authenticated: true,
    userId: session.uid,
    role: session.role,
    environment: getRuntimeEnvironment(),
    expiresAt: new Date(session.exp * 1000).toISOString(),
  });
}
