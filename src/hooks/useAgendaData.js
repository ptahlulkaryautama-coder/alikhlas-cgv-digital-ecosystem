/**
 * useAgendaData.js — Hook for the Agenda & Kalender admin module
 *
 * Fetches 09_Agenda_Kalender via getPublicAgenda() and enriches each item
 * with display helpers (displayDay, displayMonth, badgeClass) needed by
 * the admin agenda components.
 *
 * Safety guarantees:
 *   - GET only. No POST.
 *   - No private admin notes or jemaah data.
 *   - Falls back silently to mockAgenda when API is unavailable.
 *   - console.warn only in DEV (via api.js logApiFallback).
 *   - AbortController cleans up on unmount.
 */

import { useEffect, useState } from 'react';
import { getPublicAgenda } from '../services/api.js';
import { mockAgenda } from '../data/dashboardMockData.js';

// ── Date parsing helpers ───────────────────────────────────────────────────

const MONTH_ID = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];

function parseDateDisplay(tanggal) {
  if (!tanggal || tanggal === '-') return null;
  // YYYY-MM-DD
  const iso = tanggal.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (iso) {
    return { displayDay: iso[3], displayMonth: MONTH_ID[parseInt(iso[2], 10) - 1] ?? iso[2], year: iso[1], monthNum: parseInt(iso[2], 10), dayNum: parseInt(iso[3], 10) };
  }
  // DD/MM/YYYY
  const dmy = tanggal.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (dmy) {
    const m = parseInt(dmy[2], 10);
    return { displayDay: dmy[1].padStart(2, '0'), displayMonth: MONTH_ID[m - 1] ?? dmy[2], year: dmy[3], monthNum: m, dayNum: parseInt(dmy[1], 10) };
  }
  // "07 Jun 2026"
  const txt = tanggal.match(/^(\d{1,2})\s+([A-Za-z]{3})\s*(\d{4})?/);
  if (txt) {
    const mLabel = txt[2].slice(0, 3);
    const mNum = MONTH_ID.indexOf(mLabel) + 1;
    return { displayDay: txt[1].padStart(2, '0'), displayMonth: mLabel, year: txt[3] ?? '', monthNum: mNum, dayNum: parseInt(txt[1], 10) };
  }
  return null;
}

const BADGE_MAP = {
  'hari besar islam': 'ag-hbi',
  'idul adha': 'ag-hbi',
  'idul fitri': 'ag-hbi',
  'kerja bakti': 'ag-goro',
  'goro': 'ag-goro',
  'rapat': 'ag-rapat',
  'koordinasi': 'ag-rapat',
  'sosial': 'ag-sosial',
  'santunan': 'ag-sosial',
};

function getBadgeClass(kategori) {
  if (!kategori) return 'ag-lain';
  const lower = kategori.toLowerCase();
  for (const [key, cls] of Object.entries(BADGE_MAP)) {
    if (lower.includes(key)) return cls;
  }
  return 'ag-lain';
}

/**
 * Enriches a normalizeAgenda() result with display helpers.
 */
function enrichAgenda(item, index) {
  const date = parseDateDisplay(item.tanggal);
  return {
    ...item,
    displayDay:   date?.displayDay   ?? '—',
    displayMonth: date?.displayMonth ?? '—',
    year:         date?.year         ?? '',
    monthNum:     date?.monthNum     ?? 0,
    dayNum:       date?.dayNum       ?? 0,
    badgeClass:   getBadgeClass(item.kategori),
    _sortKey:     date ? `${date.year}-${String(date.monthNum).padStart(2,'0')}-${String(date.dayNum).padStart(2,'0')}` : `9999-${index}`,
  };
}

// ── Pre-enriched fallback (module-level, computed once) ──────────────────
// mockAgenda items already carry displayDay/displayMonth/badgeClass but lack
// _sortKey. Enriching here ensures the initial useState value is always safe
// and the .sort() call in the effect never receives undefined _sortKey.
const enrichedFallback = mockAgenda
  .map(enrichAgenda)
  .sort((a, b) => a._sortKey.localeCompare(b._sortKey));

// ── Hook ──────────────────────────────────────────────────────────────────

export default function useAgendaData() {
  const [agenda, setAgenda]       = useState(enrichedFallback);
  const [source, setSource]       = useState('fallback');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    let isMounted = true;

    getPublicAgenda(mockAgenda, { signal: controller.signal }).then((result) => {
      if (!isMounted) return;
      // If the fetch was aborted (Strict Mode double-mount cleanup), result.source
      // will still be 'fallback' with normalizeAgenda-shaped data — enrich it.
      const enriched = result.data
        .map(enrichAgenda)
        .sort((a, b) => a._sortKey.localeCompare(b._sortKey));
      setAgenda(enriched);
      setSource(result.source);
      setIsLoading(false);
    });

    return () => { isMounted = false; controller.abort(); };
  }, []);

  return { agenda, source, isLoading };
}
