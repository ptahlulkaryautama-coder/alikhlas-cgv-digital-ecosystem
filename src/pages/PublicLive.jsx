import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/website/Header.jsx';
import Footer from '../components/website/Footer.jsx';
import Container from '../components/common/Container.jsx';
import YouTubeEmbed from '../components/website/YouTubeEmbed.jsx';
import {
  upcomingLiveStreams,
  endedLiveStreams,
} from '../data/liveStreamData.js';
import '../styles/home.css';
import '../styles/liveKajian.css';

export default function PublicLive() {
  // Live broadcast status is temporarily taken out as requested.
  const isLiveNow = false; 
  const featuredVideo = endedLiveStreams && endedLiveStreams.length > 0 ? endedLiveStreams[0] : null;

  return (
    <div className="home-page luxury-live-page">
      <Header />
      <main className="luxury-live-main">
        {/* ── 1. Luxury Hero Section ── */}
        <section className="luxury-live-hero" aria-labelledby="live-page-title">
          <div className="luxury-hero-bg-aura" aria-hidden="true" />
          <Container>
            <div className="luxury-hero-content">
              <div className="luxury-hero-kicker">
                <span className="luxury-kicker-badge">
                  <span className="luxury-kicker-dot" />
                  MEDIA &amp; DAKWAH DIGITAL
                </span>
                <span className="luxury-kicker-sep">·</span>
                <span className="luxury-kicker-arabic">البث المباشر والقناة الرقمية</span>
              </div>

              <h1 id="live-page-title" className="luxury-hero-title">
                Kanal Kajian &amp; Video Digital<br />
                <span className="luxury-hero-gold-text">Masjid Al Ikhlas CGV Batam</span>
              </h1>

              <p className="luxury-hero-subtitle">
                Menyimak rekaman kajian rutin, ceramah hikmah, dan video pembelajaran Islam dari mimbar utama Masjid Al Ikhlas Cipta Greenville Batam.
              </p>
            </div>
          </Container>
        </section>

        {/* ── 2. Main Cinema Video Section ── */}
        <section className="luxury-main-video-section">
          <Container>
            {/* Featured Video Showcase Card (16:9 ratio preservation) */}
            {featuredVideo && (
              <div className="luxury-video-card">
                <div className="luxury-video-badge-row">
                  <span className="luxury-chip-gold">
                    <span>📺 DAKWAH PILIHAN</span>
                  </span>
                  <span className="luxury-video-schedule">{featuredVideo.scheduleLabel}</span>
                </div>

                {/* 16:9 Aspect Ratio Cinema Player Frame */}
                <div className="luxury-player-frame">
                  <YouTubeEmbed
                    youtubeUrl={featuredVideo.youtubeUrl}
                    videoId={featuredVideo.videoId}
                    title={featuredVideo.title}
                    channelUrl={featuredVideo.channelUrl}
                    isLive={false}
                  />
                </div>

                {/* Video Meta & Actions */}
                <div className="luxury-video-meta">
                  <h2 className="luxury-video-title">{featuredVideo.title}</h2>
                  
                  {featuredVideo.speaker && (
                    <div className="luxury-video-speaker">
                      <span aria-hidden="true">🎙️</span>
                      <span><strong>Pemateri:</strong> {featuredVideo.speaker}</span>
                    </div>
                  )}

                  {featuredVideo.description && (
                    <p className="luxury-video-desc">{featuredVideo.description}</p>
                  )}

                  <div className="luxury-video-actions">
                    {featuredVideo.youtubeUrl && (
                      <a
                        href={featuredVideo.youtubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="luxury-btn-gold"
                      >
                        <span>Tonton di YouTube</span>
                        <span aria-hidden="true">↗</span>
                      </a>
                    )}
                    {featuredVideo.channelUrl && (
                      <a
                        href={featuredVideo.channelUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="luxury-btn-glass"
                      >
                        <span>Kanal YouTube DKM ↗</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ── 3. Upcoming Schedule Section ── */}
            {upcomingLiveStreams && upcomingLiveStreams.length > 0 && (
              <div className="luxury-schedule-section">
                <div className="luxury-section-header">
                  <div>
                    <span className="luxury-kicker-gold">JADWAL DA'WAH</span>
                    <h3>Kajian &amp; Kegiatan Mendatang</h3>
                  </div>
                  <Link to="/agenda" className="luxury-link-gold">
                    Lihat Seluruh Agenda →
                  </Link>
                </div>

                <div className="luxury-schedule-grid">
                  {upcomingLiveStreams.map((sched) => (
                    <div className="luxury-schedule-card" key={sched.id}>
                      <span className="luxury-tag-gold">📅 Mendatang</span>
                      <h4>{sched.title}</h4>
                      <div className="sched-meta-item">
                        <span aria-hidden="true">🎙️</span>
                        <span>{sched.speaker}</span>
                      </div>
                      <div className="sched-meta-item">
                        <span aria-hidden="true">🕒</span>
                        <span>{sched.scheduleLabel}</span>
                      </div>
                      {sched.description && <p className="sched-desc">{sched.description}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── 4. Video Archive Grid Section ── */}
            {endedLiveStreams && endedLiveStreams.length > 0 && (
              <div className="luxury-archive-section">
                <div className="luxury-section-header">
                  <div>
                    <span className="luxury-kicker-gold">ARSIP DAKWAH</span>
                    <h3>Rekaman Video Kajian</h3>
                  </div>
                  <a
                    href="https://www.youtube.com/@alikhlascgv"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="luxury-link-gold"
                  >
                    Buka YouTube DKM ↗
                  </a>
                </div>

                <div className="luxury-archive-grid">
                  {endedLiveStreams.map((rec) => (
                    <div className="luxury-archive-card" key={rec.id}>
                      <div className="luxury-archive-thumb-wrap">
                        <img
                          src={`https://img.youtube.com/vi/${rec.videoId}/hqdefault.jpg`}
                          alt={rec.title}
                          className="luxury-archive-thumb"
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                        <div className="luxury-play-overlay" aria-hidden="true">
                          <div className="luxury-play-btn">▶</div>
                        </div>
                        <span className="luxury-thumb-tag">📺 Rekaman</span>
                      </div>

                      <div className="luxury-archive-body">
                        <h4>{rec.title}</h4>
                        <div className="archive-speaker">🎙️ {rec.speaker}</div>
                        <div className="archive-date">🕒 {rec.scheduleLabel}</div>
                        {rec.youtubeUrl && (
                          <a
                            href={rec.youtubeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="luxury-card-link"
                          >
                            Tonton Video ↗
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Container>
        </section>
      </main>
      <Footer />
    </div>
  );
}
