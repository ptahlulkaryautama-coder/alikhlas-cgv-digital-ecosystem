import React from 'react';

export default function TPQFutureModulesSection() {
  const futureModules = [
    {
      id: 'fm1',
      icon: '📁',
      title: 'Data Santri',
      statusLabel: 'Belum aktif',
      desc: 'Pengelolaan data induk santri, identitas wali, dan dokumen administrasi terenkripsi.',
      requirement: 'Membutuhkan autentikasi dan penyimpanan data yang aman.',
    },
    {
      id: 'fm2',
      icon: '📋',
      title: 'Absensi',
      statusLabel: 'Belum aktif',
      desc: 'Jurnal presensi harian per kelas dan notifikasi kehadiran otomatis ke WhatsApp wali santri.',
      requirement: 'Membutuhkan autentikasi dan penyimpanan data yang aman.',
    },
    {
      id: 'fm3',
      icon: '⭐',
      title: 'Evaluasi',
      statusLabel: 'Belum aktif',
      desc: 'Pencatatan setoran hafalan Juz Amma, kelancaran bacaan tajwid, dan jurnal murojaah.',
      requirement: 'Membutuhkan autentikasi dan penyimpanan data yang aman.',
    },
    {
      id: 'fm4',
      icon: '📊',
      title: 'Raport',
      statusLabel: 'Belum aktif',
      desc: 'Penginputan nilai semester, pencetakan raport digital, dan buku penghubung wali santri.',
      requirement: 'Membutuhkan autentikasi dan penyimpanan data yang aman.',
    },
    {
      id: 'fm5',
      icon: '💼',
      title: 'Administrasi',
      statusLabel: 'Belum aktif',
      desc: 'Pembukuan donasi pendidikan, penyaluran beasiswa santri, dan insentif pengajar TPQ.',
      requirement: 'Membutuhkan autentikasi dan penyimpanan data yang aman.',
    },
  ];

  return (
    <div className="tpq-sec-wrapper">
      <div className="db-sec-eyebrow" style={{ marginBottom: '14px' }}>
        H. Rencana Fitur Terproteksi (Future Roadmap)
      </div>
      <div className="tpq-roadmap-grid">
        {futureModules.map((module) => (
          <div
            className="tpq-roadmap-item"
            key={module.id}
            style={{
              background: '#fdfcf9',
              border: '1px solid rgba(12,43,29,0.1)',
              cursor: 'default',
              pointerEvents: 'none', // Completely non-interactive
              userSelect: 'none',
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '22px' }} aria-hidden="true">{module.icon}</span>
                <span className="tpq-roadmap-badge" style={{ background: '#fdf4e3', color: '#7a4b0a', borderColor: 'rgba(122,75,10,0.2)' }}>
                  ⚠️ {module.statusLabel}
                </span>
              </div>

              <h4 className="tpq-roadmap-name" style={{ fontSize: '15px', marginBottom: '6px' }}>
                {module.title}
              </h4>

              <p className="tpq-roadmap-desc" style={{ fontSize: '12px', lineHeight: 1.45, marginBottom: '10px' }}>
                {module.desc}
              </p>
            </div>

            <div
              style={{
                fontSize: '11px',
                fontWeight: 600,
                color: '#7a4b0a',
                background: '#fcf8ee',
                border: '1px solid rgba(201,165,90,0.3)',
                padding: '6px 10px',
                borderRadius: '6px',
                lineHeight: 1.35,
              }}
            >
              🔒 {module.requirement}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
