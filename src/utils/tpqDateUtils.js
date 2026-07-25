/**
 * tpqDateUtils.js — Runtime-safe date classification utilities for TPQ Portal.
 *
 * Provides timezone-aware local date calculations and runtime-safe filtering/sorting
 * for TPQ agenda events without relying on UTC ISO string slicing or hardcoded dates.
 */

/**
 * Returns current local date in YYYY-MM-DD format.
 * Uses local Date components (getFullYear, getMonth, getDate) to prevent UTC timezone shift around midnight.
 *
 * @param {Date} [referenceDate] - Optional reference date (defaults to new Date())
 * @returns {string} Local date string in YYYY-MM-DD format
 */
export function getLocalISODate(referenceDate = new Date()) {
  const now = referenceDate instanceof Date && !isNaN(referenceDate.getTime()) ? referenceDate : new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Validates whether a string matches YYYY-MM-DD format.
 *
 * @param {string} str
 * @returns {boolean}
 */
export function isValidISODateString(str) {
  return typeof str === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(str.trim());
}

/**
 * Classifies agenda items into future/today (upcoming), past (arsip), and unknown date lists.
 *
 * Boundary Rules:
 * - future date (isoDate > todayISO): upcoming
 * - same local date (isoDate === todayISO): hari ini (upcoming/active)
 * - earlier date (isoDate < todayISO): past / arsip
 * - invalid/missing date: unknown date state (NOT upcoming or completed)
 *
 * @param {Array} agendaList - Array of agenda items containing isoDate property
 * @param {string} [todayISO] - Optional YYYY-MM-DD comparison string (defaults to local runtime date)
 * @returns {{ future: Array, past: Array, unknown: Array }} Classified agenda lists
 */
export function classifyTPQAgenda(agendaList = [], todayISO = getLocalISODate()) {
  const safeList = Array.isArray(agendaList) ? agendaList : [];

  const future = [];
  const past = [];
  const unknown = [];

  for (const item of safeList) {
    if (!item || !isValidISODateString(item.isoDate)) {
      if (item) unknown.push(item);
      continue;
    }

    const trimmedISO = item.isoDate.trim();
    if (trimmedISO >= todayISO) {
      future.push(item);
    } else {
      past.push(item);
    }
  }

  // Future: ascending order (soonest upcoming event first)
  const sortedFuture = [...future].sort((a, b) =>
    (a.isoDate || '').trim().localeCompare((b.isoDate || '').trim())
  );

  // Past: descending order (most recent completed event first)
  const sortedPast = [...past].sort((a, b) =>
    (b.isoDate || '').trim().localeCompare((a.isoDate || '').trim())
  );

  return {
    future: sortedFuture,
    past: sortedPast,
    unknown,
  };
}
