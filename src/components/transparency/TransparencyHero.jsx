import Container from '../common/Container.jsx';

export default function TransparencyHero({ isLoading, summary }) {
  return (
    <section className="transparency-hero" aria-labelledby="transparency-title">
      <Container size="xl" className="transparency-hero-grid">
        <div>
          <p className="label">Transparansi & Amanah</p>
          <h1 id="transparency-title">Laporan amanah Masjid Al Ikhlas CGV.</h1>
          <p>
            Halaman ini menyajikan ringkasan keuangan publik yang mudah dibaca jamaah:
            pemasukan, penggunaan dana, saldo akhir, dan laporan bulanan tanpa membuka data
            pribadi donatur.
          </p>
        </div>
        <aside className="transparency-hero-card" aria-label="Status laporan">
          <span>Periode</span>
          <strong>{summary.period}</strong>
          <p>Terakhir diperbarui {summary.updatedAt}</p>
          <small>{isLoading ? 'Memuat data...' : summary.note}</small>
        </aside>
      </Container>
    </section>
  );
}
