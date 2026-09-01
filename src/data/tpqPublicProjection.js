import { CLASS_GROUPS, KURIKULUM_ROADMAP, TPQ_AGENDA, TPQ_STATS } from './tpqData.js';

export const tpqPublicProjection = Object.freeze({
  schedule: Object.freeze(CLASS_GROUPS.map(({ id, name, level, day, time, room, description }) => Object.freeze({
    id, name, level, day, time, room, description,
    sourceVerified: false,
  }))),
  agenda: Object.freeze(TPQ_AGENDA.map(({ id, title, date, isoDate, time, location, category, status }) => Object.freeze({
    id, title, date, isoDate, time, location, category, status,
    sourceVerified: false,
  }))),
  learningFocus: Object.freeze(KURIKULUM_ROADMAP.map(({ level, name, category, desc, target }) => Object.freeze({
    level, name, category, description: desc, target, sourceVerified: false,
  }))),
  aggregates: Object.freeze(Object.fromEntries(Object.entries(TPQ_STATS)
    .filter(([, value]) => value.isVerified === true)
    .map(([key, value]) => [key, Object.freeze({ displayValue: value.displayValue, isVerified: true })]))),
  aggregateStatus: Object.freeze({
    verified: false,
    message: 'Nilai agregat belum diverifikasi dan tidak dipublikasikan.',
  }),
});
