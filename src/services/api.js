/**
 * api.js — Public Google Apps Script connector (read-only)
 *
 * Connects to the Al Ikhlas GAS Konektor v1.7 deployment.
 * All communication is GET-only. POST / write actions are intentionally
 * not implemented here — admin writes go through the protected dashboard.
 *
 * GAS endpoint contract (v1.7):
 *   GET ?sheet=SHEET_NAME  →  { ok, sheet, count, data: [...] }
 *   GET ?sheet=02_Keuangan →  { ok, sheet, count, ringkasan: {...}, data: [...] }
 *
 * Data source mode:
 *   local — return approved repository fallback without a network request.
 *   proxy — GET the same-origin Netlify read proxy only.
 *
 * Sheet names (as defined in Code_v1_7.gs SHEET_CONFIG):
 *   01_Program_Kajian   — public kajian / program listings
 *   02_Keuangan         — cash-book transactions + ringkasan summary
 *   09_Agenda_Kalender  — upcoming public events / agenda
 *
 * Data exposure rules enforced here:
 *   - Donor names, personal notes, and jemaah fields are NEVER returned.
 *   - Internal-only fields (jemaah, kitab, muqaddimah, audio on programs)
 *     are stripped before the normalized objects leave this module.
 *   - Finance data: individual transaction rows are not exported from this
 *     module; only the ringkasan (summary) aggregate is surfaced publicly.
 */

// ─── Configuration ────────────────────────────────────────────────────────────

/**
 * Public sheet connector.
 * Backend deployment URLs and credentials are server-side only.
 */
import {
  DATA_SOURCE_LOCAL,
  DATA_SOURCE_PROXY,
  readByDataSource,
  requestProxyJson,
  resolveDataSourceMode,
} from './dataSource.js';

const runtimeEnv = import.meta.env ?? {};

export const DATA_SOURCE_MODE = resolveDataSourceMode({
  configuredMode: runtimeEnv.VITE_DATA_SOURCE,
  isDevelopment: runtimeEnv.DEV === true,
});

/** GAS sheet names as registered in SHEET_CONFIG of Code_v1_7.gs */
const SHEETS = {
  PROGRAM: '01_Program_Kajian',
  KEUANGAN: '02_Keuangan',
  AGENDA: '09_Agenda_Kalender',
};

// ─── Utility helpers ──────────────────────────────────────────────────────────

const SAFE_TEXT_FALLBACK = '-';

function logApiFallback(sheetName, error) {
  if (error?.name === 'AbortError') {
    return; // Aborted signals are neutral — do not log
  }
  if (runtimeEnv.DEV && !loggedSheets.has(sheetName)) {
    loggedSheets.add(sheetName);
    console.info(`[api] Sheet "${sheetName}" using local fallback data (run \`netlify dev\` for live remote integration).`);
  }
}

function getText(value, fallback = SAFE_TEXT_FALLBACK) {
  if (value === null || value === undefined) return fallback;
  const text = String(value).trim();
  return text || fallback;
}

function getNumber(value, fallback = 0) {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  const numeric = Number(String(value ?? '').replace(/[^\d.-]/g, ''));
  return Number.isFinite(numeric) ? numeric : fallback;
}

function formatRupiah(value) {
  return `Rp ${getNumber(value).toLocaleString('id-ID')}`;
}

/**
 * Returns a safe image URL string. Only http/https URLs are allowed;
 * anything else is returned as an empty string so it is never injected
 * into an <img src> attribute.
 */
function getSafeUrl(value) {
  const raw = getText(value, '');
  return /^https?:\/\//i.test(raw) ? raw : '';
}

function splitSchedule(schedule = '') {
  const [day, ...timeParts] = String(schedule).split(/·|\|/);
  return {
    day: getText(day, 'Jadwal menyusul'),
    time: getText(timeParts.join(' ').trim(), 'Waktu menyusul'),
  };
}

// In-flight request cache to deduplicate simultaneous requests per sheet
const pendingRequests = new Map();
const loggedSheets = new Set();

/**
 * Performs a GET request to the same-origin /api/sheets endpoint for the given sheet name.
 * Proxy responses must be JSON. HTML indicates a routing/configuration error.
 *
 * @param {string} sheetName  — one of the SHEETS constants
 * @param {{ signal?: AbortSignal }} [options]
 * @returns {Promise<object>}  — raw response payload
 */
async function fetchSheet(sheetName, { signal } = {}) {
  // If in-flight request already exists for this sheet, reuse it
  if (pendingRequests.has(sheetName)) {
    return pendingRequests.get(sheetName);
  }

  const fetchPromise = (async () => {
    try {
      const params = new URLSearchParams({ sheet: sheetName });
      return requestProxyJson({ path: `/api/sheets?${params}`, signal });
    } finally {
      // Clear in-flight cache when request finishes
      pendingRequests.delete(sheetName);
    }
  })();

  pendingRequests.set(sheetName, fetchPromise);
  return fetchPromise;
}

// ─── Program (01_Program_Kajian) ──────────────────────────────────────────────

/**
 * Normalizes a single row from 01_Program_Kajian into a clean public object.
 * Internal-only fields (jemaah, kitab, muqaddimah, audio) are excluded.
 *
 * @param {object} item  — raw row object from GAS
 * @param {number} [index]
 * @returns {object}
 */
export function normalizeProgram(item, index = 0) {
  const schedule = splitSchedule(item?.schedule ?? item?.jadwal);

  return {
    id: getText(item?.id ?? item?.ID ?? index + 1, `program-${index + 1}`),
    kategori: getText(item?.kategori ?? item?.category, 'Program Masjid'),
    pilar: getText(item?.pilar, 'Ilmu'),
    nama: getText(item?.nama ?? item?.title, 'Program Masjid'),
    deskripsi: getText(
      item?.deskripsi ?? item?.description,
      'Informasi program akan diperbarui oleh pengurus masjid.',
    ),
    hari: getText(item?.hari, schedule.day),
    waktu: getText(item?.waktu, schedule.time),
    lokasi: getText(item?.lokasi ?? item?.location, 'Masjid Al Ikhlas CGV'),
    pemateri: getText(item?.pemateri ?? item?.narasumber ?? item?.speaker, ''),
    sasaran: getText(item?.sasaran ?? item?.keterangan ?? item?.audience, ''),
    poster: getSafeUrl(item?.poster),
    status: getText(item?.status, 'Siap publik'),
    visibility: getText(item?.visibility ?? item?.website, 'Publik'),
    version: Number(item?.version ?? 1),
    createdBy: item?.createdBy ?? null,
    reviewedBy: item?.reviewedBy ?? null,
    rejectionReason: getText(item?.rejectionReason, ''),
    environment: getText(item?.environment, 'production'),
    source: item?.source ?? 'repository',
    // Internal fields intentionally excluded: jemaah, kitab, muqaddimah, audio
  };
}

/**
 * Fetches program data from 01_Program_Kajian.
 * Falls back to the provided fallback programs on any error.
 *
 * @param {object[]} fallbackPrograms
 * @param {{ signal?: AbortSignal }} [options]
 * @returns {Promise<{ data: object[], source: 'api'|'fallback' }>}
 */
export async function getPublicPrograms(fallbackPrograms, options) {
  const fallback = () => ({
    data: fallbackPrograms.map(normalizeProgram),
    source: 'fallback',
  });
  return readByDataSource({
    mode: options?.dataSourceMode ?? DATA_SOURCE_MODE,
    local: fallback,
    proxy: async () => {
      try {
        const payload = await fetchSheet(SHEETS.PROGRAM, options);
        const rows = Array.isArray(payload?.data) ? payload.data : [];
        if (!rows.length) throw new Error('01_Program_Kajian payload contained no data rows');
        return { data: rows.map(normalizeProgram), source: 'api' };
      } catch (error) {
        logApiFallback(SHEETS.PROGRAM, error);
        return fallback();
      }
    },
  });
}

// ─── Finance Summary (02_Keuangan) ────────────────────────────────────────────

/**
 * Checks whether the GAS ringkasan object contains at least one
 * meaningful finance figure.
 *
 * @param {object} ringkasan
 * @returns {boolean}
 */
function hasRingkasanFields(ringkasan) {
  return [
    ringkasan?.totalMasuk,
    ringkasan?.totalKeluar,
    ringkasan?.saldoAkhir,
  ].some((v) => v !== undefined && v !== null && v !== '');
}

/**
 * Normalizes the GAS 02_Keuangan response into a public finance summary.
 * Only the ringkasan aggregate is surfaced — individual transaction rows
 * are not exposed to avoid leaking donor amounts or notes.
 *
 * @param {object} payload       — raw GAS response
 * @param {object} fallbackSummary
 * @returns {object}
 */
export function normalizeFinanceSummaryPayload(payload, fallbackSummary) {
  // GAS v1.7 places the summary under payload.ringkasan for 02_Keuangan
  const r = payload?.ringkasan ?? {};

  const masuk = r.totalMasuk ?? r.masuk;
  const keluar = r.totalKeluar ?? r.keluar;
  const saldo = r.saldoAkhir ?? r.saldo;
  const txCount = r.jumlahTransaksi ?? r.transactionCount ?? r.transactions;

  return {
    ...fallbackSummary,
    period: getText(r.period ?? r.periode ?? r.bulan, fallbackSummary.period),
    updatedAt: getText(r.updatedAt ?? r.updated_at, fallbackSummary.updatedAt),
    totalIn: masuk === undefined ? fallbackSummary.totalIn : formatRupiah(masuk),
    totalOut: keluar === undefined ? fallbackSummary.totalOut : formatRupiah(keluar),
    endingBalance: saldo === undefined ? fallbackSummary.endingBalance : formatRupiah(saldo),
    transactionCount: getText(txCount, fallbackSummary.transactionCount),
    // donorCount is intentionally not derived from raw data — GAS does not
    // expose donor counts in its public ringkasan; use fallback value.
    note: 'Ringkasan ini ditampilkan dari data publik yang sudah dikurasi untuk jamaah.',
  };
}

/**
 * Fetches the finance summary from 02_Keuangan.
 * Falls back to the provided fallback summary on any error.
 *
 * @param {object} fallbackSummary
 * @param {{ signal?: AbortSignal }} [options]
 * @returns {Promise<{ data: object, source: 'api'|'fallback' }>}
 */
export async function getPublicFinanceSummary(fallbackSummary) {
  // Finance is in verification mode — 02_Keuangan fetches are intentionally skipped.
  return {
    data: fallbackSummary,
    source: 'fallback',
  };
}

// ─── Agenda (09_Agenda_Kalender) ──────────────────────────────────────────────

/**
 * Normalizes a single row from 09_Agenda_Kalender.
 *
 * @param {object} item
 * @param {number} [index]
 * @returns {object}
 */
export function normalizeAgenda(item, index = 0) {
  return {
    id: getText(item?.id ?? index + 1, `agenda-${index + 1}`),
    kategori: getText(item?.kategori, 'Agenda Masjid'),
    nama: getText(item?.nama ?? item?.title, 'Agenda Masjid'),
    tanggal: getText(item?.tanggal, ''),
    waktu: getText(item?.waktu, ''),
    lokasi: getText(item?.lokasi, 'Masjid Al Ikhlas'),
    deskripsi: getText(item?.deskripsi ?? item?.description, ''),
    // galeri URL sanitised — only http/https allowed
    galeri: getSafeUrl(item?.galeri),
    status: getText(item?.status, 'Siap publik'),
    visibility: getText(item?.visibility ?? item?.website, 'Publik'),
    version: Number(item?.version ?? 1),
    createdBy: getText(item?.createdBy, ''),
    reviewedBy: getText(item?.reviewedBy, ''),
    rejectionReason: getText(item?.rejectionReason, ''),
    cancellationReason: getText(item?.cancellationReason, ''),
    environment: getText(item?.environment, 'production'),
    source: getText(item?.source, ''),
  };
}

/**
 * Fetches public agenda items from 09_Agenda_Kalender.
 * Falls back to the provided fallback agenda on any error.
 *
 * @param {object[]} fallbackAgenda
 * @param {{ signal?: AbortSignal }} [options]
 * @returns {Promise<{ data: object[], source: 'api'|'fallback' }>}
 */
export async function getPublicAgenda(fallbackAgenda, options) {
  const fallback = () => ({
    data: fallbackAgenda.map(normalizeAgenda),
    source: 'fallback',
  });
  return readByDataSource({
    mode: options?.dataSourceMode ?? DATA_SOURCE_MODE,
    local: fallback,
    proxy: async () => {
      try {
        const payload = await fetchSheet(SHEETS.AGENDA, options);
        const rows = Array.isArray(payload?.data) ? payload.data : [];
        if (!rows.length) throw new Error('09_Agenda_Kalender payload contained no data rows');
        return { data: rows.map(normalizeAgenda), source: 'api' };
      } catch (error) {
        logApiFallback(SHEETS.AGENDA, error);
        return fallback();
      }
    },
  });
}

// ─── Legacy compatibility exports ─────────────────────────────────────────────
// These re-exports keep existing hooks (usePrograms.js, useFinanceSummary.js)
// working without modification.

/**
 * @deprecated Use getPublicPrograms directly with sheet-based API.
 * Kept for backwards compatibility with existing hooks.
 */
export function normalizeProgramsPayload(payload, fallbackPrograms) {
  const rows = Array.isArray(payload?.data) ? payload.data : fallbackPrograms;
  return rows.map(normalizeProgram);
}

/**
 * @deprecated Alias kept for backwards compatibility with useFinanceSummary.js
 */
export { getPublicFinanceSummary as default };

export async function getIntegrationHealth(options = {}) {
  if ((options.dataSourceMode ?? DATA_SOURCE_MODE) === DATA_SOURCE_LOCAL) {
    return {
      ok: true,
      configured: false,
      programReadAvailable: false,
      agendaReadAvailable: false,
      environment: 'local',
      timestamp: new Date().toISOString(),
      source: DATA_SOURCE_LOCAL,
    };
  }

  const payload = await requestProxyJson({
    path: '/api/integration/health',
    signal: options.signal,
  });
  return { ...payload, source: DATA_SOURCE_PROXY };
}
