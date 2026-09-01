import { programs as fallbackPrograms } from '../data/siteContent.js';
import { DATA_SOURCE_MODE, getPublicPrograms, normalizeProgram } from '../services/api.js';
import { DATA_SOURCE_SUPABASE } from '../services/dataSource.js';
import { readSupabasePrograms } from '../services/supabaseContent.js';
import { sourceStatusFromApi, sourceStatusFromSupabase } from './sourceStatus.js';

const fallbackRecords = Object.freeze(fallbackPrograms.map((item, index) =>
  Object.freeze(normalizeProgram(item, index)),
));
let lastSourceStatus = sourceStatusFromApi('fallback');

function isPublicRecord(record) {
  const status = String(record.status ?? 'Siap publik').toLowerCase();
  const visibility = String(record.visibility ?? 'Publik').toLowerCase();
  return ['siap publik', 'active', 'aktif', 'ready'].includes(status)
    && ['publik', 'public', 'yes', 'ya'].includes(visibility);
}

async function readAll(options) {
  if ((options?.dataSourceMode ?? DATA_SOURCE_MODE) === DATA_SOURCE_SUPABASE) {
    try {
      const rows = (await readSupabasePrograms(options)).map(normalizeProgram);
      lastSourceStatus = sourceStatusFromSupabase();
      return rows;
    } catch {
      lastSourceStatus = sourceStatusFromApi('fallback');
      return fallbackRecords;
    }
  }
  const result = await getPublicPrograms(fallbackPrograms, options);
  lastSourceStatus = sourceStatusFromApi(result.source);
  return result.data;
}

export const programRepository = Object.freeze({
  getInitialAll: () => fallbackRecords,
  getInitialPublic: () => fallbackRecords.filter(isPublicRecord),
  getAll: readAll,
  async getPublic(options) {
    return (await readAll(options)).filter(isPublicRecord);
  },
  async getById(id, options) {
    return (await readAll(options)).find((record) => String(record.id) === String(id)) ?? null;
  },
  getSourceStatus: () => lastSourceStatus,
});

export { isPublicRecord as isPublicProgram };
