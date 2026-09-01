const DEFAULT_CHECKS = [
  { label: 'UI shell', status: 'Siap', tone: 'ready', note: 'Layout dan navigasi modul sudah bisa diuji.' },
  { label: 'Data dummy', status: 'Aman', tone: 'ready', note: 'Hanya memakai label generik/kode opaque.' },
  { label: 'Private vault', status: 'Terkunci', tone: 'locked', note: 'Belum membaca data anak/wali/pengampu asli.' },
  { label: 'Write RPC', status: 'Menunggu', tone: 'pending', note: 'Aktif setelah policy data anak disetujui.' },
];

const MODULE_OVERRIDES = {
  Beranda: [
    { label: 'Ruang harian', status: 'Siap', tone: 'ready', note: 'Shortcut dan alur kerja sudah tersedia.' },
    { label: 'Data privat', status: '0', tone: 'ready', note: 'Tidak ada data anak dibaca di beranda.' },
    { label: 'Stand-alone', status: 'Siap', tone: 'ready', note: 'Route app ringan sudah tersedia.' },
    { label: 'Pilot operator', status: 'Aman', tone: 'ready', note: 'Bisa dicek tanpa SQL tambahan.' },
  ],
  'Kas TPQ': [
    { label: 'Ledger', status: 'Siap', tone: 'ready', note: 'Membaca ringkasan finance TPQ yang sudah ada.' },
    { label: 'Input kas', status: 'Via Finance', tone: 'pending', note: 'Mutasi kas tetap lewat workflow finance.' },
    { label: 'Data santri', status: 'Tidak dibuka', tone: 'ready', note: 'Tidak menampilkan pembayaran individu.' },
    { label: 'Koreksi', status: 'Terkontrol', tone: 'ready', note: 'Mengikuti koreksi ledger yang sudah dibuat.' },
  ],
  Agenda: [
    { label: 'Read model', status: 'Siap', tone: 'ready', note: 'Membaca agenda public-safe.' },
    { label: 'Publikasi', status: 'Via Agenda', tone: 'ready', note: 'Mutasi tetap lewat workflow Agenda.' },
    { label: 'Peserta', status: 'Tersembunyi', tone: 'ready', note: 'Tidak menampilkan daftar peserta.' },
    { label: 'Website', status: 'Public-safe', tone: 'ready', note: 'Hanya agenda yang boleh dipublikasi.' },
  ],
};

export default function TPQModulePilotChecklist({ moduleTitle }) {
  const checks = MODULE_OVERRIDES[moduleTitle] ?? DEFAULT_CHECKS;

  return (
    <section className="tpq-module-pilot-checklist" aria-label={`Kesiapan pilot modul ${moduleTitle}`}>
      <div className="tpq-demo-header compact">
        <div>
          <span>MODUL READINESS</span>
          <h3>Kesiapan pilot: {moduleTitle}</h3>
          <p>Panel ini membantu operator tahu batas aman modul sebelum data privat dibuka.</p>
        </div>
        <strong>Guarded</strong>
      </div>
      <div className="tpq-module-pilot-grid">
        {checks.map((check) => (
          <article className={check.tone} key={check.label}>
            <small>{check.label}</small>
            <strong>{check.status}</strong>
            <span>{check.note}</span>
          </article>
        ))}
      </div>
    </section>
  );
}
