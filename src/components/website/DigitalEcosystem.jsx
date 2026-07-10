import { ecosystemItems } from '../../data/siteContent.js';
import Container from '../common/Container.jsx';

export default function DigitalEcosystem() {
  return (
    <section id="portal" className="ecosystem-section" aria-labelledby="ecosystem-title">
      <Container>
        <div className="centered-heading">
          <p className="label">Digital Ecosystem</p>
          <h2 id="ecosystem-title" className="section-title">Satu masjid. Lima ruang digital.</h2>
          <p className="section-copy">
            Website publik, portal jamaah, portal transparansi, dashboard DKM, dan portal
            pendidikan saling terhubung dalam satu sistem.
          </p>
        </div>
        <div className="ecosystem-grid">
          {ecosystemItems.map((item) => (
            <article className="ecosystem-card" key={item.title}>
              <span className="card-icon" aria-hidden="true">{item.title.slice(0, 1)}</span>
              <strong>{item.title}</strong>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
