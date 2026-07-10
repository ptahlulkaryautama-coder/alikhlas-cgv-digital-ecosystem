import Container from '../common/Container.jsx';

function BreakdownColumn({ title, description, items, tone = 'forest' }) {
  return (
    <article className="breakdown-card">
      <div className="breakdown-head">
        <p className="label">{title}</p>
        <span>{description}</span>
      </div>
      <div className="breakdown-list">
        {items.map((item) => (
          <div className="breakdown-item" key={item.label}>
            <div>
              <strong>{item.label}</strong>
              <span>{item.amount}</span>
            </div>
            <i aria-hidden="true">
              <b className={`tone-${tone}`} style={{ width: `${item.percent}%` }} />
            </i>
            <em>{item.percent}%</em>
          </div>
        ))}
      </div>
    </article>
  );
}

export default function FinanceBreakdown({ incomeItems, expenseItems }) {
  return (
    <section className="finance-breakdown-section" aria-labelledby="breakdown-title">
      <Container>
        <div className="section-kicker-block wide">
          <p className="label">Ringkasan Amanah</p>
          <h2 id="breakdown-title" className="section-title">
            Dana diringkas agar mudah dipahami.
          </h2>
          <p className="section-copy">
            Tampilan ini sengaja tidak menampilkan tabel mentah. Jamaah cukup melihat sumber
            pemasukan utama dan penggunaan dana per kategori publik.
          </p>
        </div>
        <div className="finance-breakdown-grid">
          <BreakdownColumn
            title="Sumber Masuk"
            description="Komposisi pemasukan publik"
            items={incomeItems}
          />
          <BreakdownColumn
            title="Penggunaan Keluar"
            description="Kategori penggunaan dana"
            items={expenseItems}
            tone="gold"
          />
        </div>
      </Container>
    </section>
  );
}
