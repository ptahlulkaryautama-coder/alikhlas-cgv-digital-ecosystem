const FIELD_GROUPS = [
  {
    area: 'Santri',
    fields: [
      { label: 'Kode opaque santri', status: 'Wajib', access: 'Pengampu kelas, Kepala TPQ' },
      { label: 'Nama panggilan', status: 'Disarankan', access: 'Pengampu kelas, Kepala TPQ' },
      { label: 'Nama lengkap', status: 'Perlu approval', access: 'Kepala TPQ/Admin terbatas' },
      { label: 'Alamat', status: 'Ditunda', access: 'Jangan dibuka di pilot awal' },
    ],
  },
  {
    area: 'Wali',
    fields: [
      { label: 'Kontak darurat', status: 'Perlu approval', access: 'Kepala TPQ/Admin terbatas' },
      { label: 'Nama wali', status: 'Ditunda', access: 'Tidak untuk pengampu biasa di pilot awal' },
      { label: 'Nomor WhatsApp', status: 'Ditunda', access: 'Tidak untuk pengampu biasa di pilot awal' },
    ],
  },
  {
    area: 'Akademik',
    fields: [
      { label: 'Status absensi', status: 'Wajib', access: 'Pengampu kelas, Kepala TPQ' },
      { label: 'Checkpoint Iqra/Al-Qur’an', status: 'Wajib', access: 'Pengampu kelas, Kepala TPQ' },
      { label: 'Catatan progres', status: 'Perlu template', access: 'Pengampu kelas, Kepala TPQ' },
      { label: 'Raport print/PDF', status: 'Audit wajib', access: 'Kepala TPQ + pengampu terkait' },
    ],
  },
  {
    area: 'Operasional',
    fields: [
      { label: 'Pembayaran individu', status: 'Ditunda', access: 'Jangan campur dengan ledger publik' },
      { label: 'Evaluasi pengampu', status: 'Private only', access: 'Kepala TPQ/Admin terbatas' },
      { label: 'Export laporan', status: 'Terkunci', access: 'Butuh alasan dan audit' },
    ],
  },
];

export default function TPQPrivateFieldMatrixPreview() {
  return (
    <section className="tpq-field-matrix" aria-label="Preview matriks field TPQ Private Vault">
      <div className="tpq-demo-header compact">
        <div>
          <span>FIELD MATRIX</span>
          <h3>Template field private vault</h3>
          <p>
            Daftar ini hanya bahan keputusan. Belum membaca database, belum menyimpan data,
            dan belum mengizinkan input data anak asli.
          </p>
        </div>
        <strong>Draft policy</strong>
      </div>

      <div className="tpq-field-groups">
        {FIELD_GROUPS.map((group) => (
          <article className="tpq-field-group" key={group.area}>
            <h4>{group.area}</h4>
            <div className="tpq-field-rows">
              {group.fields.map((field) => (
                <div className="tpq-field-row" key={`${group.area}-${field.label}`}>
                  <strong>{field.label}</strong>
                  <span>{field.status}</span>
                  <small>{field.access}</small>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>

      <div className="tpq-field-warning">
        <strong>Prinsip pilot:</strong>
        <span>mulai dari kode opaque + data minimum. Field sensitif dibuka bertahap setelah role, retensi, dan audit disepakati.</span>
      </div>
    </section>
  );
}
