/**
 * LatestReportSnapshot.jsx — Report snapshot for the main DKM dashboard
 */

import React from 'react';

const RECENT_REPORTS = [
  { id: 'DKM-2026-007', title: 'Laporan Kas & JPU Sep 2026 (Disahkan)', category: 'Keuangan Bulanan', status: 'Siap publik', date: '30 Sep 2026' },
  { id: 'DKM-2026-006', title: 'Laporan Kas Ags 2026 (Disahkan)', category: 'Keuangan Bulanan', status: 'Siap publik', date: '31 Ags 2026' },
  { id: 'DKM-2026-005', title: 'Laporan Kas Mei 2026', category: 'Keuangan Bulanan', status: 'Arsip internal', date: '25 Mei 2026' },
];

function getStatusBadge(status) {
  switch (status) {
    case 'Dalam peninjauan':
      return <span className="db-chip o" style={{ fontSize: '9px', padding: '1px 6px' }}>Peninjauan</span>;
    case 'Siap publik':
      return <span className="db-chip g" style={{ fontSize: '9px', padding: '1px 6px' }}>Publik</span>;
    case 'Arsip internal':
      return <span className="db-chip" style={{ fontSize: '9px', padding: '1px 6px', background: 'var(--db-info-bg)', color: 'var(--db-info-text)' }}>Internal</span>;
    default:
      return <span className="db-chip">{status}</span>;
  }
}

export default function LatestReportSnapshot() {
  return (
    <div className="db-card">
      <div className="db-card-head">
        <div>
          <div className="db-card-title">Dokumen &amp; Laporan Terbaru</div>
          <div className="db-card-sub">Arsip pertanggungjawaban DKM</div>
        </div>
        <a 
          href="/app/laporan"
          className="db-chip g"
          style={{ fontSize: '10px', padding: '3px 10px', textDecoration: 'none', fontWeight: 600 }}
        >
          Lihat Laporan →
        </a>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {RECENT_REPORTS.map((rpt) => (
          <div 
            key={rpt.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              padding: '10px 12px',
              background: 'var(--db-bg-hover)',
              borderRadius: '8px',
              border: '1px solid rgba(12,24,16,.05)',
            }}
          >
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--db-text-1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {rpt.title}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--db-text-3)', marginTop: '2px', display: 'flex', gap: '6px' }}>
                <span>{rpt.id}</span>
                <span>·</span>
                <span>{rpt.date}</span>
              </div>
            </div>
            {getStatusBadge(rpt.status)}
          </div>
        ))}
      </div>
    </div>
  );
}
