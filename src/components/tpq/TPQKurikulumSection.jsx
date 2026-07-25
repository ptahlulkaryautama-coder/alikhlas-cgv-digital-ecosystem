import React from 'react';
import { KURIKULUM_ROADMAP } from '../../data/tpqData.js';

export default function TPQKurikulumSection() {
  // Guard: if data is empty or missing, render informative fallback rather than an empty grid.
  if (!KURIKULUM_ROADMAP || KURIKULUM_ROADMAP.length === 0) {
    return (
      <div className="tpq-sec-wrapper">
        <div className="db-sec-eyebrow" style={{ marginBottom: '14px' }}>
          D. Fokus Pembelajaran &amp; Peta Jalan Kurikulum
        </div>
        <div
          style={{
            padding: '24px 20px',
            background: '#fdfcf9',
            border: '1px dashed rgba(12,43,29,0.18)',
            borderRadius: '12px',
            textAlign: 'center',
          }}
          role="status"
        >
          <div style={{ fontSize: '24px', marginBottom: '8px' }} aria-hidden="true">📋</div>
          <p style={{ fontSize: '13px', color: '#556b5e', margin: 0, fontWeight: 500 }}>
            Informasi kurikulum belum tersedia. Hubungi pengurus DKM untuk informasi lebih lanjut.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="tpq-sec-wrapper">
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '10px',
          marginBottom: '14px',
        }}
      >
        <div className="db-sec-eyebrow" style={{ margin: 0 }}>
          D. Fokus Pembelajaran &amp; Peta Jalan Kurikulum
        </div>
        {/* Source badge: curriculum structure from prototype, not an official DKM document */}
        <span
          style={{
            fontSize: '9.5px',
            fontWeight: 700,
            padding: '2px 8px',
            borderRadius: '4px',
            background: '#f0f0f0',
            color: '#555',
            border: '1px solid rgba(0,0,0,0.08)',
          }}
        >
          ℹ Informasi Umum
        </span>
      </div>

      <div className="tpq-roadmap-box">
        <div className="tpq-roadmap-grid">
          {KURIKULUM_ROADMAP.map((item) => (
            <div className="tpq-roadmap-item" key={item.name}>
              <div>
                <span className="tpq-roadmap-badge">{item.category}</span>
                <h4 className="tpq-roadmap-name">{item.name}</h4>
                {/* Guard: only render desc if present */}
                {item.desc && (
                  <p className="tpq-roadmap-desc">{item.desc}</p>
                )}
              </div>
              {/* Guard: only render target if present */}
              {item.target && (
                <div className="tpq-roadmap-target">
                  <span aria-hidden="true">🎯</span>{' '}
                  <strong>Target Capaian:</strong> {item.target}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
