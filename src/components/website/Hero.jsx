import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import heroImage from '../../assets/masjid-al-ikhlas-remake.png';
import Button from '../common/Button.jsx';
import Container from '../common/Container.jsx';

const prayerCardLabels = ['Subuh', 'Dzuhur', 'Ashar', 'Maghrib', 'Isya'];

const PRAYER_ARABIC = {
  Subuh: 'الفجر',
  Dzuhur: 'الظهر',
  Ashar: 'العصر',
  Maghrib: 'المغرب',
  Isya: 'العشاء',
};

function PrayerIcon({ name, isNext }) {
  const strokeColor = isNext ? '#10b981' : 'currentColor';
  if (name === 'Subuh') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 2v6" />
        <path d="M4.93 10.93l4.24-4.24" />
        <path d="M2 18h20" />
        <path d="M20 18a8 8 0 1 0-16 0" />
      </svg>
    );
  }
  if (name === 'Dzuhur') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="5" />
        <line x1="12" y1="1" x2="12" y2="3" />
        <line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" />
        <line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
      </svg>
    );
  }
  if (name === 'Ashar') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2" />
        <path d="M12 20v2" />
        <path d="M2 12h2" />
        <path d="M20 12h2" />
        <path d="m19 19-3-3" />
      </svg>
    );
  }
  if (name === 'Maghrib') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 10V2" />
        <path d="m4.93 10.93 4.24-4.24" />
        <path d="M2 18h20" />
        <path d="M20 18a8 8 0 1 0-16 0" />
        <path d="M12 14v4" />
      </svg>
    );
  }
  // Isya
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  );
}

export default function Hero({
  isPrayerLoading,
  nextPrayer,
  prayerSource,
  prayerTimes,
  currentDate = new Date(),
}) {
  const isFallback = prayerSource === 'fallback';
  const countdown = isPrayerLoading ? 'Memuat...' : nextPrayer?.countdown ?? '--:--:--';
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

  // Date and Time formatting
  const timeFormatted = useMemo(() => {
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    const seconds = String(currentDate.getSeconds()).padStart(2, '0');
    return { hours, minutes, seconds };
  }, [currentDate]);

  const masehiDateStr = useMemo(() => {
    try {
      return new Intl.DateTimeFormat('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(currentDate);
    } catch {
      return 'Jumat, 16 Oktober 2026';
    }
  }, [currentDate]);

  const hijriDateStr = useMemo(() => {
    try {
      return new Intl.DateTimeFormat('id-ID-u-ca-islamic', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(currentDate);
    } catch {
      return '6 Jumadilawal 1448 H';
    }
  }, [currentDate]);

  return (
    <section className="home-hero" aria-labelledby="hero-title">
      {/* ── DESKTOP LUXURY VIEW (Screens > 768px) ── */}
      <div className="home-hero-desktop">
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
                Agenda &amp; Kajian
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
      </div>

      {/* ── MOBILE HIJRAH-APP VIEW (Screens <= 768px) ── */}
      <div className="home-hero-mobile">
        <Container className="hijrah-mobile-container">
          {/* Top Location Bar */}
          <div className="hijrah-top-bar">
            <div className="hijrah-location-chip">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>Cipta Greenville, Batam</span>
            </div>
            <div className="hijrah-top-actions">
              <Link to="/kontak" className="hijrah-icon-btn" title="Arah Kiblat &amp; Lokasi" aria-label="Arah Kiblat &amp; Lokasi">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" />
                  <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
                </svg>
              </Link>
              <Link to="/agenda" className="hijrah-icon-btn" title="Kalender Kegiatan" aria-label="Kalender Kegiatan">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </Link>
              <Link to="/login" className="hijrah-icon-btn" title="Pengaturan / Akses DKM" aria-label="Pengaturan / Akses DKM">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Main Hijrah Card */}
          <div className="hijrah-main-card">
            <div className="hijrah-card-top-row">
              <div className="hijrah-clock-block">
                <div className="hijrah-digital-clock">
                  <span className="hijrah-clock-time">{timeFormatted.hours}:{timeFormatted.minutes}</span>
                  <span className="hijrah-clock-sec">{timeFormatted.seconds}</span>
                </div>
                <div className="hijrah-masehi-date">{masehiDateStr}</div>
              </div>
              <div className="hijrah-hijri-badge">
                <span className="hijri-badge-text">{hijriDateStr}</span>
              </div>
            </div>

            <div className="hijrah-card-divider" />

            <div className="hijrah-next-row">
              <div className="hijrah-next-left">
                <div className="hijrah-next-icon">
                  <PrayerIcon name={nextPrayerName} isNext={true} />
                </div>
                <div>
                  <div className="hijrah-next-kicker">Sholat Berikutnya</div>
                  <strong className="hijrah-next-name">{nextPrayerName}</strong>
                </div>
              </div>
              <div className="hijrah-next-right">
                <span className="hijrah-next-time">{nextPrayerTime}</span>
                <span className="hijrah-countdown-pill">{countdown}</span>
              </div>
            </div>
          </div>

          {/* 4-Column Feature Shortcuts Grid */}
          <div className="hijrah-shortcuts-section">
            <div className="hijrah-section-title-sm">Pintasan Layanan Masjid</div>
            <div className="hijrah-shortcuts-grid">
              <a href="#jadwal-salat-mobile" className="hijrah-shortcut-item">
                <div className="hijrah-shortcut-icon-box">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2L15 6H9L12 2Z" />
                    <path d="M12 6V9" />
                    <path d="M4 22V11C4 8.5 7.5 7 12 7C16.5 7 20 8.5 20 11V22" />
                  </svg>
                </div>
                <span>Shalat</span>
              </a>

              <Link to="/agenda" className="hijrah-shortcut-item">
                <div className="hijrah-shortcut-icon-box">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </div>
                <span>Agenda</span>
              </Link>

              <Link to="/tpq" className="hijrah-shortcut-item">
                <div className="hijrah-shortcut-icon-box">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
                    <line x1="12" y1="6" x2="16" y2="6" />
                  </svg>
                </div>
                <span>TPQ</span>
              </Link>

              <Link to="/transparansi" className="hijrah-shortcut-item">
                <div className="hijrah-shortcut-icon-box">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <polyline points="9 12 11 14 15 10" />
                  </svg>
                </div>
                <span>Kas DKM</span>
              </Link>

              <Link to="/donasi" className="hijrah-shortcut-item is-gold">
                <div className="hijrah-shortcut-icon-box is-gold">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </div>
                <span>Infaq QRIS</span>
              </Link>

              <Link to="/program" className="hijrah-shortcut-item">
                <div className="hijrah-shortcut-icon-box">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                  </svg>
                </div>
                <span>Program</span>
              </Link>

              <Link to="/kabar" className="hijrah-shortcut-item">
                <div className="hijrah-shortcut-icon-box">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
                    <path d="M18 14h-8" />
                    <path d="M18 18h-8" />
                  </svg>
                </div>
                <span>Kabar</span>
              </Link>

              <Link to="/kontak" className="hijrah-shortcut-item">
                <div className="hijrah-shortcut-icon-box">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>
                <span>Kontak</span>
              </Link>
            </div>
          </div>

          {/* Clean Hijrah-Style Prayer Times List */}
          <div className="hijrah-schedule-section" id="jadwal-salat-mobile">
            <div className="hijrah-schedule-head">
              <div className="hijrah-section-title-sm">Jadwal Salat Hari Ini</div>
              <span className="hijrah-source-badge">Kemenag · Batam</span>
            </div>

            <div className="hijrah-prayer-list">
              {cards.map((card) => {
                const isCurrentNext = card.name?.toLowerCase() === nextPrayerName?.toLowerCase();
                const arabicName = PRAYER_ARABIC[card.name] || '';

                return (
                  <div
                    key={card.name}
                    className={`hijrah-prayer-row ${isCurrentNext ? 'is-active-prayer' : ''}`}
                  >
                    <div className="hijrah-prayer-left">
                      <div className={`hijrah-prayer-icon-wrap ${isCurrentNext ? 'is-active' : ''}`}>
                        <PrayerIcon name={card.name} isNext={isCurrentNext} />
                      </div>
                      <div className="hijrah-prayer-names">
                        <strong className="hijrah-prayer-name-lat">{card.name}</strong>
                        <span className="hijrah-prayer-name-ar">{arabicName}</span>
                      </div>
                    </div>

                    <div className="hijrah-prayer-right">
                      <span className="hijrah-prayer-time-val">
                        {isPrayerLoading ? '--:--' : card.time}
                      </span>
                      {isCurrentNext ? (
                        <span className="hijrah-prayer-active-pill">Berikutnya</span>
                      ) : (
                        <span className="hijrah-check-icon" aria-hidden="true">✓</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}
