import heroUrl from '../../assets/al-ikhlas-townhouse-hero.png';
import storyMalamUrl from '../../assets/cerita-kajian-malam.jpg';
import storyRutinUrl from '../../assets/cerita-kajian-rutin.jpg';
import { stories } from '../../data/siteContent.js';
import Container from '../common/Container.jsx';

const imageMap = {
  hero: heroUrl,
  storyKajianMalam: storyMalamUrl,
  storyKajianRutin: storyRutinUrl,
};

export default function CeritaKajian() {
  return (
    <section id="cerita" className="stories-section" aria-labelledby="stories-title">
      <Container>
        <div className="section-kicker-block wide">
          <p className="label">Cerita Jamaah</p>
          <h2 id="stories-title" className="section-title">
            Masjid tumbuh dari wajah-wajah yang menghidupkannya.
          </h2>
        </div>
        <div className="stories-grid">
          {stories.map((story) => (
            <article className="story-card" key={story.title}>
              <img src={imageMap[story.imageKey]} alt={story.alt} loading="lazy" />
              <div>
                {story.label ? <p className="story-label">{story.label}</p> : null}
                <h3>{story.title}</h3>
                <p>{story.description}</p>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
