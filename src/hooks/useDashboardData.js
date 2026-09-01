/**
 * useDashboardData.js — Aggregated data hook for the DKM dashboard overview
 *
 * Fires all 3 read-only GET calls concurrently on mount:
 *   - getPublicPrograms()       → 01_Program_Kajian
 *   - getPublicAgenda()         → 09_Agenda_Kalender
 *   - getPublicFinanceSummary() → 02_Keuangan (ringkasan only)
 *
 * Returns per-section { data, source, isLoading } so each dashboard card
 * can independently show a "Menampilkan data sementara" indicator when
 * its own section fell back to mock data.
 *
 * Safety guarantees:
 *   - Never throws to the caller — every branch catches internally.
 *   - Local mode returns fallback without a request; proxy failures also fall back.
 *   - console.warn only in DEV (handled inside api.js logApiFallback).
 *   - No donor / jemaah / TPQ child data is fetched or surfaced here.
 *   - No POST calls are made.
 *   - AbortController cleans up in-flight requests on unmount.
 */

import { useEffect, useState } from 'react';
import {
  getPublicAgenda,
  getPublicFinanceSummary,
  getPublicPrograms,
} from '../services/api.js';

import {
  mockAgenda,
  mockKpi,
  mockPrograms,
} from '../data/dashboardMockData.js';

import { publicFinanceSummary } from '../data/siteContent.js';

// ── Helpers to shape API data for dashboard display ────────────────────────

const MONTH_ID = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];

/**
 * Parses a date string (YYYY-MM-DD, DD/MM/YYYY, or "07 Jun 2026"-like)
 * into { displayDay, displayMonth } for the agenda date box.
 * Returns null if unparseable.
 */
function parseDateDisplay(tanggal) {
  if (!tanggal || tanggal === '-') return null;

  // Try YYYY-MM-DD
  const iso = tanggal.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (iso) {
    const m = parseInt(iso[2], 10);
    return { displayDay: iso[3], displayMonth: MONTH_ID[m - 1] ?? iso[2] };
  }

  // Try DD/MM/YYYY or D/M/YYYY
  const dmy = tanggal.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (dmy) {
    const m = parseInt(dmy[2], 10);
    return {
      displayDay: dmy[1].padStart(2, '0'),
      displayMonth: MONTH_ID[m - 1] ?? dmy[2],
    };
  }

  // Try "07 Jun 2026" style
  const textDate = tanggal.match(/^(\d{1,2})\s+([A-Za-z]{3})/);
  if (textDate) {
    return {
      displayDay: textDate[1].padStart(2, '0'),
      displayMonth: textDate[2].slice(0, 3),
    };
  }

  return null;
}

/**
 * Maps a category string to a badge CSS class.
 */
const KATEGORI_BADGE_MAP = {
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
  for (const [key, cls] of Object.entries(KATEGORI_BADGE_MAP)) {
    if (lower.includes(key)) return cls;
  }
  return 'ag-lain';
}

/**
 * Maps a program pilar string to a CSS badge class.
 */
const PILAR_CLASS_MAP = {
  ilmu: 'pl-ilmu',
  ibadah: 'pl-ibadah',
  keluarga: 'pl-keluarga',
  amanah: 'pl-amanah',
};

function getPilarClass(pilar) {
  return PILAR_CLASS_MAP[(pilar ?? '').toLowerCase()] ?? 'pl-ilmu';
}

/**
 * Maps a pilar string to an emoji icon.
 */
const PILAR_EMOJI_MAP = {
  ilmu: '📖',
  ibadah: '🕌',
  keluarga: '👨‍👩‍👧',
  amanah: '📿',
};

function getPilarEmoji(pilar) {
  return PILAR_EMOJI_MAP[(pilar ?? '').toLowerCase()] ?? '📋';
}

const PILAR_BG_MAP = {
  ilmu: '#E8F5EE',
  ibadah: '#E0EEFF',
  keluarga: '#FDF4E3',
  amanah: '#F0EAF8',
};

function getPilarBg(pilar) {
  return PILAR_BG_MAP[(pilar ?? '').toLowerCase()] ?? '#EDE9DF';
}

/**
 * Converts a normalized API program (from normalizeProgram) into the
 * shape expected by ProgramOverview.
 */
function toDashboardProgram(prog, index) {
  const pilarLower = (prog.pilar ?? '').toLowerCase();
  return {
    id: prog.id ?? index,
    emoji: getPilarEmoji(pilarLower),
    bgColor: getPilarBg(pilarLower),
    kategori: prog.kategori,
    nama: prog.nama,
    hari: prog.hari,
    waktu: prog.waktu,
    pilar: prog.pilar,
    pilarColor: getPilarClass(pilarLower),
  };
}

/**
 * Converts a normalized API agenda item (from normalizeAgenda) into the
 * shape expected by AgendaOverview (adds displayDay, displayMonth, badgeClass).
 */
function toDashboardAgenda(item, index) {
  const dateDisplay = parseDateDisplay(item.tanggal);
  return {
    id: item.id ?? index,
    kategori: item.kategori,
    badgeClass: getBadgeClass(item.kategori),
    nama: item.nama,
    tanggal: item.tanggal,
    displayDay: dateDisplay?.displayDay ?? '—',
    displayMonth: dateDisplay?.displayMonth ?? '—',
    waktu: item.waktu,
    lokasi: item.lokasi,
  };
}

/**
 * Builds KPI finance values from API finance summary, falling back per field.
 * Returns { kasMasuk, kasKeluar, saldoAkhir } each as { value, hint }.
 * If API summary is unavailable, returns the existing mock KPI values unchanged.
 */
function toFinanceKpi(apiSummary, isFallback) {
  if (isFallback) return null; // signal to keep existing mockKpi values

  // Strip the "Rp " prefix that formatRupiah adds, keep only the number string
  const strip = (s) => String(s ?? '').replace(/^Rp\s*/i, '').trim();

  return {
    kasMasuk: {
      value: strip(apiSummary.totalIn),
      hint: apiSummary.transactionCount
        ? `${apiSummary.transactionCount} transaksi`
        : mockKpi.kasMasuk.hint,
    },
    kasKeluar: {
      value: strip(apiSummary.totalOut),
      hint: mockKpi.kasKeluar.hint,
    },
    saldoAkhir: {
      value: strip(apiSummary.endingBalance),
      hint: apiSummary.period ? `Per ${apiSummary.period}` : mockKpi.saldoAkhir.hint,
    },
  };
}

// ── Fallbacks shaped for dashboard ────────────────────────────────────────

const FALLBACK_PROGRAMS = mockPrograms; // already in dashboard shape
const FALLBACK_AGENDA   = mockAgenda;   // already in dashboard shape

// Finance fallback mirrors publicFinanceSummary shape (used by transparansi too)
const FINANCE_FALLBACK  = publicFinanceSummary;

// ── The hook ──────────────────────────────────────────────────────────────

/**
 * @returns {{
 *   programs:    { data: object[], source: string, isLoading: boolean },
 *   agenda:      { data: object[], source: string, isLoading: boolean },
 *   finance:     { kpi: object|null, source: string, isLoading: boolean },
 *   isAnyLoading: boolean,
 * }}
 */
export default function useDashboardData() {
  const [programs, setPrograms] = useState({
    data: FALLBACK_PROGRAMS,
    source: 'fallback',
    isLoading: true,
  });

  const [agenda, setAgenda] = useState({
    data: FALLBACK_AGENDA,
    source: 'fallback',
    isLoading: true,
  });

  const [finance, setFinance] = useState({
    kpi: null, // null = use mockKpi
    source: 'fallback',
    isLoading: true,
  });

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    let isMounted = true;

    // ── Programs ──────────────────────────────────────────────────────────
    getPublicPrograms(
      // Pass raw mock as fallback — getPublicPrograms will call normalizeProgram on it
      mockPrograms,
      { signal },
    ).then((result) => {
      if (!isMounted) return;
      setPrograms({
        // result.data is already normalized; convert to dashboard shape
        data: result.data.map(toDashboardProgram),
        source: result.source,
        isLoading: false,
      });
    });

    // ── Agenda ────────────────────────────────────────────────────────────
    getPublicAgenda(
      // Pass raw mock as fallback
      mockAgenda,
      { signal },
    ).then((result) => {
      if (!isMounted) return;
      setAgenda({
        data: result.data.map(toDashboardAgenda),
        source: result.source,
        isLoading: false,
      });
    });

    // ── Finance summary ───────────────────────────────────────────────────
    getPublicFinanceSummary(FINANCE_FALLBACK, { signal }).then((result) => {
      if (!isMounted) return;
      const isFallback = result.source !== 'api';
      setFinance({
        kpi: toFinanceKpi(result.data, isFallback),
        source: result.source,
        isLoading: false,
      });
    });

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  return {
    programs,
    agenda,
    finance,
    isAnyLoading: programs.isLoading || agenda.isLoading || finance.isLoading,
  };
}
