import React from 'react';

export default function NewsActionButtons({ onCreate }) {
  return <div className="news-action-bar">
    <button className="news-create-button" type="button" onClick={onCreate}><span className="news-create-icon" aria-hidden="true">+</span><span><strong>Tulis artikel baru</strong><small>Mulai sebagai draft aman</small></span></button>
    <div className="news-workflow-hint"><span className="news-workflow-dot">1</span><span>Tulis & preview</span><i/><span className="news-workflow-dot">2</span><span>Ajukan review</span><i/><span className="news-workflow-dot">3</span><span>Persetujuan terpisah</span></div>
  </div>;
}
