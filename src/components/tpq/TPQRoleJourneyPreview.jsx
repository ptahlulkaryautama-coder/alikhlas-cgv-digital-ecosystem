const JOURNEYS = [
  {
    role: 'Pengampu',
    starts: 'Beranda → Absensi → Progres → Raport',
    firstModule: 'Absensi',
    focus: 'Mencatat kegiatan kelas yang diampu.',
    guardrail: 'Tidak melihat semua kelas dan tidak export data anak.',
  },
  {
    role: 'Kepala TPQ',
    starts: 'Beranda → Kelas → Progres → Evaluasi Pengampu',
    firstModule: 'Kelas',
    focus: 'Memantau kualitas belajar, jadwal, dan tindak lanjut.',
    guardrail: 'Tidak merilis data privat ke website publik.',
  },
  {
    role: 'Bendahara TPQ',
    starts: 'Kas TPQ → Laporan',
    firstModule: 'Kas TPQ',
    focus: 'Memantau ledger TPQ, import/manual/correction sesuai workflow finance.',
    guardrail: 'Tidak membuka nilai, raport, catatan anak, atau data wali.',
  },
  {
    role: 'Admin DKM',
    starts: 'Setting → Role & akses → Backup readiness → Policy gate',
    firstModule: 'Setting',
    focus: 'Menjaga akses, audit, backup, dan kesiapan integrasi.',
    guardrail: 'Tidak bypass private vault dan tidak hard delete data trial.',
  },
];

export default function TPQRoleJourneyPreview({ onSelectModule }) {
  return (
    <section className="tpq-role-journey" aria-label="Preview alur kerja per role App TPQ">
      <div className="tpq-demo-header compact">
        <div>
          <span>ROLE JOURNEY</span>
          <h3>Alur kerja per pengguna</h3>
          <p>Ringkasan ini membantu pilot UI. Tidak mengubah permission, tidak membaca Supabase, dan tidak menyimpan data.</p>
        </div>
        <strong>Guide</strong>
      </div>

      <div className="tpq-role-journey-grid">
        {JOURNEYS.map((item) => (
          <article key={item.role}>
            <small>{item.role}</small>
            <strong>{item.starts}</strong>
            <p>{item.focus}</p>
            <em>{item.guardrail}</em>
            <button type="button" onClick={() => onSelectModule(item.firstModule)}>
              Mulai alur {item.role} →
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
