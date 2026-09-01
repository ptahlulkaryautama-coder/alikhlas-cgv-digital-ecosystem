const READINESS_ITEMS = [
  {
    label: 'Shell App TPQ',
    state: 'Siap',
    tone: 'ready',
    note: 'Route, sidebar, modul harian, dan preview mobile sudah tersedia.',
  },
  {
    label: 'Data Privat Anak',
    state: 'Terkunci',
    tone: 'locked',
    note: 'Nama, wali, absensi individu, progres, raport, dan pembayaran anak belum dibuka.',
  },
  {
    label: 'Supabase Private Vault',
    state: 'Menunggu approval',
    tone: 'pending',
    note: 'SQL private vault baru boleh dijalankan setelah checklist policy disetujui DKM/TPQ.',
  },
  {
    label: 'Pilot Dummy/Opaque',
    state: 'Aman diuji',
    tone: 'ready',
    note: 'Uji UI memakai kode seperti TPQ-STUDENT-001 dan label generik Pengampu A/B/C.',
  },
  {
    label: 'Print & Export',
    state: 'Terkunci',
    tone: 'locked',
    note: 'Print raport/export produksi menunggu role, audit, dan policy data anak.',
  },
];

export default function TPQPilotReadinessPreview() {
  return (
    <section className="tpq-pilot-readiness" aria-label="Preview kesiapan pilot App TPQ">
      <div className="tpq-demo-header compact">
        <div>
          <span>PILOT READINESS</span>
          <h3>Status kesiapan App TPQ</h3>
          <p>Panel ini hanya indikator. Tidak menjalankan SQL, tidak menyimpan data, dan tidak membuka private vault.</p>
        </div>
        <strong>Dry-run</strong>
      </div>

      <div className="tpq-readiness-list">
        {READINESS_ITEMS.map((item) => (
          <article className={`tpq-readiness-item ${item.tone}`} key={item.label}>
            <div>
              <small>{item.label}</small>
              <strong>{item.state}</strong>
            </div>
            <p>{item.note}</p>
          </article>
        ))}
      </div>

      <div className="tpq-readiness-footer">
        <strong>Next gate:</strong>
        <span>Policy data anak → migration private vault → verification SQL → pilot dummy/opaque → baru data terbatas.</span>
      </div>
    </section>
  );
}
