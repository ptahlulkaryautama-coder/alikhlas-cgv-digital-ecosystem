import { useState } from 'react';

const ROLE_ROWS = [
  {
    role: 'Kepala TPQ',
    scope: 'Koordinasi akademik',
    allowed: 'Review kelas, raport, progres, evaluasi pengampu',
    locked: 'Tidak langsung rilis ke website publik',
  },
  {
    role: 'Pengampu',
    scope: 'Kelas yang diampu',
    allowed: 'Absensi, progres, catatan kelas, draft raport',
    locked: 'Tidak melihat semua kelas tanpa otorisasi',
  },
  {
    role: 'Bendahara TPQ',
    scope: 'Kas TPQ',
    allowed: 'Input/import/koreksi keuangan TPQ lewat finance ledger',
    locked: 'Tidak membuka nilai, raport, atau catatan anak',
  },
  {
    role: 'Admin DKM',
    scope: 'Pengaturan & audit',
    allowed: 'Kelola akses, backup, dan rilis konten public-safe',
    locked: 'Tidak boleh bypass private vault',
  },
];

export default function TPQRoleAccessPreview() {
  const [activeRole, setActiveRole] = useState(null);

  return (
    <section className="tpq-role-access" aria-label="Preview matriks role App Pengampu TPQ">
      <div className="tpq-demo-header compact">
        <div>
          <span>ROLE & AKSES</span>
          <h3>Matriks Akses TPQ</h3>
          <p>Preview arah pembagian otoritas. Belum mengubah role/permission Supabase.</p>
        </div>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {ROLE_ROWS.map((r) => (
            <button
              key={r.role}
              type="button"
              onClick={() => setActiveRole(activeRole === r.role ? null : r.role)}
              style={{
                fontSize: '11px',
                fontWeight: 600,
                padding: '3px 8px',
                borderRadius: '4px',
                border: '1px solid rgba(12,24,16,.15)',
                background: activeRole === r.role ? 'var(--db-forest, #0c2b1d)' : '#fff',
                color: activeRole === r.role ? '#fff' : 'var(--db-text-1)',
                cursor: 'pointer',
              }}
            >
              {r.role}
            </button>
          ))}
        </div>
      </div>

      <div className="tpq-role-table" role="table" aria-label="Matriks akses aman TPQ">
        <div className="tpq-role-row is-head" role="row">
          <span role="columnheader">Role</span>
          <span role="columnheader">Scope</span>
          <span role="columnheader">Boleh</span>
          <span role="columnheader">Dikunci</span>
        </div>
        {ROLE_ROWS.map((row) => {
          const isSelected = activeRole === row.role;
          return (
            <div
              className={`tpq-role-row${isSelected ? ' is-selected' : ''}`}
              role="row"
              key={row.role}
              onClick={() => setActiveRole(activeRole === row.role ? null : row.role)}
              style={{
                cursor: 'pointer',
                background: isSelected ? 'rgba(12,43,29,.05)' : undefined,
                borderLeft: isSelected ? '3px solid var(--db-forest, #0c2b1d)' : undefined,
              }}
            >
              <strong role="cell">{row.role}</strong>
              <span role="cell">{row.scope}</span>
              <span role="cell">{row.allowed}</span>
              <span role="cell">{row.locked}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

