/**
 * ProgramTable.jsx — Filterable read-only program listing table
 *
 * Props:
 *   programs  {object[]} — normalized programs from usePrograms
 *   isLoading {boolean}
 *
 * Features:
 *   - Pilar filter chips: Semua · Ilmu · Ibadah · Keluarga · Amanah
 *   - Text search by nama
 *   - No edit/delete/add actions (read-only)
 *   - Pilar and kategori badges
 *   - Row hover highlight
 */

import { useState } from 'react';

const PILAR_COLORS = {
  ilmu:     { bg: '#E8F5EE', text: '#1A7A50' },
  ibadah:   { bg: '#E0EEFF', text: '#2B6CB0' },
  keluarga: { bg: '#FDF4E3', text: '#8A6200' },
  amanah:   { bg: '#F0EAF8', text: '#6B46C1' },
};

function PilarBadge({ pilar }) {
  const key = (pilar ?? '').toLowerCase();
  const style = PILAR_COLORS[key] ?? { bg: '#F3F4F6', text: '#6B7280' };
  return (
    <span
      style={{
        display: 'inline-block',
        fontSize: '10.5px',
        fontWeight: 600,
        padding: '2px 8px',
        borderRadius: '99px',
        background: style.bg,
        color: style.text,
        whiteSpace: 'nowrap',
      }}
    >
      {pilar || '—'}
    </span>
  );
}

const FILTERS = ['Semua', 'Ilmu', 'Ibadah', 'Keluarga', 'Amanah'];

function SkeletonRow() {
  return (
    <tr>
      {[30, 45, 18, 14, 22, 16].map((w, i) => (
        <td key={i} style={{ padding: '10px 14px', borderBottom: '1px solid rgba(12,24,16,.04)' }}>
          <div style={{
            height: 12, width: `${w}%`, borderRadius: 4,
            background: 'rgba(12,24,16,.07)',
            animation: 'dbSkeletonPulse 1.4s ease-in-out infinite',
          }} />
        </td>
      ))}
    </tr>
  );
}

const HEADER_STYLE = {
  fontSize: '10px',
  fontWeight: 600,
  color: 'var(--db-text-4)',
  textTransform: 'uppercase',
  letterSpacing: '.07em',
  padding: '8px 14px',
  textAlign: 'left',
  borderBottom: '1px solid rgba(12,24,16,.07)',
  background: 'var(--db-bg-hover)',
  whiteSpace: 'nowrap',
};

export default function ProgramTable({ programs = [], isLoading = false }) {
  const [activeFilter, setActiveFilter] = useState('Semua');
  const [searchQuery, setSearchQuery]   = useState('');

  const filtered = programs.filter((p) => {
    const matchPilar = activeFilter === 'Semua' || (p.pilar ?? '').toLowerCase() === activeFilter.toLowerCase();
    const matchSearch = !searchQuery || (p.nama ?? '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchPilar && matchSearch;
  });

  return (
    <div className="db-card" style={{ marginBottom: '16px' }}>
      {/* Filter bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '14px 16px 10px',
          flexWrap: 'wrap',
          borderBottom: '1px solid rgba(12,24,16,.06)',
        }}
      >
        <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--db-text-4)', flexShrink: 0 }}>Pilar</span>
        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', flex: 1 }}>
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              style={{
                fontSize: '11.5px',
                fontWeight: 500,
                padding: '4px 12px',
                borderRadius: '99px',
                border: '1px solid rgba(12,24,16,.10)',
                cursor: 'pointer',
                transition: 'background .12s, color .12s',
                fontFamily: 'inherit',
                ...(activeFilter === f
                  ? { background: 'var(--db-forest)', color: '#fff', borderColor: 'var(--db-forest)' }
                  : { background: 'var(--db-bg-card)', color: 'var(--db-text-2)' }),
              }}
            >
              {f}
            </button>
          ))}
        </div>
        {/* Search */}
        <input
          type="search"
          placeholder="Cari nama program…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Cari program"
          style={{
            fontSize: '12px',
            padding: '5px 10px',
            borderRadius: '8px',
            border: '1px solid rgba(12,24,16,.12)',
            background: 'var(--db-bg-inset)',
            color: 'var(--db-text-1)',
            fontFamily: 'inherit',
            width: '180px',
            outline: 'none',
          }}
        />
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table
          style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px' }}
          aria-label="Daftar program kajian"
        >
          <thead>
            <tr>
              <th style={HEADER_STYLE}>Nama Program</th>
              <th style={HEADER_STYLE}>Kategori</th>
              <th style={HEADER_STYLE}>Pilar</th>
              <th style={HEADER_STYLE}>Hari</th>
              <th style={HEADER_STYLE}>Waktu</th>
              <th style={HEADER_STYLE}>Lokasi</th>
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? [1, 2, 3, 4, 5].map((k) => <SkeletonRow key={k} />)
              : filtered.length > 0
                ? filtered.map((prog) => (
                    <tr
                      key={prog.id}
                      style={{ transition: 'background .12s' }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--db-bg-hover)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = '')}
                    >
                      <td style={{ padding: '10px 14px', borderBottom: '1px solid rgba(12,24,16,.04)', fontWeight: 600, color: 'var(--db-text-1)', minWidth: 180 }}>
                        {prog.nama}
                      </td>
                      <td style={{ padding: '10px 14px', borderBottom: '1px solid rgba(12,24,16,.04)', color: 'var(--db-text-3)', fontSize: '12px' }}>
                        {prog.kategori}
                      </td>
                      <td style={{ padding: '10px 14px', borderBottom: '1px solid rgba(12,24,16,.04)' }}>
                        <PilarBadge pilar={prog.pilar} />
                      </td>
                      <td style={{ padding: '10px 14px', borderBottom: '1px solid rgba(12,24,16,.04)', color: 'var(--db-text-2)', whiteSpace: 'nowrap' }}>
                        {prog.hari || '—'}
                      </td>
                      <td style={{ padding: '10px 14px', borderBottom: '1px solid rgba(12,24,16,.04)', color: 'var(--db-text-2)', whiteSpace: 'nowrap' }}>
                        {prog.waktu || '—'}
                      </td>
                      <td style={{ padding: '10px 14px', borderBottom: '1px solid rgba(12,24,16,.04)', color: 'var(--db-text-3)', fontSize: '12px' }}>
                        {prog.lokasi || 'Masjid Al Ikhlas'}
                      </td>
                    </tr>
                  ))
                : (
                  <tr>
                    <td colSpan={6} style={{ padding: '32px', textAlign: 'center', color: 'var(--db-text-4)', fontSize: '13px' }}>
                      {searchQuery || activeFilter !== 'Semua'
                        ? 'Tidak ada program sesuai filter.'
                        : 'Belum ada data program.'}
                    </td>
                  </tr>
                )}
          </tbody>
        </table>
      </div>

      {/* Table footer */}
      <div
        style={{
          padding: '9px 16px',
          borderTop: '1px solid rgba(12,24,16,.06)',
          background: 'var(--db-bg-hover)',
          fontSize: '11.5px',
          color: 'var(--db-text-4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          flexWrap: 'wrap',
        }}
      >
        <span>
          Menampilkan{' '}
          <strong style={{ color: 'var(--db-text-2)' }}>{isLoading ? '…' : filtered.length}</strong>
          {' '}dari{' '}
          <strong style={{ color: 'var(--db-text-2)' }}>{isLoading ? '…' : programs.length}</strong>
          {' '}program
        </span>
        <span style={{ fontStyle: 'italic' }}>Read-only · Edit program belum aktif</span>
      </div>
    </div>
  );
}
