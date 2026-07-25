import React from 'react';

const mockDonationsList = [
  { id: 'DON-2026-024', tanggal: '28 Jun 2026', nama: 'Hamba Allah (Greenwich)', keterangan: 'Sedekah Subuh', kategori: 'Transfer', jumlah: 'Rp 1.500.000' },
  { id: 'DON-2026-023', tanggal: '27 Jun 2026', nama: 'Hamba Allah (Pinnata)', keterangan: 'Infaq Jumat Barokah', kategori: 'Kotak Infaq', jumlah: 'Rp 200.000' },
  { id: 'DON-2026-022', tanggal: '25 Jun 2026', nama: 'Hamba Allah (Canyon)', keterangan: 'Sedekah TPQ & Pendidikan', kategori: 'QRIS', jumlah: 'Rp 500.000' },
  { id: 'DON-2026-021', tanggal: '22 Jun 2026', nama: 'Hamba Allah (Greenwich)', keterangan: 'Infaq Operasional Masjid', kategori: 'Transfer', jumlah: 'Rp 1.000.000' },
  { id: 'DON-2026-020', tanggal: '19 Jun 2026', nama: 'Hamba Allah (Pinnata)', keterangan: 'Infaq Jumat Bulanan', kategori: 'Kotak Infaq', jumlah: 'Rp 1.388.000' }
];

function getBadgeClass(kat) {
  const k = kat.toLowerCase();
  if (k.includes('transfer')) return 'fin-pill-green';
  if (k.includes('qris')) return 'fin-pill-blue';
  return 'fin-pill-yellow';
}

export default function DonationMonitorTable() {
  return (
    <div className="fin-table-container" style={{ marginTop: '24px' }}>
      <div className="fin-table-header-block">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div className="fin-table-title">Monitoring Donasi Masuk (Read-only · Aman &amp; Anonim)</div>
            <div style={{ fontSize: '12px', color: '#6b7f74', marginTop: '4px' }}>Daftar donasi masuk untuk periode Juni 2026. Data pribadi donatur disamarkan demi privasi.</div>
          </div>
          <div className="fin-table-actions">
            <button className="fin-btn fin-btn-primary" disabled aria-disabled="true" title="Fungsi tulis tidak aktif">
              + Tambah Donasi
            </button>
            <button className="fin-btn" disabled aria-disabled="true">
              Export CSV
            </button>
            <button className="fin-btn" disabled aria-disabled="true">
              Sinkronisasi
            </button>
          </div>
        </div>
      </div>

      <div className="fin-table-wrapper">
        <table className="fin-table" aria-label="Tabel monitoring donasi masuk">
          <thead>
            <tr>
              <th>ID DONASI</th>
              <th>TANGGAL</th>
              <th>NAMA DONATUR (ANONIM)</th>
              <th>KETERANGAN</th>
              <th>METODE</th>
              <th className="fin-text-right">JUMLAH</th>
            </tr>
          </thead>
          <tbody>
            {mockDonationsList.map((don) => (
              <tr key={don.id}>
                <td style={{ whiteSpace: 'nowrap', fontFamily: 'monospace', fontWeight: 600 }}>{don.id}</td>
                <td style={{ whiteSpace: 'nowrap' }}>{don.tanggal}</td>
                <td style={{ fontWeight: 600, color: '#0c2b1d' }}>{don.nama}</td>
                <td>{don.keterangan}</td>
                <td>
                  <span className={`fin-pill ${getBadgeClass(don.kategori)}`}>
                    {don.kategori}
                  </span>
                </td>
                <td className="fin-text-right" style={{ fontWeight: 600, color: '#0f6130' }}>
                  {don.jumlah}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ background: '#FAFAFA', padding: '16px 24px', borderTop: '1px solid #E5E5E5', fontSize: '12px', color: '#6b7f74', textAlign: 'center', fontWeight: 500 }}>
        Menampilkan 5 donasi terverifikasi terbaru untuk akuntabilitas publik
      </div>
    </div>
  );
}
