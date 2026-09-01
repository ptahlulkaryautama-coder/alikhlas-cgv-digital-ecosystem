export const SOURCE_TYPES = Object.freeze({
  REMOTE_PROXY: 'remote-proxy',
  LOCAL_FALLBACK: 'local-fallback',
  STATIC_REPOSITORY: 'static-repository',
  PROTECTED_PROTOTYPE: 'protected-prototype',
  SUPABASE: 'supabase',
});

const SOURCE_LABELS = Object.freeze({
  [SOURCE_TYPES.REMOTE_PROXY]: 'Google Sheets via proxy',
  [SOURCE_TYPES.LOCAL_FALLBACK]: 'Local fallback',
  [SOURCE_TYPES.STATIC_REPOSITORY]: 'Static repository data',
  [SOURCE_TYPES.PROTECTED_PROTOTYPE]: 'Protected prototype data',
  [SOURCE_TYPES.SUPABASE]: 'Supabase PostgreSQL',
});

export function createSourceStatus(type, overrides = {}) {
  return Object.freeze({
    type,
    label: SOURCE_LABELS[type] ?? 'Integrasi belum diverifikasi',
    connected: type === SOURCE_TYPES.REMOTE_PROXY,
    verified: type !== SOURCE_TYPES.PROTECTED_PROTOTYPE,
    ...overrides,
  });
}

export function sourceStatusFromApi(source) {
  return createSourceStatus(
    source === 'api' ? SOURCE_TYPES.REMOTE_PROXY : SOURCE_TYPES.LOCAL_FALLBACK,
  );
}

export function sourceStatusFromSupabase() {
  return createSourceStatus(SOURCE_TYPES.SUPABASE, { connected: true, verified: true });
}
