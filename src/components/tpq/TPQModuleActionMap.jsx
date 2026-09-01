const ACTION_MAP = {
  Beranda: {
    focus: 'Mulai hari kerja pengampu dari ringkasan, agenda, dan shortcut tugas.',
    now: ['Cek jadwal dummy', 'Buka alur absensi/progres/raport', 'Pantau status safe shell'],
    locked: ['Data anak asli', 'Notifikasi wali', 'Sinkron private vault'],
    handoff: ['Absensi', 'Progres', 'Raport'],
  },
  Santri: {
    focus: 'Menjadi direktori privat santri setelah policy data anak disetujui.',
    now: ['Review daftar field', 'Cek batas privasi', 'Siapkan kode opaque santri'],
    locked: ['Nama lengkap anak', 'Data wali', 'Alamat dan kontak'],
    handoff: ['Kelas', 'Absensi', 'Raport'],
  },
  Progres: {
    focus: 'Mencatat perkembangan belajar tanpa membuka identitas anak di fase pilot.',
    now: ['Coba catatan dummy', 'Review format checkpoint', 'Pastikan bahasa catatan sopan'],
    locked: ['Catatan individu asli', 'Riwayat hafalan asli', 'Tindak lanjut personal'],
    handoff: ['Absensi', 'Raport', 'Kelas'],
  },
  Raport: {
    focus: 'Menyiapkan pola preview dan print raport sebelum data privat aktif.',
    now: ['Cek template print', 'Review rubrik nilai', 'Pastikan export terkunci'],
    locked: ['Raport santri asli', 'PDF produksi', 'Riwayat cetak resmi'],
    handoff: ['Progres', 'Laporan', 'Setting'],
  },
  Absensi: {
    focus: 'Menguji flow hadir/izin/sakit/alfa dengan kode dummy.',
    now: ['Coba layout draft', 'Review status kehadiran', 'Siapkan aturan koreksi'],
    locked: ['Presensi individu asli', 'Rekap per wali', 'Audit kehadiran produksi'],
    handoff: ['Progres', 'Raport', 'Laporan'],
  },
  Kelas: {
    focus: 'Memetakan kelompok belajar, jadwal, dan pengampu tanpa identitas personal.',
    now: ['Review struktur kelas', 'Cek jadwal mingguan', 'Validasi pembagian modul'],
    locked: ['Daftar santri kelas asli', 'Pengampu personal', 'Riwayat pindah kelas'],
    handoff: ['Santri', 'Pengampu', 'Absensi'],
  },
  Pengampu: {
    focus: 'Menyiapkan coverage SDM TPQ tanpa membuka data personal pengampu.',
    now: ['Review role pengampu', 'Cek coverage jadwal', 'Siapkan akses kepala TPQ'],
    locked: ['Profil personal', 'Kontak pengampu', 'Dokumen SDM'],
    handoff: ['Kelas', 'Evaluasi Pengampu', 'Setting'],
  },
  'Evaluasi Pengampu': {
    focus: 'Menyiapkan rubrik internal yang tidak pernah tampil ke website publik.',
    now: ['Review rubrik', 'Cek guardrail bahasa', 'Pastikan akses internal saja'],
    locked: ['Catatan evaluasi asli', 'Riwayat pembinaan', 'Skor personal'],
    handoff: ['Pengampu', 'Laporan', 'Setting'],
  },
  'Kas TPQ': {
    focus: 'Memantau ledger TPQ yang sudah terintegrasi tanpa membuka pembayaran individu.',
    now: ['Cek saldo read-only', 'Review kategori', 'Gunakan workflow finance untuk mutasi'],
    locked: ['Tagihan per santri', 'Riwayat pembayaran anak', 'Kuitansi personal'],
    handoff: ['Laporan', 'Setting', 'Beranda'],
  },
  Agenda: {
    focus: 'Menggunakan agenda public-safe untuk jadwal TPQ dan kegiatan umum.',
    now: ['Cek agenda terdekat', 'Review kategori', 'Gunakan workflow agenda untuk publikasi'],
    locked: ['Daftar peserta', 'Catatan internal panitia', 'Absensi acara'],
    handoff: ['Beranda', 'Absensi', 'Laporan'],
  },
  Laporan: {
    focus: 'Menjadi pusat rekap operasional setelah private vault dan aturan export siap.',
    now: ['Review manifest export', 'Cek batas agregat publik', 'Pastikan print resmi terkunci'],
    locked: ['Export data anak', 'Raport produksi', 'Laporan wali'],
    handoff: ['Raport', 'Kas TPQ', 'Setting'],
  },
  Setting: {
    focus: 'Mengatur policy gate, role, backup, dan kesiapan stand-alone App TPQ.',
    now: ['Review decision checklist', 'Cek matriks role', 'Siapkan backup readiness'],
    locked: ['Perubahan role produksi', 'Private vault switch', 'Retention policy final'],
    handoff: ['Santri', 'Laporan', 'Beranda'],
  },
};

const DEFAULT_ACTION = ACTION_MAP.Beranda;

export default function TPQModuleActionMap({ moduleTitle, onSelectModule }) {
  const action = ACTION_MAP[moduleTitle] ?? DEFAULT_ACTION;

  return (
    <section className="tpq-module-action-map" aria-label={`Peta aksi aman modul ${moduleTitle}`}>
      <div className="tpq-demo-header compact">
        <div>
          <span>ACTION MAP</span>
          <h3>Apa yang bisa dilakukan di modul {moduleTitle}</h3>
          <p>{action.focus}</p>
        </div>
        <strong>Safe pilot</strong>
      </div>

      <div className="tpq-module-action-grid">
        <article>
          <small>Bisa dicoba sekarang</small>
          <ul>
            {action.now.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </article>
        <article className="locked">
          <small>Masih terkunci</small>
          <ul>
            {action.locked.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </article>
        <article className="handoff">
          <small>Modul terkait</small>
          <div>
            {action.handoff.map((target) => (
              <button key={target} type="button" onClick={() => onSelectModule(target)}>
                {target} →
              </button>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}
