import React from 'react';

export default function TPQOverviewKPI() {
  return (
    <div className="tpq-kpi-grid">
      {/* 1. Kelas Aktif Card — source: CLASS_GROUPS (prototype overview) */}
      <div className="tpq-kpi-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span className="tpq-kpi-tag">KELAS AKTIF</span>
          <span style={{ fontSize: '9.5px', fontWeight: 700, padding: '2px 6px', borderRadius: '4px', background: '#f0f0f0', color: '#555' }}>
            Informasi Umum
          </span>
        </div>
        <div className="tpq-kpi-num">
          4 <span className="tpq-kpi-unit">kelompok</span>
        </div>
        <div className="tpq-kpi-hint">Iqra 1–3, Iqra 4–6, Al-Qur'an &amp; Tahfiz</div>
      </div>

      {/* 2. Jadwal Belajar Card — source: TPQ_PORTAL_INFO.jamOperasional (general window only;
           room assignments are legacy prototype, not independently approved) */}
      <div className="tpq-kpi-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span className="tpq-kpi-tag">JADWAL BELAJAR</span>
          <span style={{ fontSize: '9.5px', fontWeight: 700, padding: '2px 6px', borderRadius: '4px', background: '#f0f0f0', color: '#555' }}>
            Informasi Umum
          </span>
        </div>
        <div className="tpq-kpi-num" style={{ fontSize: '22px' }}>
          Senin – Sabtu
        </div>
        <div className="tpq-kpi-hint">Sore 16.00–17.30 WIB · Tahfiz Jum–Sab</div>
      </div>

      {/* 3. Fokus Pembelajaran Card — source: CLASS_GROUPS (prototype legacy only; not
           independently approved against official DKM curriculum document) */}
      <div className="tpq-kpi-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span className="tpq-kpi-tag">FOKUS PEMBELAJARAN</span>
          <span style={{ fontSize: '9.5px', fontWeight: 700, padding: '2px 6px', borderRadius: '4px', background: '#f0f0f0', color: '#555' }}>
            Informasi Umum
          </span>
        </div>
        <div className="tpq-kpi-num" style={{ fontSize: '20px' }}>
          Iqra, Tahsin, Tahfiz
        </div>
        <div className="tpq-kpi-hint">Hijaiyah, Tajwid, &amp; Hafalan Juz 30</div>
      </div>

      {/* 4. Agenda Terakhir Card — all entries are past as of Jul 2026 */}
      <div className="tpq-kpi-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span className="tpq-kpi-tag">AGENDA TERAKHIR</span>
          <span style={{ fontSize: '9.5px', fontWeight: 700, padding: '2px 6px', borderRadius: '4px', background: '#f0f0f0', color: '#444' }}>
            Arsip Agenda
          </span>
        </div>
        <div className="tpq-kpi-num" style={{ fontSize: '18px', lineHeight: 1.3 }}>
          Kajian Keluarga Muslim
        </div>
        <div className="tpq-kpi-hint">12 Juli 2026 · Ruang Utama Masjid</div>
      </div>
    </div>
  );
}
