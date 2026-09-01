async function requestAdminJson(path, { signal } = {}) {
  const response = await fetch(path, {
    method: 'GET',
    credentials: 'same-origin',
    headers: { Accept: 'application/json' },
    signal,
  });
  const contentType = response.headers.get('content-type') ?? '';
  if (!contentType.toLowerCase().includes('application/json')) {
    throw new Error('Admin session endpoint is unavailable');
  }
  const payload = await response.json();
  if (!response.ok) {
    const error = new Error(payload?.error ?? 'Admin request failed');
    error.status = response.status;
    throw error;
  }
  return payload;
}

export function getServerAdminSession(options) {
  return requestAdminJson('/api/admin/session', options);
}

export function getAdminIntegrationHealth(options) {
  return requestAdminJson('/api/admin/integration-health', options);
}
