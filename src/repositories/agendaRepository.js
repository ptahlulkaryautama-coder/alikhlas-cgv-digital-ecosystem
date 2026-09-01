import { mockAgenda } from '../data/dashboardMockData.js';
import { DATA_SOURCE_MODE, getPublicAgenda, normalizeAgenda } from '../services/api.js';
import { DATA_SOURCE_SUPABASE } from '../services/dataSource.js';
import { readSupabaseAgenda } from '../services/supabaseContent.js';
import { sourceStatusFromApi, sourceStatusFromSupabase } from './sourceStatus.js';

const MONTH_ID = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
const BADGE_MAP = {
  'hari besar islam': 'ag-hbi', 'idul adha': 'ag-hbi', 'idul fitri': 'ag-hbi',
  'kerja bakti': 'ag-goro', goro: 'ag-goro', rapat: 'ag-rapat',
  koordinasi: 'ag-rapat', sosial: 'ag-sosial', santunan: 'ag-sosial',
};

function toIsoDate(value) {
  const text = String(value ?? '').trim();
  let match = text.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (match) return `${match[1]}-${match[2]}-${match[3]}`;
  match = text.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (match) return `${match[3]}-${match[2].padStart(2, '0')}-${match[1].padStart(2, '0')}`;
  return '';
}

function getBadgeClass(category) {
  const lower = String(category ?? '').toLowerCase();
  return Object.entries(BADGE_MAP).find(([key]) => lower.includes(key))?.[1] ?? 'ag-lain';
}

export function enrichAgendaRecord(item, index = 0, today = new Date()) {
  const record = normalizeAgenda(item, index);
  const isoDate = toIsoDate(record.tanggal);
  const parts = isoDate ? isoDate.split('-') : [];
  const todayIso = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  return {
    ...record,
    isoDate,
    displayDay: parts[2] ?? '—',
    displayMonth: parts[1] ? MONTH_ID[Number(parts[1]) - 1] ?? parts[1] : '—',
    year: parts[0] ?? '',
    monthNum: Number(parts[1] ?? 0),
    dayNum: Number(parts[2] ?? 0),
    badgeClass: getBadgeClass(record.kategori),
    temporalGroup: !isoDate ? 'unknown' : isoDate < todayIso ? 'archive' : 'upcoming',
    _sortKey: isoDate || `9999-${index}`,
  };
}

function isPublicRecord(record) {
  const status = String(record.status ?? 'Siap publik').toLowerCase();
  const visibility = String(record.visibility ?? 'Publik').toLowerCase();
  return !['dibatalkan', 'cancelled', 'draft', 'internal'].includes(status)
    && ['publik', 'public', 'yes', 'ya'].includes(visibility);
}

const fallbackRecords = Object.freeze(mockAgenda
  .map((item, index) => enrichAgendaRecord(item, index))
  .sort((a, b) => a._sortKey.localeCompare(b._sortKey)));
let lastSourceStatus = sourceStatusFromApi('fallback');

async function readAll(options) {
  if ((options?.dataSourceMode ?? DATA_SOURCE_MODE) === DATA_SOURCE_SUPABASE) {
    try {
      const rows = (await readSupabaseAgenda(options))
        .map((item, index) => enrichAgendaRecord(item, index))
        .sort((a, b) => a._sortKey.localeCompare(b._sortKey));
      lastSourceStatus = sourceStatusFromSupabase();
      return rows;
    } catch {
      lastSourceStatus = sourceStatusFromApi('fallback');
      return fallbackRecords;
    }
  }
  const result = await getPublicAgenda(mockAgenda, options);
  lastSourceStatus = sourceStatusFromApi(result.source);
  return result.data
    .map((item, index) => enrichAgendaRecord(item, index))
    .sort((a, b) => a._sortKey.localeCompare(b._sortKey));
}

export const agendaRepository = Object.freeze({
  getInitialAll: () => fallbackRecords,
  getInitialPublic: () => fallbackRecords.filter(isPublicRecord),
  getAll: readAll,
  async getPublic(options) { return (await readAll(options)).filter(isPublicRecord); },
  async getById(id, options) {
    return (await readAll(options)).find((record) => String(record.id) === String(id)) ?? null;
  },
  getSourceStatus: () => lastSourceStatus,
});

export { isPublicRecord as isPublicAgenda };
