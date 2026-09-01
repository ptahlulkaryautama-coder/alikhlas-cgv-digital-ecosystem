import useProductionReadiness from '../../hooks/useProductionReadiness.js';

export default function ProductionReadinessGate() {
  const { checks, ready, passed, blocked, loading, refreshedAt, retry } = useProductionReadiness();
  return (
    <section className={`db-card production-gate${ready ? ' is-ready' : ' is-blocked'}`} aria-labelledby="production-gate-title">
      <div className="production-gate__head">
        <div>
          <div className="db-sec-eyebrow">Gate Production</div>
          <h2 id="production-gate-title">Kunci Kesiapan Rilis Sistem</h2>
          <p>Checklist otomatis sebelum dashboard dianggap siap produksi. Ini membantu memastikan mode uji tertutup, daftar rilis bersih, dan website membaca data production.</p>
        </div>
        <button className="fin-btn" type="button" onClick={retry} disabled={loading}>
          {loading ? 'Memeriksa...' : 'Cek ulang'}
        </button>
      </div>

      <div className="production-gate__result">
        <div>
          <span>{ready ? 'Siap produksi' : 'Belum siap produksi'}</span>
          <strong>{passed}/{checks.length}</strong>
        </div>
        <p>{ready ? 'Semua pengecekan otomatis aman. Tetap minta keputusan DKM sebelum deploy/rilis resmi.' : `${blocked} hal masih perlu dibereskan sebelum dipakai sebagai production.`}</p>
      </div>

      <div className="production-gate__checks">
        {checks.map((check) => (
          <article className={check.pass ? 'is-pass' : 'is-fail'} key={check.id}>
            <div>
              <span aria-hidden="true">{check.pass ? '✓' : '!'}</span>
              <h3>{check.title}</h3>
            </div>
            <p>{check.detail}</p>
          </article>
        ))}
      </div>

      <footer className="production-gate__foot">
        <span>Gate ini hanya membaca status. Tidak deploy, tidak publish, dan tidak mengubah data.</span>
        <span>{refreshedAt ? `Update ${refreshedAt.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}` : 'Belum diperbarui'}</span>
      </footer>
    </section>
  );
}
