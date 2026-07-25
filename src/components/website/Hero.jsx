import heroDesktop from '../../assets/hero-desktop.png';
import heroTablet from '../../assets/hero-tablet.png';
import heroMobile from '../../assets/hero-mobile.png';
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
        src={heroDesktop}
        srcSet={`${heroMobile} 418w, ${heroTablet} 836w, ${heroDesktop} 1672w`}
        sizes="(max-width: 600px) 418px, (max-width: 1024px) 836px, 1672px"
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
          <p className="hero-location">Cipta Greenville · Tembesi · Batam</p>
          <h1 id="hero-title">
            <span>Masjid yang tumbuh dari</span>
            <span>keikhlasan dan</span>
            <span>kebersamaan warga.</span>
          </h1>
          <p className="hero-subtitle">
            Berawal dari sebuah unit townhouse di Cipta Greenville, Masjid Al Ikhlas kini 
            digunakan untuk shalat berjamaah, belajar mengaji, dan kegiatan warga.
          </p>
          <div className="hero-actions">
            <Button href="/agenda" variant="light">
              Lihat Kegiatan
            </Button>
            <Button href="/donasi" variant="outline-light">
              Dukung Masjid
            </Button>
          </div>


        </div>

        <aside className="hero-prayer-card" aria-label="Informasi waktu salat">
          <div className="prayer-card-glow prayer-card-glow-gold" aria-hidden="true" />
          <div className="prayer-card-glow prayer-card-glow-forest" aria-hidden="true" />
          <p className="prayer-label">Menuju Salat Berikutnya</p>
          <strong className="prayer-countdown">{countdown}</strong>
          <div className="prayer-next">
            <span aria-hidden="true" />
            <p>{statusText}</p>
          </div>
          <div className="prayer-highlight">
            <div>
              <p>Salat berikutnya</p>
              <span>{nextPrayerName}</span>
            </div>
            <strong>{nextPrayerTime}</strong>
          </div>
          <div className="prayer-times">
            {cards.map((card) => (
              <article key={card.name}>
                <span>{card.name}</span>
                <strong>{isPrayerLoading ? '--:--' : card.time}</strong>
              </article>
            ))}
          </div>
        </aside>
      </Container>
    </section>
  );
}
