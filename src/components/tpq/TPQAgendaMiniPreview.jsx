import useAgendaData from '../../hooks/useAgendaData.js';

export default function TPQAgendaMiniPreview() {
  const { agenda, isLoading, source, retry } = useAgendaData({ scope: 'public' });
  const upcoming = agenda
    .filter((item) => item.temporalGroup !== 'archive')
    .slice(0, 4);

  if (isLoading) {
    return (
      <div className="tpq-academic-demo" aria-live="polite">
        Memuat agenda TPQ…
      </div>
    );
  }

  return (
    <div className="tpq-academic-demo" aria-label="Preview read-only Agenda TPQ">
      <div className="tpq-demo-header">
        <div>
          <span>AGENDA TPQ</span>
          <h3>Agenda Terdekat</h3>
          <p>Read-only dari agenda public-safe. Data peserta dan catatan internal tidak ditampilkan.</p>
        </div>
        <strong>{source === 'supabase' ? 'Supabase' : 'Fallback'}</strong>
      </div>

      {upcoming.length === 0 ? (
        <div className="tpq-empty-mini">
          <strong>Belum ada agenda mendatang.</strong>
          <span>Jika agenda sudah dirilis, daftar akan muncul otomatis.</span>
          <button className="tpq-mini-action" type="button" onClick={retry}>Muat ulang</button>
        </div>
      ) : (
        <div className="tpq-agenda-mini-list">
          {upcoming.map((item) => (
            <article className="tpq-agenda-mini-card" key={item.id}>
              <time dateTime={item.isoDate}>
                <strong>{item.displayDay}</strong>
                <span>{item.displayMonth}</span>
              </time>
              <div>
                <small>{item.kategori || 'Agenda'}</small>
                <strong>{item.nama}</strong>
                <span>{item.jam || 'Waktu menyusul'} · {item.lokasi || 'Lokasi menyusul'}</span>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
