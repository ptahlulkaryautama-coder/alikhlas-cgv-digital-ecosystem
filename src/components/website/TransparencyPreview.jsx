import { transparencyStats, publicFinanceSummary } from '../../data/siteContent.js';
import Button from '../common/Button.jsx';
import Container from '../common/Container.jsx';

export default function TransparencyPreview() {
  return (
    <section id="transparansi" className="transparency-section" aria-labelledby="trust-title">
      <Container className="transparency-grid">
        <div className="section-kicker-block">
          <p className="label">Transparansi</p>
          <h2 id="trust-title" className="section-title">Amanah yang bisa dilihat.</h2>
          <p className="section-copy">
            Setiap infaq dan pengeluaran masjid dicatat terbuka dan disajikan secara ringkas untuk warga.
          </p>
          <Button href="/transparansi" variant="outline">Buka Laporan Transparansi</Button>
        </div>
        <div className="transparency-card">
          <div className="summary-head">
            <p>Ringkasan Amanah · {publicFinanceSummary.period}</p>
            <span>Update Bulanan</span>
          </div>
          <div className="summary-grid">
            {transparencyStats.map((stat) => (
              <article key={stat.label}>
                <p>{stat.label}</p>
                <strong>{stat.value}</strong>
              </article>
            ))}
          </div>
          <div className="allocation">
            <div>
              <span>Alokasi dana bulan ini</span>
              <span>59% terpakai</span>
            </div>
            <i><b /></i>
          </div>
          <p className="summary-note">
            Catatan di atas adalah ringkasan berjalan bulan ini. Buka halaman Transparansi untuk melihat rincian lengkapnya.
          </p>
        </div>
      </Container>
    </section>
  );
}
