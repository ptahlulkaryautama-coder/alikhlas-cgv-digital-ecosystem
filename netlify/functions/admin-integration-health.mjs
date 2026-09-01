import {
  requireAdminSession,
  validateAdminRequestContext,
} from './_lib/admin-auth.mjs';
import { getRuntimeEnvironment, jsonResponse } from './_lib/http.mjs';
import { isReadProxyConfigured, readApprovedSheet } from './_lib/sheets-read.mjs';

const PROGRAM_SHEET = '01_Program_Kajian';
const AGENDA_SHEET = '09_Agenda_Kalender';

async function getReadStatus(sheet, configured) {
  if (!configured) return 'not_configured';
  try {
    await readApprovedSheet(sheet);
    return 'available';
  } catch {
    return 'unavailable';
  }
}

export function areProgramTrialWritesEnabled(env = process.env) {
  return String(env.PROGRAM_TRIAL_WRITES_ENABLED ?? '').toLowerCase() === 'true';
}

export default async function handler(req) {
  if (req.method !== 'GET') {
    return jsonResponse({ ok: false, error: 'Method not allowed' }, 405, { Allow: 'GET' });
  }
  if (!validateAdminRequestContext(req)) {
    return jsonResponse({ ok: false, error: 'Origin rejected' }, 403);
  }
  const auth = requireAdminSession(req);
  if (!auth.ok) return jsonResponse({ ok: false, error: auth.error }, auth.status);

  const configured = isReadProxyConfigured();
  const [programReadStatus, agendaReadStatus] = await Promise.all([
    getReadStatus(PROGRAM_SHEET, configured),
    getReadStatus(AGENDA_SHEET, configured),
  ]);

  return jsonResponse({
    authenticated: true,
    role: auth.session.role,
    environment: getRuntimeEnvironment(),
    readProxyConfigured: configured,
    programReadStatus,
    agendaReadStatus,
    mutationEnabled: areProgramTrialWritesEnabled(),
    testSheetProvisioned: false,
    timestamp: new Date().toISOString(),
  });
}
