import React from 'react';
import Container from '../common/Container.jsx';
import { incomeBreakdown, financeBreakdown } from '../../data/siteContent.js';

export default function FinanceBreakdown({ incomeItems = incomeBreakdown, expenseItems = financeBreakdown }) {
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
              Rincian persentase penerimaan infaq jamaah dan realisasi operasional dakwah periode 1–15 Agustus 2026.
            </p>
          </div>
        </div>

        <div className="finance-breakdown-grid">
          {/* Card 1: Sumber Kas Masuk */}
          <div className="breakdown-card breakdown-card--income">
            <div className="breakdown-card-head">
              <div>
                <span className="card-kicker text-forest">SUMBER PENERIMAAN (1–15 AGS)</span>
                <h3 className="card-title">Kas Masuk: Rp 4.300.000</h3>
              </div>
              <span className="card-badge card-badge--forest">3 Kategori Infaq</span>
            </div>

            <div className="breakdown-items-list">
              {incomeItems.map((item, idx) => (
                <div className="breakdown-row" key={idx}>
                  <div className="breakdown-row-meta">
                    <span className="breakdown-row-label">
                      <span className="breakdown-dot" style={{ background: item.color || '#0c2b1d' }}></span>
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
                      style={{ width: `${item.percent}%`, background: item.color || '#0c2b1d' }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="breakdown-card-footer">
              <div className="footer-highlight-pill">
                💡 <strong>Pilar Utama:</strong> Infaq Jumat jamaah menopang 74% dari total penerimaan kas masjid.
              </div>
            </div>
          </div>

          {/* Card 2: Penggunaan Kas Keluar */}
          <div className="breakdown-card breakdown-card--expense">
            <div className="breakdown-card-head">
              <div>
                <span className="card-kicker text-crimson">PENGGUNAAN DANA (1–15 AGS)</span>
                <h3 className="card-title">Kas Keluar: Rp 1.560.000</h3>
              </div>
              <span className="card-badge card-badge--crimson">Amanah &amp; Operasional</span>
            </div>

            <div className="breakdown-items-list">
              {expenseItems.map((item, idx) => (
                <div className="breakdown-row" key={idx}>
                  <div className="breakdown-row-meta">
                    <span className="breakdown-row-label">
                      <span className="breakdown-dot" style={{ background: idx === 0 ? '#9b2113' : '#b45309' }}></span>
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
                        background: idx === 0 ? '#9b2113' : '#b45309',
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="breakdown-card-footer">
              <div className="footer-highlight-pill">
                📖 <strong>Amanah Keumatan:</strong> Alokasi terbesar disalurkan untuk bisyaroh tahsin, khotib Jumat, dan ustadzah kajian.
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

