import React from 'react';

/**
 * Safely extracts and validates an 11-character YouTube video ID.
 */
export function parseYouTubeVideoId(input) {
  if (!input || typeof input !== 'string') return null;

  const trimmed = input.trim();

  // Direct 11-char ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  try {
    const urlString = trimmed.startsWith('http://') || trimmed.startsWith('https://')
      ? trimmed
      : `https://${trimmed}`;
    const url = new URL(urlString);

    // youtube.com/watch?v=...
    if (url.hostname.includes('youtube.com')) {
      if (url.searchParams.has('v')) {
        const v = url.searchParams.get('v');
        if (v && /^[a-zA-Z0-9_-]{11}$/.test(v)) return v;
      }

      // youtube.com/live/... or youtube.com/embed/...
      const pathSegments = url.pathname.split('/').filter(Boolean);
      if (pathSegments[0] === 'live' || pathSegments[0] === 'embed') {
        const id = pathSegments[1];
        if (id && /^[a-zA-Z0-9_-]{11}$/.test(id)) return id;
      }
    }

    // youtu.be/...
    if (url.hostname.includes('youtu.be')) {
      const id = url.pathname.slice(1);
      if (id && /^[a-zA-Z0-9_-]{11}$/.test(id)) return id;
    }
  } catch {
    // Regex fallback
    const match = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|live\/))([a-zA-Z0-9_-]{11})/);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

export default function YouTubeEmbed({
  youtubeUrl,
  videoId,
  title = 'Siaran Live Kajian Masjid Al Ikhlas',
  channelUrl,
  className = '',
}) {
  const validVideoId = parseYouTubeVideoId(youtubeUrl || videoId);

  if (!validVideoId) {
    return (
      <div className={`yt-embed-fallback-card ${className}`}>
        <div className="yt-fallback-icon" aria-hidden="true">🕌</div>
        <div className="yt-fallback-title">Siaran Video Belum Tersedia</div>
        <p className="yt-fallback-desc">
          Pemain siaran langsung belum memuat video aktif. Anda dapat menyimak siaran terbaru dan jadwal dakwah langsung melalui Channel YouTube DKM.
        </p>
        {channelUrl && (
          <a
            href={channelUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="yt-fallback-btn"
          >
            <span>Buka Channel YouTube DKM</span>
            <span aria-hidden="true">↗</span>
          </a>
        )}
      </div>
    );
  }

  return (
    <div className={`yt-embed-container ${className}`}>
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${validVideoId}?autoplay=0&rel=0`}
        title={title}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="yt-embed-iframe"
      />
    </div>
  );
}
