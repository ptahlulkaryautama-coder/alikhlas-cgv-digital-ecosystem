import { useState } from 'react';

const STUDENT_SCOPE_ROWS = [
  { label: 'Identitas santri', status: 'Private vault', note: 'Nama/kode internal hanya setelah policy disetujui.' },
  { label: 'Kelas aktif', status: 'Scoped', note: 'Pengampu hanya melihat kelas yang diotorisasi.' },
  { label: 'Kontak wali', status: 'Terkunci', note: 'Tidak tampil di shell dan tidak tampil publik.' },
  { label: 'Riwayat akademik', status: 'Audit only', note: 'Akses harus tercatat dan beralasan.' },
];

export default function TPQStudentVaultPreview() {
  const [activeFilter, setActiveFilter] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRows = STUDENT_SCOPE_ROWS.filter((r) => {
    const matchFilter = activeFilter === 'Semua' || r.status === activeFilter;
    const matchSearch = searchQuery === '' || r.label.toLowerCase().includes(searchQuery.toLowerCase()) || r.note.toLowerCase().includes(searchQuery.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div className="tpq-academic-demo" aria-label="Preview direktori santri privat tanpa data anak">
      <div className="tpq-demo-header">
        <div>
          <span>SANTRI</span>
          <h3>Direktori Privat Belum Dibuka</h3>
          <p>Preview batas akses santri. Shell ini belum membaca nama anak, wali, alamat, absensi, nilai, atau pembayaran.</p>
        </div>
        <strong>Private vault</strong>
      </div>

      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '16px', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Cari ruang lingkup / kode..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            padding: '8px 14px',
            borderRadius: '8px',
            border: '1px solid rgba(12,24,16,.2)',
            fontSize: '13px',
            background: '#fff',
            flex: '1',
            minWidth: '200px',
          }}
        />
        <div style={{ display: 'flex', gap: '6px' }}>
          {['Semua', 'Private vault', 'Scoped', 'Terkunci', 'Audit only'].map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setActiveFilter(f)}
              style={{
                fontSize: '11px',
                fontWeight: 700,
                padding: '4px 10px',
                borderRadius: '6px',
                border: '1px solid rgba(12,24,16,.15)',
                background: activeFilter === f ? '#0c2b1d' : '#fff',
                color: activeFilter === f ? '#fff' : '#0c2b1d',
                cursor: 'pointer',
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="tpq-vault-grid">
        {filteredRows.map((row) => (
          <article key={row.label}>
            <small>{row.status}</small>
            <strong>{row.label}</strong>
            <span>{row.note}</span>
          </article>
        ))}
      </div>

      <div className="tpq-vault-warning">
        <strong>Data yang sengaja belum ditampilkan</strong>
        <p>Nama santri, nama/nomor wali, alamat, presensi individu, progres individu, nilai, catatan perilaku, dan pembayaran individu.</p>
      </div>
    </div>
  );
}

