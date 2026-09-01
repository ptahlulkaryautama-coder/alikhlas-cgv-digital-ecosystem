import useSupabaseFinanceReadModel from '../../hooks/useSupabaseFinanceReadModel.js';
import '../../styles/financeAdmin.css';

const money = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 });
const date = new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
const statusLabel = { approved: 'Disetujui', published: 'Dipublikasikan' };

export default function FinanceSupabaseSnapshot({ scope }) {
  const { data, isLoading, error, source, retry } = useSupabaseFinanceReadModel(scope);
  if (isLoading) return <section className="fin-live-card fin-live-state" aria-live="polite">Memuat ringkasan keuangan Supabase…</section>;
  if (error) return <section className="fin-live-card fin-live-state" role="alert"><span>{error}</span><button className="fin-btn" onClick={retry}>Coba lagi</button></section>;
  if (source === 'empty' || !data) return null;
  const maxCategory = Math.max(...[...data.incomeBreakdown, ...data.expenseBreakdown].map((item) => item.amount), 1);

  return <section className="fin-live-card" aria-labelledby={`fin-live-${scope}`}>
    <header className="fin-live-header">
      <div><div className="db-sec-eyebrow">SNAPSHOT KEUANGAN SUPABASE</div><h2 id={`fin-live-${scope}`}>Keuangan {scope === 'tpq' ? 'TPQ' : 'DKM'}</h2><p>Satu dataset untuk ringkasan, kategori, saldo berjalan, dan transaksi.</p></div>
      <div className="fin-live-badges"><span className="fin-live-test">Data uji</span><span className="fin-live-approved">{statusLabel[data.workflowStatus] || data.workflowStatus}</span></div>
    </header>
    <div className="fin-live-kpis">
      <article><span>Saldo awal</span><strong>{money.format(data.openingBalance)}</strong></article>
      <article><span>Kas masuk</span><strong>{money.format(data.totalIncome)}</strong></article>
      <article><span>Kas keluar</span><strong>{money.format(data.totalExpense)}</strong></article>
      <article className="is-primary"><span>Saldo akhir</span><strong>{money.format(data.endingBalance)}</strong></article>
    </div>
    <div className="fin-live-grid">
      <div className="fin-live-breakdown"><h3>Rekap kategori</h3>{[...data.incomeBreakdown.map((item) => ({ ...item, direction: 'Masuk' })), ...data.expenseBreakdown.map((item) => ({ ...item, direction: 'Keluar' }))].map((item) => <div className="fin-live-category" key={`${item.direction}-${item.category}`}><div><span>{item.category}</span><small>{item.direction}</small><strong>{money.format(item.amount)}</strong></div><i><b style={{ width: `${Math.max(6, item.amount / maxCategory * 100)}%` }} /></i></div>)}</div>
      <div className="fin-live-transactions"><h3>Transaksi terbaru</h3><div className="fin-live-table-wrap"><table><thead><tr><th>Tanggal</th><th>Keterangan</th><th>Kategori</th><th>Nominal</th><th>Saldo</th></tr></thead><tbody>{data.transactions.slice(-10).reverse().map((row) => <tr key={row.id}><td>{date.format(new Date(`${row.date}T00:00:00`))}</td><td>{row.description}</td><td>{row.category}</td><td className={row.direction === 'income' ? 'is-income' : 'is-expense'}>{row.direction === 'income' ? '+' : '−'}{money.format(row.amount)}</td><td>{money.format(row.runningBalance)}</td></tr>)}</tbody></table></div></div>
    </div>
    <footer className="fin-live-footer">Batch {data.batchId} · Periode {data.period} · {data.transactionCount} transaksi · Lingkungan {data.environment}</footer>
  </section>;
}
