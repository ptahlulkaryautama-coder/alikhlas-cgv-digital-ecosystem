import { donationPrograms } from '../../data/siteContent.js';
import Button from '../common/Button.jsx';
import Container from '../common/Container.jsx';

export default function DonationSection() {
  return (
    <section id="donasi" className="donation-section" aria-labelledby="donation-title">
      <Container>
        <div className="section-kicker-block wide">
          <p className="label">Donasi & Amanah</p>
          <h2 id="donation-title" className="section-title">
            Dukung masjid yang sudah digunakan hari ini.
          </h2>
          <p className="section-copy">
            Fokus donasi bukan narasi pembangunan besar, tetapi kebutuhan nyata: operasional
            ibadah, pendidikan anak, kebersihan, fasilitas, dan layanan sosial warga.
          </p>
        </div>
        <div className="donation-grid">
          {donationPrograms.map((item) => (
            <article className="donation-card" key={item.title}>
              <span className="card-icon" aria-hidden="true">{item.title.slice(0, 1)}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <Button href="#kontak" variant="primary">Dukung</Button>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
