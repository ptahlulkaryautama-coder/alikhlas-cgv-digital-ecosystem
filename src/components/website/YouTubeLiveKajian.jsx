import React, { useState } from 'react';
import Container from '../common/Container.jsx';
import {
  youtubeChannelInfo,
  currentLiveStream,
  upcomingLiveSchedule,
  recordedLecturesArchive,
} from '../../data/youtubeLiveData.js';
import '../../styles/youtubeLive.css';

export default function YouTubeLiveKajian() {
  const [activeTab, setActiveTab] = useState('live'); // 'live' | 'archive' | 'schedule'
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [activeVideo, setActiveVideo] = useState({
    videoId: currentLiveStream.videoId,
    title: currentLiveStream.title,
    speaker: currentLiveStream.speaker,
    isLive: true,
    category: 'Kajian Utama',
  });

  const handleSelectArchiveVideo = (video) => {
    setActiveVideo({
      videoId: video.videoId,
      title: video.title,
      speaker: video.speaker,
      isLive: false,
      category: video.category,
    });
    // Scroll player into view smoothly
    const playerEl = document.getElementById('yt-live-player-section');
    if (playerEl) {
      playerEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  return (
    <section className="yt-live-section" id="live-kajian" aria-labelledby="yt-live-heading">
      <Container>
        {/* ── Section Header ── */}
        <div className="yt-live-header animate-fade-in">
          <div className="yt-live-kicker">
            <span className="yt-live-dot" aria-hidden="true" />
            <span>SIARAN DAKWAH DIGITAL</span>
            <span className="kicker-sep">·</span>
            <span className="kicker-arabic">البث المباشر</span>
          </div>
          <h2 id="yt-live-heading" className="yt-live-title">
            Siaran dan Rekaman Kajian
          </h2>
          <p className="yt-live-subtitle">
            Simak kajian ilmu syar'i secara langsung dari Masjid Al Ikhlas Cipta Greenville, kapan saja dan di mana saja.
          </p>
        </div>

        {/* ── Main Player & Control Grid ── */}
        <div className="yt-live-grid" id="yt-live-player-section">
          {/* Left Column: Embedded YouTube Video Player */}
          <div className="yt-player-card">
            <div className="yt-player-wrapper">
              {isPlayingVideo ? (
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${activeVideo.videoId}?autoplay=1&rel=0`}
                  title={activeVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="yt-iframe"
                />
              ) : (
                <div
                  className="yt-facade-container"
                  onClick={() => setIsPlayingVideo(true)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setIsPlayingVideo(true);
                    }
                  }}
                  aria-label={`Putar video: ${activeVideo.title}`}
                >
                  <img
                    src={`https://img.youtube.com/vi/${activeVideo.videoId}/hqdefault.jpg`}
                    alt={activeVideo.title}
                    className="yt-facade-poster"
                  />
                  <div className="yt-facade-overlay">
                    <div className="yt-play-button" aria-hidden="true">
                      <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
                        <polygon points="5 3 19 12 5 21 5 3" />
                      </svg>
                    </div>
                    <span className="yt-facade-label">Klik untuk memutar siaran</span>
                  </div>
                </div>
              )}
            </div>

            {/* Video Info Bar */}
            <div className="yt-video-info">
              <div className="yt-info-top">
                <span className={`yt-status-badge ${activeVideo.isLive ? 'is-live' : 'is-recorded'}`}>
                  {activeVideo.isLive ? '🔴 LIVE STREAMING' : '📺 REKAMAN KAJIAN'}
                </span>
                <span className="yt-info-category">{activeVideo.category}</span>
              </div>

              <h3 className="yt-video-title">{activeVideo.title}</h3>

              <div className="yt-video-meta">
                <div className="yt-speaker">
                  <span className="yt-icon" aria-hidden="true">🎙️</span>
                  <span><strong>Pemateri:</strong> {activeVideo.speaker}</span>
                </div>
                {activeVideo.isLive && (
                  <div className="yt-viewers">
                    <span className="yt-icon" aria-hidden="true">👥</span>
                    <span>{currentLiveStream.currentViewers}</span>
                  </div>
                )}
              </div>

              <div className="yt-actions">
                <a
                  href={`https://www.youtube.com/watch?v=${activeVideo.videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="yt-btn yt-btn-gold"
                >
                  <span>📺 Buka di YouTube</span>
                  <span aria-hidden="true">↗</span>
                </a>
                <a
                  href={youtubeChannelInfo.channelUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="yt-btn yt-btn-outline"
                >
                  <span>🔔 Subscribe Channel DKM</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Tabbed Content & Secondary Info */}
          <div className="yt-sidebar-card">
            {/* Channel Info Strip */}
            <div className="yt-channel-banner">
              <div className="yt-channel-avatar">🕌</div>
              <div className="yt-channel-details">
                <h4 className="yt-channel-name">{youtubeChannelInfo.channelName}</h4>
                <div className="yt-channel-sub">{youtubeChannelInfo.subscribersText} · {youtubeChannelInfo.handle}</div>
              </div>
            </div>

            {/* Tabs */}
            <div className="yt-tabs-nav" role="tablist" aria-label="Navigasi Siaran Live">
              <button
                role="tab"
                aria-selected={activeTab === 'live'}
                className={`yt-tab-btn ${activeTab === 'live' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab('live');
                  setActiveVideo({
                    videoId: currentLiveStream.videoId,
                    title: currentLiveStream.title,
                    speaker: currentLiveStream.speaker,
                    isLive: true,
                    category: 'Kajian Utama',
                  });
                }}
              >
                🔴 Live Hari Ini
              </button>
              <button
                role="tab"
                aria-selected={activeTab === 'archive'}
                className={`yt-tab-btn ${activeTab === 'archive' ? 'active' : ''}`}
                onClick={() => setActiveTab('archive')}
              >
                📺 Rekaman
              </button>
              <button
                role="tab"
                aria-selected={activeTab === 'schedule'}
                className={`yt-tab-btn ${activeTab === 'schedule' ? 'active' : ''}`}
                onClick={() => setActiveTab('schedule')}
              >
                📅 Jadwal
              </button>
            </div>

            {/* Tab Content: Live Overview */}
            {activeTab === 'live' && (
              <div className="yt-tab-content animate-fade-in">
                <div className="yt-live-details-box">
                  <div className="yt-box-title">Informasi Kajian Berlangsung</div>
                  <p className="yt-box-desc">{currentLiveStream.description}</p>

                  <div className="yt-detail-row">
                    <span className="yt-detail-label">🕒 Jadwal:</span>
                    <span className="yt-detail-val">{currentLiveStream.schedule}</span>
                  </div>
                  <div className="yt-detail-row">
                    <span className="yt-detail-label">📍 Lokasi:</span>
                    <span className="yt-detail-val">{currentLiveStream.location}</span>
                  </div>
                </div>

                <div className="yt-notice-card">
                  <span className="yt-notice-icon">💬</span>
                  <div className="yt-notice-text">
                    <strong>Tanya Jawab Live:</strong> Jamaah yang mengikuti via YouTube dapat menyalurkan pertanyaan melalui fitur <em>Live Chat</em> YouTube.
                  </div>
                </div>
              </div>
            )}

            {/* Tab Content: Recorded Archive */}
            {activeTab === 'archive' && (
              <div className="yt-tab-content animate-fade-in">
                <div className="yt-archive-list">
                  {recordedLecturesArchive.map((rec) => (
                    <div
                      key={rec.id}
                      className={`yt-archive-item ${activeVideo.videoId === rec.videoId ? 'is-playing' : ''}`}
                      onClick={() => handleSelectArchiveVideo(rec)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          handleSelectArchiveVideo(rec);
                        }
                      }}
                    >
                      <div className="yt-archive-thumb">
                        <img
                          src={`https://img.youtube.com/vi/${rec.videoId}/hqdefault.jpg`}
                          alt=""
                        />
                        <span className="yt-duration">{rec.duration}</span>
                      </div>
                      <div className="yt-archive-meta">
                        <div className="yt-archive-title">{rec.title}</div>
                        <div className="yt-archive-sub">{rec.speaker}</div>
                        <div className="yt-archive-stats">
                          <span>{rec.date}</span> · <span>{rec.views}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab Content: Upcoming Schedule */}
            {activeTab === 'schedule' && (
              <div className="yt-tab-content animate-fade-in">
                <div className="yt-schedule-list">
                  {upcomingLiveSchedule.map((sched) => (
                    <div key={sched.id} className="yt-schedule-item">
                      <div className="yt-sched-tag">{sched.category}</div>
                      <div className="yt-sched-title">{sched.title}</div>
                      <div className="yt-sched-speaker">🎙️ {sched.speaker}</div>
                      <div className="yt-sched-time">📅 {sched.schedule}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
