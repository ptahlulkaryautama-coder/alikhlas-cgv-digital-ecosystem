import React from 'react';
import Container from '../common/Container.jsx';
import DonutChart from '../common/DonutChart.jsx';
import { incomeBreakdown, financeBreakdown, publicFinanceSummary } from '../../data/siteContent.js';

export default function FinanceBreakdown({
  incomeItems = incomeBreakdown,
  expenseItems = financeBreakdown,
  summary = publicFinanceSummary,
}) {
  const periodLabel = summary?.period ?? 'September 2026';
  const totalIn = summary?.combined?.totalMasuk ?? summary?.totalIn ?? 'Rp 22.046.541';
  const totalOut = summary?.combined?.totalKeluar ?? summary?.totalOut ?? 'Rp 23.710.000';

  return (
    <section className="finance-breakdown-section" id="alokasi-dana" aria-labelledby="breakdown-title">
      <Container>
        <div className="finance-breakdown-head">
          <div>
            <div className="transparency-hero-label" style={{ color: '#0c2b1d', marginBottom: '8px' }}>
              <span className="fin-line" style={{ background: '#0c2b1d' }}></span> ALOKASI &amp; SUMBER KAS
            </div>
            <h2 id="breakdown-title" className="finance-breakdown-heading">
              Komposisi Kas Masuk &amp; Realisasi Pengeluaran
            </h2>
            <p className="finance-breakdown-sub">
              Rincian persentase penerimaan infaq jamaah dan realisasi operasional dakwah periode {periodLabel}.
            </p>
          </div>
        </div>

        <div className="finance-breakdown-grid">
          {/* Card 1: Sumber Kas Masuk */}
          <div className="breakdown-card breakdown-card--income">
            <div className="breakdown-card-head">
              <div>
                <span className="card-kicker text-forest">SUMBER PENERIMAAN ({periodLabel.toUpperCase()})</span>
                <h3 className="card-title">Kas Masuk: {totalIn}</h3>
              </div>
              <span className="card-badge card-badge--forest">{incomeItems.length} Kategori Masuk</span>
            </div>

            {/* Donut Chart Presentation */}
            <div style={{ marginBottom: '24px', padding: '12px 0' }}>
              <DonutChart
                items={incomeItems}
                centerLabel="Total Masuk"
                centerValue={totalIn}
                size={180}
                strokeWidth={22}
                ariaLabel={`Diagram Donut Sumber Kas Masuk ${periodLabel}`}
              />
            </div>

            <div className="breakdown-items-list">
              {incomeItems.map((item, idx) => (
                <div className="breakdown-row" key={idx}>
                  <div className="breakdown-row-meta">
                    <span className="breakdown-row-label">
                      <span className="breakdown-dot" style={{ background: item.color || '#0f6130' }}></span>
                      {item.label}
                    </span>
                    <div className="breakdown-row-values">
                      <strong className="breakdown-row-amount">{item.amount}</strong>
                      <span className="breakdown-row-pct">({item.percent}%)</span>
                    </div>
                  </div>
                  <div className="breakdown-track">
                    <div
                      className="breakdown-fill breakdown-fill--forest"
                      style={{ width: `${item.percent}%`, background: item.color || '#0f6130' }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="breakdown-card-footer" style={{ marginTop: '24px' }}>
              <div className="footer-highlight-pill">
                💡 <strong>Pilar Utama:</strong> Infaq operasional donatur &amp; kotak infaq Jumat jamaah menopang porsi terbesar penerimaan kas masjid.
              </div>
            </div>
          </div>

          {/* Card 2: Penggunaan Kas Keluar */}
          <div className="breakdown-card breakdown-card--expense">
            <div className="breakdown-card-head">
              <div>
                <span className="card-kicker text-crimson">PENGGUNAAN DANA ({periodLabel.toUpperCase()})</span>
                <h3 className="card-title">Kas Keluar: {totalOut}</h3>
              </div>
              <span className="card-badge card-badge--crimson">{expenseItems.length} Pos Alokasi</span>
            </div>

            {/* Donut Chart Presentation */}
            <div style={{ marginBottom: '24px', padding: '12px 0' }}>
              <DonutChart
                items={expenseItems}
                centerLabel="Total Keluar"
                centerValue={totalOut}
                size={180}
                strokeWidth={22}
                ariaLabel={`Diagram Donut Realisasi Pengeluaran ${periodLabel}`}
              />
            </div>

            <div className="breakdown-items-list">
              {expenseItems.map((item, idx) => (
                <div className="breakdown-row" key={idx}>
                  <div className="breakdown-row-meta">
                    <span className="breakdown-row-label">
                      <span className="breakdown-dot" style={{ background: item.color || '#9b2113' }}></span>
                      {item.label}
                    </span>
                    <div className="breakdown-row-values">
                      <strong className="breakdown-row-amount text-crimson">{item.amount}</strong>
                      <span className="breakdown-row-pct">({item.percent}%)</span>
                    </div>
                  </div>
                  <div className="breakdown-track">
                    <div
                      className="breakdown-fill breakdown-fill--crimson"
                      style={{
                        width: `${item.percent}%`,
                        background: item.color || '#9b2113',
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="breakdown-card-footer" style={{ marginTop: '24px' }}>
              <div className="footer-highlight-pill">
                📖 <strong>Amanah Keumatan:</strong> Alokasi diprioritaskan untuk bisyaroh imam &amp; guru, bantuan sosial peduli umat, serta renovasi fasilitas teras mushola.
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
