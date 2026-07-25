import React from 'react';

const mockReportsList = [
  { id: 'DKM-2026-005', periode: 'Mei 2026', tanggal: '25 Mei 2026', nama: 'Laporan Keuangan Bulanan Mei 2026', kategori: 'Keuangan', status: 'Dalam verifikasi', akses: 'Pengurus' },
  { id: 'DKM-2026-004', periode: 'Juni 2026', tanggal: '14 Jun 2026', nama: 'Laporan Keuangan Bulanan Juni 2026', kategori: 'Keuangan', status: 'Dalam verifikasi', akses: 'Pengurus' },
  { id: 'DKM-2026-003', periode: 'April 2026', tanggal: '10 Mei 2026', nama: 'Laporan LPJ Kegiatan Ramadhan 1447 H', kategori: 'Kegiatan DKM', status: 'Arsip internal', akses: 'Pengurus' },
  { id: 'DKM-2026-002', periode: 'April 2026', tanggal: '28 Apr 2026', nama: 'Laporan Keuangan Bulanan April 2026', kategori: 'Keuangan', status: 'Arsip internal', akses: 'Pengurus' },
  { id: 'DKM-2026-001', periode: 'Jan 2026', tanggal: '10 Jan 2026', nama: 'SK Pengesahan Pengurus DKM Al Ikhlas', kategori: 'SK & Surat', status: 'Siap publik', akses: 'Publik' }
];

function getBadgeStyle(status) {
  switch (status) {
    case 'Dalam verifikasi':
      return { background: '#FFF3CD', color: '#856404', border: '1px solid #FFEEBA', fontWeight: 600 };
    case 'Dalam peninjauan':
      return { background: '#FDECEA', color: '#9B2113', border: '1px solid rgba(155,33,19,.2)', fontWeight: 600 };
    case 'Siap publik':
      return { background: '#E8F5EE', color: '#0F6130', border: '1px solid rgba(15,97,48,.2)', fontWeight: 600 };
    case 'Arsip internal':
    default:
      return { background: '#E2E8F0', color: '#475569', border: '1px solid #CBD5E1', fontWeight: 600 };
  }
}

export default function ReportArchiveTable() {
  return (
    <div className="fin-table-container" style={{ marginTop: '24px' }}>
      <div className="fin-table-header-block">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div className="fin-table-title">Arsip Dokumen Resmi (Read-only)</div>
            <div style={{ fontSize: '12px', color: '#6b7f74', marginTop: '4px' }}>Daftar surat keputusan, notulen rapat, dan laporan resmi DKM</div>
          </div>
          <div className="fin-table-actions">
            <button className="fin-btn" disabled aria-disabled="true" style={{ cursor: 'not-allowed', opacity: 0.7 }}>
              + Tambah dokumen <span style={{ fontSize: '9px', fontWeight: 600, color: 'var(--db-warn-text)', background: 'var(--db-warn-bg)', padding: '1px 4px', borderRadius: '3px', marginLeft: '4px' }}>belum aktif</span>
            </button>
            <button className="fin-btn" disabled aria-disabled="true" style={{ cursor: 'not-allowed', opacity: 0.7 }}>
              Export CSV <span style={{ fontSize: '9px', fontWeight: 600, color: 'var(--db-warn-text)', background: 'var(--db-warn-bg)', padding: '1px 4px', borderRadius: '3px', marginLeft: '4px' }}>belum aktif</span>
            </button>
          </div>
        </div>
      </div>

      <div className="fin-table-wrapper">
        <table className="fin-table" aria-label="Tabel arsip dokumen laporan">
          <thead>
            <tr>
              <th>ID DOKUMEN</th>
              <th>PERIODE</th>
              <th>NAMA DOKUMEN</th>
              <th>KATEGORI</th>
              <th>STATUS</th>
              <th>HAK AKSES</th>
              <th className="fin-text-right">TAUTAN</th>
            </tr>
          </thead>
          <tbody>
            {mockReportsList.map((doc) => (
              <tr key={doc.id}>
                <td style={{ whiteSpace: 'nowrap', fontFamily: 'monospace', fontWeight: 600 }}>{doc.id}</td>
                <td style={{ whiteSpace: 'nowrap', fontSize: '12.5px' }}>{doc.periode}</td>
                <td style={{ fontWeight: 600, color: '#0c1810' }}>{doc.nama}</td>
                <td>
                  <span className="fin-pill" style={{ background: 'var(--db-bg-inset)' }}>
                    {doc.kategori}
                  </span>
                </td>
                <td>
                  <span className="fin-pill" style={getBadgeStyle(doc.status)}>
                    {doc.status}
                  </span>
                </td>
                <td style={{ fontWeight: 500, color: '#0c1810' }}>
                  {doc.akses}
                </td>
                <td className="fin-text-right">
                  {doc.status === 'Siap publik' ? (
                    <a 
                      href="/transparansi" 
                      style={{ fontSize: '11px', fontWeight: 700, color: 'var(--db-forest-mid)', textDecoration: 'none' }}
                    >
                      Halaman Publik →
                    </a>
                  ) : (
                    <span style={{ fontSize: '11px', color: 'var(--db-text-4)' }}>–</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ background: '#FAFAFA', padding: '16px 24px', borderTop: '1px solid #E5E5E5', fontSize: '12px', color: '#6b7f74', textAlign: 'center', fontWeight: 500 }}>
        Menampilkan 5 dokumen resmi terbaru dari arsip DKM · Read-only
      </div>
    </div>
  );
}
