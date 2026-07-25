import React from 'react';
import { Link } from 'react-router-dom';
import { currentLiveStream } from '../../data/liveStreamData.js';

export default function LiveKajianBanner() {
  const isLiveActive =
    currentLiveStream &&
    currentLiveStream.status === 'live' &&
    currentLiveStream.isPublic === true;

  if (!isLiveActive) {
    return null;
  }

  return (
    <div className="live-kajian-banner" role="banner" aria-label="Pengumuman Siaran Langsung">
      <div className="live-banner-container">
        <div className="live-banner-content">
          <div className="live-badge-wrap">
            <span className="live-pulse-dot" aria-hidden="true" />
            <span className="live-badge-label">Kajian sedang berlangsung</span>
          </div>

          <div className="live-banner-title">
            <strong>{currentLiveStream.title}</strong>
            {currentLiveStream.speaker && (
              <span className="live-banner-speaker"> · {currentLiveStream.speaker}</span>
            )}
          </div>
        </div>

        <Link to="/live" className="live-banner-cta">
          <span>Tonton Live</span>
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </div>
  );
}
