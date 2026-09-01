import { mockTransactionsAgustus, mockTransactionsMei, mockTransactionsJuni, mockFinanceSummary, financePeriods } from '../../data/dashboardMockData.js';
import '../../styles/financeAdmin.css';

function getPillClass(kategori) {
  const cat = (kategori || '').toLowerCase();
  if (cat.includes('infaq') || cat.includes('donasi') || cat.includes('penerimaan')) return 'fin-pill-green';
  if (cat.includes('operasional') || cat.includes('bisyaroh') || cat.includes('jumber')) return 'fin-pill-red';
  return 'fin-pill-blue';
}

export default function FinanceTransactionTable({ selectedPeriod = 'agustus2026', data = null, source = 'fallback' }) {
  const activePeriod = financePeriods[selectedPeriod] || financePeriods.agustus2026;
  const money = (value) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);
  const list = data ? data.transactions.map((row) => ({ id: row.id, tanggal: row.date, keterangan: row.description, kategori: row.category, masuk: row.direction === 'income' ? money(row.amount) : '-', keluar: row.direction === 'expense' ? money(row.amount) : '-', saldo: money(row.runningBalance) })) : selectedPeriod === 'agustus2026' ? mockTransactionsAgustus : selectedPeriod === 'mei2026' ? mockTransactionsMei : mockTransactionsJuni;
  const periodLabel = data?.period || (activePeriod.periodRange ? `${activePeriod.label} (${activePeriod.periodRange})` : activePeriod.label);

  return (
    <div className="fin-table-container">
      <div className="fin-table-header-block">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div className="fin-table-title">Riwayat Transaksi (Read-only)</div>
            <div style={{ fontSize: '12px', color: '#6b7f74', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>Transaksi periode {periodLabel}</span>
              <span style={{ fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '12px', background: activePeriod.status === 'Terverifikasi' ? '#E8F5EE' : '#FFF3CD', color: activePeriod.status === 'Terverifikasi' ? '#0F6130' : '#856404', border: activePeriod.status === 'Terverifikasi' ? '1px solid rgba(15,97,48,.2)' : '1px solid #FFEEBA' }}>
                {source === 'supabase' ? 'Data Uji Supabase' : activePeriod.status === 'Terverifikasi' ? 'Terverifikasi DKM' : 'Dalam Peninjauan'}
              </span>
            </div>
          </div>
          <div className="fin-table-actions">
            <button className="fin-btn fin-btn-primary" disabled aria-disabled="true" title="Fungsi tulis tidak aktif">
              + Tambah transaksi
            </button>
            <button className="fin-btn" disabled aria-disabled="true">
              Export PDF
            </button>
            <button className="fin-btn" disabled aria-disabled="true">
              Sinkron Google Sheet
            </button>
          </div>
        </div>
      </div>

      <div className="fin-table-wrapper">
        <table className="fin-table" aria-label="Tabel detail transaksi kas">
          <thead>
            <tr>
              <th>TANGGAL</th>
              <th>KETERANGAN</th>
              <th>KATEGORI</th>
              <th className="fin-text-right">KAS MASUK</th>
              <th className="fin-text-right">KAS KELUAR</th>
              <th className="fin-text-right">SALDO</th>
            </tr>
          </thead>
          <tbody>
            {list.map((trx) => (
              <tr key={trx.id}>
                <td style={{ whiteSpace: 'nowrap' }}>{trx.tanggal}</td>
                <td style={{ fontWeight: 500, color: '#0c1810' }}>{trx.keterangan}</td>
                <td>
                  <span className={`fin-pill ${getPillClass(trx.kategori)}`}>
                    {trx.kategori}
                  </span>
                </td>
                <td className="fin-text-right" style={{ color: trx.masuk !== '-' ? '#0f6130' : '#7f8c8d', fontWeight: trx.masuk !== '-' ? 600 : 400, whiteSpace: 'nowrap' }}>
                  {trx.masuk !== '-' ? `+${trx.masuk}` : '—'}
                </td>
                <td className="fin-text-right" style={{ color: trx.keluar !== '-' ? '#9b2113' : '#7f8c8d', fontWeight: trx.keluar !== '-' ? 500 : 400, whiteSpace: 'nowrap' }}>
                  {trx.keluar !== '-' ? `-${trx.keluar}` : '—'}
                </td>
                <td className="fin-text-right" style={{ fontWeight: 600, color: '#0c1810', whiteSpace: 'nowrap' }}>
                  {trx.saldo}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ background: '#FAFAFA', padding: '16px 24px', borderTop: '1px solid #E5E5E5', fontSize: '12px', color: '#6b7f74', textAlign: 'center', fontWeight: 500 }}>
        {list.length} transaksi ditampilkan · Masuk: {activePeriod.kasMasuk} | Keluar: {activePeriod.kasKeluar} | Saldo: {activePeriod.saldoAkhir}
      </div>
    </div>
  );
}
