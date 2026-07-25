import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/website/Header.jsx';
import Footer from '../components/website/Footer.jsx';
import Container from '../components/common/Container.jsx';
import YouTubeEmbed from '../components/website/YouTubeEmbed.jsx';
import {
  currentLiveStream,
  upcomingLiveStreams,
  endedLiveStreams,
} from '../data/liveStreamData.js';
import '../styles/home.css';
import '../styles/liveKajian.css';

export default function PublicLive() {
  const stream = currentLiveStream;
  const isLiveNow = stream && stream.status === 'live' && stream.isPublic === true;
  const nextSchedule = upcomingLiveStreams && upcomingLiveStreams.length > 0 ? upcomingLiveStreams[0] : null;

  return (
    <div className="home-page">
      <Header />
      <main>
        {/* ── 1. Editorial Hero ── */}
        <section className="page-hero page-hero--live" aria-labelledby="live-page-title">
          <Container>
            <div className="page-hero-content animate-fade-in">
              <div className="page-hero-kicker">
                {isLiveNow ? (
                  <>
                    <span className="live-pulse-dot-hero" aria-hidden="true" />
                    <span>SIARAN LANGSUNG (LIVE)</span>
                  </>
                ) : (
                  <span>KANAL DAKWAH DIGITAL</span>
                )}
                <span className="kicker-sep" aria-hidden="true">·</span>
                <span className="kicker-arabic">البث المباشر</span>
              </div>

              <h1 id="live-page-title">Kajian Live &amp; Rekaman Video</h1>
              <p>
                Menyimak siaran langsung pengajian rutin dan rekaman video kajian dari mimbar utama Masjid Al Ikhlas Cipta Greenville Batam.
              </p>
            </div>
          </Container>
        </section>

        {/* ── Main Stream Container ── */}
        <section style={{ padding: '48px 0', background: 'var(--color-warm-bg, #f3efe6)' }}>
          <Container>
            {isLiveNow ? (
              /* ACTIVE LIVE STREAM LAYOUT */
              <div className="live-sec-card live-sec-card--active" style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <div style={{ padding: '24px 24px 0 24px' }}>
                  {/* 2. Live/status badge */}
                  <div className="live-info-badge-row" style={{ marginBottom: '16px' }}>
                    <span className="live-badge-red">
                      <span className="live-pulse-dot" aria-hidden="true" />
                      <span>LIVE KAJIAN</span>
                    </span>
                    <span className="live-info-schedule">{stream.scheduleLabel}</span>
                  </div>

                  {/* 3. Responsive 16:9 video player */}
                  <div style={{ borderRadius: '12px', overflow: 'hidden', marginBottom: '24px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}>
                    <YouTubeEmbed
                      youtubeUrl={stream.youtubeUrl}
                      videoId={stream.videoId}
                      title={stream.title}
                      channelUrl={stream.channelUrl}
                      isLive={true}
                      status="live"
                    />
                  </div>

                  {/* 4. Kajian title */}
                  <h2 className="live-info-title" style={{ fontSize: '26px', marginBottom: '12px' }}>
                    {stream.title}
                  </h2>

                  {/* 5. Speaker */}
                  {stream.speaker && (
                    <div className="live-info-speaker" style={{ fontSize: '15px', marginBottom: '10px' }}>
                      <span className="live-icon" aria-hidden="true">🎙️</span>
                      <span><strong>Pemateri:</strong> {stream.speaker}</span>
                    </div>
                  )}

                  {/* 6. Schedule */}
                  {stream.scheduleLabel && (
                    <div className="live-info-speaker" style={{ fontSize: '14px', marginBottom: '16px', color: '#556b5e' }}>
                      <span className="live-icon" aria-hidden="true">🕒</span>
                      <span><strong>Jadwal:</strong> {stream.scheduleLabel}</span>
                    </div>
                  )}

                  {/* 7. Description */}
                  {stream.description && (
                    <p className="live-info-desc" style={{ fontSize: '14px', lineHeight: 1.65, marginBottom: '24px' }}>
                      {stream.description}
                    </p>
                  )}

                  {/* 8. Direct YouTube link */}
                  <div className="live-info-actions" style={{ marginBottom: '24px' }}>
                    {stream.youtubeUrl && (
                      <a
                        href={stream.youtubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="button button-gold"
                      >
                        <span>Tonton di YouTube</span>
                        <span aria-hidden="true">↗</span>
                      </a>
                    )}
                    {stream.channelUrl && (
                      <a
                        href={stream.channelUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="button button-outline"
                      >
                        Subscribe Channel DKM ↗
                      </a>
                    )}
                  </div>

                  {/* 9. Related links */}
                  <div className="live-related-links" style={{ padding: '20px 0', borderTop: '1px solid rgba(12,43,29,0.1)' }}>
                    <span className="live-rel-label" style={{ fontWeight: 700, color: 'var(--color-forest)' }}>Tautan Terkait:</span>
                    <Link to="/program" className="button button-outline" style={{ padding: '6px 14px', fontSize: '12px' }}>
                      📚 Program Kajian
                    </Link>
                    <Link to="/agenda" className="button button-outline" style={{ padding: '6px 14px', fontSize: '12px' }}>
                      📅 Agenda Masjid
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              /* NO ACTIVE PUBLIC LIVE STREAM FALLBACK LAYOUT */
              <div className="live-sec-card" style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 28px', textAlign: 'center' }}>
                <div style={{ fontSize: '42px', marginBottom: '12px' }} aria-hidden="true">📡</div>
                <div className="live-badge-ended" style={{ display: 'inline-block', marginBottom: '16px' }}>
                  SIARAN NONAKTIF (OFF-AIR)
                </div>

                <h2 style={{ fontFamily: 'DM Serif Display, Georgia, serif', fontSize: '24px', color: 'var(--color-forest)', marginBottom: '12px' }}>
                  Belum ada siaran kajian yang sedang berlangsung.
                </h2>
                
                <p style={{ fontSize: '14px', color: '#4a5d52', maxWidth: '600px', margin: '0 auto 24px auto', lineHeight: 1.6 }}>
                  Siaran langsung kajian ilmu rutin diadakan sesuai jadwal pekanan. Anda dapat menyimak siaran mendatang atau membuka rekaman video kajian sebelumnya di kanal YouTube DKM.
                </p>

                {/* Show Next Schedule if available */}
                {nextSchedule && (
                  <div style={{ background: '#f7f5ef', border: '1px solid rgba(12,43,29,0.08)', borderRadius: '12px', padding: '20px', maxWidth: '640px', margin: '0 auto 28px auto', textAlign: 'left' }}>
                    <div style={{ fontSize: '11px', fontWeight: 800, color: '#8A6200', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
                      📅 JADWAL KAJIAN MENDATANG
                    </div>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: '#0c2b1d', marginBottom: '4px' }}>
                      {nextSchedule.title}
                    </div>
                    <div style={{ fontSize: '13px', color: '#3b5044', marginBottom: '4px' }}>
                      🎙️ <strong>Pemateri:</strong> {nextSchedule.speaker}
                    </div>
                    <div style={{ fontSize: '13px', color: '#556b5e' }}>
                      🕒 <strong>Jadwal:</strong> {nextSchedule.scheduleLabel}
                    </div>
                  </div>
                )}

                {/* YouTube Channel CTA & Related Links */}
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '24px' }}>
                  <a
                    href={stream?.channelUrl || 'https://www.youtube.com/@alikhlascgv'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="button button-gold"
                  >
                    <span>Buka Kanal YouTube</span>
                    <span aria-hidden="true">↗</span>
                  </a>
                  <Link to="/program" className="button button-outline">
                    Program Kajian
                  </Link>
                  <Link to="/agenda" className="button button-outline">
                    Agenda Masjid
                  </Link>
                </div>
              </div>
            )}

            {/* Rekaman Kajian Past Stream Cards */}
            {endedLiveStreams && endedLiveStreams.length > 0 && (
              <div style={{ maxWidth: '1000px', margin: '40px auto 0 auto' }}>
                <h3 style={{ fontFamily: 'DM Serif Display, Georgia, serif', fontSize: '20px', color: 'var(--color-forest)', marginBottom: '16px' }}>
                  Rekaman Kajian Terbaru
                </h3>

                <div className="live-archive-cards-grid">
                  {endedLiveStreams.map((rec) => (
                    <div className="live-archive-card" key={rec.id}>
                      <span className="archive-card-badge ended">📺 Rekaman</span>
                      <h4 className="archive-card-title">{rec.title}</h4>
                      <div className="archive-card-speaker">🎙️ {rec.speaker}</div>
                      <div className="archive-card-time">🕒 {rec.scheduleLabel}</div>
                      {rec.youtubeUrl && (
                        <a
                          href={rec.youtubeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ display: 'inline-block', marginTop: '10px', fontSize: '12px', fontWeight: 700, color: '#0c2b1d', textDecoration: 'none' }}
                        >
                          Tonton Rekaman ↗
                        </a>
                      )}
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
