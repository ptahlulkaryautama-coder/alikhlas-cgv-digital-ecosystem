import { pillars } from '../../data/siteContent.js';
import Container from '../common/Container.jsx';

const pillarIcons = {
  Ibadah: (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 20h18" />
      <path d="M12 2v3" />
      <path d="M12 5a7 7 0 0 0-7 7v8h14v-8a7 7 0 0 0-7-7z" />
      <path d="M9 20v-4a3 3 0 0 1 6 0v4" />
    </svg>
  ),
  Ilmu: (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  ),
  Keluarga: (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  Amanah: (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 11 2 2 4-4" />
    </svg>
  ),
};

export default function FourPillars() {
  return (
    <section className="pillars-section" aria-labelledby="pillars-title">
      <Container className="pillars-grid">
        <div className="section-kicker-block">
          <p className="label">Empat Pilar Al Ikhlas <span>أركان أربعة</span></p>
          <h2 id="pillars-title" className="section-title">
            Ibadah yang terjaga, ilmu yang dipelajari, keluarga yang terlibat, dan amanah yang dikelola secara terbuka.
          </h2>
          <p className="section-copy">
            Berdiri di unit townhouse Cipta Greenville, kekuatan Masjid Al Ikhlas ada pada shalat 
            berjamaah, TPQ anak-anak, kegiatan keluarga, serta pengelolaan kas yang terbuka.
          </p>
        </div>
        <div className="pillar-cards">
          {pillars.map((pillar) => (
            <article className={`pillar-card pillar-card-${pillar.title.toLowerCase()}`} key={pillar.title}>
              <span className="card-icon" aria-hidden="true">
                {pillarIcons[pillar.title] || pillar.title.slice(0, 1)}
              </span>
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
