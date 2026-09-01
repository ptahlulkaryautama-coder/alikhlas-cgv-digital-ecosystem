export const DATA_SOURCE_LOCAL = 'local';
export const DATA_SOURCE_PROXY = 'proxy';
export const DATA_SOURCE_SUPABASE = 'supabase';

export function resolveDataSourceMode({ configuredMode, isDevelopment = false } = {}) {
  if ([DATA_SOURCE_LOCAL, DATA_SOURCE_PROXY, DATA_SOURCE_SUPABASE].includes(configuredMode)) {
    return configuredMode;
  }
  return isDevelopment ? DATA_SOURCE_LOCAL : DATA_SOURCE_PROXY;
}

export function isJsonContentType(contentType = '') {
  return String(contentType).toLowerCase().includes('application/json');
}

export async function readByDataSource({ mode, local, proxy }) {
  if (mode === DATA_SOURCE_LOCAL) return local();
  if (mode === DATA_SOURCE_PROXY) return proxy();
  throw new Error(`Unsupported data source mode: ${mode}`);
}

export async function requestProxyJson({
  path,
  fetchImpl = globalThis.fetch,
  origin = globalThis.location?.origin,
  signal,
}) {
  if (typeof fetchImpl !== 'function') throw new Error('Fetch is unavailable');
  if (!origin) throw new Error('A same-origin base URL is required');

  const url = new URL(path, origin);
  if (url.origin !== new URL(origin).origin) {
    throw new Error('Only same-origin proxy requests are allowed');
  }

  const response = await fetchImpl(url.toString(), {
    method: 'GET',
    credentials: 'same-origin',
    headers: { Accept: 'application/json' },
    signal,
  });
  const contentType = response.headers.get('content-type') ?? '';
  if (!isJsonContentType(contentType)) {
    throw new Error(`Proxy configuration error: expected JSON but received ${contentType || 'an unknown content type'}`);
  }

  const payload = await response.json();
  if (!response.ok) throw new Error(payload?.error ?? `Proxy responded with HTTP ${response.status}`);
  if (payload?.ok === false) throw new Error(payload?.error ?? 'Proxy returned ok:false');
  return payload;
}
