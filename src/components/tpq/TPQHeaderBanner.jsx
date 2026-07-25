import React from 'react';
import { TPQ_PORTAL_INFO } from '../../data/tpqData.js';

export default function TPQHeaderBanner() {
  return (
    <div>
      {/* Arabic Bismillah Strip */}
      <div className="tpq-portal-bismillah" aria-label="Header Bismillah">
        <span className="tpq-bismillah-line" aria-hidden="true" />
        <div className="tpq-bismillah-arabic">
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </div>
        <span className="tpq-bismillah-line r" aria-hidden="true" />
      </div>

      {/* Top Banner */}
      <div className="db-top-banner" style={{ marginBottom: '24px' }}>
        <div className="db-banner-icon">📖</div>
        <div className="db-banner-content">
          <div className="db-banner-title">{TPQ_PORTAL_INFO.nama}</div>
          <div className="db-banner-sub">{TPQ_PORTAL_INFO.naungan} · {TPQ_PORTAL_INFO.skPengesahan}</div>
        </div>
      </div>
    </div>
  );
}
