import React from 'react';

export default function NewsNotice() {
  return (
    <div
      className="db-card"
      style={{
        border: '1px solid var(--db-gold-border)',
        background: 'var(--db-warn-bg)',
        color: 'var(--db-warn-text)',
        padding: '16px 20px',
        borderRadius: 'var(--db-r-lg)',
        marginBottom: '20px',
        display: 'flex',
        gap: '12px',
        alignItems: 'flex-start',
        boxShadow: 'var(--db-sh-sm)',
      }}
    >
      <span style={{ fontSize: '20px', lineHeight: 1 }}>⚠️</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '3px' }}>
          Modul Warta &amp; Kabar (Read-Only Prototype)
        </div>
        <div style={{ fontSize: '12px', opacity: 0.85, lineHeight: 1.5 }}>
          Daftar artikel yang tampil di website utama. Pada versi prototype ini, perubahan data hanya dapat dilakukan oleh Pengembang melalui berkas `newsData.js`. Fitur penambahan, penyuntingan, dan penghapusan artikel dinonaktifkan.
        </div>
      </div>
    </div>
  );
}
