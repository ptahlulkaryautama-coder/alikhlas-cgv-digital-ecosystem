import Container from '../common/Container.jsx';

export default function TransparencyHero({ isLoading, summary }) {
  const period = summary?.periodRange ? `${summary.period} (${summary.periodRange})` : (summary?.period ?? 'Agustus 2026');
  const updatedAt = summary?.updatedAt ?? '15 Agustus 2026';
  const status = summary?.status ?? 'Terverifikasi';
  const endingBalance = summary?.endingBalance ?? 'Rp 21.126.130';

  return (
    <section className="transparency-hero" aria-labelledby="transparency-title">
      <Container size="xl" className="transparency-hero-grid">
        <div>
          <div className="transparency-hero-label">
            <span className="transparency-hero-line" aria-hidden="true"></span> TRANSPARANSI &amp; AKUNTABILITAS DKM
          </div>
          <h1 id="transparency-title">Laporan Kas Masjid Al Ikhlas</h1>
          <p className="transparency-hero-desc">
            Pencatatan kas resmi, mutasi infaq, dan pengeluaran operasional Masjid Al Ikhlas CGV disajikan secara terbuka, akuntabel, dan telah disahkan oleh <strong>Ketua DKM, Sekretaris, dan Bendahara</strong>.
          </p>

          <div className="transparency-hero-actions">
            <a href="#ringkasan" className="transparency-hero-btn transparency-hero-btn-outline">
              Ikhtisar Kas
            </a>
            <a href="#buku-kas-terbuka" className="transparency-hero-btn transparency-hero-btn-outline">
              Buku Kas Terbuka (13 Mutasi)
            </a>
            <a href="#alokasi-dana" className="transparency-hero-btn transparency-hero-btn-outline">
              Alokasi &amp; Grafik
            </a>
            <a href="#donasi-transparansi" className="transparency-hero-btn transparency-hero-btn-gold">
              Kanal Donasi (BSI &amp; QRIS)
            </a>
          </div>
        </div>
        <aside className="transparency-hero-card" aria-label="Status saldo laporan">
          <div className="hero-card-header">
            <span className="transparency-card-label">SALDO KAS SAAT INI</span>
            <span className="transparency-card-badge" style={{ background: status === 'Terverifikasi' ? 'rgba(15, 97, 48, 0.25)' : 'rgba(201, 165, 90, 0.15)', color: status === 'Terverifikasi' ? '#5cdb8c' : '#c9a55a', border: status === 'Terverifikasi' ? '1px solid rgba(92, 219, 140, 0.4)' : '1px solid rgba(201, 165, 90, 0.3)', fontWeight: 700 }}>
              {isLoading ? 'Memuat...' : `✓ ${status} DKM`}
            </span>
          </div>
          <strong className="transparency-card-value">{isLoading ? 'Memuat...' : endingBalance}</strong>
          <div className="hero-card-meta-list">
            <div className="hero-card-meta-item">
              <span>Periode Buku Kas:</span>
              <strong>{period}</strong>
            </div>
            <div className="hero-card-meta-item">
              <span>Rekening Operasional:</span>
              <strong>BSI 1500600069</strong>
            </div>
            <div className="hero-card-meta-item">
              <span>Terakhir Disahkan:</span>
              <span>{updatedAt}</span>
            </div>
          </div>
        </aside>
      </Container>
    </section>
  );
}

