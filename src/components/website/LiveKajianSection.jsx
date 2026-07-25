import React from 'react';
import { Link } from 'react-router-dom';
import Container from '../common/Container.jsx';
import YouTubeEmbed from './YouTubeEmbed.jsx';
import {
  currentLiveStream,
  upcomingLiveStreams,
  endedLiveStreams,
} from '../../data/liveStreamData.js';

export default function LiveKajianSection({ showArchiveList = true }) {
  const stream = currentLiveStream;
  const status = stream ? stream.status : 'inactive';

  return (
    <section className="live-kajian-section" id="live-kajian" aria-labelledby="live-section-heading">
      <Container>
        {/* Section Header */}
        <div className="live-sec-header">
          <div className="live-sec-kicker">
            <span className="live-kicker-dot" aria-hidden="true" />
            <span>SIARAN DAKWAH DIGITAL</span>
            <span className="kicker-sep" aria-hidden="true">·</span>
            <span className="kicker-arabic">البث المباشر</span>
          </div>
          <h2 id="live-section-heading" className="live-sec-title">
            Live Stream &amp; Rekaman Kajian
          </h2>
          <p className="live-sec-subtitle">
            Simak kajian Al-Qur'an dan sunnah secara langsung dari Masjid Al Ikhlas Cipta Greenville Batam.
          </p>
        </div>

        {/* ── STATE 1: LIVE ── */}
        {status === 'live' && (
          <div className="live-sec-card live-sec-card--active">
            <div className="live-sec-grid">
              {/* Video Player */}
              <div className="live-sec-player">
                <YouTubeEmbed
                  youtubeUrl={stream.youtubeUrl}
                  videoId={stream.videoId}
                  title={stream.title}
                  channelUrl={stream.channelUrl}
                  isLive={true}
                  status="live"
                />
              </div>

              {/* Info */}
              <div className="live-sec-info">
                <div className="live-info-badge-row">
                  <span className="live-badge-red">
                    <span className="live-pulse-dot" aria-hidden="true" />
                    <span>LIVE KAJIAN</span>
                  </span>
                  <span className="live-info-schedule">{stream.scheduleLabel}</span>
                </div>

                <h3 className="live-info-title">{stream.title}</h3>

                {stream.speaker && (
                  <div className="live-info-speaker">
                    <span className="live-icon" aria-hidden="true">🎙️</span>
                    <span><strong>Pemateri:</strong> {stream.speaker}</span>
                  </div>
                )}

                {stream.description && (
                  <p className="live-info-desc">{stream.description}</p>
                )}

                <div className="live-info-actions">
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
                  <Link to="/program" className="button button-outline">
                    Lihat Program Kajian
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── STATE 2: SCHEDULED ── */}
        {status === 'scheduled' && (
          <div className="live-sec-card live-sec-card--scheduled">
            <div className="live-scheduled-banner">
              <div className="live-sched-badge">📅 JADWAL MENDATANG</div>
              <h3 className="live-info-title" style={{ fontSize: '24px', marginBottom: '8px' }}>Kajian Berikutnya</h3>
              <h4 style={{ fontSize: '18px', fontWeight: 600, color: '#0c2b1d', margin: '0 0 12px 0' }}>{stream.title}</h4>
              
              {stream.speaker && (
                <div className="live-info-speaker" style={{ justifyContent: 'center', marginBottom: '8px' }}>
                  <span className="live-icon" aria-hidden="true">🎙️</span>
                  <span><strong>Pemateri:</strong> {stream.speaker}</span>
                </div>
              )}
              
              {stream.scheduleLabel && (
                <div className="live-sched-time" style={{ marginBottom: '16px' }}>
                  <span className="live-icon" aria-hidden="true">🕒</span>
                  <span><strong>Jadwal:</strong> {stream.scheduleLabel}</span>
                </div>
              )}

              {stream.description && (
                <p className="live-info-desc" style={{ maxWidth: '600px', margin: '0 auto 20px auto' }}>{stream.description}</p>
              )}

              <div className="live-info-actions" style={{ justifyContent: 'center' }}>
                <Link to="/agenda" className="button button-gold">
                  Lihat Agenda
                </Link>
                {stream.channelUrl && (
                  <a
                    href={stream.channelUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="button button-outline"
                  >
                    <span>Buka Kanal YouTube</span>
                    <span aria-hidden="true">↗</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── STATE 3: ENDED ── */}
        {status === 'ended' && (
          <div className="live-sec-card live-sec-card--ended">
            <div className="live-sec-grid">
              {stream.videoId && (
                <div className="live-sec-player">
                  <YouTubeEmbed
                    youtubeUrl={stream.youtubeUrl}
                    videoId={stream.videoId}
                    title={stream.title}
                    channelUrl={stream.channelUrl}
                    isLive={false}
                    status="ended"
                  />
                </div>
              )}

              <div className="live-sec-info">
                <div className="live-info-badge-row">
                  <span className="live-badge-ended">📺 REKAMAN KAJIAN</span>
                  <span className="live-info-schedule">{stream.scheduleLabel}</span>
                </div>

                <h3 className="live-info-title">Rekaman Kajian</h3>
                <h4 style={{ fontSize: '16px', fontWeight: 600, color: '#0c2b1d', margin: '0 0 8px 0' }}>{stream.title}</h4>

                {stream.speaker && (
                  <div className="live-info-speaker">
                    <span className="live-icon" aria-hidden="true">🎙️</span>
                    <span><strong>Pemateri:</strong> {stream.speaker}</span>
                  </div>
                )}

                {stream.description && (
                  <p className="live-info-desc">{stream.description}</p>
                )}

                <div className="live-info-actions">
                  {stream.youtubeUrl && (
                    <a
                      href={stream.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="button button-gold"
                    >
                      <span>Tonton Rekaman</span>
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
                      Buka Kanal YouTube
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── STATE 4: INACTIVE ── */}
        {status === 'inactive' && (
          <div className="live-sec-card live-sec-card--inactive">
            <div className="live-inactive-box">
              <div className="live-inactive-icon" aria-hidden="true">🕌</div>
              <div className="live-inactive-badge">KANAL YOUTUBE DKM</div>
              <h3 className="live-info-title">Kanal YouTube Masjid Al Ikhlas CGV</h3>
              <p className="live-info-desc">
                Simak rekaman video kajian rutin, dokumentasi kegiatan warga, dan siaran langsung dakwah melalui kanal resmi YouTube DKM Al Ikhlas Cipta Greenville.
              </p>
              <div className="live-info-actions" style={{ justifyContent: 'center' }}>
                {stream.channelUrl && (
                  <a
                    href={stream.channelUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="button button-gold"
                  >
                    <span>Buka Kanal YouTube</span>
                    <span aria-hidden="true">↗</span>
                  </a>
                )}
                <Link to="/program" className="button button-outline">
                  Lihat Program Kajian
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* ── Optional Archive / Upcoming Grid ── */}
        {showArchiveList && (
          <div className="live-archive-grid-section">
            <div className="live-archive-header">
              <h3>Jadwal &amp; Rekaman Kajian Lainnya</h3>
            </div>

            <div className="live-archive-cards-grid">
              {upcomingLiveStreams.map((sched) => (
                <div className="live-archive-card" key={sched.id}>
                  <span className="archive-card-badge sched">📅 Mendatang</span>
                  <h4 className="archive-card-title">{sched.title}</h4>
                  <div className="archive-card-speaker">🎙️ {sched.speaker}</div>
                  <div className="archive-card-time">🕒 {sched.scheduleLabel}</div>
                </div>
              ))}

              {endedLiveStreams.map((rec) => (
                <div className="live-archive-card" key={rec.id}>
                  <span className="archive-card-badge ended">📺 Rekaman</span>
                  <h4 className="archive-card-title">{rec.title}</h4>
                  <div className="archive-card-speaker">🎙️ {rec.speaker}</div>
                  <div className="archive-card-time">🕒 {rec.scheduleLabel}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}
