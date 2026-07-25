import React from 'react';

export default function TPQDocumentsSection() {
  const requirementText = 'Membutuhkan autentikasi dan penyimpanan data yang aman.';

  const disabledActions = [
    { label: 'Lihat Raport', statusText: 'Belum Aktif' },
    { label: 'Upload Raport', statusText: 'Belum Aktif' },
    { label: 'Input Nilai', statusText: 'Belum Aktif' },
    { label: 'Absensi', statusText: 'Belum Aktif' },
    { label: 'Download Dokumen Santri', statusText: 'Belum Aktif' },
  ];

  return (
    <div className="tpq-sec-wrapper">
      <div className="db-sec-eyebrow" style={{ marginBottom: '14px' }}>
        G. Dokumen dan Raport
      </div>
      <div
        className="tpq-faq-card"
        style={{
          background: '#f8f6f0',
          border: '1px solid rgba(12, 43, 29, 0.12)',
          borderRadius: '14px',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '28px' }} aria-hidden="true">🔒</span>
          <div>
            <h4 className="tpq-faq-q" style={{ fontSize: '16px', margin: 0 }}>
              Dokumen dan Raport
            </h4>
            <p className="tpq-faq-a" style={{ fontSize: '13px', color: '#556b5e', margin: '4px 0 0 0' }}>
              Dokumen individual santri belum tersedia pada versi prototype. {requirementText}
            </p>
          </div>
        </div>

        {/* Disabled / Non-Interactive Actions with Correct ARIA Attributes */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', paddingTop: '12px', borderTop: '1px dashed rgba(12,43,29,0.1)' }}>
          {disabledActions.map((action) => (
            <button
              key={action.label}
              className="button button-outline"
              disabled
              aria-disabled="true"
              type="button"
              style={{
                opacity: 0.65,
                cursor: 'not-allowed',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '12px',
                fontWeight: 700,
                padding: '7px 14px',
                borderRadius: '6px',
                background: '#ffffff',
                color: '#3b5044',
                borderColor: 'rgba(12,43,29,0.15)',
                pointerEvents: 'none',
              }}
            >
              <span>{action.label}</span>
              <span style={{ fontSize: '9px', fontWeight: 800, padding: '1px 5px', borderRadius: '4px', background: '#fdf4e3', color: '#7a4b0a' }}>
                {action.statusText}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
