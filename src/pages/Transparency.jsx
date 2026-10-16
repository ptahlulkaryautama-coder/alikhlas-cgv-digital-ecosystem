import React from 'react';
import DonationInfo from '../components/transparency/DonationInfo.jsx';
import FinanceBreakdown from '../components/transparency/FinanceBreakdown.jsx';
import FinanceSummary from '../components/transparency/FinanceSummary.jsx';
import PublicCashflowChart from '../components/transparency/PublicCashflowChart.jsx';
import PublicTransactionTable from '../components/transparency/PublicTransactionTable.jsx';
import ReportList from '../components/transparency/ReportList.jsx';
import TransparencyHero from '../components/transparency/TransparencyHero.jsx';
import TransparencyTopicBar from '../components/transparency/TransparencyTopicBar.jsx';
import Footer from '../components/website/Footer.jsx';
import Header from '../components/website/Header.jsx';
import {
  donationInfo,
  financeBreakdown,
  incomeBreakdown,
  monthlyReports,
} from '../data/siteContent.js';
import useFinanceSummary from '../hooks/useFinanceSummary.js';
import Container from '../components/common/Container.jsx';
import '../styles/transparency.css';

export default function Transparency() {
  const { summary, isLoading } = useFinanceSummary();

  return (
    <div className="transparency-page">
      <Header />
      <main>
        {/* 1. Hero Section with Quick Overview */}
        <TransparencyHero isLoading={isLoading} summary={summary} />

        {/* 2. In-Page Sticky Topic Jump Bar */}
        <TransparencyTopicBar transactionCount={summary?.combined?.totalTransactions || summary?.transactionCount || '70'} />

        {/* 3. Official Endorsement Banner */}
        <Container className="verified-banner-container" style={{ marginTop: '16px', marginBottom: '8px' }}>
          <div className="public-verified-banner" role="status">
            <div className="verified-icon-circle">
              <span>✓</span>
            </div>
            <div style={{ flex: 1 }}>
              <div className="verified-banner-top">
                <h2 className="verified-banner-title">
                  Laporan Kas &amp; Dana Sosial Resmi Terverifikasi DKM
                </h2>
                <span className="verified-pill">
                  Status: Terverifikasi
                </span>
              </div>
              <p className="verified-banner-text">
                Buku Kas Periode <strong>September 2026</strong> (Kas Masjid: <strong>Rp 14.850.208</strong> · Dana Sosial JPU: <strong>Rp 4.500.000</strong> · Total Likuiditas: <strong>Rp 19.350.208</strong>) telah diteliti dan disahkan resmi oleh <strong>Karya HP (Ketua DKM)</strong>, <strong>Zulhendy M (Sekretaris)</strong>, dan <strong>Bambang S (Bendahara)</strong> dengan rekening resmi BSI No. Rek <strong>1500600069</strong>.
              </p>
            </div>
          </div>
        </Container>

        {/* 4. 4 Main Financial KPI Cards */}
        <div id="ringkasan">
          <FinanceSummary isLoading={isLoading} summary={summary} />
        </div>

        {/* 5. Cash Flow Trend Chart */}
        <div id="grafik-kas">
          <PublicCashflowChart />
        </div>

        {/* 5. Income Composition & Expense Allocation */}
        <div id="alokasi-dana">
          <FinanceBreakdown incomeItems={incomeBreakdown} expenseItems={financeBreakdown} summary={summary} />
        </div>

        {/* 6. Full 13 Transparent Transaction Ledger */}
        <div id="buku-kas-terbuka">
          <PublicTransactionTable />
        </div>

        {/* 7. Archive of Reports */}
        <div id="laporan">
          <ReportList reports={monthlyReports} />
        </div>

        {/* 8. Donation & QRIS Channels */}
        <div id="donasi-transparansi">
          <DonationInfo donation={donationInfo} compact={true} />
        </div>
      </main>
      <Footer />
    </div>
  );
}

