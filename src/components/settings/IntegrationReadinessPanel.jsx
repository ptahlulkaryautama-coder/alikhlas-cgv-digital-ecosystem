import useIntegrationReadiness from '../../hooks/useIntegrationReadiness.js';

const RANK_LABEL = {
  ready: 'Siap jalan',
  trial: 'Mode uji',
  locked: 'Aman terkunci',
  unknown: 'Cek ulang',
};

const SCORE = { ready: 2, trial: 1, locked: 0, unknown: 0 };

export default function IntegrationReadinessPanel() {
  const { modules, loading, error, refreshedAt, retry } = useIntegrationReadiness();
  const total = modules.length || 1;
  const points = modules.reduce((sum, item) => sum + (SCORE[item.rank] ?? 0), 0);
  const max = total * 2;
  const percent = Math.round((points / max) * 100);
  const ready = modules.filter((item) => item.rank === 'ready').length;
  const trial = modules.filter((item) => item.rank === 'trial').length;
  const locked = modules.filter((item) => item.rank === 'locked').length;

  return (
    <section className="db-card integration-readiness" aria-labelledby="integration-readiness-title">
      <div className="integration-readiness__head">
        <div>
          <div className="db-sec-eyebrow">Peta Integrasi</div>
          <h2 id="integration-readiness-title">Kesiapan Web, Dashboard, dan TPQ</h2>
          <p>Satu layar untuk melihat apakah jalur data sudah tersambung, masih uji coba, atau sengaja dikunci aman.</p>
        </div>
        <button className="fin-btn" type="button" onClick={retry} disabled={loading}>
          {loading ? 'Memeriksa...' : 'Refresh status'}
        </button>
      </div>

      <div className="integration-readiness__summary" aria-label="Ringkasan kesiapan integrasi">
        <div className="integration-readiness__score">
          <span>{percent}%</span>
          <small>Kesiapan antar lini</small>
        </div>
        <div className="integration-readiness__metrics">
          <span><strong>{ready}</strong> lini siap jalan</span>
          <span><strong>{trial}</strong> lini masih uji</span>
          <span><strong>{locked}</strong> lini dikunci aman</span>
        </div>
      </div>

      {error && <p className="integration-readiness__notice" role="status">Sebagian status belum terbaca: {error}</p>}

      <div className="integration-readiness__grid">
        {modules.map((item) => (
          <article className={`integration-readiness__item is-${item.rank}`} key={item.id}>
            <div className="integration-readiness__item-head">
              <span>{item.area}</span>
              <strong>{RANK_LABEL[item.rank] ?? 'Cek ulang'}</strong>
            </div>
            <h3>{item.title}</h3>
            <p>{item.detail}</p>
            {item.action && <small>{item.action}</small>}
          </article>
        ))}
      </div>

      <footer className="integration-readiness__foot">
        <span>Read-only: panel ini tidak mengubah data dan tidak memuat data santri, wali, nilai, absensi, atau transaksi privat.</span>
        <span>{refreshedAt ? `Update ${refreshedAt.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}` : 'Belum diperbarui'}</span>
      </footer>
    </section>
  );
}
