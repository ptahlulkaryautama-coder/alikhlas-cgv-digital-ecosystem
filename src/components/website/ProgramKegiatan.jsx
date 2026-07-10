import { agendaItems } from '../../data/siteContent.js';
import usePrograms from '../../hooks/usePrograms.js';
import Container from '../common/Container.jsx';

export default function ProgramKegiatan() {
  const { programs: publicPrograms, isLoading } = usePrograms();

  return (
    <>
      <section id="program" className="program-section" aria-labelledby="program-title">
        <Container>
          <div className="program-header">
            <p className="label">Program & Kegiatan</p>
            <h2 id="program-title" className="section-title">PROGRAM & KEGIATAN</h2>
            <span className="program-status" aria-live="polite">
              {isLoading ? 'Memuat data...' : 'Program pilihan untuk jamaah.'}
            </span>
          </div>
          <div className="program-grid">
            {publicPrograms.map((program) => (
              <article className="program-card" key={program.id}>
                <p className="program-category">{program.kategori}</p>
                <h3>{program.nama}</h3>
                <p>{program.deskripsi}</p>
                <div className="program-meta">
                  <span>{program.hari} - {program.waktu}</span>
                  <span>{program.lokasi}</span>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section id="agenda" className="agenda-section" aria-labelledby="agenda-title">
        <Container>
          <div className="program-header agenda-header">
            <div>
              <p className="label">Agenda Masjid</p>
              <h2 id="agenda-title" className="section-title">AGENDA & KEGIATAN MENDATANG</h2>
            </div>
            <div className="view-toggle" aria-label="Tampilan agenda">
              <span>Grid</span>
              <span>Kalender</span>
            </div>
          </div>
          <div className="agenda-grid">
            {agendaItems.map((agenda) => (
              <article className="agenda-card" key={agenda.title}>
                <p>{agenda.category}</p>
                <h3>{agenda.title}</h3>
                <strong>{agenda.date}</strong>
                <span>{agenda.meta}</span>
              </article>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
