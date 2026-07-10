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
import '../styles/transparency.css';

const transparencyNavItems = [
  { label: 'Beranda', href: '/' },
  { label: 'Ringkasan', href: '#ringkasan' },
  { label: 'Laporan', href: '#laporan' },
  { label: 'Donasi', href: '#donasi-transparansi' },
];

export default function Transparency() {
  const { summary, isLoading } = useFinanceSummary();

  return (
    <div className="transparency-page">
      <Header navItems={transparencyNavItems} ctaHref="#donasi-transparansi" />
      <main>
        <TransparencyHero isLoading={isLoading} summary={summary} />
        <div id="ringkasan">
          <FinanceSummary isLoading={isLoading} summary={summary} />
        </div>
        <FinanceBreakdown incomeItems={incomeBreakdown} expenseItems={financeBreakdown} />
        <div id="laporan">
          <ReportList reports={monthlyReports} />
        </div>
        <div id="donasi-transparansi">
          <DonationInfo donation={donationInfo} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
