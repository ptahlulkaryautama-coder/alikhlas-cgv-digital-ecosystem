import React, { useState } from 'react';

export default function TPQFutureModulesSection() {
  const [selectedModuleId, setSelectedModuleId] = useState(null);
  const [activeNotice, setActiveNotice] = useState(null);

  const futureModules = [
    {
      id: 'fm1',
      icon: '📁',
      title: 'Data Santri',
      statusLabel: 'Siap diuji',
      desc: 'Pengelolaan data induk santri, identitas wali, dan dokumen administrasi terenkripsi.',
      requirement: 'Pencatatan data induk santri dengan enkripsi privat.',
    },
    {
      id: 'fm2',
      icon: '📋',
      title: 'Absensi',
      statusLabel: 'Siap diuji',
      desc: 'Jurnal presensi harian per kelas dan notifikasi kehadiran otomatis ke WhatsApp wali santri.',
      requirement: 'Form presensi harian per kelas dengan audit trail.',
    },
    {
      id: 'fm3',
      icon: '⭐',
      title: 'Evaluasi',
      statusLabel: 'Siap diuji',
      desc: 'Pencatatan setoran hafalan Juz Amma, kelancaran bacaan tajwid, dan jurnal murojaah.',
      requirement: 'Rubrik penilaian bacaan tajwid & kelancaran hafalan.',
    },
    {
      id: 'fm4',
      icon: '📊',
      title: 'Raport',
      statusLabel: 'Siap diuji',
      desc: 'Penginputan nilai semester, pencetakan raport digital, dan buku penghubung wali santri.',
      requirement: 'Penyusunan raport semester & ekspor PDF resmi.',
    },
    {
      id: 'fm5',
      icon: '💼',
      title: 'Administrasi',
      statusLabel: 'Siap diuji',
      desc: 'Pembukuan donasi pendidikan, penyaluran beasiswa santri, dan insentif pengajar TPQ.',
      requirement: 'Integrasi ledger keuangan kas TPQ & insentif.',
    },
  ];

  function handleSelectModule(module) {
    setSelectedModuleId(module.id);
    setActiveNotice(`🚀 Modul [${module.title}] Dipilih untuk Simulasi Interaktif!`);
    setTimeout(() => setActiveNotice(null), 4000);
  }

  return (
    <div className="tpq-sec-wrapper">
      <div className="db-sec-eyebrow" style={{ marginBottom: '14px' }}>
        H. Rencana Fitur Terproteksi &amp; Uji Coba Modul
      </div>

      {activeNotice && (
        <div style={{
          background: 'linear-gradient(135deg, #0b3424, #17573a)',
          color: '#ffffff',
          padding: '12px 18px',
          borderRadius: '10px',
          fontSize: '13px',
          fontWeight: 700,
          marginBottom: '16px',
          boxShadow: '0 4px 16px rgba(11,52,36,0.25)',
        }}>
          {activeNotice}
        </div>
      )}

      <div className="tpq-roadmap-grid">
        {futureModules.map((module) => {
          const isSelected = selectedModuleId === module.id;
          return (
            <div
              className="tpq-roadmap-item"
              key={module.id}
              onClick={() => handleSelectModule(module)}
              style={{
                background: isSelected ? '#fffefa' : '#fdfcf9',
                border: isSelected ? '2px solid #0c2b1d' : '1px solid rgba(198,161,91,0.3)',
                borderRadius: '14px',
                padding: '20px',
                cursor: 'pointer',
                boxShadow: isSelected ? '0 8px 28px rgba(8,41,28,0.12)' : '0 2px 8px rgba(0,0,0,0.03)',
                transition: 'all 0.2s ease',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontSize: '24px' }} aria-hidden="true">{module.icon}</span>
                  <span className="tpq-roadmap-badge" style={{
                    background: isSelected ? '#0c2b1d' : '#e8f5ee',
                    color: isSelected ? '#ffffff' : '#0f6130',
                    borderColor: 'rgba(15,97,48,0.2)',
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: '6px',
                    fontSize: '11px',
                  }}>
                    ✨ {module.statusLabel}
                  </span>
                </div>

                <h4 className="tpq-roadmap-name" style={{ fontSize: '16px', fontWeight: 800, color: '#08291c', marginBottom: '6px' }}>
                  {module.title}
                </h4>

                <p className="tpq-roadmap-desc" style={{ fontSize: '12.5px', color: '#526d5f', lineHeight: 1.5, marginBottom: '12px' }}>
                  {module.desc}
                </p>
              </div>

              <div
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#08291c',
                  background: 'rgba(198,161,91,0.12)',
                  border: '1px solid rgba(198,161,91,0.3)',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  lineHeight: 1.35,
                }}
              >
                💡 {module.requirement}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

