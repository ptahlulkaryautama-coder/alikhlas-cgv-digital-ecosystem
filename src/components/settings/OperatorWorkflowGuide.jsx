const FLOWS = [
  {
    title: 'Konten website',
    scope: 'Kabar · Program · Agenda',
    steps: ['Buat atau edit draft', 'Publikasikan di dashboard', 'Rilis ke website dari Pengaturan'],
    note: 'Data uji tidak tampil di website sampai dirilis sebagai production.',
  },
  {
    title: 'Keuangan',
    scope: 'DKM · TPQ',
    steps: ['Upload Excel atau input manual', 'Cek validasi & saldo', 'Publikasikan ke ledger'],
    note: 'Tidak ada hard delete. Koreksi dilakukan lewat edit/review sesuai workflow.',
  },
  {
    title: 'Akses pengguna',
    scope: 'Role · Otorisasi tombol',
    steps: ['Buat user di Supabase Auth', 'Atur role di Pengaturan', 'Cabut/pulihkan akses bila diperlukan'],
    note: 'Pulihkan akun tidak mengembalikan role lama otomatis agar tetap aman.',
  },
  {
    title: 'Portal TPQ',
    scope: 'Public-safe projection',
    steps: ['Tampilkan info kelas/agendanya', 'Sembunyikan data pribadi', 'Review sebelum fitur santri individu'],
    note: 'Data santri, wali, nilai, absensi, dan pembayaran individu tetap tidak dipublikasikan.',
  },
];

export default function OperatorWorkflowGuide() {
  return (
    <section className="db-card operator-guide" aria-labelledby="operator-guide-title">
      <div className="operator-guide__head">
        <div>
          <div className="db-sec-eyebrow">Panduan Operator</div>
          <h2 id="operator-guide-title">Cara kerja singkat dashboard</h2>
          <p>Urutan praktis untuk pengurus non-teknis. Ikuti dari kiri ke kanan; kalau tombol tidak muncul, biasanya akses atau mode aman sedang terkunci.</p>
        </div>
        <span className="fin-pill">Tanpa SQL</span>
      </div>

      <div className="operator-guide__grid">
        {FLOWS.map((flow) => (
          <article className="operator-guide__item" key={flow.title}>
            <span>{flow.scope}</span>
            <h3>{flow.title}</h3>
            <ol>
              {flow.steps.map((step) => <li key={step}>{step}</li>)}
            </ol>
            <p>{flow.note}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
