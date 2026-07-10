/**
 * FinanceCategoryBreakdown.jsx — Income and expense breakdown bars
 *
 * Two-column layout: Sumber Masuk | Penggunaan Keluar
 * Uses safe fallback data from siteContent.js when API ringkasan has no breakdown.
 *
 * Note: GAS 02_Keuangan ringkasan does not include per-category breakdown arrays.
 * This component always uses the static breakdown from siteContent.js as the
 * illustrative reference. A future phase can wire category aggregates when the
 * GAS endpoint exposes them.
 *
 * No donor names, private notes, or raw transaction data.
 */

import { financeBreakdown, incomeBreakdown } from '../../data/siteContent.js';

function BreakdownBar({ label, amount, percent, colorClass, maxAmount }) {
  const barPct = maxAmount > 0 ? Math.round((percent / 100) * 100) : percent;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', alignItems: 'baseline' }}>
        <span style={{ fontSize: '12.5px', fontWeight: 500, color: 'var(--db-text-1)' }}>{label}</span>
        <span
          style={{
            fontSize: '12.5px',
            fontWeight: 700,
            color: colorClass === 'g' ? 'var(--db-emerald)' : 'var(--db-down-text)',
          }}
        >
          {amount}
        </span>
      </div>
      <div className="db-pb-wrap">
        <div
          className={`db-pb ${colorClass}`}
          style={{ width: `${barPct}%` }}
          role="progressbar"
          aria-valuenow={barPct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${label}: ${percent}%`}
        />
      </div>
    </div>
  );
}

export default function FinanceCategoryBreakdown({ period = 'Mei 2026' }) {
  return (
    <div className="db-card db-cp" style={{ marginBottom: '16px' }}>
      <div className="db-card-head">
        <div>
          <div className="db-card-title">Rekap per Kategori · {period}</div>
          <div className="db-card-sub">Breakdown sumber dan penggunaan dana — data ilustratif</div>
        </div>
        {/* Always static note */}
        <span
          className="db-chip o"
          style={{ fontSize: '10px', fontWeight: 600, padding: '2px 8px', whiteSpace: 'nowrap', flexShrink: 0 }}
          title="Breakdown per kategori menggunakan data ilustratif. GAS ringkasan tidak menyertakan array per-kategori."
        >
          Ilustratif
        </span>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '28px',
        }}
      >
        {/* ── Income column ── */}
        <div>
          <div className="db-sec-eyebrow">Sumber Masuk</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '13px' }}>
            {incomeBreakdown.map((item) => (
              <BreakdownBar
                key={item.label}
                label={item.label}
                amount={item.amount}
                percent={item.percent}
                colorClass="g"
              />
            ))}
          </div>
        </div>

        {/* ── Expense column ── */}
        <div>
          <div className="db-sec-eyebrow">Penggunaan Keluar</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '13px' }}>
            {financeBreakdown.map((item) => (
              <BreakdownBar
                key={item.label}
                label={item.label}
                amount={item.amount}
                percent={item.percent}
                colorClass="r"
              />
            ))}
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: '16px',
          paddingTop: '14px',
          borderTop: '1px solid rgba(12,24,16,.06)',
          fontSize: '11px',
          color: 'var(--db-text-4)',
          lineHeight: 1.6,
        }}
      >
        Laporan KAS · Masjid Al Ikhlas Cipta Greenville · Bank Syariah Indonesia BSI · No. Rek 1500600069
      </div>
    </div>
  );
}
