const DEFAULT_WINDOW_MS = 15 * 60 * 1000;
const DEFAULT_MAX_FAILURES = 5;
const MAX_TRACKED_CLIENTS = 1000;

const failures = new Map();

function positiveInteger(value, fallback) {
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function clientKey(req) {
  return req.headers.get('x-nf-client-connection-ip')
    || req.headers.get('x-forwarded-for')?.split(',', 1)[0]?.trim()
    || 'unknown';
}

function settings(env) {
  return {
    windowMs: positiveInteger(env.ADMIN_LOGIN_RATE_LIMIT_WINDOW_SECONDS, DEFAULT_WINDOW_MS / 1000) * 1000,
    maxFailures: positiveInteger(env.ADMIN_LOGIN_RATE_LIMIT_MAX_FAILURES, DEFAULT_MAX_FAILURES),
  };
}

function prune(now) {
  for (const [key, entry] of failures) {
    if (entry.resetAt <= now) failures.delete(key);
  }
  while (failures.size > MAX_TRACKED_CLIENTS) failures.delete(failures.keys().next().value);
}

export function checkLoginRateLimit(req, env = process.env, now = Date.now()) {
  prune(now);
  const key = clientKey(req);
  const entry = failures.get(key);
  if (!entry || entry.resetAt <= now || entry.count < settings(env).maxFailures) {
    return { allowed: true, key };
  }
  return {
    allowed: false,
    key,
    retryAfterSeconds: Math.max(1, Math.ceil((entry.resetAt - now) / 1000)),
  };
}

export function recordLoginFailure(key, env = process.env, now = Date.now()) {
  const { windowMs } = settings(env);
  const current = failures.get(key);
  if (!current || current.resetAt <= now) failures.set(key, { count: 1, resetAt: now + windowMs });
  else current.count += 1;
  prune(now);
}

export function clearLoginFailures(key) {
  failures.delete(key);
}

export function resetLoginRateLimitsForTests() {
  failures.clear();
}
