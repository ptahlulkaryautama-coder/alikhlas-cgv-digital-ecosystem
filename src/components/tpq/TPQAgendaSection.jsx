import React from 'react';
import { Link } from 'react-router-dom';
import { classifyTPQAgenda, getLocalISODate } from '../../utils/tpqDateUtils.js';

/**
 * TPQAgendaSection — ISO-date-driven temporal classification.
 *
 * Uses tpqDateUtils for runtime-safe local date classification.
 * Boundary Classification:
 * - future date (isoDate > todayISO): upcoming (Akan Datang)
 * - same local date (isoDate === todayISO): hari ini (Hari Ini)
 * - earlier date (isoDate < todayISO): past / arsip (Arsip Agenda)
 * - invalid/missing date: unknown date state (Tanggal Belum Ditentukan)
 *
 * If no future/today items exist → empty-state notice (no invented dates).
 */
export default function TPQAgendaSection({ agenda = [] }) {
  const todayISO = getLocalISODate();
  const { future: sortedFuture, past: sortedPast, unknown: unknownAgenda } = classifyTPQAgenda(
    agenda,
    todayISO
  );

  return (
    <div className="tpq-sec-wrapper">
      {/* ── Section Header ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '20px',
        }}
      >
        <div className="db-sec-eyebrow" style={{ margin: 0 }}>
          E. Agenda TPQ &amp; Kegiatan Akademik
        </div>

        {/* CTA retained per requirement */}
        <Link
          to="/agenda"
          className="button button-outline"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '12px',
            fontWeight: 700,
            padding: '4px 12px',
            borderRadius: '99px',
            color: '#0c2b1d',
            borderColor: 'rgba(12,43,29,0.2)',
            textDecoration: 'none',
          }}
        >
          <span>Lihat Agenda Lengkap</span>
          <span aria-hidden="true">→</span>
        </Link>
      </div>

      {/* ── A. Agenda TPQ Berikutnya ── */}
      <div style={{ marginBottom: '28px' }}>
        <div
          style={{
            fontSize: '11px',
            fontWeight: 800,
            letterSpacing: '0.07em',
            textTransform: 'uppercase',
            color: '#0c2b1d',
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span
            style={{
              display: 'inline-block',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#154d38',
            }}
            aria-hidden="true"
          />
          Agenda TPQ Berikutnya
        </div>

        {sortedFuture.length === 0 ? (
          /* Required empty-state — no invented dates */
          <div
            style={{
              padding: '24px 20px',
              background: '#fdfcf9',
              border: '1px dashed rgba(12,43,29,0.18)',
              borderRadius: '12px',
              textAlign: 'center',
            }}
            role="status"
            aria-live="polite"
          >
            <div style={{ fontSize: '24px', marginBottom: '8px' }} aria-hidden="true">📭</div>
            <p
              style={{
                fontSize: '13px',
                color: '#556b5e',
                margin: 0,
                fontWeight: 500,
              }}
            >
              Belum ada agenda TPQ berikutnya yang dipublikasikan.
            </p>
          </div>
        ) : (
          <div className="tpq-agenda-grid" role="list">
            {sortedFuture.map((agenda) => (
              <AgendaCard
                key={agenda.id}
                agenda={agenda}
                isPast={false}
                isUnknown={false}
                todayISO={todayISO}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── B. Agenda Tanpa Tanggal Konfirmasi (Unknown Date State) ── */}
      {unknownAgenda.length > 0 && (
        <div style={{ marginBottom: '28px' }}>
          <div
            style={{
              fontSize: '11px',
              fontWeight: 800,
              letterSpacing: '0.07em',
              textTransform: 'uppercase',
              color: '#7a4b0a',
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span
              style={{
                display: 'inline-block',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#c9a55a',
              }}
              aria-hidden="true"
            />
            Agenda Menunggu Konfirmasi Tanggal
          </div>
          <div className="tpq-agenda-grid" role="list">
            {unknownAgenda.map((agenda) => (
              <AgendaCard
                key={agenda.id}
                agenda={agenda}
                isPast={false}
                isUnknown={true}
                todayISO={todayISO}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── C. Arsip Agenda TPQ ── */}
      {sortedPast.length > 0 && (
        <div>
          <div
            style={{
              fontSize: '11px',
              fontWeight: 800,
              letterSpacing: '0.07em',
              textTransform: 'uppercase',
              color: '#556b5e',
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span
              style={{
                display: 'inline-block',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#999',
              }}
              aria-hidden="true"
            />
            Arsip Agenda TPQ
          </div>
          <div className="tpq-agenda-grid" role="list">
            {sortedPast.map((agenda) => (
              <AgendaCard
                key={agenda.id}
                agenda={agenda}
                isPast={true}
                isUnknown={false}
                todayISO={todayISO}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Shared AgendaCard sub-component ── */
function AgendaCard({ agenda, isPast, isUnknown, todayISO }) {
  const isToday = !isUnknown && agenda && agenda.isoDate === todayISO;

  return (
    <div
      className="tpq-agenda-card"
      role="listitem"
      style={{
        opacity: isPast ? 0.82 : 1,
      }}
    >
      <div>
        {/* Category + Status badge row */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '6px',
          }}
        >
          <span className="tpq-agenda-cat">{agenda.category}</span>
          <span
            className={`tpq-status-badge ${isUnknown ? 'past' : isPast ? 'past' : 'future'}`}
            aria-label={
              isUnknown
                ? 'Kategori: Tanggal Belum Ditentukan'
                : isToday
                ? 'Kategori: Hari Ini'
                : isPast
                ? 'Kategori: Arsip Agenda'
                : 'Kategori: Akan Datang'
            }
          >
            {isUnknown
              ? '❓ Menunggu Tanggal'
              : isToday
              ? '⚡ Hari Ini'
              : isPast
              ? '📁 Arsip Agenda'
              : '⏳ Akan Datang'}
          </span>
        </div>

        <h4 className="tpq-agenda-title">{agenda.title}</h4>
        <p
          style={{
            fontSize: '12.5px',
            color: '#556b5e',
            lineHeight: 1.5,
            marginBottom: '12px',
          }}
        >
          {agenda.description ||
            'Kegiatan akademik rutin TPQ Al Mardhotillah terbuka untuk santri dan orang tua santri.'}
        </p>
      </div>

      <div className="tpq-agenda-meta">
        <div>
          <span aria-hidden="true">📅</span>{' '}
          <strong>Tanggal:</strong> {agenda.date || 'Belum Ditentukan'} {agenda.time ? `(${agenda.time})` : ''}
        </div>
        <div>
          <span aria-hidden="true">📍</span>{' '}
          <strong>Lokasi:</strong> {agenda.location || 'Ruang TPQ Masjid Al Ikhlas'}
        </div>
      </div>
    </div>
  );
}
