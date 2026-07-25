import React from 'react';

export default function NewsActionButtons() {
  return (
    <div className="news-action-bar">
      {/* Tulis artikel — belum aktif */}
      <button 
        className="news-btn-disabled" 
        disabled 
        aria-disabled="true"
        title="Fitur Penulisan Artikel baru akan tersedia di fase berikutnya."
      >
        <span>✍️</span> Tulis Artikel
        <span className="news-btn-disabled-kicker">belum aktif</span>
      </button>

      {/* Upload foto — belum aktif */}
      <button 
        className="news-btn-disabled" 
        disabled 
        aria-disabled="true"
        title="Fitur Upload Foto akan tersedia di fase berikutnya."
      >
        <span>📷</span> Upload Foto
        <span className="news-btn-disabled-kicker">belum aktif</span>
      </button>

      {/* Publish — belum aktif */}
      <button 
        className="news-btn-disabled" 
        disabled 
        aria-disabled="true"
        title="Fitur Publikasi langsung akan tersedia di fase berikutnya."
      >
        <span>🚀</span> Publish Artikel
        <span className="news-btn-disabled-kicker">belum aktif</span>
      </button>
    </div>
  );
}
