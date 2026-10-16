/**
 * FinanceOverview.jsx — Finance section of the dashboard overview
 *
 * Shows:
 * - Monthly kas trend chart (pure CSS/SVG bars, no Chart.js dependency)
 * - Income source donut legend
 * - Budget realization progress bars
 *
 * Data: mock only — no real donor or transaction data.
 */

import { mockAnggaran, mockBulananChart, mockIncomeSources } from '../../data/dashboardMockData.js';

// Simple CSS bar chart — no external charting library required
function BarChart({ labels, masuk, keluar }) {
  const maxVal = Math.max(...masuk, ...keluar);

  return (
    <div
      className="db-bar-chart"
      role="img"
      aria-label="Grafik kas bulanan Jan–Jun 2026"
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: '6px',
        height: '180px',
        padding: '0 4px',
      }}
    >
      {labels.map((label, i) => {
        const masukH = Math.round((masuk[i] / maxVal) * 140);
        const keluarH = Math.round((keluar[i] / maxVal) * 140);
        const isCurrent = i === labels.length - 1;

        return (
          <div
            key={label}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '3px',
            }}
          >
            {/* Bars */}
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px' }}>
              <div
                style={{
                  width: '12px',
                  height: `${masukH}px`,
                  background: 'var(--db-emerald)',
                  borderRadius: '3px 3px 0 0',
                  opacity: isCurrent ? 1 : 0.55,
                  transition: 'height 0.5s ease',
                }}
                title={`Masuk: ${(masuk[i] / 1000000).toFixed(1)} jt`}
              />
              <div
                style={{
                  width: '12px',
                  height: `${keluarH}px`,
                  background: '#c0392b',
                  borderRadius: '3px 3px 0 0',
                  opacity: isCurrent ? 1 : 0.45,
                  transition: 'height 0.5s ease',
                }}
                title={`Keluar: ${(keluar[i] / 1000000).toFixed(1)} jt`}
              />
            </div>

            {/* Label */}
            <div
              style={{
                fontSize: '10px',
                color: isCurrent ? 'var(--color-forest)' : 'var(--db-text-4)',
                fontWeight: isCurrent ? 700 : 500,
                letterSpacing: '0.02em',
              }}
            >
              {label}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function FinanceOverview() {
  return (
    <>
      {/* ── Chart + Income Sources ── */}
      <div className="db-grid-2-1">
        {/* Bar chart */}
        <div className="db-card">
          <div className="db-cp">
            <div className="db-card-head">
              <div>
                <div className="db-card-title">Tren Kas Masuk vs Keluar</div>
                <div className="db-card-sub">Januari – September 2026 · dalam juta rupiah</div>
              </div>
              <div style={{ display: 'flex', gap: '5px' }}>
                <span className="db-chip g">↑ Masuk</span>
                <span className="db-chip r">↓ Keluar</span>
              </div>
            </div>
            <BarChart
              labels={mockBulananChart.labels}
              masuk={mockBulananChart.masuk}
              keluar={mockBulananChart.keluar}
            />
          </div>
        </div>

        {/* Income sources */}
        <div className="db-card">
          <div className="db-cp">
            <div className="db-card-head">
              <div>
                <div className="db-card-title">Sumber Kas Masuk</div>
                <div className="db-card-sub">Distribusi September 2026</div>
              </div>
            </div>

            {/* Simple donut representation via legend only */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 1fr)',
                gap: '3px',
                height: '8px',
                borderRadius: '6px',
                overflow: 'hidden',
                marginBottom: '4px',
              }}
              aria-hidden="true"
            >
              {mockIncomeSources.map((src) => (
                <div
                  key={src.label}
                  style={{
                    gridColumn: `span ${Math.max(1, Math.round(src.percent / 10))}`,
                    background: src.color,
                    borderRadius: '2px',
                  }}
                />
              ))}
            </div>

            <div className="db-dlegend">
              {mockIncomeSources.map((src) => (
                <div key={src.label} className="db-dl">
                  <span
                    className="db-dl-swatch"
                    style={{ background: src.color }}
                    aria-hidden="true"
                  />
                  {src.label}
                  <span className="db-dl-val">{src.amount}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Budget realization ── */}
      <div className="db-card db-cp" style={{ marginBottom: '14px' }}>
        <div className="db-card-head">
          <div>
            <div className="db-card-title">Distribusi Pengeluaran</div>
            <div className="db-card-sub">Persentase menunjukkan porsi pengeluaran per kategori dari total pengeluaran kas bulan ini (bukan pencapaian target anggaran).</div>
          </div>
          <span className="db-chip o">Juni 2026</span>
        </div>

        <div className="db-anggaran-list">
          {mockAnggaran.map((item) => (
            <div key={item.label} className="db-anggaran-row">
              <div className="db-anggaran-head">
                <span className="db-anggaran-label">{item.label}</span>
                <span className={`db-anggaran-pct${item.color === 'o' ? ' o' : ''}`}>
                  {item.pct}%
                </span>
              </div>
              <div className="db-pb-wrap">
                <div
                  className={`db-pb ${item.color}`}
                  style={{ width: `${item.pct}%` }}
                  role="progressbar"
                  aria-valuenow={item.pct}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${item.label}: ${item.pct}%`}
                />
              </div>
              <div className="db-anggaran-meta">{item.realisasi} / {item.target}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
