import React from 'react';
import Container from '../common/Container.jsx';

export default function FinanceSummary({ isLoading, summary }) {
  const endingBalance = summary?.endingBalance || 'Rp 16.313.667';
  const totalIn = summary?.totalIn || 'Rp 10.782.000';
  const totalOut = summary?.totalOut || 'Rp 12.854.463';
  const jpuEnding = summary?.jpu?.saldoAkhir || 'Rp 4.700.000';
  const totalLikuiditas = summary?.combined?.totalSaldoAkhir || 'Rp 21.013.667';

  const stats = [
    {
      id: 'saldo-akhir-masjid',
      label: 'KAS OPERASIONAL MASJID',
      value: endingBalance,
      sub: 'Saldo Akhir per 31 Ags 2026',
      badge: 'Terverifikasi DKM',
      badgeTone: 'gold',
      featured: true,
      icon: '🏛️',
    },
    {
      id: 'saldo-jpu',
      label: 'DANA SOSIAL (JPU)',
      value: jpuEnding,
      sub: 'Jumat Peduli Umat (31 Ags)',
      badge: 'Dana Sosial Umat',
      badgeTone: 'gold',
      featured: true,
      icon: '🤝',
    },
    {
      id: 'kas-masuk',
      label: 'KAS MASJID MASUK',
      value: totalIn,
      sub: '11 Transaksi (Infaq Jumat/Kajian)',
      badge: '+Inflow',
      badgeTone: 'green',
      icon: '📥',
    },
    {
      id: 'kas-keluar',
      label: 'KAS MASJID KELUAR',
      value: totalOut,
      sub: '27 Transaksi (Bisyaroh & PLN)',
      badge: '-Outflow',
      badgeTone: 'crimson',
      icon: '📤',
    },
  ];

  return (
    <section className="transparency-summary-section" aria-label="Ringkasan Utama Keuangan Kas Masjid">
      <Container>
        <div className="transparency-summary-header">
          <div className="transparency-hero-label" style={{ color: '#0c2b1d', justifyContent: 'center', marginBottom: '8px' }}>
            <span className="fin-line" style={{ background: '#0c2b1d' }}></span> IKHTISAR KAS RESMI
          </div>
          <h2 className="transparency-summary-heading">
            Laporan Kas &amp; Dana Sosial Terverifikasi (Agustus 2026)
          </h2>
          <p className="transparency-summary-sub">
            Pencatatan kas resmi Masjid Al Ikhlas CGV disahkan oleh <strong>Ketua DKM (Karya HP), Sekretaris (Zulhendy M), dan Bendahara (Bambang S)</strong>.
            <br />
            <span style={{ display: 'inline-block', marginTop: '6px', padding: '4px 12px', background: 'rgba(12, 43, 29, 0.06)', borderRadius: '20px', fontWeight: 700, color: '#0c2b1d' }}>
              Total Likuiditas Amanah (Kas Masjid + JPU): <strong>{totalLikuiditas}</strong>
            </span>
          </p>
        </div>

        <div className="finance-summary-grid">
          {stats.map((stat) => (
            <article
              className={`finance-stat-card ${stat.featured ? 'is-featured' : ''}`}
              key={stat.id}
            >
              <div className="stat-card-top">
                <p className="stat-label">{stat.label}</p>
                <span className={`stat-badge stat-badge--${stat.badgeTone}`}>{stat.badge}</span>
              </div>
              <strong className="stat-value">{isLoading ? 'Memuat...' : stat.value}</strong>
              <div className="stat-card-bottom">
                <span className="stat-icon">{stat.icon}</span>
                <span className="stat-sub">{stat.sub}</span>
              </div>
            </article>
          ))}
        </div>

        {/* Trust & Guarantee Banner */}
        <div className="transparency-trust-strip">
          <div className="trust-strip-item">
            <div className="trust-icon">✓</div>
            <div>
              <strong>100% Akuntabel</strong>
              <p>Setiap rupiah infaq &amp; donasi JPU dicatat terperinci.</p>
            </div>
          </div>
          <div className="trust-strip-divider"></div>
          <div className="trust-strip-item">
            <div className="trust-icon">✓</div>
            <div>
              <strong>Rekening BSI Resmi</strong>
              <p>No. Rek 1500600069 a.n. Masjid Al Ikhlas CGV.</p>
            </div>
          </div>
          <div className="trust-strip-divider"></div>
          <div className="trust-strip-item">
            <div className="trust-icon">✓</div>
            <div>
              <strong>Pengesahan 3 Pimpinan</strong>
              <p>Ketua DKM, Sekretaris &amp; Bendahara.</p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}


