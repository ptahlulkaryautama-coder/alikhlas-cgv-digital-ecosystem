import { clearSessionCookie, requireAdminSession, validateMutationOrigin } from './_lib/admin-auth.mjs';
import { jsonResponse } from './_lib/http.mjs';

export default async function handler(req) {
  if (req.method !== 'POST') {
    return jsonResponse({ ok: false, error: 'Method not allowed' }, 405, { Allow: 'POST' });
  }
  if (!validateMutationOrigin(req)) {
    return jsonResponse({ ok: false, error: 'Origin rejected' }, 403);
  }
  const auth = requireAdminSession(req);
  if (!auth.ok) return jsonResponse({ ok: false, error: auth.error }, auth.status, {
    'Set-Cookie': clearSessionCookie(),
  });
  return jsonResponse({ ok: true, authenticated: false }, 200, {
    'Set-Cookie': clearSessionCookie(),
  });
}
