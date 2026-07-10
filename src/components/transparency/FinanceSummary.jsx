import Container from '../common/Container.jsx';

export default function FinanceSummary({ isLoading, summary }) {
  const transactionHelper = summary.donorCount
    ? `${summary.donorCount} donatur tercatat tanpa nama publik`
    : `${summary.transactionCount} catatan ringkas`;
  const stats = [
    { label: 'Total Kas Masuk', value: summary.totalIn, helper: transactionHelper },
    { label: 'Total Kas Keluar', value: summary.totalOut, helper: 'Penggunaan amanah bulan ini' },
    { label: 'Saldo Akhir', value: summary.endingBalance, helper: 'Saldo publik sementara', featured: true },
    { label: 'Campaign Aktif', value: summary.activeCampaign, helper: 'Fokus donasi berjalan' },
  ];

  return (
    <section className="transparency-summary-section" aria-label="Ringkasan keuangan">
      <Container className="finance-summary-grid">
        {stats.map((stat) => (
          <article
            className={`finance-stat-card ${stat.featured ? 'is-featured' : ''}`}
            key={stat.label}
          >
            <p>{stat.label}</p>
            <strong>{isLoading ? 'Memuat data...' : stat.value}</strong>
            <span>{stat.helper}</span>
          </article>
        ))}
      </Container>
    </section>
  );
}
