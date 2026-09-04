import React from 'react';
import Container from '../common/Container.jsx';

export default function TPQFacultyCards({ teachingTeam = [] }) {
  if (!teachingTeam || teachingTeam.length === 0) return null;

  return (
    <section className="tpq-faculty-section" id="pengampu-tpq" aria-labelledby="faculty-title">
      <Container size="xl">
        <div className="tpq-section-header">
          <p className="tpq-section-kicker">Tenaga Pendidik</p>
          <h2 id="faculty-title" className="tpq-section-title">
            Profil Asatidz &amp; Pengampu TPQ
          </h2>
          <p className="tpq-section-desc">
            Para asatidz dan asatidzah berkompeten, bersanad, dan berdedikasi membina generasi Qur'ani di Masjid Al Ikhlas CGV.
          </p>
        </div>

        <div className="faculty-grid">
          {teachingTeam.map((teacher) => (
            <article key={teacher.id} className="faculty-card">
              <div className="faculty-card-top">
                <div className="faculty-photo-wrap">
                  <img
                    src={teacher.photoUrl || '/src/assets/cerita-kajian-rutin.jpg'}
                    alt={teacher.name}
                    className="faculty-photo"
                    loading="lazy"
                  />
                  {teacher.hafalanJuz && (
                    <span className="faculty-hafalan-badge">
                      <span className="badge-star" aria-hidden="true">⭐</span>
                      <span>{teacher.hafalanJuz}</span>
                    </span>
                  )}
                </div>

                <div className="faculty-identity">
                  <span className="faculty-role-pill" style={{ borderColor: teacher.badgeColor, color: teacher.badgeColor }}>
                    {teacher.roleLabel}
                  </span>
                  <h3 className="faculty-name">{teacher.name}</h3>
                  {teacher.titleDegree && (
                    <p className="faculty-degree">{teacher.titleDegree}</p>
                  )}
                </div>
              </div>

              <div className="faculty-card-body">
                <p className="faculty-desc">{teacher.desc}</p>

                {teacher.education && (
                  <div className="faculty-info-row">
                    <span className="info-icon" aria-hidden="true">🎓</span>
                    <span className="info-text"><strong>Latar Belakang:</strong> {teacher.education}</span>
                  </div>
                )}

                <div className="faculty-info-row">
                  <span className="info-icon" aria-hidden="true">⏰</span>
                  <span className="info-text"><strong>Jadwal:</strong> {teacher.schedule}</span>
                </div>

                <div className="faculty-info-row">
                  <span className="info-icon" aria-hidden="true">🎯</span>
                  <span className="info-text"><strong>Fokus Materi:</strong> {teacher.focus}</span>
                </div>

                {teacher.certificates && teacher.certificates.length > 0 && (
                  <div className="faculty-certificates-box">
                    <h4 className="certs-title">
                      <span aria-hidden="true">📜</span> Sertifikasi &amp; Sanad:
                    </h4>
                    <ul className="certs-list">
                      {teacher.certificates.map((cert, cIdx) => (
                        <li key={cIdx} className="cert-item">
                          <span className="cert-check">✓</span>
                          <span>{cert}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
