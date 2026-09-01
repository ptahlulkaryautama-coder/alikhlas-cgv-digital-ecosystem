const HANDOFF_ITEMS = [
  { label: 'Kelas', value: 'Iqra 3–4', note: 'Label kelompok dummy' },
  { label: 'Kehadiran', value: '2 hadir · 2 izin/sakit', note: 'Rekap dari draft absensi' },
  { label: 'Progres', value: '3 checkpoint', note: 'Ringkasan capaian belajar' },
  { label: 'Raport', value: 'Belum final', note: 'Menunggu review kepala TPQ' },
];

export default function TPQDailySessionHandoffPreview({ onSelectModule }) {
  return (
    <section className="tpq-session-handoff" aria-label="Preview handoff sesi harian TPQ">
      <div className="tpq-demo-header compact">
        <div>
          <span>SESSION HANDOFF</span>
          <h3>Ringkasan setelah kelas</h3>
          <p>
            Draft akhir sesi untuk menghubungkan absensi, progres, dan bahan raport.
            Semua data masih contoh dan tidak menyimpan catatan anak.
          </p>
        </div>
        <strong>Dummy report</strong>
      </div>

      <div className="tpq-session-handoff-grid">
        {HANDOFF_ITEMS.map((item) => (
          <article key={item.label}>
            <small>{item.label}</small>
            <strong>{item.value}</strong>
            <span>{item.note}</span>
          </article>
        ))}
      </div>

      <div className="tpq-session-handoff-actions">
        <button type="button" onClick={() => onSelectModule('Absensi')}>Review Absensi</button>
        <button type="button" onClick={() => onSelectModule('Progres')}>Review Progres</button>
        <button type="button" onClick={() => onSelectModule('Raport')}>Siapkan Raport</button>
      </div>
    </section>
  );
}
