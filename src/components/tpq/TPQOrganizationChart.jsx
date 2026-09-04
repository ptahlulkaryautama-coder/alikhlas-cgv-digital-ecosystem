import React from 'react';
import Container from '../common/Container.jsx';

export default function TPQOrganizationChart({ structure }) {
  if (!structure) return null;

  return (
    <section className="tpq-org-section" id="struktur-organisasi" aria-labelledby="org-title">
      <Container size="xl">
        <div className="tpq-section-header">
          <p className="tpq-section-kicker">Struktur Lembaga</p>
          <h2 id="org-title" className="tpq-section-title">
            Bagan Struktur Organisasi TPQ
          </h2>
          <p className="tpq-section-desc">
            Tata kelola kelembagaan dan pembinaan pendidikan Al-Qur'an terpadu di bawah naungan DKM Masjid Al Ikhlas CGV.
          </p>
        </div>

        <div className="tpq-org-tree-wrapper">
          {/* Level 1: Pembina */}
          <div className="org-tree-level level-pembina">
            <div className="org-node-card card-pembina">
              <div className="org-node-badge">Pelindung &amp; Pembina</div>
              <h3 className="org-node-name">{structure.pembina?.name}</h3>
              <p className="org-node-inst">{structure.pembina?.institution}</p>
              <p className="org-node-desc">{structure.pembina?.description}</p>
            </div>
          </div>

          <div className="org-tree-connector-line" aria-hidden="true" />

          {/* Level 2: Mudir & Tata Usaha */}
          <div className="org-tree-level level-leaders">
            <div className="org-node-card card-mudir">
              <div className="org-node-badge badge-gold">Kepala / Mudir TPQ</div>
              <h3 className="org-node-name">{structure.mudir?.name}</h3>
              <span className="org-node-degree">{structure.mudir?.titleDegree}</span>
              {structure.mudir?.hafalanJuz && (
                <div className="org-node-hafalan">
                  <span className="hafalan-star">⭐</span> {structure.mudir?.hafalanJuz}
                </div>
              )}
              <p className="org-node-desc">{structure.mudir?.description}</p>
            </div>

            <div className="org-node-card card-admin">
              <div className="org-node-badge badge-blue">Administrasi &amp; Santri</div>
              <h3 className="org-node-name">{structure.administrasi?.name}</h3>
              <span className="org-node-degree">{structure.administrasi?.titleDegree}</span>
              <p className="org-node-desc">{structure.administrasi?.description}</p>
            </div>
          </div>

          <div className="org-tree-connector-line" aria-hidden="true" />

          {/* Level 3: Dewan Asatidz Banner */}
          <div className="org-tree-level level-asatidz-kicker">
            <div className="asatidz-tree-banner">
              <span>Dewan Asatidz &amp; Pengampu Kelompok Belajar Santri</span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
