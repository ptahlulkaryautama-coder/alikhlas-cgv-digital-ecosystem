/**
 * AgendaCalendarPreview.jsx — Monthly mini-calendar + website preview
 *
 * Section A: Monthly grid (current month) with event dots on days that have agenda
 * Section B: 3-column preview cards linking to homepage
 *
 * Props:
 *   agenda    {object[]} — enriched agenda from useAgendaData
 *   isLoading {boolean}
 */

import { useState } from 'react';

const MONTH_NAMES_ID = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
const DAY_HEADERS   = ['Sen','Sel','Rab','Kam','Jum','Sab','Ahu'];

const BADGE_COLORS = {
  'ag-hbi':    '#C9A55A',
  'ag-goro':   '#1A7A50',
  'ag-rapat':  '#2B6CB0',
  'ag-sosial': '#8A6200',
  'ag-lain':   '#9CA3AF',
};

const CAT_LABELS = {
  'ag-hbi':    'Hari Besar Islam',
  'ag-goro':   'Kerja Bakti',
  'ag-rapat':  'Rapat',
  'ag-sosial': 'Sosial',
  'ag-lain':   'Lainnya',
};

/**
 * Builds a 6×7 day grid for the given year/month (1-indexed).
 * Returns array of {date: Date|null} objects.
 */
function buildCalendarGrid(year, month) {
  const firstDay = new Date(year, month - 1, 1);
  // Monday-first: getDay() 0=Sun → 7
  let startOffset = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
  const daysInMonth = new Date(year, month, 0).getDate();
  const cells = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month - 1, d));
  // pad to complete weeks
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

/**
 * Maps day numbers (in a given year/month) to their agenda dots.
 */
function buildDayEventMap(agenda, year, month) {
  const map = {};
  agenda.forEach((a) => {
    if (Number(a.year) === year && a.monthNum === month) {
      if (!map[a.dayNum]) map[a.dayNum] = [];
      map[a.dayNum].push(a);
    }
  });
  return map;
}

export default function AgendaCalendarPreview({ agenda = [], isLoading = false }) {
  const now    = new Date();
  const [viewYear,  setViewYear]  = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth() + 1);

  const grid   = buildCalendarGrid(viewYear, viewMonth);
  const dayMap = buildDayEventMap(agenda, viewYear, viewMonth);
  const today  = now.getDate();
  const isCurrentMonth = viewYear === now.getFullYear() && viewMonth === now.getMonth() + 1;

  function prevMonth() {
    if (viewMonth === 1) { setViewYear((y) => y - 1); setViewMonth(12); }
    else setViewMonth((m) => m - 1);
  }
  function nextMonth() {
    if (viewMonth === 12) { setViewYear((y) => y + 1); setViewMonth(1); }
    else setViewMonth((m) => m + 1);
  }

  return (
    <>
      {/* ── Monthly calendar ── */}
      <div className="db-card db-cp" style={{ marginBottom: '16px' }}>
        <div className="db-card-head">
          <div>
            <div className="db-card-title">Kalender Kegiatan</div>
            <div className="db-card-sub">{MONTH_NAMES_ID[viewMonth - 1]} {viewYear}</div>
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              onClick={prevMonth}
              style={{ padding: '5px 10px', borderRadius: '8px', border: '1px solid rgba(12,24,16,.10)', background: 'var(--db-bg-card)', cursor: 'pointer', fontSize: '12px', color: 'var(--db-text-2)', fontFamily: 'inherit' }}
            >
              ‹ Sebelumnya
            </button>
            <button
              onClick={nextMonth}
              style={{ padding: '5px 10px', borderRadius: '8px', border: '1px solid rgba(12,24,16,.10)', background: 'var(--db-bg-card)', cursor: 'pointer', fontSize: '12px', color: 'var(--db-text-2)', fontFamily: 'inherit' }}
            >
              Berikutnya ›
            </button>
          </div>
        </div>

        {isLoading ? (
          <div style={{ height: 180, background: 'rgba(12,24,16,.04)', borderRadius: 10, animation: 'dbSkeletonPulse 1.4s ease-in-out infinite' }} />
        ) : (
          <>
            {/* Day headers */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '3px', marginBottom: '6px' }}>
              {DAY_HEADERS.map((d) => (
                <div key={d} style={{ textAlign: 'center', fontSize: '10px', fontWeight: 700, color: 'var(--db-text-4)', textTransform: 'uppercase', letterSpacing: '.05em', padding: '4px 0' }}>
                  {d}
                </div>
              ))}
            </div>

            {/* Day cells */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '3px' }}>
              {grid.map((date, i) => {
                if (!date) return <div key={i} />;
                const d     = date.getDate();
                const evts  = dayMap[d] ?? [];
                const isToday = isCurrentMonth && d === today;
                return (
                  <div
                    key={i}
                    title={evts.length > 0 ? evts.map((e) => e.nama).join(', ') : undefined}
                    style={{
                      minHeight: '40px',
                      borderRadius: '8px',
                      padding: '4px',
                      background: isToday ? 'var(--db-forest)' : evts.length > 0 ? 'rgba(26,122,80,.06)' : 'transparent',
                      border: isToday ? 'none' : evts.length > 0 ? '1px solid rgba(26,122,80,.15)' : '1px solid transparent',
                      display: 'flex', flexDirection: 'column', alignItems: 'center',
                      transition: 'background .1s',
                    }}
                  >
                    <span style={{
                      fontSize: '12px', fontWeight: isToday ? 700 : evts.length > 0 ? 600 : 400,
                      color: isToday ? '#fff' : evts.length > 0 ? 'var(--db-forest)' : 'var(--db-text-3)',
                      lineHeight: 1.6,
                    }}>
                      {d}
                    </span>
                    {/* Event dots */}
                    <div style={{ display: 'flex', gap: '2px', flexWrap: 'wrap', justifyContent: 'center' }}>
                      {evts.slice(0, 3).map((e) => (
                        <span
                          key={e.id}
                          style={{
                            width: 5, height: 5, borderRadius: '50%',
                            background: BADGE_COLORS[e.badgeClass] ?? '#9CA3AF',
                            display: 'inline-block',
                          }}
                          aria-hidden="true"
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginTop: '12px', paddingTop: '10px', borderTop: '1px solid rgba(12,24,16,.06)' }}>
              {Object.entries(BADGE_COLORS).map(([key, color]) => (
                <span key={key} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: 'var(--db-text-3)' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, display: 'inline-block' }} aria-hidden="true" />
                  {CAT_LABELS[key]}
                </span>
              ))}
            </div>
          </>
        )}
      </div>

      {/* ── Website preview cards ── */}
      <div className="db-card db-cp" style={{ marginBottom: '16px' }}>
        <div className="db-card-head">
          <div>
            <div className="db-card-title">Preview — Section "Agenda Masjid" (Website)</div>
            <div className="db-card-sub">Tampilan agenda mendatang di halaman publik</div>
          </div>
          <a
            href="/#agenda"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '5px',
              fontSize: '12px', fontWeight: 500,
              color: 'var(--db-emerald)', textDecoration: 'none',
              padding: '5px 10px', border: '1px solid rgba(12,24,16,.09)',
              borderRadius: '8px', background: 'var(--db-bg-card)', flexShrink: 0,
            }}
          >
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true">
              <path d="M2 9L9 2M9 2H4M9 2v5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Lihat di Website
          </a>
        </div>

        {isLoading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
            {[1, 2, 3].map((k) => (
              <div key={k} style={{ background: 'rgba(12,24,16,.04)', borderRadius: 12, height: 100, animation: 'dbSkeletonPulse 1.4s ease-in-out infinite' }} />
            ))}
          </div>
        ) : agenda.length === 0 ? (
          <div style={{ padding: '24px', textAlign: 'center', color: 'var(--db-text-4)', fontSize: '13px' }}>
            Belum ada agenda untuk ditampilkan.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
            {agenda.slice(0, 3).map((item) => {
              const bg  = BADGE_COLORS[item.badgeClass] ?? '#9CA3AF';
              const lbl = CAT_LABELS[item.badgeClass] ?? item.kategori;
              return (
                <div
                  key={item.id}
                  style={{
                    borderRadius: '12px', padding: '14px 16px',
                    background: 'var(--db-bg-inset)',
                    border: '1px solid rgba(12,24,16,.07)',
                    display: 'flex', flexDirection: 'column', gap: '6px',
                  }}
                >
                  {/* Date pill */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: bg, flexShrink: 0 }} aria-hidden="true" />
                    <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--db-text-4)', textTransform: 'uppercase', letterSpacing: '.05em' }}>
                      {item.displayDay} {item.displayMonth} {item.year}
                    </span>
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--db-text-1)', lineHeight: 1.3 }}>{item.nama}</div>
                  <div style={{ fontSize: '11.5px', color: 'var(--db-text-3)' }}>{[item.waktu, item.lokasi].filter(Boolean).join(' · ')}</div>
                  <span style={{ alignSelf: 'flex-start', fontSize: '10px', fontWeight: 600, padding: '2px 7px', borderRadius: '99px', background: `${bg}22`, color: bg }}>
                    {lbl}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
