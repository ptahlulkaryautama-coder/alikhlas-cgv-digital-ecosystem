import DonationInfo from '../components/transparency/DonationInfo.jsx';
import FinanceBreakdown from '../components/transparency/FinanceBreakdown.jsx';
import FinanceSummary from '../components/transparency/FinanceSummary.jsx';
import ReportList from '../components/transparency/ReportList.jsx';
import TransparencyHero from '../components/transparency/TransparencyHero.jsx';
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

// default public header will be used

export default function Transparency() {
  const { summary, isLoading } = useFinanceSummary();

  return (
    <div className="transparency-page">
      <Header />
      <main>
        <TransparencyHero isLoading={isLoading} summary={summary} />
        <Container style={{ marginTop: '32px', marginBottom: '8px' }}>
          <div style={{
            background: 'rgba(201, 165, 90, 0.08)',
            border: '1px solid rgba(201, 165, 90, 0.35)',
            borderRadius: '16px',
            padding: '24px 28px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '18px',
            boxShadow: '0 4px 16px rgba(12, 43, 29, 0.04)'
          }} role="status">
            <span style={{ fontSize: '26px', lineHeight: 1 }} aria-hidden="true">ℹ️</span>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                <h2 style={{ fontSize: '17px', fontWeight: 700, color: '#0c2b1d', margin: 0, letterSpacing: '-0.01em' }}>
                  Data keuangan sedang diverifikasi
                </h2>
                <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '20px', background: '#FFF3CD', color: '#856404', border: '1px solid #FFEEBA' }}>
                  Dalam verifikasi
                </span>
              </div>
              <p style={{ fontSize: '14px', color: '#3a5244', margin: 0, lineHeight: 1.6 }}>
                Ringkasan keuangan Mei–Juni 2026 sedang diperiksa bersama Bendahara DKM. Angka akan dipublikasikan setelah sumber laporan resmi ditetapkan.
              </p>
            </div>
          </div>
        </Container>
        <div id="ringkasan">
          <FinanceSummary isLoading={isLoading} summary={summary} />
        </div>
        <FinanceBreakdown incomeItems={incomeBreakdown} expenseItems={financeBreakdown} />
        <div id="laporan">
          <ReportList reports={monthlyReports} />
        </div>
        <div id="donasi-transparansi">
          <DonationInfo donation={donationInfo} compact={true} />
        </div>

      </main>
      <Footer />
    </div>
  );
}
