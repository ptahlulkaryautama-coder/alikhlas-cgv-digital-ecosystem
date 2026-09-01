import TPQBackupRestoreRunbookPreview from './TPQBackupRestoreRunbookPreview.jsx';

const BACKUP_CHECKS = [
  { label: 'Scope backup', status: 'Belum aktif', note: 'Harus dibatasi per modul dan role.' },
  { label: 'Data anak', status: 'Terkunci', note: 'Tidak boleh export massal tanpa otorisasi.' },
  { label: 'Audit export', status: 'Wajib', note: 'Siapa, kapan, alasan, dan jenis file.' },
  { label: 'Restore rehearsal', status: 'Wajib', note: 'Harus bisa diuji tanpa menimpa data produksi.' },
];

export default function TPQBackupReadinessPreview() {
  return (
    <section className="tpq-backup-readiness" aria-label="Preview kesiapan backup App TPQ">
      <div className="tpq-demo-header compact">
        <div>
          <span>BACKUP READINESS</span>
          <h3>Backup & Restore TPQ</h3>
          <p>Backup untuk data privat TPQ belum aktif. Desainnya harus audit-first dan recoverable.</p>
        </div>
      </div>

      <div className="tpq-backup-grid">
        {BACKUP_CHECKS.map((row) => (
          <article key={row.label}>
            <small>{row.status}</small>
            <strong>{row.label}</strong>
            <span>{row.note}</span>
          </article>
        ))}
      </div>

      <TPQBackupRestoreRunbookPreview />
    </section>
  );
}
