import { createHmac, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import { getRuntimeEnvironment } from './http.mjs';

const scrypt = promisify(scryptCallback);
export const SESSION_COOKIE_NAME = 'alikhlas_admin_session';
export const SESSION_TTL_SECONDS = 15 * 60;
export const ALLOWED_ADMIN_ROLES = new Set(['super_admin_trial']);
const DEFAULT_SESSION_VERSION = '1';

function encode(value) {
  return Buffer.from(value).toString('base64url');
}

function decode(value) {
  return Buffer.from(value, 'base64url').toString('utf8');
}

function sign(value, secret) {
  return createHmac('sha256', secret).update(value).digest('base64url');
}

function safeEqualText(left, right) {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function validateMutationOrigin(req, env = process.env) {
  const origin = req.headers.get('origin');
  if (!origin) return false;

  const requestOrigin = new URL(req.url).origin;
  const allowed = new Set(
    String(env.ADMIN_ALLOWED_ORIGINS ?? '')
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean),
  );
  allowed.add(requestOrigin);
  return allowed.has(origin);
}

export function validateAdminRequestContext(req, env = process.env) {
  const origin = req.headers.get('origin');
  if (origin) return validateMutationOrigin(req, env);
  const fetchSite = req.headers.get('sec-fetch-site');
  if (fetchSite && fetchSite !== 'same-origin' && fetchSite !== 'none') return false;
  return true;
}

export function getActiveSessionVersion(env = process.env) {
  const version = String(env.ADMIN_SESSION_VERSION ?? DEFAULT_SESSION_VERSION).trim();
  return version || DEFAULT_SESSION_VERSION;
}

export async function verifyPassword(password, encodedHash) {
  if (typeof password !== 'string' || typeof encodedHash !== 'string') return false;
  const [algorithm, nText, rText, pText, saltText, digestText] = encodedHash.split('$');
  if (algorithm !== 'scrypt') return false;

  const N = Number(nText);
  const r = Number(rText);
  const p = Number(pText);
  const salt = Buffer.from(saltText ?? '', 'base64url');
  const expected = Buffer.from(digestText ?? '', 'base64url');
  if (!Number.isInteger(N) || !Number.isInteger(r) || !Number.isInteger(p) || !salt.length || !expected.length) {
    return false;
  }

  try {
    const actual = await scrypt(password, salt, expected.length, {
      N,
      r,
      p,
      maxmem: Math.max(32 * 1024 * 1024, 128 * N * r + 1024),
    });
    return actual.length === expected.length && timingSafeEqual(actual, expected);
  } catch {
    return false;
  }
}

export function createSessionToken({
  userId = 'trial_admin',
  role = 'super_admin_trial',
  now = Date.now(),
} = {}, env = process.env) {
  const secret = env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 32) throw new Error('Session signing is not configured');
  if (!ALLOWED_ADMIN_ROLES.has(role)) throw new Error('Role is not allowed');
  const issuedAt = Math.floor(now / 1000);
  const payload = encode(JSON.stringify({
    uid: userId,
    role,
    iat: issuedAt,
    exp: issuedAt + SESSION_TTL_SECONDS,
    ver: getActiveSessionVersion(env),
  }));
  return `${payload}.${sign(payload, secret)}`;
}

export function verifySessionToken(token, env = process.env, now = Date.now()) {
  const secret = env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 32 || typeof token !== 'string') return null;
  const [payload, signature, extra] = token.split('.');
  if (!payload || !signature || extra || !safeEqualText(signature, sign(payload, secret))) return null;

  try {
    const session = JSON.parse(decode(payload));
    const nowSeconds = Math.floor(now / 1000);
    if (typeof session.uid !== 'string' || !session.uid || typeof session.role !== 'string' || !session.role) return null;
    if (!Number.isInteger(session.iat) || !Number.isInteger(session.exp)) return null;
    if (session.ver !== getActiveSessionVersion(env)) return null;
    if (session.iat > nowSeconds + 30 || session.exp <= nowSeconds || session.exp - session.iat > SESSION_TTL_SECONDS) return null;
    return session;
  } catch {
    return null;
  }
}

export function readSessionCookie(req) {
  const cookieHeader = req.headers.get('cookie') ?? '';
  for (const pair of cookieHeader.split(';')) {
    const [name, ...valueParts] = pair.trim().split('=');
    if (name === SESSION_COOKIE_NAME) return decodeURIComponent(valueParts.join('='));
  }
  return null;
}

export function makeSessionCookie(token, env = process.env) {
  const secure = getRuntimeEnvironment(env) === 'production' ? '; Secure' : '';
  const expires = new Date(Date.now() + SESSION_TTL_SECONDS * 1000).toUTCString();
  return `${SESSION_COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${SESSION_TTL_SECONDS}; Expires=${expires}${secure}`;
}

export function clearSessionCookie(env = process.env) {
  const secure = getRuntimeEnvironment(env) === 'production' ? '; Secure' : '';
  return `${SESSION_COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT${secure}`;
}

export function requireAdminSession(req, {
  env = process.env,
  requiredRole = 'super_admin_trial',
  now = Date.now(),
} = {}) {
  const session = verifySessionToken(readSessionCookie(req), env, now);
  if (!session) return { ok: false, status: 401, error: 'Unauthorized' };
  if (session.role !== requiredRole) return { ok: false, status: 403, error: 'Forbidden' };
  return { ok: true, session };
}
