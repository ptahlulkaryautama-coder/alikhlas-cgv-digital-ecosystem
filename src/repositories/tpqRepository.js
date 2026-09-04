import { FAQS, TPQ_AGENDA, TPQ_PORTAL_INFO, TPQ_STATS, CLASS_GROUPS, KURIKULUM_ROADMAP, TPQ_TEACHING_TEAM, TPQ_ORGANIZATION_STRUCTURE } from '../data/tpqData.js';
import { tpqPublicProjection } from '../data/tpqPublicProjection.js';
import { kabarRepository } from './kabarRepository.js';
import { createSourceStatus, sourceStatusFromSupabase, SOURCE_TYPES } from './sourceStatus.js';
import { DATA_SOURCE_MODE } from '../services/api.js';
import { DATA_SOURCE_SUPABASE } from '../services/dataSource.js';
import { readSupabaseTpqProjection } from '../services/supabaseContent.js';

import { getSupabaseBrowserClient } from '../services/supabaseClient.js';

const fallbackSourceStatus = createSourceStatus(SOURCE_TYPES.PROTECTED_PROTOTYPE, {
  verified: false,
  connected: false,
  detail: 'Integrasi belum diverifikasi',
});
let sourceStatus = fallbackSourceStatus;

export const tpqRepository = Object.freeze({
  getAll: () => ({
    portalInfo: TPQ_PORTAL_INFO, stats: TPQ_STATS, classes: CLASS_GROUPS,
    curriculum: KURIKULUM_ROADMAP, teachingTeam: TPQ_TEACHING_TEAM,
    structure: TPQ_ORGANIZATION_STRUCTURE,
    agenda: TPQ_AGENDA, faqs: FAQS,
  }),
  getPublic: () => tpqPublicProjection,
  async getIntegratedProjection(options) {
    if ((options?.dataSourceMode ?? DATA_SOURCE_MODE) !== DATA_SOURCE_SUPABASE) {
      sourceStatus = fallbackSourceStatus;
      return { schedule: CLASS_GROUPS, agenda: TPQ_AGENDA, learningFocus: KURIKULUM_ROADMAP };
    }
    try {
      const projection = await readSupabaseTpqProjection(options);
      sourceStatus = sourceStatusFromSupabase();
      return projection;
    } catch {
      sourceStatus = fallbackSourceStatus;
      return { schedule: CLASS_GROUPS, agenda: TPQ_AGENDA, learningFocus: KURIKULUM_ROADMAP };
    }
  },
  getById: (id) => tpqPublicProjection.schedule.find((item) => item.id === id)
    ?? tpqPublicProjection.agenda.find((item) => item.id === id) ?? null,
  getPublicSchedule: () => tpqPublicProjection.schedule,
  getPublicAgenda: () => tpqPublicProjection.agenda,
  getPublicLearningFocus: () => tpqPublicProjection.learningFocus,
  getPublicNews: () => kabarRepository.getPublic().filter((article) =>
    article.category === 'TPQ' || article.tags?.includes('TPQ'),
  ),
  getSourceStatus: () => sourceStatus,

  async getCapabilities() {
    try {
      const client = getSupabaseBrowserClient();
      if (!client) return { read_enabled: false, writes_enabled: false, can_private_read: false, can_private_write: false };
      const { data, error } = await client.rpc('tpq_private_capabilities');
      if (error || !data) return { read_enabled: false, writes_enabled: false, can_private_read: false, can_private_write: false };
      return data;
    } catch {
      return { read_enabled: false, writes_enabled: false, can_private_read: false, can_private_write: false };
    }
  },

  async savePrivateRecord(action, { recordId = null, expectedVersion = null, payload = {} } = {}) {
    try {
      const client = getSupabaseBrowserClient();
      if (!client) return { success: false, error: 'Klien Supabase tidak tersedia' };
      const { data, error } = await client.rpc('command_tpq_private_record', {
        p_action: action,
        p_record_id: recordId,
        p_expected_version: expectedVersion,
        p_payload: payload,
      });
      if (error) return { success: false, error: error.message };
      return { success: true, data };
    } catch (err) {
      return { success: false, error: err.message || 'Gagal menyimpan catatan privat TPQ' };
    }
  },

  async saveAttendanceSession(sessionData) {
    return this.savePrivateRecord('create', {
      payload: {
        kind: 'attendance_note',
        opaque_code: `tpq_att_${Date.now()}`,
        session: sessionData,
      },
    });
  },

  async saveProgressNote(progressData) {
    return this.savePrivateRecord('create', {
      payload: {
        kind: 'progress_note',
        opaque_code: `tpq_prog_${Date.now()}`,
        progress: progressData,
      },
    });
  },

  async saveRaportDraft(raportData) {
    return this.savePrivateRecord('create', {
      payload: {
        kind: 'document_note',
        opaque_code: `tpq_rap_${Date.now()}`,
        raport: raportData,
      },
    });
  },
});

