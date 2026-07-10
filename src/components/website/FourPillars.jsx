import { pillars } from '../../data/siteContent.js';
import Container from '../common/Container.jsx';

export default function FourPillars() {
  return (
    <section className="pillars-section" aria-labelledby="pillars-title">
      <Container className="pillars-grid">
        <div className="section-kicker-block">
          <p className="label">Empat Pilar Al Ikhlas <span>أركان أربعة</span></p>
          <h2 id="pillars-title" className="section-title">
            Bukan bangunan megah. Ekosistem yang hidup.
          </h2>
          <p className="section-copy">
            Kekuatan Masjid Al Ikhlas bukan dari bentuk arsitektur besar, tetapi dari ritme
            ibadah, ilmu, keluarga, dan amanah yang berjalan setiap hari.
          </p>
        </div>
        <div className="pillar-cards">
          {pillars.map((pillar) => (
            <article className="pillar-card" key={pillar.title}>
              <span className="card-icon" aria-hidden="true">{pillar.title.slice(0, 1)}</span>
              <h3>{pillar.title}</h3>
              <p className="arabic-text">{pillar.arabic}</p>
              <p>{pillar.description}</p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
