import React from 'react';
import Container from '../common/Container.jsx';

export default function FinanceSummary({ isLoading, summary }) {
  const endingBalance = summary?.endingBalance || 'Rp 21.126.130';
  const totalIn = summary?.totalIn || 'Rp 4.300.000';
  const totalOut = summary?.totalOut || 'Rp 1.560.000';
  const saldoAwal = summary?.saldoAwal || 'Rp 18.386.130';

  const stats = [
    {
      id: 'saldo-akhir',
      label: 'SALDO KAS AKHIR',
      value: endingBalance,
      sub: 'Per 15 Agustus 2026',
      badge: 'Terverifikasi DKM',
      badgeTone: 'gold',
      featured: true,
      icon: '🏛️',
    },
    {
      id: 'kas-masuk',
      label: 'TOTAL KAS MASUK',
      value: totalIn,
      sub: '5 Transaksi (1–15 Ags)',
      badge: '+Inflow',
      badgeTone: 'green',
      icon: '📥',
    },
    {
      id: 'kas-keluar',
      label: 'TOTAL KAS KELUAR',
      value: totalOut,
      sub: '7 Transaksi (1–15 Ags)',
      badge: '-Outflow',
      badgeTone: 'crimson',
      icon: '📤',
    },
    {
      id: 'saldo-awal',
      label: 'SALDO AWAL JULI',
      value: saldoAwal,
      sub: 'Penutupan 31 Juli 2026',
      badge: 'Kas Berjalan: 22,68 jt',
      badgeTone: 'neutral',
      icon: '📑',
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
            Laporan Kas Terverifikasi (1–15 Agustus 2026)
          </h2>
          <p className="transparency-summary-sub">
            Pencatatan kas resmi Masjid Al Ikhlas CGV disahkan oleh <strong>Ketua DKM, Sekretaris, dan Bendahara</strong>.
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
              <p>Setiap rupiah infaq dicatat di buku kas umum.</p>
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

