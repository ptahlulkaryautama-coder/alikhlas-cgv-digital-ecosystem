import React from 'react';
import { tpqRepository } from '../../repositories/tpqRepository.js';

const TPQ_TEACHING_TEAM = tpqRepository.getAll().teachingTeam;

/**
 * TPQTeachersSection — General Tim Pengajar overview.
 *
 * Renders aggregate role-capacity cards only.
 * No personal names, no personal schedules, no photographs, no biographies.
 * Individual staff profiles will be rendered here once DKM name-display approval is obtained.
 */

/** Neutral geometric placeholder icon per role — non-personal, non-emoji-face. */
const ROLE_ICONS = ['📖', '📗', '🕌', '⭐'];

export default function TPQTeachersSection() {
  return (
    <div className="tpq-sec-wrapper">

      {/* ── Section header ── */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '10px',
          marginBottom: '6px',
        }}
      >
        <div className="db-sec-eyebrow" style={{ margin: 0 }}>
          Tim Pengajar TPQ
        </div>
        <span
          style={{
            fontSize: '9.5px',
            fontWeight: 700,
            padding: '2px 8px',
            borderRadius: '4px',
            background: '#fdf4e3',
            color: '#7a4b0a',
            border: '1px solid rgba(122,75,10,0.18)',
          }}
          aria-label="Tampilan prototipe: nama pengajar menunggu persetujuan DKM"
        >
          🔒 Prototipe — Nama Menunggu Persetujuan
        </span>
      </div>

      {/* Aggregate count line */}
      <p
        style={{
          fontSize: '12.5px',
          color: '#556b5e',
          marginBottom: '16px',
          lineHeight: 1.5,
        }}
      >
        TPQ Al Mardhotillah diampu oleh{' '}
        <strong>4 tenaga pengajar</strong> yang berdedikasi, terdiri dari Ustadz dan
        Ustadzah berpengalaman di bidang Iqra, Tajwid, dan Tahfiz Al-Qur'an.
      </p>

      {/* Role-capacity grid */}
      <div className="tpq-teachers-grid">
        {TPQ_TEACHING_TEAM.map((member) => (
          <div className="tpq-teacher-card" key={member.id}>
            <div>
              {/* Neutral role-icon placeholder — no photo, no initial tied to a name */}
              <div
                className="tpq-teacher-avatar"
                aria-hidden="true"
                style={{
                  background: '#f0f5f2',
                  color: '#154d38',
                  fontSize: '26px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {member.icon}
              </div>

              {/* Role label only — no personal name */}
              <h4 className="tpq-teacher-name" style={{ fontSize: '14px' }}>
                {member.roleLabel}
              </h4>

              {/* Schedule: tied to the role/class, not to an individual */}
              <div
                className="tpq-teacher-role"
                style={{ fontSize: '11.5px', marginBottom: '8px' }}
              >
                <span aria-hidden="true">🕐</span> {member.schedule}
              </div>

              <p className="tpq-teacher-bio">{member.desc}</p>
            </div>

            <div className="tpq-teacher-spec">
              <span aria-hidden="true">💡</span>{' '}
              <strong>Bidang:</strong> {member.focus}
            </div>
          </div>
        ))}
      </div>

      {/* Disclosure notice */}
      <div
        style={{
          marginTop: '16px',
          padding: '10px 14px',
          background: '#fdf4e3',
          border: '1px solid rgba(122,75,10,0.15)',
          borderRadius: '8px',
          fontSize: '11.5px',
          color: '#7a4b0a',
          lineHeight: 1.55,
        }}
        role="note"
      >
        <strong>Catatan Prototipe:</strong> Informasi nama pengajar memerlukan persetujuan
        resmi DKM sebelum ditampilkan. Profil individual akan dimuat setelah persetujuan
        diperoleh. Data lengkap tersimpan dan dapat diaktifkan oleh pengelola sistem.
      </div>
    </div>
  );
}
