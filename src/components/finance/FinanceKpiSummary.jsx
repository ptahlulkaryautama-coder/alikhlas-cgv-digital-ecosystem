import { mockKpi } from '../../data/dashboardMockData.js';
import '../../styles/financeAdmin.css';

export default function FinanceKpiSummary({ data, isLoading = false }) {
  const strip = (s) => String(s ?? '').replace(/^Rp\s*/i, '').trim() || '—';

  return (
    <>
      <div className="fin-kpi-grid">
        <div className="fin-kpi-card">
          <div className="fin-kpi-label">KAS MASUK</div>
          <div className="fin-kpi-value">Rp {isLoading ? '...' : strip(data?.totalIn ?? mockKpi.kasMasuk.value)}</div>
          <div className="fin-kpi-hint">{isLoading ? 'Memuat…' : (data?.transactionCount ? `${data.transactionCount} transaksi` : mockKpi.kasMasuk.hint)}</div>
        </div>
        
        <div className="fin-kpi-card">
          <div className="fin-kpi-label">KAS KELUAR</div>
          <div className="fin-kpi-value">Rp {isLoading ? '...' : strip(data?.totalOut ?? mockKpi.kasKeluar.value)}</div>
          <div className="fin-kpi-hint">{isLoading ? 'Memuat…' : mockKpi.kasKeluar.hint}</div>
        </div>

        <div className="fin-kpi-card fin-kpi-highlight">
          <div className="fin-kpi-label">SALDO AKHIR</div>
          <div className="fin-kpi-value">Rp {isLoading ? '...' : strip(data?.endingBalance ?? mockKpi.saldoAkhir.value)}</div>
          <div className="fin-kpi-hint">{isLoading ? 'Memuat…' : 'Surplus bulan ini'}</div>
        </div>
      </div>

      <div className="fin-kpi-row-2">
        <div className="fin-kpi-card" style={{ maxWidth: '320px' }}>
          <div className="fin-kpi-label">TRANSAKSI</div>
          <div className="fin-kpi-value">{isLoading ? '...' : (data?.transactionCount ?? '44')}</div>
          <div className="fin-kpi-hint">{isLoading ? 'Memuat…' : (data?.updatedAt ? `Terakhir ${data.updatedAt}` : 'Terakhir 27 Mei')}</div>
        </div>
      </div>
    </>
  );
}
