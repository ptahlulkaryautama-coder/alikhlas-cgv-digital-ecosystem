/**
 * AgendaList.jsx — Filterable read-only agenda item listing
 *
 * Features:
 *   - Category filter chips: Semua · Hari Besar · Kerja Bakti · Rapat · Sosial
 *   - Text search by nama
 *   - Timeline-style rows with date box, body, category badge
 *   - Read-only — no edit/delete/add
 *
 * Props:
 *   agenda    {object[]} — enriched agenda from useAgendaData
 *   isLoading {boolean}
 */

import { useState } from 'react';

const BADGE_COLORS = {
  'ag-hbi':    { bg: '#FEF3E2', text: '#8A6200',  border: 'rgba(200,115,10,.15)' },
  'ag-goro':   { bg: '#E8F5EE', text: '#1A7A50',  border: 'rgba(26,122,80,.15)' },
  'ag-rapat':  { bg: '#E0EEFF', text: '#2B6CB0',  border: 'rgba(43,108,176,.15)' },
  'ag-sosial': { bg: '#FDF4E3', text: '#8A6200',  border: 'rgba(200,165,90,.15)' },
  'ag-lain':   { bg: '#F3F4F6', text: '#6B7280',  border: 'rgba(107,114,128,.15)' },
};

const CAT_LABELS = {
  'ag-hbi':    'Hari Besar Islam',
  'ag-goro':   'Kerja Bakti',
  'ag-rapat':  'Rapat/Koordinasi',
  'ag-sosial': 'Sosial',
  'ag-lain':   'Lainnya',
};

const FILTERS = [
  { key: 'semua', label: 'Semua' },
  { key: 'ag-hbi',    label: 'Hari Besar' },
  { key: 'ag-goro',   label: 'Kerja Bakti' },
  { key: 'ag-rapat',  label: 'Rapat' },
  { key: 'ag-sosial', label: 'Sosial' },
];

function DateBox({ day, month }) {
  return (
    <div
      style={{
        width: 50, height: 52, flexShrink: 0,
        background: 'var(--db-forest)',
        borderRadius: '10px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        color: '#fff',
      }}
      aria-label={`${day} ${month}`}
    >
      <div style={{ fontSize: '18px', fontWeight: 800, lineHeight: 1 }}>{day}</div>
      <div style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.05em', opacity: 0.8 }}>{month}</div>
    </div>
  );
}

function CategoryBadge({ badgeClass, label }) {
  const clr = BADGE_COLORS[badgeClass] ?? BADGE_COLORS['ag-lain'];
  return (
    <span
      style={{
        display: 'inline-block',
        fontSize: '10.5px', fontWeight: 600,
        padding: '3px 9px', borderRadius: '99px',
        background: clr.bg, color: clr.text,
        border: `1px solid ${clr.border}`,
        whiteSpace: 'nowrap', flexShrink: 0,
      }}
    >
      {label}
    </span>
  );
}

function SkeletonRow() {
  return (
    <div style={{ display: 'flex', gap: '14px', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid rgba(12,24,16,.05)' }} aria-hidden="true">
      <div style={{ width: 50, height: 52, borderRadius: 10, background: 'rgba(12,24,16,.07)', flexShrink: 0, animation: 'dbSkeletonPulse 1.4s ease-in-out infinite' }} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ height: 13, width: '55%', borderRadius: 4, background: 'rgba(12,24,16,.07)', animation: 'dbSkeletonPulse 1.4s ease-in-out infinite' }} />
        <div style={{ height: 10, width: '35%', borderRadius: 4, background: 'rgba(12,24,16,.05)', animation: 'dbSkeletonPulse 1.4s ease-in-out infinite' }} />
      </div>
    </div>
  );
}

export default function AgendaList({ agenda = [], isLoading = false }) {
  const [activeFilter, setActiveFilter] = useState('semua');
  const [searchQuery, setSearchQuery]   = useState('');

  const filtered = agenda.filter((a) => {
    const matchCat  = activeFilter === 'semua' || a.badgeClass === activeFilter;
    const matchText = !searchQuery || (a.nama ?? '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchText;
  });

  return (
    <div className="db-card" style={{ marginBottom: '16px' }}>
      {/* Filter bar */}
      <div
        style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          padding: '14px 16px 10px', flexWrap: 'wrap',
          borderBottom: '1px solid rgba(12,24,16,.06)',
        }}
      >
        <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--db-text-4)', flexShrink: 0 }}>Kategori</span>
        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', flex: 1 }}>
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              style={{
                fontSize: '11.5px', fontWeight: 500,
                padding: '4px 12px', borderRadius: '99px',
                border: '1px solid rgba(12,24,16,.10)',
                cursor: 'pointer', fontFamily: 'inherit',
                transition: 'background .12s, color .12s',
                ...(activeFilter === f.key
                  ? { background: 'var(--db-forest)', color: '#fff', borderColor: 'var(--db-forest)' }
                  : { background: 'var(--db-bg-card)', color: 'var(--db-text-2)' }),
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
        <input
          type="search"
          placeholder="Cari nama agenda…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Cari agenda"
          style={{
            fontSize: '12px', padding: '5px 10px',
            borderRadius: '8px', border: '1px solid rgba(12,24,16,.12)',
            background: 'var(--db-bg-inset)', color: 'var(--db-text-1)',
            fontFamily: 'inherit', width: '180px', outline: 'none',
          }}
        />
      </div>

      {/* List */}
      <div style={{ padding: '0 16px' }} role="list" aria-label="Daftar agenda">
        {isLoading
          ? [1, 2, 3, 4].map((k) => <SkeletonRow key={k} />)
          : filtered.length > 0
            ? filtered.map((item) => {
                const catLabel = CAT_LABELS[item.badgeClass] ?? item.kategori ?? 'Agenda';
                return (
                  <div
                    key={item.id}
                    role="listitem"
                    style={{
                      display: 'flex', gap: '14px', alignItems: 'flex-start',
                      padding: '14px 0',
                      borderBottom: '1px solid rgba(12,24,16,.05)',
                    }}
                  >
                    <DateBox day={item.displayDay} month={item.displayMonth} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--db-text-1)', marginBottom: '4px', lineHeight: 1.3 }}>
                        {item.nama}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--db-text-3)', marginBottom: '6px' }}>
                        {[item.waktu, item.lokasi].filter(Boolean).join(' · ')}
                      </div>
                      {item.deskripsi && item.deskripsi !== '-' && (
                        <div style={{ fontSize: '11.5px', color: 'var(--db-text-4)', lineHeight: 1.5 }}>
                          {item.deskripsi}
                        </div>
                      )}
                    </div>
                    <CategoryBadge badgeClass={item.badgeClass} label={catLabel} />
                  </div>
                );
              })
            : (
              <div style={{ padding: '32px', textAlign: 'center', color: 'var(--db-text-4)', fontSize: '13px' }}>
                {searchQuery || activeFilter !== 'semua'
                  ? 'Tidak ada agenda sesuai filter.'
                  : 'Belum ada data agenda.'}
              </div>
            )}
      </div>

      {/* Footer */}
      <div
        style={{
          padding: '9px 16px',
          borderTop: '1px solid rgba(12,24,16,.06)',
          background: 'var(--db-bg-hover)',
          fontSize: '11.5px', color: 'var(--db-text-4)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px',
        }}
      >
        <span>
          Menampilkan{' '}
          <strong style={{ color: 'var(--db-text-2)' }}>{isLoading ? '…' : filtered.length}</strong>
          {' '}dari{' '}
          <strong style={{ color: 'var(--db-text-2)' }}>{isLoading ? '…' : agenda.length}</strong>
          {' '}agenda
        </span>
        <span style={{ fontStyle: 'italic' }}>Read-only · Edit agenda belum aktif</span>
      </div>
    </div>
  );
}
