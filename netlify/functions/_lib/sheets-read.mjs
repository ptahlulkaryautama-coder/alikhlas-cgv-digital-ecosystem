export const ALLOWED_READ_SHEETS = new Set(['01_Program_Kajian', '09_Agenda_Kalender']);
export const DEFAULT_TIMEOUT_MS = 6000;

export function isReadProxyConfigured(env = process.env) {
  return typeof env.GAS_URL === 'string' && env.GAS_URL.trim().length > 0;
}

export async function readApprovedSheet(sheet, {
  env = process.env,
  fetchImpl = globalThis.fetch,
  timeoutMs = DEFAULT_TIMEOUT_MS,
} = {}) {
  if (!ALLOWED_READ_SHEETS.has(sheet)) {
    const error = new Error('Invalid or unapproved sheet parameter');
    error.code = 'UNAPPROVED_SHEET';
    throw error;
  }
  if (!isReadProxyConfigured(env)) {
    const error = new Error('Read proxy is not configured');
    error.code = 'NOT_CONFIGURED';
    throw error;
  }

  const targetUrl = new URL(env.GAS_URL);
  targetUrl.searchParams.set('sheet', sheet);
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetchImpl(targetUrl.toString(), {
      method: 'GET',
      redirect: 'follow',
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });
    if (!response.ok) {
      const error = new Error(`Upstream error HTTP ${response.status}`);
      error.code = 'UPSTREAM_HTTP_ERROR';
      throw error;
    }
    const contentType = response.headers.get('content-type') ?? '';
    if (!contentType.toLowerCase().includes('application/json')) {
      const error = new Error('Upstream did not return JSON');
      error.code = 'UPSTREAM_CONTENT_TYPE';
      throw error;
    }
    const payload = await response.json();
    if (payload?.ok === false) {
      const error = new Error('Upstream rejected the read request');
      error.code = 'UPSTREAM_REJECTED';
      throw error;
    }
    return payload;
  } finally {
    clearTimeout(timeoutId);
  }
}

