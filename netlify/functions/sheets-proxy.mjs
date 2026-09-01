import { jsonResponse } from './_lib/http.mjs';
import { ALLOWED_READ_SHEETS, readApprovedSheet } from './_lib/sheets-read.mjs';

export default async function handler(req) {
  if (req.method !== 'GET') {
    return jsonResponse({ ok: false, error: 'Method not allowed' }, 405, { Allow: 'GET' });
  }

  const sheet = new URL(req.url).searchParams.get('sheet');
  if (!sheet || !ALLOWED_READ_SHEETS.has(sheet)) {
    return jsonResponse({ ok: false, error: 'Invalid or unapproved sheet parameter' }, 400);
  }

  try {
    const data = await readApprovedSheet(sheet);
    return jsonResponse(data, 200, { 'Cache-Control': 'public, max-age=300, s-maxage=600' });
  } catch (error) {
    if (error.code === 'NOT_CONFIGURED') {
      return jsonResponse({ ok: false, error: 'Read proxy is not configured' }, 503);
    }
    if (error.name === 'AbortError') {
      return jsonResponse({ ok: false, error: 'Upstream request timeout' }, 504);
    }
    return jsonResponse({ ok: false, error: 'Upstream sheet read failed' }, 502);
  }
}

