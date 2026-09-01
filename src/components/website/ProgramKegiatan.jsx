import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import usePrograms from '../../hooks/usePrograms.js';
import useAgendaData from '../../hooks/useAgendaData.js';
import { programRepository } from '../../repositories/programRepository.js';
import { agendaRepository } from '../../repositories/agendaRepository.js';
import Container from '../common/Container.jsx';
import Button from '../common/Button.jsx';

const PRAYER_MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];
const WEEKDAYS = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

export default function ProgramKegiatan({ limitPrograms, limitAgenda, hideProgram, hideAgenda }) {
  const { programs, isLoading: isProgramsLoading } = usePrograms();
  const { agenda, isLoading: isAgendaLoading } = useAgendaData();

  // Program States
  const [progSearch, setProgSearch] = useState('');
  const [selectedKategori, setSelectedKategori] = useState('Semua');

  // Agenda States
  const [agendaView, setAgendaView] = useState('grid'); // 'grid' | 'cal'
  const [calYear, setCalYear] = useState(2026);
  const [calMonth, setCalMonth] = useState(5); // June (0-indexed 5)
  const [selectedDateStr, setSelectedDateStr] = useState('2026-06-07'); // Default to first event

  // ── Program Categories and Filters ──────────────────────────────────────────
  const activeProgramsPool = useMemo(() => {
    return (programs && programs.length > 0) ? programs : programRepository.getInitialPublic();
  }, [programs]);

  const activeAgendaPool = useMemo(() => {
    return (agenda && agenda.length > 0) ? agenda : agendaRepository.getInitialPublic();
  }, [agenda]);

  const uniqueProgramCategories = useMemo(() => {
    if (!activeProgramsPool) return ['Semua'];
    const cats = new Set(activeProgramsPool.map((p) => p.kategori));
    return ['Semua', ...Array.from(cats)];
  }, [activeProgramsPool]);

  const filteredPrograms = useMemo(() => {
    let result = activeProgramsPool || [];

    if (selectedKategori !== 'Semua') {
      result = result.filter((p) => p.kategori === selectedKategori);
    }

    if (progSearch.trim() !== '') {
      const q = progSearch.toLowerCase();
      result = result.filter(
        (p) =>
          (p.nama && p.nama.toLowerCase().includes(q)) ||
          (p.deskripsi && p.deskripsi.toLowerCase().includes(q)) ||
          (p.pemateri && p.pemateri.toLowerCase().includes(q))
      );
    }

    return limitPrograms ? result.slice(0, limitPrograms) : result;
  }, [activeProgramsPool, selectedKategori, progSearch, limitPrograms]);

  // ── Agenda Filtering ────────────────────────────────────────────────────────
  const filteredAgendas = useMemo(() => {
    return limitAgenda ? activeAgendaPool.slice(0, limitAgenda) : activeAgendaPool;
  }, [activeAgendaPool, limitAgenda]);

  // ── Calendar Calculations ──────────────────────────────────────────────────
  const daysInMonth = useMemo(() => {
    return new Date(calYear, calMonth + 1, 0).getDate();
  }, [calYear, calMonth]);

  const firstDayOfWeek = useMemo(() => {
    return new Date(calYear, calMonth, 1).getDay();
  }, [calYear, calMonth]);

  const calendarDays = useMemo(() => {
    const cells = [];
    // Empty cells for padding
    for (let i = 0; i < firstDayOfWeek; i++) {
      cells.push({ day: null, dateStr: '' });
    }
    // Days in month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      cells.push({ day, dateStr });
    }
    return cells;
  }, [calYear, calMonth, daysInMonth, firstDayOfWeek]);

  // Find events for selected date
  const selectedDayEvents = useMemo(() => {
    if (!selectedDateStr) return [];
    return agenda.filter((item) => item.tanggal === selectedDateStr);
  }, [agenda, selectedDateStr]);

  // Handle Month Navigation
  const prevMonth = () => {
    setCalMonth((prev) => {
      if (prev === 0) {
        setCalYear((y) => y - 1);
        return 11;
      }
      return prev - 1;
    });
  };

  const nextMonth = () => {
    setCalMonth((prev) => {
      if (prev === 11) {
        setCalYear((y) => y + 1);
        return 0;
      }
      return prev + 1;
    });
  };

  // Helper to map program category to icons
  const getIconForCategory = (cat = '') => {
    const c = cat.toLowerCase();
    if (c.includes('kitab')) return '📚';
    if (c.includes('bahasa') || c.includes('arab')) return '🗣️';
    if (c.includes('tafsir')) return '📖';
    if (c.includes('tahsin')) return '🎙️';
    if (c.includes('keluarga') || c.includes('nikah')) return '🏠';
    return '🕌';
  };

  // Helper to map program category to 3-tier hierarchy class
  const getHierarchyBadgeClass = (cat = '') => {
    const c = cat.toLowerCase();
    if (c.includes('tahsin') || c.includes('bahasa') || c.includes('tpq') || c.includes('belajar')) {
      return 'tier-class';
    }
    if (c.includes('tematik') || c.includes('event') || c.includes('spesial') || c.includes('tabligh')) {
      return 'tier-event';
    }
    return 'tier-recurring';
  };

  // Helper to map program category to 3-tier hierarchy label
  const getHierarchyBadgeLabel = (cat = '') => {
    const c = cat.toLowerCase();
    if (c.includes('tahsin') || c.includes('bahasa') || c.includes('tpq') || c.includes('belajar')) {
      return 'Kelas & Tahsin';
    }
    if (c.includes('tematik') || c.includes('event') || c.includes('spesial') || c.includes('tabligh')) {
      return 'Kegiatan Tematik';
    }
    return 'Kajian Rutin';
  };

  // Helper to derive target audience for program cards
  const getTargetAudience = (program) => {
    if (program.sasaran) return program.sasaran;
    const c = (program.kategori || '').toLowerCase();
    if (c.includes('tpq') || c.includes('anak')) return 'Santri TPQ & Anak-anak';
    if (c.includes('tahsin') || c.includes('bahasa')) return 'Jamaah Ikhwan & Akhwat';
    return 'Jamaah Umum & Warga CGV';
  };

  // Helper to derive category-based CTA text (all kajian are open public without registration)
  const getCategoryCTALabel = (cat = '') => {
    const c = cat.toLowerCase();
    if (c.includes('tematik') || c.includes('event')) return 'Lihat Detail Program';
    if (c.includes('kitab')) return 'Lihat Detail Kajian';
    if (c.includes('tahsin') || c.includes('bahasa')) return 'Lihat Detail Kelas';
    return 'Lihat Detail Kajian';
  };

  // Helper to derive category-based CTA CSS variant
  const getCategoryCTAVariant = (cat = '') => {
    const c = cat.toLowerCase();
    if (c.includes('tahsin') || c.includes('bahasa') || c.includes('tpq')) return 'variant-class';
    if (c.includes('tematik') || c.includes('event')) return 'variant-event';
    return 'variant-recurring';
  };

  return (
    <>
      {!hideProgram && (
        <section id="program" className="program-section" aria-labelledby="program-title">
          <Container>
            <div className="program-header">
              <p className="label">Program dan Kegiatan <span>البرامج والأنشطة</span></p>
              <h2 id="program-title" className="section-title">PROGRAM DAN KELAS KAJIAN</h2>
              <div className="program-summary-pill-bar">
                <span className="program-status-pill" aria-live="polite">
                  Total Program Aktif: <strong>{isProgramsLoading ? '...' : programs?.length || 0} Program</strong>
                </span>
                <span className="program-status-pill">
                  Lokasi: <strong>Masjid Al Ikhlas CGV</strong>
                </span>
              </div>
            </div>

            {/* Filter controls — only visible in full page, or optionally everywhere for premium UX */}
            {!limitPrograms && (
              <div className="filter-bar">
                <div className="search-input-wrapper">
                  <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Cari kajian, pemateri, atau materi..."
                    value={progSearch}
                    onChange={(e) => setProgSearch(e.target.value)}
                    className="prog-search-input"
                  />
                  {progSearch && (
                    <button onClick={() => setProgSearch('')} className="clear-search-btn">✕</button>
                  )}
                </div>

                <div className="category-pills">
                  {uniqueProgramCategories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedKategori(cat)}
                      className={`category-pill ${selectedKategori === cat ? 'active' : ''}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {isProgramsLoading ? (
              <div className="program-grid">
                {[1, 2, 3].map((n) => (
                  <div className="program-card skeleton" key={n}>
                    <div className="skeleton-line category" />
                    <div className="skeleton-line title" />
                    <div className="skeleton-line text" />
                    <div className="skeleton-line text short" />
                    <div className="skeleton-line footer" />
                  </div>
                ))}
              </div>
            ) : filteredPrograms.length === 0 ? (
              <div className="empty-programs-state">
                <p>{limitPrograms ? 'Jadwal program sedang diperbarui.' : 'Belum ada program yang sesuai dengan pencarian.'}</p>
                {!limitPrograms && (
                  <button
                    onClick={() => {
                      setProgSearch('');
                      setSelectedKategori('Semua');
                    }}
                    className="button button-gold"
                    style={{ marginTop: '16px' }}
                  >
                    Atur Ulang Pencarian
                  </button>
                )}
              </div>
            ) : (
              <div className="program-grid">
                {filteredPrograms.map((program) => (
                  <article className="program-card" key={program.id}>
                    <div className="program-card-top">
                      <div className="program-card-badges">
                        <span className="program-cat-icon">{getIconForCategory(program.kategori)}</span>
                        <span className={`program-hierarchy-pill ${getHierarchyBadgeClass(program.kategori)}`}>
                          {getHierarchyBadgeLabel(program.kategori)}
                        </span>
                      </div>
                      <p className="program-category">{program.kategori}</p>
                    </div>

                    <h3>{program.nama}</h3>

                    <div className="program-meta">
                      <div className="meta-row schedule-highlight">
                        <svg className="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                        <span><strong>{program.hari}</strong> · {program.waktu}</span>
                      </div>

                      {program.pemateri && (
                        <div className="meta-row speaker-row">
                          <svg className="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                          </svg>
                          <span><strong>Pengajar:</strong> {program.pemateri}</span>
                        </div>
                      )}

                      <div className="meta-row location-row">
                        <svg className="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                        <span>{program.lokasi}</span>
                      </div>

                      <div className="meta-row audience-row">
                        <svg className="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                          <circle cx="9" cy="7" r="4" />
                          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                        <span><strong>Peserta:</strong> {getTargetAudience(program)}</span>
                      </div>
                    </div>

                    <p className="program-description-text">{program.deskripsi}</p>

                    <div className="program-card-footer">
                      <Link 
                        to="/kontak" 
                        className={`program-card-cta ${getCategoryCTAVariant(program.kategori)}`}
                      >
                        <span>{getCategoryCTALabel(program.kategori)}</span>
                        <svg className="cta-arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="9 18 15 12 9 6" />
                        </svg>
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {limitPrograms && (
              <div className="program-section-footer">
                <Button href="/program" variant="gold">
                  Lihat Semua Program Kajian
                </Button>
              </div>
            )}
          </Container>
        </section>
      )}

      {!hideAgenda && (
        <section id="agenda" className="agenda-section" aria-labelledby="agenda-title">
          <Container>
            <div className="program-header agenda-header">
              <div>
                <p className="label">Agenda Masjid <span>جدول الفعاليات</span></p>
                <h2 id="agenda-title" className="section-title">
                  {filteredAgendas.some((a) => {
                    if (!a._sortKey || a._sortKey.startsWith('9999')) return false;
                    const [y, m, d] = a._sortKey.split('-').map(Number);
                    return new Date(y, m - 1, d) >= new Date();
                  }) ? 'AGENDA BEBERAPA WAKTU MENDATANG' : 'ARSIP KEGIATAN & AGENDA MASJID'}
                </h2>
              </div>
              
              {/* Active Toggle Switch */}
              <div className="view-toggle" role="group" aria-label="Pilih tampilan agenda">
                <button
                  onClick={() => setAgendaView('grid')}
                  className={agendaView === 'grid' ? 'active' : ''}
                >
                  <svg className="toggle-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="7" height="7" />
                    <rect x="14" y="3" width="7" height="7" />
                    <rect x="3" y="14" width="7" height="7" />
                    <rect x="14" y="14" width="7" height="7" />
                  </svg>
                  <span>Grid</span>
                </button>
                <button
                  onClick={() => setAgendaView('cal')}
                  className={agendaView === 'cal' ? 'active' : ''}
                >
                  <svg className="toggle-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  <span>Kalender</span>
                </button>
              </div>
            </div>

            {isAgendaLoading ? (
              <div className="agenda-grid">
                {[1, 2, 3].map((n) => (
                  <div className="agenda-card skeleton" key={n}>
                    <div className="skeleton-line category" />
                    <div className="skeleton-line title" />
                    <div className="skeleton-line date" />
                    <div className="skeleton-line footer" />
                  </div>
                ))}
              </div>
            ) : agendaView === 'grid' ? (
              <div className="agenda-grid">
                {filteredAgendas.map((item) => (
                  <article className="agenda-card" key={item.id}>
                    <div className="agenda-card-badge-row">
                      <span className={`agenda-badge ${item.badgeClass || 'ag-lain'}`}>
                        {item.kategori}
                      </span>
                    </div>
                    <h3>{item.nama}</h3>
                    
                    <div className="agenda-meta-info">
                      <div className="agenda-meta-item">
                        <svg className="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                          <line x1="16" y1="2" x2="16" y2="6" />
                          <line x1="8" y1="2" x2="8" y2="6" />
                          <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                        <strong>{item.displayDay} {item.displayMonth} {item.year}</strong>
                      </div>
                      <div className="agenda-meta-item">
                        <svg className="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                        </svg>
                        <span>{item.waktu} · {item.lokasi}</span>
                      </div>
                    </div>
                    
                    {item.deskripsi && (
                      <p className="agenda-desc-short">{item.deskripsi}</p>
                    )}
                  </article>
                ))}
              </div>
            ) : (
              /* Premium Interactive Calendar View */
              <div className="calendar-view-container animate-fade-in">
                <div className="calendar-main-grid">
                  <div className="calendar-box">
                    <div className="calendar-nav-header">
                      <button onClick={prevMonth} className="calendar-nav-btn">‹</button>
                      <h3 className="calendar-month-title">
                        {PRAYER_MONTHS[calMonth]} {calYear}
                      </h3>
                      <button onClick={nextMonth} className="calendar-nav-btn">›</button>
                    </div>
                    
                    <div className="calendar-grid-header">
                      {WEEKDAYS.map((day) => (
                        <div key={day} className="calendar-weekday-cell">{day}</div>
                      ))}
                    </div>

                    <div className="calendar-days-grid">
                      {calendarDays.map((cell, idx) => {
                        if (!cell.day) {
                          return <div key={`empty-${idx}`} className="calendar-day-cell empty" />;
                        }

                        const hasEvents = agenda.some((item) => item.tanggal === cell.dateStr);
                        const isSelected = selectedDateStr === cell.dateStr;

                        return (
                          <button
                            key={cell.dateStr}
                            onClick={() => setSelectedDateStr(cell.dateStr)}
                            className={`calendar-day-cell ${hasEvents ? 'has-event' : ''} ${isSelected ? 'selected' : ''}`}
                            aria-label={`Tanggal ${cell.day} ${PRAYER_MONTHS[calMonth]} ${calYear}`}
                          >
                            <span className="day-number">{cell.day}</span>
                            {hasEvents && <span className="event-dot" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="calendar-sidebar-details">
                    <h4 className="sidebar-date-header">
                      Detail Agenda: {selectedDateStr ? (() => {
                        const parts = selectedDateStr.split('-');
                        if (parts.length < 3) return '';
                        const [, m, d] = parts;
                        return `${parseInt(d, 10)} ${PRAYER_MONTHS[parseInt(m, 10) - 1]} ${calYear}`;
                      })() : 'Pilih Tanggal'}
                    </h4>

                    {selectedDayEvents.length === 0 ? (
                      <div className="calendar-no-events">
                        <svg className="no-events-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <circle cx="12" cy="12" r="10" />
                          <line x1="12" y1="8" x2="12" y2="12" />
                          <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                        <p>Belum ada kegiatan di tanggal ini. Coba pilih tanggal yang memiliki titik emas di kalender.</p>
                        <small className="help-text">Klik tanggal yang memiliki tanda titik emas di kalender.</small>
                      </div>
                    ) : (
                      <div className="calendar-events-list">
                        {selectedDayEvents.map((item) => (
                          <article key={item.id} className="calendar-sidebar-event-card">
                            <span className={`agenda-badge ${item.badgeClass || 'ag-lain'}`}>
                              {item.kategori}
                            </span>
                            <h3>{item.nama}</h3>
                            <div className="event-sidebar-meta">
                              <p>
                                <strong>Waktu:</strong> {item.waktu || '—'}
                              </p>
                              <p>
                                <strong>Lokasi:</strong> {item.lokasi || 'Masjid Al Ikhlas'}
                              </p>
                            </div>
                            {item.deskripsi && (
                              <p className="event-sidebar-desc">{item.deskripsi}</p>
                            )}
                          </article>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {limitAgenda && (
              <div className="agenda-section-footer">
                <Button href="/agenda" variant="gold">
                  Lihat Semua Agenda Mendatang
                </Button>
              </div>
            )}
          </Container>
        </section>
      )}
    </>
  );
}
