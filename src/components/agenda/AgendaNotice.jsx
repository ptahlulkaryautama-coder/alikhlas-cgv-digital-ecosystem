export default function AgendaNotice({ source = 'fallback', isLoading = false, total = 0 }) {
  const connected = source === 'supabase' || source === 'api';
  const sourceLabel = source === 'supabase' ? 'Supabase PostgreSQL' : source === 'api' ? 'Read proxy' : 'Data repository sementara';
  return <section className={`program-source-notice ${connected?'is-connected':'is-fallback'}`} aria-label="Status sumber data Agenda">
    <div className="program-source-indicator" aria-hidden="true" />
    <div><strong>{isLoading?'Memuat data Agenda…':sourceLabel}</strong><span>{isLoading?'Mohon tunggu':`${total} agenda terbaca · data peserta tidak ditampilkan`}</span></div>
    <span className="program-source-mode">{connected?'TERHUBUNG':'SEMENTARA'}</span>
  </section>;
}
