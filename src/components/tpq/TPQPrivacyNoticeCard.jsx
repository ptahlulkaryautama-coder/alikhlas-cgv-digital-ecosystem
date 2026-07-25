import React from 'react';

export default function TPQPrivacyNoticeCard() {
  return (
    <div className="tpq-privacy-notice" role="region" aria-label="Informasi Privasi & Status Fitur">
      <div className="tpq-notice-icon" aria-hidden="true">🔒</div>
      <div>
        <h4 className="tpq-notice-title">
          Pemberitahuan Privasi Data Santri &amp; Akses Portal
        </h4>
        <p className="tpq-notice-desc">
          <strong>Data santri belum ditampilkan pada versi prototype ini.</strong> Demi menjaga privasi anak-anak dan keluarga warga, portal ini hanya menyajikan ringkasan kelompok belajar, kurikulum, dan jadwal kegiatan yang dipublikasikan. Fitur portal wali santri (input raport &amp; presensi individu) akan disiapkan pada pengembangan selanjutnya saat infrastruktur data terenkripsi telah siap.
        </p>
      </div>
    </div>
  );
}
