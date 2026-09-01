import { createSessionToken, makeSessionCookie, validateMutationOrigin, verifyPassword } from './_lib/admin-auth.mjs';
import { jsonResponse } from './_lib/http.mjs';
import { checkLoginRateLimit, clearLoginFailures, recordLoginFailure } from './_lib/login-rate-limit.mjs';

const MAX_BODY_BYTES = 4096;

export default async function handler(req) {
  if (req.method !== 'POST') {
    return jsonResponse({ ok: false, error: 'Method not allowed' }, 405, { Allow: 'POST' });
  }
  if (!validateMutationOrigin(req)) {
    return jsonResponse({ ok: false, error: 'Origin rejected' }, 403);
  }

  const length = Number(req.headers.get('content-length') ?? 0);
  if (length > MAX_BODY_BYTES) return jsonResponse({ ok: false, error: 'Request body too large' }, 413);
  if (!process.env.ADMIN_PASSWORD_HASH || !process.env.ADMIN_SESSION_SECRET) {
    return jsonResponse({ ok: false, error: 'Admin authentication is not configured' }, 503);
  }

  const rateLimit = checkLoginRateLimit(req);
  if (!rateLimit.allowed) {
    return jsonResponse({ ok: false, error: 'Too many login attempts' }, 429, {
      'Retry-After': String(rateLimit.retryAfterSeconds),
    });
  }

  try {
    const bodyText = await req.text();
    if (Buffer.byteLength(bodyText) > MAX_BODY_BYTES) {
      return jsonResponse({ ok: false, error: 'Request body too large' }, 413);
    }
    const body = JSON.parse(bodyText);
    const valid = await verifyPassword(body?.password, process.env.ADMIN_PASSWORD_HASH);
    if (!valid) {
      recordLoginFailure(rateLimit.key);
      return jsonResponse({ ok: false, error: 'Invalid credentials' }, 401);
    }

    clearLoginFailures(rateLimit.key);

    const token = createSessionToken({
      userId: String(process.env.ADMIN_USER_ID ?? 'trial_admin'),
      role: 'super_admin_trial',
    });
    return jsonResponse(
      { ok: true, authenticated: true, role: 'super_admin_trial', expiresInSeconds: 900 },
      200,
      { 'Set-Cookie': makeSessionCookie(token) },
    );
  } catch {
    return jsonResponse({ ok: false, error: 'Invalid JSON request' }, 400);
  }
}
