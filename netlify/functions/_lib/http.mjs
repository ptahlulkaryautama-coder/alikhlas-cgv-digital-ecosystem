export function jsonResponse(body, status = 200, headers = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'Referrer-Policy': 'no-referrer',
      ...headers,
    },
  });
}

export function getRuntimeEnvironment(env = process.env) {
  const explicit = String(env.INTEGRATION_ENV ?? '').toLowerCase();
  if (['local', 'test', 'production'].includes(explicit)) return explicit;
  if (env.CONTEXT === 'production') return 'production';
  if (env.CONTEXT === 'deploy-preview' || env.CONTEXT === 'branch-deploy') return 'test';
  return 'local';
}
