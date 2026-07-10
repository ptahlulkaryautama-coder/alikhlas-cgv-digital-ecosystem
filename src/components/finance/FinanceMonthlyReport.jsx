/**
 * FinanceMonthlyReport.jsx — Monthly period report summary table
 *
 * Shows the list of monthly report periods from siteContent.js monthlyReports.
 * Read-only. No transaction details. No donor data.
 * Links to /transparansi for full public view.
 */

import { monthlyReports } from '../../data/siteContent.js';

const STATUS_STYLE = {
  'Draft publik':   { bg: 'var(--db-warn-bg)',  text: 'var(--db-warn-text)' },
  'Arsip internal': { bg: 'var(--db-info-bg)',  text: 'var(--db-info-text)' },
  'Diterbitkan':    { bg: 'var(--db-up-bg)',    text: 'var(--db-up-text)' },
};

function StatusBadge({ status }) {
  const style = STATUS_STYLE[status] ?? { bg: 'var(--db-bg-inset)', text: 'var(--db-text-4)' };
  return (
    <span
      style={{
        display: 'inline-block',
        fontSize: '10px',
        fontWeight: 600,
        padding: '2px 8px',
        borderRadius: '99px',
        background: style.bg,
        color: style.text,
        whiteSpace: 'nowrap',
      }}
    >
      {status}
    </span>
  );
}

export default function FinanceMonthlyReport() {
  return (
    <div className="db-card" style={{ marginBottom: '16px' }}>
      <div className="db-cp" style={{ paddingBottom: 0 }}>
        <div className="db-card-head">
          <div>
            <div className="db-card-title">Laporan Bulanan</div>
            <div className="db-card-sub">Arsip ringkasan kas per periode — tanpa data pribadi</div>
          </div>
          <a
            href="/transparansi"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              fontSize: '12px',
              fontWeight: 500,
              color: 'var(--db-emerald)',
              textDecoration: 'none',
              padding: '5px 10px',
              border: '1px solid rgba(12,24,16,.09)',
              borderRadius: '8px',
              background: 'var(--db-bg-card)',
              transition: 'border-color .15s',
              flexShrink: 0,
            }}
          >
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true">
              <path d="M2 9L9 2M9 2H4M9 2v5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Lihat Transparansi Publik
          </a>
        </div>
      </div>

      <table
        style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px' }}
        aria-label="Daftar laporan bulanan"
      >
        <thead>
          <tr>
            {['Periode', 'Judul', 'Ringkasan', 'Status'].map((h) => (
              <th
                key={h}
                style={{
                  fontSize: '10px',
                  fontWeight: 600,
                  color: 'var(--db-text-4)',
                  textTransform: 'uppercase',
                  letterSpacing: '.07em',
                  padding: '8px 16px',
                  textAlign: 'left',
                  borderBottom: '1px solid rgba(12,24,16,.07)',
                  background: 'var(--db-bg-hover)',
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {monthlyReports.map((report, i) => (
            <tr
              key={i}
              style={{ transition: 'background .12s' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--db-bg-hover)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '')}
            >
              <td style={{ padding: '10px 16px', borderBottom: '1px solid rgba(12,24,16,.04)', fontWeight: 600, color: 'var(--db-forest)', whiteSpace: 'nowrap' }}>
                {report.month}
              </td>
              <td style={{ padding: '10px 16px', borderBottom: '1px solid rgba(12,24,16,.04)', color: 'var(--db-text-1)' }}>
                {report.title}
              </td>
              <td style={{ padding: '10px 16px', borderBottom: '1px solid rgba(12,24,16,.04)', color: 'var(--db-text-3)', fontSize: '12px', lineHeight: 1.5 }}>
                {report.summary}
              </td>
              <td style={{ padding: '10px 16px', borderBottom: '1px solid rgba(12,24,16,.04)' }}>
                <StatusBadge status={report.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div
        style={{
          padding: '10px 16px',
          borderTop: '1px solid rgba(12,24,16,.06)',
          background: 'var(--db-bg-hover)',
          fontSize: '11.5px',
          color: 'var(--db-text-4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span>Menampilkan {monthlyReports.length} periode</span>
        <span style={{ fontStyle: 'italic' }}>Data tidak mengandung nama donatur atau catatan internal</span>
      </div>
    </div>
  );
}
