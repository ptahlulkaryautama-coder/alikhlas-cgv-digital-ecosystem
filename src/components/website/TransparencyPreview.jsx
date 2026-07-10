import { transparencyStats } from '../../data/siteContent.js';
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
            Setiap donasi, kebutuhan, dan aktivitas masjid ditampilkan sebagai ringkasan yang
            mudah dipahami jamaah.
          </p>
          <Button href="/transparansi" variant="outline">Buka Laporan Transparansi</Button>
        </div>
        <div className="transparency-card">
          <div className="summary-head">
            <p>Ringkasan Amanah</p>
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
            Ringkasan di atas adalah data sementara. Laporan lengkap dan resmi dapat diakses melalui halaman Transparansi.
          </p>
        </div>
      </Container>
    </section>
  );
}
