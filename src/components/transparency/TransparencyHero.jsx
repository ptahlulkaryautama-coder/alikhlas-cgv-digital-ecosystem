import Container from '../common/Container.jsx';

export default function TransparencyHero({ isLoading, summary }) {
  const period = summary?.periodRange ? `${summary.period} (${summary.periodRange})` : (summary?.period ?? 'Agustus 2026');
  const updatedAt = summary?.updatedAt ?? '31 Agustus 2026';
  const status = summary?.status ?? 'Terverifikasi';
  const endingBalance = summary?.endingBalance ?? 'Rp 16.313.667';
  const jpuEnding = summary?.jpu?.saldoAkhir ?? 'Rp 4.700.000';
  const totalLikuiditas = summary?.combined?.totalSaldoAkhir ?? 'Rp 21.013.667';

  return (
    <section className="transparency-hero" aria-labelledby="transparency-title">
      <Container size="xl" className="transparency-hero-grid">
        <div>
          <div className="transparency-hero-label">
            <span className="transparency-hero-line" aria-hidden="true"></span> TRANSPARANSI &amp; AKUNTABILITAS DKM
          </div>
          <h1 id="transparency-title">Laporan Kas Masjid &amp; Dana Sosial</h1>
          <p className="transparency-hero-desc">
            Pencatatan kas resmi, mutasi infaq jamaah, dan dana sosial <strong>Jumat Peduli Umat (JPU)</strong> Masjid Al Ikhlas CGV disajikan secara terbuka, akuntabel, dan telah disahkan oleh <strong>Ketua DKM, Sekretaris, dan Bendahara</strong>.
          </p>

          <div className="transparency-hero-actions">
            <a href="#ringkasan" className="transparency-hero-btn transparency-hero-btn-outline">
              Ikhtisar Kas
            </a>
            <a href="#buku-kas-terbuka" className="transparency-hero-btn transparency-hero-btn-outline">
              Buku Kas Terbuka (70 Mutasi)
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
            <span className="transparency-card-label">TOTAL LIKUIDITAS AMANAH</span>
            <span className="transparency-card-badge" style={{ background: status === 'Terverifikasi' ? 'rgba(15, 97, 48, 0.25)' : 'rgba(201, 165, 90, 0.15)', color: status === 'Terverifikasi' ? '#5cdb8c' : '#c9a55a', border: status === 'Terverifikasi' ? '1px solid rgba(92, 219, 140, 0.4)' : '1px solid rgba(201, 165, 90, 0.3)', fontWeight: 700 }}>
              {isLoading ? 'Memuat...' : `✓ ${status} DKM`}
            </span>
          </div>
          <strong className="transparency-card-value">{isLoading ? 'Memuat...' : totalLikuiditas}</strong>
          <div style={{ display: 'flex', gap: '8px', marginTop: '4px', marginBottom: '14px', fontSize: '12px', flexWrap: 'wrap' }}>
            <span style={{ color: '#F3E3B6', background: 'rgba(201,165,90,0.15)', padding: '2px 8px', borderRadius: '4px' }}>
              Kas Masjid: <strong>{endingBalance}</strong>
            </span>
            <span style={{ color: '#67e8f9', background: 'rgba(6,182,212,0.15)', padding: '2px 8px', borderRadius: '4px' }}>
              Dana JPU: <strong>{jpuEnding}</strong>
            </span>
          </div>
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

