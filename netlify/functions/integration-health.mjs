import { getRuntimeEnvironment, jsonResponse } from './_lib/http.mjs';
import { isReadProxyConfigured, readApprovedSheet } from './_lib/sheets-read.mjs';

const PROGRAM_SHEET = '01_Program_Kajian';
const AGENDA_SHEET = '09_Agenda_Kalender';

async function isReadAvailable(sheet) {
  try {
    await readApprovedSheet(sheet);
    return true;
  } catch {
    return false;
  }
}

export default async function handler(req) {
  if (req.method !== 'GET') {
    return jsonResponse({ ok: false, error: 'Method not allowed' }, 405, { Allow: 'GET' });
  }

  const configured = isReadProxyConfigured();
  const [programReadAvailable, agendaReadAvailable] = configured
    ? await Promise.all([isReadAvailable(PROGRAM_SHEET), isReadAvailable(AGENDA_SHEET)])
    : [false, false];

  return jsonResponse({
    ok: true,
    configured,
    programReadAvailable,
    agendaReadAvailable,
    environment: getRuntimeEnvironment(),
    timestamp: new Date().toISOString(),
  });
}

