import React from 'react';
import Container from '../common/Container.jsx';

export default function FinanceSummary({ isLoading, summary }) {
  const endingBalance = summary?.endingBalance || 'Rp 14.850.208';
  const totalIn = summary?.totalIn || 'Rp 15.646.541';
  const totalOut = summary?.totalOut || 'Rp 17.110.000';
  const jpuEnding = summary?.jpu?.saldoAkhir || 'Rp 4.500.000';
  const totalLikuiditas = summary?.combined?.totalSaldoAkhir || 'Rp 19.350.208';
  const periodLabel = summary?.period || 'September 2026';

  const stats = [
    {
      id: 'saldo-akhir-masjid',
      label: 'KAS OPERASIONAL MASJID',
      value: endingBalance,
      sub: `Saldo Akhir per 30 Sep 2026`,
      badge: 'Terverifikasi DKM',
      badgeTone: 'gold',
      featured: true,
      icon: '🏛️',
    },
    {
      id: 'saldo-jpu',
      label: 'DANA SOSIAL (JPU)',
      value: jpuEnding,
      sub: 'Jumat Peduli Umat (30 Sep)',
      badge: 'Dana Sosial Umat',
      badgeTone: 'gold',
      featured: true,
      icon: '🤝',
    },
    {
      id: 'kas-masuk',
      label: 'KAS MASJID MASUK',
      value: totalIn,
      sub: '18 Transaksi (Infaq/Donatur/Rongsokan)',
      badge: '+Inflow',
      badgeTone: 'green',
      icon: '📥',
    },
    {
      id: 'kas-keluar',
      label: 'KAS MASJID KELUAR',
      value: totalOut,
      sub: '28 Transaksi (Bisyaroh/Renovasi/Bantuan)',
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
            <span className="fin-line" style={{ background: '#0c2b1d' }}></span> 4 INDIKATOR UTAMA
          </div>
          <h2 className="transparency-summary-heading">
            Ringkasan Likuiditas &amp; Aliran Dana ({periodLabel})
          </h2>
          <p className="transparency-summary-sub">
            Posisi saldo kas operasional masjid dan dana sosial JPU amanah jamaah.
            <br />
            <span style={{ display: 'inline-block', marginTop: '6px', padding: '4px 12px', background: 'rgba(12, 43, 29, 0.06)', borderRadius: '20px', fontWeight: 700, color: '#0c2b1d' }}>
              Total Likuiditas Amanah (Kas + JPU): <strong>{totalLikuiditas}</strong>
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


