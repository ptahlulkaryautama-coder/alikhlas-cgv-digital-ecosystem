import useSupabaseFinanceReadModel from '../../hooks/useSupabaseFinanceReadModel.js';

const money = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
});

export default function TPQFinanceMiniSnapshot() {
  const { data, isLoading, error, source, retry } = useSupabaseFinanceReadModel('tpq');

  if (isLoading) {
    return (
      <div className="tpq-academic-demo" aria-live="polite">
        Memuat snapshot Kas TPQ…
      </div>
    );
  }

  if (error) {
    return (
      <div className="tpq-academic-demo" role="alert">
        <div className="tpq-demo-header">
          <div>
            <span>KAS TPQ</span>
            <h3>Snapshot belum termuat</h3>
            <p>{error}</p>
          </div>
          <button className="tpq-mini-action" type="button" onClick={retry}>Coba lagi</button>
        </div>
      </div>
    );
  }

  if (source === 'empty' || !data) {
    return (
      <div className="tpq-academic-demo">
        <div className="tpq-demo-header">
          <div>
            <span>KAS TPQ</span>
            <h3>Belum ada ledger terpublikasi</h3>
            <p>Jika batch TPQ sudah dipublikasikan, ringkasan kas akan muncul otomatis di sini.</p>
          </div>
          <strong>Read-only</strong>
        </div>
      </div>
    );
  }

  const recentTransactions = data.transactions.slice(-3).reverse();

  return (
    <div className="tpq-academic-demo" aria-label="Snapshot read-only Kas TPQ">
      <div className="tpq-demo-header">
        <div>
          <span>KAS TPQ</span>
          <h3>Snapshot Ledger TPQ</h3>
          <p>Ringkasan read-only dari finance ledger. Tidak memuat nama santri atau detail pembayaran privat.</p>
        </div>
        <strong>{data.environment === 'production' ? 'Produksi' : 'Data uji'}</strong>
      </div>

      <div className="tpq-finance-mini-kpis">
        <article>
          <small>Kas masuk</small>
          <strong>{money.format(data.totalIncome)}</strong>
        </article>
        <article>
          <small>Kas keluar</small>
          <strong>{money.format(data.totalExpense)}</strong>
        </article>
        <article className="is-primary">
          <small>Saldo akhir</small>
          <strong>{money.format(data.endingBalance)}</strong>
        </article>
      </div>

      <div className="tpq-demo-list">
        {recentTransactions.map((row) => (
          <article className="tpq-demo-row" key={row.id}>
            <div>
              <small>{row.date}</small>
              <strong>{row.category}</strong>
            </div>
            <span className={row.direction === 'income' ? 'is-income' : 'is-expense'}>
              {row.direction === 'income' ? '+' : '−'}{money.format(row.amount)}
            </span>
          </article>
        ))}
      </div>
    </div>
  );
}
