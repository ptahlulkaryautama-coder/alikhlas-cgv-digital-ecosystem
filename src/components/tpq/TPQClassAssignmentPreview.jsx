import { useState } from 'react';

const CLASS_ROWS = [
  { name: 'Iqra 1–3', schedule: 'Senin & Kamis', room: 'Serambi Masjid', mentor: 'Pengampu A' },
  { name: 'Iqra 4–6', schedule: 'Selasa & Jumat', room: 'Ruang TPQ', mentor: 'Pengampu B' },
  { name: 'Al-Qur’an & Tahfiz', schedule: 'Sabtu', room: 'Aula Masjid', mentor: 'Pengampu C' },
];

const WEEKLY_SLOTS = [
  { day: 'Sen', className: 'Iqra 1–3' },
  { day: 'Sel', className: 'Iqra 4–6' },
  { day: 'Rab', className: '—' },
  { day: 'Kam', className: 'Iqra 1–3' },
  { day: 'Jum', className: 'Iqra 4–6' },
  { day: 'Sab', className: 'Al-Qur’an' },
];

export default function TPQClassAssignmentPreview() {
  const [selectedClass, setSelectedClass] = useState(null);

  return (
    <div className="tpq-academic-demo" aria-label="Preview kelas TPQ tanpa data privat">
      <div className="tpq-demo-header">
        <div>
          <span>KELAS & JADWAL</span>
          <h3>Pemetaan Kelompok Belajar</h3>
          <p>Klik kartu kelas untuk melihat sorotan jadwal kelompok belajar.</p>
        </div>
        <strong>Public-safe</strong>
      </div>

      <div className="tpq-class-grid">
        {CLASS_ROWS.map((row) => {
          const isSelected = selectedClass === row.name;
          return (
            <article
              className={`tpq-class-card${isSelected ? ' is-selected' : ''}`}
              key={row.name}
              onClick={() => setSelectedClass(isSelected ? null : row.name)}
              style={{
                cursor: 'pointer',
                border: isSelected ? '2px solid #0c2b1d' : undefined,
                background: isSelected ? 'rgba(12,43,29,0.06)' : undefined,
              }}
            >
              <small>{row.schedule}</small>
              <strong>{row.name}</strong>
              <span>{row.room}</span>
              <em>{row.mentor}</em>
            </article>
          );
        })}
      </div>

      <div className="tpq-weekly-board" aria-label="Preview jadwal mingguan kelas TPQ">
        {WEEKLY_SLOTS.map((slot) => {
          const isMatch = selectedClass && (slot.className.includes(selectedClass.split(' ')[0]));
          return (
            <article
              className={`${slot.className === '—' ? 'is-empty' : ''}${isMatch ? ' is-highlighted' : ''}`}
              key={slot.day}
              style={{
                background: isMatch ? '#0c2b1d' : undefined,
                color: isMatch ? '#ffffff' : undefined,
              }}
            >
              <small style={{ color: isMatch ? 'rgba(255,255,255,0.8)' : undefined }}>{slot.day}</small>
              <strong>{slot.className}</strong>
            </article>
          );
        })}
      </div>
    </div>
  );
}

