import heroImage from '../../assets/masjid-al-ikhlas-remake.png';
import Button from '../common/Button.jsx';
import Container from '../common/Container.jsx';

const prayerCardLabels = ['Subuh', 'Dzuhur', 'Ashar', 'Maghrib', 'Isya'];

export default function Hero({ isPrayerLoading, nextPrayer, prayerSource, prayerTimes }) {
  const isFallback = prayerSource === 'fallback';
  const countdown = isPrayerLoading ? 'Memuat jadwal...' : nextPrayer?.countdown ?? '--:--:--';
  const nextPrayerName = isPrayerLoading ? '--' : nextPrayer?.name ?? '--';
  const nextPrayerTime = isPrayerLoading ? '--:--' : nextPrayer?.time ?? '--:--';
  const statusText = isPrayerLoading
    ? 'Memuat jadwal...'
    : isFallback
      ? 'Waktu salat Batam (Referensi)'
      : 'Waktu salat Batam';
  const cards = prayerTimes?.length
    ? prayerTimes
    : prayerCardLabels.map((name) => ({ name, time: '--:--' }));

  return (
    <section className="home-hero" aria-labelledby="hero-title">
      <img
        className="home-hero-image"
        src={heroImage}
        width="1672"
        height="941"
        alt="Masjid Al Ikhlas Cipta Greenville Batam saat suasana sunset"
        loading="eager"
        fetchPriority="high"
        decoding="async"
      />
      <div className="home-hero-shade" aria-hidden="true" />
      <div className="home-hero-top-fade" aria-hidden="true" />
      <div className="home-hero-bottom-fade" aria-hidden="true" />

      <Container size="xl" className="home-hero-content">
        <div className="home-hero-copy">
          <div className="hero-badge-row">
            <span className="hero-location-badge">Cipta Greenville · Batam</span>
          </div>

          <h1 id="hero-title">
            <span>Masjid yang</span>
            <span className="hero-title-highlight">dihidupkan dari</span>
            <span>keikhlasan umat.</span>
          </h1>

          <p className="hero-subtitle">
            Pusat ibadah, tempat pembinaan santri TPQ Al-Mardhotillah, ruang kebersamaan warga,
            serta transparansi amanah sosial di Cipta Greenville Batam.
          </p>

          <div className="hero-actions">
            <Button href="/agenda" variant="gold" className="hero-cta-main">
              Agenda & Kajian
            </Button>
            <Button href="/tpq" variant="outline-light" className="hero-cta-secondary">
              Portal TPQ
            </Button>
          </div>
        </div>

        <aside className="hero-prayer-card" aria-label="Informasi waktu salat">
          <div className="prayer-card-glow prayer-card-glow-gold" aria-hidden="true" />
          <div className="prayer-card-glow prayer-card-glow-forest" aria-hidden="true" />
          
          <div className="prayer-card-header">
            <p className="prayer-label">Menuju Salat Berikutnya</p>
            <strong className="prayer-countdown">{countdown}</strong>
          </div>

          <div className="prayer-next">
            <span className="prayer-pulse-indicator" aria-hidden="true" />
            <p>{statusText}</p>
          </div>

          <div className="prayer-highlight">
            <div>
              <p>Salat berikutnya</p>
              <span className="next-prayer-name">{nextPrayerName}</span>
            </div>
            <strong className="next-prayer-time">{nextPrayerTime}</strong>
          </div>

          <div className="prayer-times">
            {cards.map((card) => {
              const isCurrentNext = card.name?.toLowerCase() === nextPrayerName?.toLowerCase();
              return (
                <article key={card.name} className={`prayer-item ${isCurrentNext ? 'is-next' : ''}`}>
                  <span className="prayer-item-name">{card.name}</span>
                  <strong className="prayer-item-time">{isPrayerLoading ? '--:--' : card.time}</strong>
                </article>
              );
            })}
          </div>
        </aside>
      </Container>
    </section>
  );
}
