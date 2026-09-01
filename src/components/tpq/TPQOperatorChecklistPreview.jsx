const CHECKLIST_ITEMS = [
  {
    phase: 'Sebelum kelas',
    action: 'Cek agenda dan kelompok belajar',
    status: 'Aman',
    note: 'Hanya memakai jadwal public-safe dan data dummy kelas.',
  },
  {
    phase: 'Saat kelas',
    action: 'Siapkan absensi dan catatan progres',
    status: 'Draft',
    note: 'Belum menyimpan data anak sampai private vault aktif.',
  },
  {
    phase: 'Setelah kelas',
    action: 'Review catatan dan tindak lanjut',
    status: 'Draft',
    note: 'Catatan individu nanti harus diaudit dan tidak tampil publik.',
  },
  {
    phase: 'Akhir periode',
    action: 'Preview raport dan laporan',
    status: 'Terkunci',
    note: 'Print/export produksi menunggu policy data anak.',
  },
];

export default function TPQOperatorChecklistPreview({ onSelectModule }) {
  return (
    <section className="tpq-operator-checklist" aria-label="Checklist operator App Pengampu TPQ">
      <div className="tpq-demo-header compact">
        <div>
          <span>OPERATOR CHECKLIST</span>
          <h3>Urutan Kerja Pengampu</h3>
          <p>Panduan ringan agar pengampu tidak bingung saat app mulai dipakai pilot.</p>
        </div>
      </div>

      <div className="tpq-checklist-flow">
        {CHECKLIST_ITEMS.map((item, index) => (
          <article className="tpq-checklist-item" key={item.phase}>
            <span className="tpq-checklist-index">{index + 1}</span>
            <div>
              <small>{item.phase}</small>
              <strong>{item.action}</strong>
              <p>{item.note}</p>
            </div>
            <em>{item.status}</em>
          </article>
        ))}
      </div>

      <div className="tpq-checklist-actions" aria-label="Shortcut checklist operator">
        <button type="button" onClick={() => onSelectModule('Agenda')}>Buka Agenda</button>
        <button type="button" onClick={() => onSelectModule('Absensi')}>Buka Absensi</button>
        <button type="button" onClick={() => onSelectModule('Raport')}>Buka Raport</button>
      </div>
    </section>
  );
}
