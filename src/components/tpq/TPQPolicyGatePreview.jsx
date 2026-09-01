const POLICY_GATES = [
  { label: 'Field santri', status: 'Belum disetujui', note: 'Nama panggilan/kode, data wali, absensi, progres, raport.' },
  { label: 'Scope akses', status: 'Belum disetujui', note: 'Pengampu per kelas, Kepala TPQ, Bendahara TPQ, Admin DKM.' },
  { label: 'Retensi data', status: 'Belum disetujui', note: 'Berapa lama absensi, progres, raport, dan evaluasi disimpan.' },
  { label: 'Export & print', status: 'Belum disetujui', note: 'Siapa boleh cetak/download, alasan, dan audit.' },
  { label: 'Backup & restore', status: 'Belum disetujui', note: 'Backup privat, restore rehearsal, dan larangan share bebas.' },
];

export default function TPQPolicyGatePreview() {
  return (
    <section className="tpq-policy-gate" aria-label="Preview policy gate TPQ Private Vault">
      <div className="tpq-demo-header compact">
        <div>
          <span>POLICY GATE</span>
          <h3>Gerbang Sebelum Private Vault Dibuka</h3>
          <p>
            Checklist ini belum menjalankan SQL. Fungsinya mengingatkan operator bahwa data anak
            baru boleh masuk setelah keputusan DKM/TPQ disetujui.
          </p>
        </div>
      </div>

      <div className="tpq-policy-list">
        {POLICY_GATES.map((gate) => (
          <article key={gate.label}>
            <div>
              <small>{gate.status}</small>
              <strong>{gate.label}</strong>
              <span>{gate.note}</span>
            </div>
            <em>Terkunci</em>
          </article>
        ))}
      </div>

      <div className="tpq-policy-link-note">
        Dokumen keputusan: <code>docs/TPQ_PRIVATE_VAULT_DECISION_CHECKLIST.md</code>
      </div>
    </section>
  );
}
