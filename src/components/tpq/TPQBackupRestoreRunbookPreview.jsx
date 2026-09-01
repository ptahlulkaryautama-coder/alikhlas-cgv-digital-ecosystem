const RESTORE_STEPS = [
  {
    step: '1',
    title: 'Bekukan perubahan',
    note: 'Matikan switch tulis modul terkait sebelum export agar snapshot tidak berubah di tengah proses.',
  },
  {
    step: '2',
    title: 'Export terukur',
    note: 'Backup hanya per scope dan role. File harus punya checksum, periode, alasan, dan operator.',
  },
  {
    step: '3',
    title: 'Restore rehearsal',
    note: 'Pulihkan ke lingkungan test dulu, bukan produksi. Bandingkan jumlah baris dan hash data.',
  },
  {
    step: '4',
    title: 'Sign-off audit',
    note: 'Catat hasil pemeriksaan, waktu, akun, temuan, dan keputusan sebelum fitur produksi dibuka.',
  },
];

const RESTORE_BOUNDARIES = [
  'Restore tidak pernah menimpa produksi tanpa rehearsal.',
  'Audit wajib untuk export, import ulang, dan koreksi.',
  'Tidak ada data anak ke website publik atau localStorage.',
];

export default function TPQBackupRestoreRunbookPreview() {
  return (
    <section className="tpq-backup-runbook" aria-label="Runbook backup restore App TPQ">
      <div className="tpq-demo-header compact">
        <div>
          <span>RESTORE REHEARSAL</span>
          <h3>Runbook Pemulihan Data TPQ</h3>
          <p>Alur ini masih preview aman. Tujuannya memastikan backup bisa dipulihkan tanpa risiko menimpa produksi.</p>
        </div>
        <strong>Draft SOP</strong>
      </div>

      <div className="tpq-backup-runbook-grid">
        {RESTORE_STEPS.map((item) => (
          <article key={item.step}>
            <small>{item.step}</small>
            <strong>{item.title}</strong>
            <span>{item.note}</span>
          </article>
        ))}
      </div>

      <div className="tpq-backup-runbook-note">
        <strong>Batas aman sebelum aktif</strong>
        <ul>
          {RESTORE_BOUNDARIES.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </div>
    </section>
  );
}
