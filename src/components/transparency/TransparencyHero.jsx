import Container from '../common/Container.jsx';

export default function TransparencyHero({ isLoading, summary }) {
  const period = summary?.period ?? 'Juni 2026';
  const updatedAt = summary?.updatedAt ?? '2 Juli 2026';

  return (
    <section className="transparency-hero" aria-labelledby="transparency-title">
      <Container size="xl" className="transparency-hero-grid">
        <div>
          <div className="transparency-hero-label">
            <span className="transparency-hero-line" aria-hidden="true"></span> RINGKASAN KAS MASJID
          </div>
          <h1 id="transparency-title">Laporan Kas Masjid Al Ikhlas</h1>
          <p className="transparency-hero-desc">
            Ringkasan penerimaan dan penggunaan dana masjid diperbarui secara berkala agar mudah diperiksa jamaah.
          </p>

          <div className="transparency-hero-actions">
            <a href="#ringkasan" className="transparency-hero-btn transparency-hero-btn-outline">
              Ringkasan Kas
            </a>
            <a href="#laporan" className="transparency-hero-btn transparency-hero-btn-outline">
              Laporan Bulanan
            </a>
            <a href="#donasi-transparansi" className="transparency-hero-btn transparency-hero-btn-gold">
              Kanal Donasi
            </a>
          </div>
        </div>
        <aside className="transparency-hero-card" aria-label="Status laporan">
          <span className="transparency-card-label">Periode</span>
          <strong className="transparency-card-value">{period}</strong>
          <span className="transparency-card-label">Terakhir Diperbarui</span>
          <span className="transparency-card-meta">{updatedAt}</span>
          <div className="transparency-card-badge" style={{ background: '#FFF3CD', color: '#856404', border: '1px solid #FFEEBA', fontWeight: 600 }}>
            {isLoading ? 'Memuat...' : 'Dalam verifikasi'}
          </div>
        </aside>
      </Container>
    </section>
  );
}

