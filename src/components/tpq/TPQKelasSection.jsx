import React, { useState } from 'react';
export default function TPQKelasSection({ classes = [] }) {
  const [dayFilter, setDayFilter] = useState('semua');

  // Determine current day of week (1-4 = Senin-Kamis, 5-6 = Jumat-Sabtu)
  const today = new Date();
  const dayNum = today.getDay(); 
  const isWeekday = dayNum >= 1 && dayNum <= 4;
  const isWeekendClass = dayNum === 5 || dayNum === 6;

  const filteredClasses = classes.filter((cls) => {
    if (dayFilter === 'senin-kamis') return cls.day.includes('Senin');
    if (dayFilter === 'jumat-sabtu') return cls.day.includes('Jumat');
    return true;
  });

  return (
    <div className="tpq-sec-wrapper">
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '10px',
        }}
      >
        <div>
          <div className="db-sec-eyebrow" style={{ margin: 0 }}>
            C. Jadwal &amp; Kelompok Belajar TPQ
          </div>
          <div style={{ fontSize: '11.5px', color: '#556b5e', marginTop: '2px' }}>
            {isWeekday
              ? <><span aria-hidden="true">📍</span> Hari Ini: Sesi Belajar Senin – Kamis Aktif</>
              : isWeekendClass
              ? <><span aria-hidden="true">📍</span> Hari Ini: Sesi Belajar Tahfiz Jumat &amp; Sabtu Aktif</>
              : <><span aria-hidden="true">📍</span> Hari Ini: Libur Belajar Rutin (Ahad)</>}
          </div>
        </div>

        {/* Day Filter Pills */}
        <div style={{ display: 'flex', gap: '6px' }} role="tablist" aria-label="Filter Hari Belajar">
          {[
            { id: 'semua', label: 'Semua Hari' },
            { id: 'senin-kamis', label: 'Senin – Kamis' },
            { id: 'jumat-sabtu', label: 'Jumat & Sabtu' },
          ].map((tab) => {
            const isActive = dayFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setDayFilter(tab.id)}
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '4px 12px',
                  borderRadius: '99px',
                  border: isActive ? '1px solid #0c2b1d' : '1px solid rgba(12,43,29,0.15)',
                  background: isActive ? '#0c2b1d' : '#fdfcf9',
                  color: isActive ? '#c9a55a' : '#3b5044',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Schedule source notice */}
      <div
        style={{
          fontSize: '11px',
          color: '#8a9e93',
          marginBottom: '14px',
          padding: '6px 10px',
          background: '#f7f5ef',
          borderRadius: '6px',
          borderLeft: '3px solid rgba(12,43,29,0.15)',
        }}
        role="note"
      >
        <span aria-hidden="true">ℹ️</span>{' '}
        Jadwal di bawah bersumber dari prototipe awal. Detail ruangan dan waktu menunggu konfirmasi resmi DKM.
      </div>

      {filteredClasses.length === 0 ? (
        /* Empty State for Unverified Schedule Data */
        <div style={{ textAlign: 'center', padding: '36px 20px', background: '#fdfcf9', border: '1px dashed rgba(12,43,29,0.18)', borderRadius: '16px', margin: '16px 0' }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>📅</div>
          <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#0c2b1d', marginBottom: '4px' }}>Belum Ada Jadwal Dipublikasikan</h4>
          <p style={{ fontSize: '12.5px', color: '#556b5e', margin: 0, maxWidth: '420px', marginInline: 'auto' }}>
            Data jadwal untuk kategori ini belum dipublikasikan oleh pengurus DKM Al Ikhlas.
          </p>
        </div>
      ) : (
        <div className="tpq-kelas-grid">
          {filteredClasses.map((cls) => {
            // Emphasize current active schedule based on today's day
            const isTodayClass = (isWeekday && cls.day.includes('Senin')) || (isWeekendClass && cls.day.includes('Jumat'));

            return (
              <div 
                className="tpq-kelas-card" 
                key={cls.id}
                style={{
                  borderColor: isTodayClass ? 'rgba(201, 165, 90, 0.5)' : undefined,
                  boxShadow: isTodayClass ? '0 6px 20px rgba(201, 165, 90, 0.1)' : undefined,
                }}
              >
                <div>
                  <div className="tpq-kelas-top">
                    <h3 className="tpq-kelas-head-title">
                      <span>{cls.icon}</span>
                      <span>{cls.name}</span>
                    </h3>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      {isTodayClass && (
                        <span style={{ fontSize: '10px', fontWeight: 800, color: '#8a6200', background: 'rgba(201,165,90,0.18)', padding: '3px 8px', borderRadius: '99px' }}>
                          ⚡ Sesi Hari Ini
                        </span>
                      )}
                      <span className="tpq-kelas-badge" style={{ background: '#e8eef8', color: '#1b3a7a', borderColor: 'rgba(27,58,122,0.2)' }}>
                        {cls.level}
                      </span>
                    </div>
                  </div>
                  
                  <p className="tpq-kelas-desc">{cls.description}</p>

                  {/* Pokok Materi / Fokus Pembelajaran */}
                  {cls.fokusMateri && cls.fokusMateri.length > 0 && (
                    <div className="tpq-kelas-fokus">
                      <div className="tpq-fokus-label">Fokus Pembelajaran:</div>
                      <div className="tpq-fokus-chips">
                        {cls.fokusMateri.map((item, idx) => (
                          <span className="tpq-fokus-chip" key={idx}>✓ {item}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Class Metadata Required Fields */}
                <div className="tpq-kelas-meta">
                  <div className="tpq-meta-line">
                    <span className="tpq-meta-label">Tingkat:</span>
                    <span className="tpq-meta-val"><strong>{cls.level}</strong></span>
                  </div>
                  <div className="tpq-meta-line">
                    <span className="tpq-meta-label">Hari:</span>
                    <span className="tpq-meta-val">{cls.day}</span>
                  </div>
                  <div className="tpq-meta-line">
                    <span className="tpq-meta-label">Waktu:</span>
                    <span className="tpq-meta-val">{cls.time}</span>
                  </div>
                  <div className="tpq-meta-line">
                    <span className="tpq-meta-label">Ruangan:</span>
                    <span className="tpq-meta-val">{cls.room}</span>
                  </div>
                  <div className="tpq-meta-line">
                    <span className="tpq-meta-label">Sasaran:</span>
                    <span className="tpq-meta-val">{cls.audience}</span>
                  </div>
                  <div className="tpq-meta-line" style={{ marginTop: '4px', paddingTop: '6px', borderTop: '1px dashed rgba(12,43,29,0.1)' }}>
                    <span className="tpq-meta-label">Pengajar:</span>
                    <span className="tpq-meta-val"><strong>{cls.pengajar}</strong></span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
