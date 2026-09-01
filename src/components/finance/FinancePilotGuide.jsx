import { useState } from 'react';

const steps = [
  ['1', 'Siapkan sumber', 'Gunakan salinan Excel resmi untuk satu periode. Pastikan saldo awal dan saldo akhir pembanding sudah disetujui penanggung jawab.'],
  ['2', 'Preview dan rekonsiliasi', 'Pilih file, periksa semua baris, lalu pastikan Bermasalah = 0 dan Selisih = Rp 0. Memilih file belum menyimpan data.'],
  ['3', 'Import oleh pembuat', 'Import hanya boleh dilakukan saat mode uji dibuka untuk jadwal pilot. Simpan ID batch sebagai bukti.'],
  ['4', 'Ajukan pemeriksaan', 'Pembuat menekan Ajukan pemeriksaan. Setelah diajukan, gunakan akun pemeriksa yang berbeda.'],
  ['5', 'Periksa dan putuskan', 'Pemeriksa mencocokkan jumlah baris, kas masuk, kas keluar, saldo, kategori, dan bukti sumber sebelum menyetujui atau menolak.'],
  ['6', 'Tutup mode uji', 'Super Admin mematikan kembali kedua finance switch. Jangan publikasikan batch pilot ke website umum.'],
];

export default function FinancePilotGuide({ scope }) {
  const [open, setOpen] = useState(false);
  const label = scope === 'tpq' ? 'TPQ' : 'DKM';

  return (
    <section className="fin-pilot-card" aria-labelledby={`finance-pilot-${scope}`}>
      <div className="fin-pilot-header">
        <div>
          <div className="db-sec-eyebrow">PANDUAN PILOT TERBATAS</div>
          <h2 id={`finance-pilot-${scope}`}>Prosedur Operator Keuangan {label}</h2>
          <p>Urutan kerja singkat agar import dan approval dapat dijalankan tanpa bantuan developer.</p>
        </div>
        <button className="fin-btn" type="button" aria-expanded={open} aria-controls={`finance-pilot-steps-${scope}`} onClick={() => setOpen((value) => !value)}>{open ? 'Tutup panduan' : 'Buka panduan'}</button>
      </div>
      <div className="fin-pilot-guardrails">
        <span><strong>Maksimal</strong> 2 operator</span>
        <span><strong>Wajib</strong> akun pemeriksa berbeda</span>
        <span><strong>Dilarang</strong> publikasi website</span>
      </div>
      {open && <ol className="fin-pilot-steps" id={`finance-pilot-steps-${scope}`}>{steps.map(([number, title, description]) => <li key={number}><span aria-hidden="true">{number}</span><div><strong>{title}</strong><p>{description}</p></div></li>)}</ol>}
      <div className="fin-pilot-evidence">
        <strong>Bukti yang wajib dicatat</strong>
        <p>Periode, nama file, ID batch, jumlah baris, total masuk/keluar, selisih, pembuat, pemeriksa, waktu keputusan, temuan, dan status kedua kill switch setelah pilot.</p>
      </div>
    </section>
  );
}
