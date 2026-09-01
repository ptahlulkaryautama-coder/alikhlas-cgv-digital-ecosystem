import { getSupabaseBrowserClient, isSupabaseConfigured } from './supabaseClient.js';

function withAbort(query, signal) {
  return signal ? query.abortSignal(signal) : query;
}

async function selectRows(table, orderColumn, { signal } = {}) {
  if (!isSupabaseConfigured()) throw new Error('Supabase is not configured');
  let query = getSupabaseBrowserClient().from(table).select('*').order(orderColumn, { ascending: true });
  query = withAbort(query, signal);
  const { data, error } = await query;
  if (error) throw error;
  if (!Array.isArray(data) || data.length === 0) throw new Error(`${table} has no readable rows`);
  return data;
}

export async function readSupabasePrograms(options) {
  return (await selectRows('content_programs', 'created_at', options)).map((row) => ({
    id: row.id, title: row.title, category: row.category, pilar: row.pillar,
    description: row.description, hari: row.schedule_day, waktu: row.schedule_time,
    location: row.location, pemateri: row.speaker_label, poster: row.poster_url,
    visibility: row.visibility, status: row.status, sourceVerified: row.source_verified,
    version: row.version, createdBy: row.created_by, reviewedBy: row.reviewed_by,
    rejectionReason: row.rejection_reason, environment: row.environment, source: 'supabase',
  }));
}

export async function readSupabaseAgenda(options) {
  return (await selectRows('content_agenda', 'event_date', options)).map((row) => ({
    id: row.id, title: row.title, category: row.category, description: row.description,
    tanggal: row.event_date, waktu: row.event_time, lokasi: row.location,
    visibility: row.visibility, status: row.status, sourceVerified: row.source_verified,
    version: row.version, createdBy: row.created_by, reviewedBy: row.reviewed_by,
    rejectionReason: row.rejection_reason, cancellationReason: row.cancellation_reason,
    environment: row.environment, source: 'supabase',
  }));
}

export async function readSupabaseTpqProjection(options) {
  const [scheduleRows, agendaRows, focusRows] = await Promise.all([
    selectRows('tpq_public_schedule', 'display_order', options),
    selectRows('tpq_public_agenda', 'event_date', options),
    selectRows('tpq_public_learning_focus', 'display_order', options),
  ]);
  return {
    schedule: scheduleRows.map((row) => ({
      id: row.id, name: row.name, level: row.level_label, day: row.day_label,
      time: row.time_label, room: row.room_label, audience: row.audience_label,
      pengajar: row.teacher_role_label, description: row.description,
      fokusMateri: row.learning_focus, sourceVerified: row.source_verified,
    })),
    agenda: agendaRows.map((row) => ({
      id: row.id, title: row.title, isoDate: row.event_date, date: row.event_date,
      time: row.time_label, location: row.location_label, category: row.category,
      description: row.description, status: row.status, sourceVerified: row.source_verified,
    })),
    learningFocus: focusRows.map((row) => ({
      level: row.level_label, name: row.name, category: row.category,
      desc: row.description, target: row.target_label, sourceVerified: row.source_verified,
    })),
  };
}
