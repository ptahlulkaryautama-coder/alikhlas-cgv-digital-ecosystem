import React, { useState } from 'react';

export default function TPQDocumentsSection() {
  const [activeAction, setActiveAction] = useState(null);
  const [actionNotice, setActionNotice] = useState(null);

  const actions = [
    { label: 'Lihat Raport', icon: '📄', statusText: 'Simulasi Aktif' },
    { label: 'Upload Raport', icon: '📤', statusText: 'Simulasi Aktif' },
    { label: 'Input Nilai', icon: '📝', statusText: 'Simulasi Aktif' },
    { label: 'Absensi', icon: '📋', statusText: 'Simulasi Aktif' },
    { label: 'Download Dokumen Santri', icon: '📥', statusText: 'Simulasi Aktif' },
  ];

  function handleTriggerAction(label) {
    setActiveAction(label);
    setActionNotice(`✨ Modul [${label}] Berhasil Dibuka Dalam Mode Simulasi Aktif!`);
    setTimeout(() => setActionNotice(null), 5000);
  }

  return (
    <div className="tpq-sec-wrapper">
      <div className="db-sec-eyebrow" style={{ marginBottom: '14px' }}>
        G. Dokumen dan Raport (Interaktif Aktif)
      </div>

      {actionNotice && (
        <div style={{
          background: 'linear-gradient(135deg, #0b3424, #17573a)',
          color: '#ffffff',
          padding: '14px 20px',
          borderRadius: '12px',
          fontSize: '13.5px',
          fontWeight: 700,
          marginBottom: '16px',
          boxShadow: '0 8px 24px rgba(11,52,36,0.25)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}>
          <span>{actionNotice}</span>
        </div>
      )}

      <div
        className="tpq-faq-card"
        style={{
          background: '#fffefa',
          border: '1px solid rgba(198, 161, 91, 0.3)',
          borderRadius: '16px',
          padding: '24px 28px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          boxShadow: '0 8px 32px rgba(8, 41, 28, 0.05)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <span style={{ fontSize: '32px' }} aria-hidden="true">📖</span>
          <div>
            <h4 className="tpq-faq-q" style={{ fontSize: '18px', fontWeight: 800, color: '#08291c', margin: 0 }}>
              Pengelolaan Dokumen &amp; Raport Santri
            </h4>
            <p className="tpq-faq-a" style={{ fontSize: '13px', color: '#556b5e', margin: '4px 0 0 0' }}>
              Seluruh fitur kelola dokumen dan raport telah aktif dalam mode simulasi interaktif. Klik tombol aksi di bawah untuk mencoba.
            </p>
          </div>
        </div>

        {/* Active Interactive Actions */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', paddingTop: '16px', borderTop: '1px dashed rgba(198,161,91,0.25)' }}>
          {actions.map((action) => {
            const isSelected = activeAction === action.label;
            return (
              <button
                key={action.label}
                className="button"
                onClick={() => handleTriggerAction(action.label)}
                type="button"
                style={{
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '13px',
                  fontWeight: 750,
                  padding: '10px 18px',
                  borderRadius: '10px',
                  background: isSelected ? 'linear-gradient(135deg, #0b3424, #17573a)' : '#ffffff',
                  color: isSelected ? '#ffffff' : '#08291c',
                  border: isSelected ? '1px solid #c6a15b' : '1px solid rgba(198,161,91,0.3)',
                  boxShadow: isSelected ? '0 4px 16px rgba(8,41,28,0.2)' : '0 2px 6px rgba(0,0,0,0.04)',
                  transition: 'all 0.18s ease',
                }}
              >
                <span aria-hidden="true">{action.icon}</span>
                <span>{action.label}</span>
                <span style={{
                  fontSize: '9.5px',
                  fontWeight: 800,
                  padding: '2px 6px',
                  borderRadius: '4px',
                  background: isSelected ? '#f0cf88' : '#e8f5ee',
                  color: isSelected ? '#08291c' : '#0f6130',
                }}>
                  {action.statusText}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

