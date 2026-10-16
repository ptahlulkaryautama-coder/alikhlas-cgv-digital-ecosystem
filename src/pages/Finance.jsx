import React, { useState } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout.jsx';
import FinanceCategoryBreakdown from '../components/finance/FinanceCategoryBreakdown.jsx';
import FinanceDailyBalanceChart from '../components/finance/FinanceDailyBalanceChart.jsx';
import FinanceKpiSummary from '../components/finance/FinanceKpiSummary.jsx';
import FinanceCashFlowRatio from '../components/finance/FinanceCashFlowRatio.jsx';
import FinanceMonthlyReport from '../components/finance/FinanceMonthlyReport.jsx';
import FinanceTransactionTable from '../components/finance/FinanceTransactionTable.jsx';
import FinanceImportPanel from '../components/finance/FinanceImportPanel.jsx';
import FinanceApprovalPanel from '../components/finance/FinanceApprovalPanel.jsx';
import FinanceBatchHistory from '../components/finance/FinanceBatchHistory.jsx';
import FinancePilotGuide from '../components/finance/FinancePilotGuide.jsx';
import FinanceManualEntryPanel from '../components/finance/FinanceManualEntryPanel.jsx';
import FinanceCorrectionPanel from '../components/finance/FinanceCorrectionPanel.jsx';
import useFinanceData from '../hooks/useFinanceData.js';
import useSupabaseFinanceReadModel from '../hooks/useSupabaseFinanceReadModel.js';
import { financePeriods } from '../data/siteContent.js';
import qrisUrl from '../assets/qris-alikhlas.png';
import '../styles/dashboard.css';
import '../styles/financeAdmin.css';

export default function Finance() {
  const [selectedPeriodKey, setSelectedPeriodKey] = useState('september2026');
  const { data: apiData, isLoading: isApiLoading } = useFinanceData();
  const periodIso = selectedPeriodKey === 'september2026' ? '2026-09-01' : selectedPeriodKey === 'agustus2026' ? '2026-08-01' : selectedPeriodKey === 'mei2026' ? '2026-05-01' : '2026-06-01';
  const financeLive = useSupabaseFinanceReadModel('dkm', periodIso);

  const activePeriod = financePeriods[selectedPeriodKey] || financePeriods.september2026;
  const fallbackData = {
    period: activePeriod.label,
    totalIn: activePeriod.kasMasuk,
    totalOut: activePeriod.kasKeluar,
    endingBalance: activePeriod.saldoAkhir,
    transactionCount: activePeriod.transactionCount,
    kpi: {
      kasMasuk: { value: activePeriod.kasMasuk.replace('Rp ', ''), hint: activePeriod.kasMasukHint },
      kasKeluar: { value: activePeriod.kasKeluar.replace('Rp ', ''), hint: activePeriod.kasKeluarHint },
      saldoAkhir: { value: activePeriod.saldoAkhir.replace('Rp ', ''), hint: activePeriod.saldoAkhirHint },
    }
  };
  const displayData = financeLive.data ? {
    period: new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric' }).format(new Date(`${financeLive.data.period}T00:00:00`)),
    totalIn: financeLive.data.totalIncome,
    totalOut: financeLive.data.totalExpense,
    endingBalance: financeLive.data.endingBalance,
    transactionCount: financeLive.data.transactionCount,
  } : fallbackData;

  const period = displayData.period;

  // Get current day name and formatted date in Indonesian
  const getFormattedPrintDate = () => {
    const today = new Date();
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    const dayName = days[today.getDay()];
    const dateNum = today.getDate();
    const monthName = months[today.getMonth()];
    const year = today.getFullYear();
    return `Dicetak: ${dayName}, ${dateNum} ${monthName} ${year}`;
  };

  return (
    <DashboardLayout
      title="Keuangan"
      subtitle={`Buku Kas Masjid · ${period}`}
      activeId="keuangan"
      period={period}
    >
      <div className="db-page-container">
        <div className={`fin-source-strip ${financeLive.source === 'supabase' ? 'is-supabase' : ''}`} role="status">
          <span>{financeLive.source === 'supabase' ? `Data Uji Supabase · ${financeLive.data.workflowStatus}` : financeLive.error || 'Sumber saat ini: repository/fallback'}</span>
          {financeLive.error && <button className="fin-btn" onClick={financeLive.retry}>Coba lagi</button>}
        </div>
        {/* ── Prototype Warning Banner ──────────────────────────────────── */}
        <div style={{ background: '#FFF3CD', border: '1px solid #FFEEBA', borderRadius: '12px', padding: '14px 20px', color: '#856404', fontSize: '13.5px', fontWeight: 600, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }} role="status">
          <span style={{ fontSize: '18px' }} aria-hidden="true">⚠️</span>
          <span>Data kerja/prototype — disahkan DKM untuk periode aktif.</span>
        </div>

        {/* ── Top Module Banner ────────────────────────────────────────── */}
        <div className="db-top-banner">
          <div className="db-banner-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </div>
          <div className="db-banner-content">
            <div className="db-banner-title">Transparansi &amp; Amanah</div>
            <div className="db-banner-sub">Masjid Al Ikhlas Cipta Greenville · DKM Al Ikhlas CGV</div>
          </div>
        </div>

        {/* ── Page Header ────────────────────────────────────────────── */}
        <div className="db-pg-header" style={{ flexWrap: 'wrap', gap: '16px', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div className="db-pg-eyebrow">Laporan Keuangan (Internal Review)</div>
            <h1 className="db-pg-title">
              Buku Kas Masjid<br />
              <i>Al Ikhlas CGV</i>
            </h1>
            <p className="db-pg-desc">Laporan {displayData.transactionCount} entri mutasi {period} · BSI No. Rek 1500600069</p>
          </div>

          {/* Period selector */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--db-text-3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Pilih Periode Laporan:
            </span>
            <select 
              value={selectedPeriodKey} 
              onChange={(e) => setSelectedPeriodKey(e.target.value)}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: '1px solid rgba(12,24,16,.15)',
                background: 'var(--db-bg-card)',
                color: 'var(--db-text-1)',
                fontWeight: 600,
                fontFamily: 'inherit',
                fontSize: '13px',
                outline: 'none',
                cursor: 'pointer',
                boxShadow: 'var(--db-sh-sm)',
              }}
            >
              <option value="september2026">September 2026 (Disahkan Bendahara DKM)</option>
              <option value="agustus2026">Agustus 2026 (Disahkan Bendahara DKM)</option>
              <option value="juni2026">Juni 2026 (Arsip Internal)</option>
              <option value="mei2026">Mei 2026 (Arsip Internal)</option>
            </select>
          </div>
        </div>

        {/* ── KPI cards ────────────────────────────────────────────────── */}
        <FinanceKpiSummary data={displayData} isLoading={financeLive.isLoading} />

        {/* ── Visual Cash Flow Waterfall & Ratio ───────────────────────── */}
        <FinanceCashFlowRatio data={displayData} isLoading={financeLive.isLoading} />

        {/* ── Saldo Harian (Line Chart) ────────────────────────────────── */}
        <FinanceDailyBalanceChart selectedPeriod={selectedPeriodKey} data={financeLive.data} />

        {/* ── Category breakdown (Donut chart & list) ───────────────── */}
        <FinanceCategoryBreakdown selectedPeriod={selectedPeriodKey} data={financeLive.data} />

        {/* ── Transaction list ──────────────────────────────────────── */}
        <FinanceTransactionTable selectedPeriod={selectedPeriodKey} data={financeLive.data} source={financeLive.source} />

        <FinanceManualEntryPanel scope="dkm" />
        <FinanceCorrectionPanel scope="dkm" />
        <FinanceImportPanel scope="dkm" />
        <FinanceApprovalPanel scope="dkm" />
        <FinanceBatchHistory scope="dkm" />
        <FinancePilotGuide scope="dkm" />

        {/* ── Monthly report list ───────────────────────────────────── */}
        <FinanceMonthlyReport />

        {/* ── Page 6 DKM Info Grid (Rekening & QRIS & Kontak) ───────────── */}
        <div className="fin-info-grid">
          <div className="fin-info-card">
            <div className="fin-info-label">REKENING DONASI</div>
            <div className="fin-info-title">BSI · 1500600069</div>
            <div className="fin-info-value">
              a.n. Masjid Al Ikhlas Cipta Green Ville<br /><br />
              <strong>Konfirmasi Transfer:</strong><br />
              <a href="https://wa.me/6281375410997" target="_blank" rel="noopener noreferrer" style={{ color: '#0c2b1d', fontWeight: 600, textDecoration: 'none' }}>
                +62 813-7541-0997
              </a> (Zulhendy Masruddin)
            </div>
          </div>

          <div className="fin-info-card" style={{ display: 'flex', alignItems: 'center', gap: '20px', justifyContent: 'space-between' }}>
            <div style={{ flex: 1 }}>
              <div className="fin-info-label">QRIS</div>
              <div className="fin-info-title" style={{ fontSize: '16px' }}>MASJID AL IKHLAS CGV</div>
              <div className="fin-info-value" style={{ fontSize: '11px', color: '#6b7f74', marginTop: '6px' }}>
                NMID: ID1024337942592<br />
                Bank Syariah Indonesia
              </div>
            </div>
            <img 
              src={qrisUrl} 
              alt="QRIS Donasi Masjid" 
              style={{ width: '100px', height: '100px', objectFit: 'contain', border: '1px solid #E5E5E5', borderRadius: '8px', padding: '4px' }} 
            />
          </div>
        </div>

        <div className="fin-info-grid" style={{ gridTemplateColumns: '1fr' }}>
          <div className="fin-info-card">
            <div className="fin-info-label">KONTAK DKM</div>
            <div className="fin-info-title">DKM Al Ikhlas Cipta Greenville</div>
            <div className="fin-info-value">
              Masjid Al Ikhlas, Cipta Greenville, Tembesi, Batam, Kepulauan Riau<br />
              <a href="https://www.youtube.com/@alikhlascgv" target="_blank" rel="noopener noreferrer" style={{ color: '#0c2b1d', fontWeight: 500 }}>
                Kanal YouTube Al Ikhlas CGV
              </a>
            </div>
          </div>
        </div>

        {/* ── Official Print Footer ────────────────────────────────────── */}
        <footer className="fin-print-footer">
          <div>Pratinjau prototype · Laporan Kas · Masjid Al Ikhlas Cipta Greenville · Bank Syariah Indonesia BSI-451 · No. Rek 1500600069</div>
          <div className="fin-print-quote">
            "Sesungguhnya Allah menyuruh kamu menyampaikan amanah kepada yang berhak menerimanya." (QS An-Nisa: 58)
          </div>
          <div>{getFormattedPrintDate()}</div>
        </footer>
      </div>
    </DashboardLayout>
  );
}
