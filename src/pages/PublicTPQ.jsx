import React from 'react';
import Header from '../components/website/Header.jsx';
import Footer from '../components/website/Footer.jsx';
import Container from '../components/common/Container.jsx';
import Button from '../components/common/Button.jsx';
import { tpqRepository } from '../repositories/tpqRepository.js';
import '../styles/tpqPublic.css';

export default function PublicTPQ() {
  const {
    portalInfo: TPQ_PORTAL_INFO,
    classes: CLASS_GROUPS,
    curriculum: KURIKULUM_ROADMAP,
    teachingTeam: TPQ_TEACHING_TEAM,
    agenda: TPQ_AGENDA,
    faqs: FAQS,
  } = tpqRepository.getAll();

  return (
    <div className="public-tpq-page">
      <Header />

      {/* ── 1. Hero Section ── */}
      <section className="tpq-public-hero" aria-labelledby="tpq-hero-title">
        <div className="tpq-arabic-watermark">مدرسة التعليم القرآني</div>
        <Container size="xl">
          <div className="tpq-hero-badge-wrap">
            <span>{TPQ_PORTAL_INFO.skPengesahan}</span>
          </div>

          <h1 id="tpq-hero-title">
            {TPQ_PORTAL_INFO.nama}
          </h1>

          <p className="tpq-hero-subtitle">
            Pembinaan Generasi Qur'ani, Berakhlak Mulia, dan Fasih Membaca Al-Qur'an di bawah naungan {TPQ_PORTAL_INFO.naungan}.
          </p>

          <div className="tpq-hero-info-grid">
            <div className="tpq-info-pill-card">
              <span className="tpq-info-icon" aria-hidden="true">⏰</span>
              <div className="tpq-info-text">
                <small>Jam Operasional</small>
                <strong>{TPQ_PORTAL_INFO.jamOperasional}</strong>
              </div>
            </div>

            <div className="tpq-info-pill-card">
              <span className="tpq-info-icon" aria-hidden="true">📍</span>
              <div className="tpq-info-text">
                <small>Lokasi Kegiatan</small>
                <strong>Masjid Al Ikhlas CGV Batam</strong>
              </div>
            </div>

            <div className="tpq-info-pill-card">
              <span className="tpq-info-icon" aria-hidden="true">📚</span>
              <div className="tpq-info-text">
                <small>Tahun Ajaran</small>
                <strong>{TPQ_PORTAL_INFO.tahunAjaran} ({TPQ_PORTAL_INFO.periodeAktif})</strong>
              </div>
            </div>
          </div>

          <div className="tpq-hero-actions">
            <Button href="#kelompok-belajar" variant="gold">
              Lihat Kelompok Belajar
            </Button>
            <Button href="/kontak" variant="glass">
              Hubungi Pengurus / Pendaftaran
            </Button>
          </div>
        </Container>
      </section>

      {/* ── 2. Kelompok Belajar Grid ── */}
      <section id="kelompok-belajar" className="tpq-section" aria-labelledby="kelompok-title">
        <Container size="xl">
          <div className="tpq-section-header">
            <p className="tpq-section-kicker">Program Pembelajaran</p>
            <h2 id="kelompok-title" className="tpq-section-title">
              Kelompok Belajar Santri
            </h2>
            <p className="tpq-section-desc">
              Pembagian kelas berjenjang yang disesuaikan dengan kemampuan membaca dan usia santri untuk hasil belajar optimal.
            </p>
          </div>

          <div className="class-groups-grid">
            {CLASS_GROUPS.map((cls) => (
              <article key={cls.id} className="class-group-card">
                <div className="class-card-head">
                  <div className="class-icon-badge">{cls.icon}</div>
                  <span
                    className="class-level-pill"
                    style={{ background: cls.badgeColor }}
                  >
                    {cls.level}
                  </span>
                </div>

                <h3>{cls.name}</h3>
                <p className="class-group-desc">{cls.description}</p>

                <div className="class-meta-list">
                  <div className="class-meta-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    <span><strong>Hari:</strong> {cls.day} ({cls.time})</span>
                  </div>

                  <div className="class-meta-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <span><strong>Ruangan:</strong> {cls.room}</span>
                  </div>

                  <div className="class-meta-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                    </svg>
                    <span><strong>Sasaran:</strong> {cls.audience}</span>
                  </div>
                </div>

                <div className="class-topics-box">
                  <strong>Fokus Pembelajaran:</strong>
                  <ul>
                    {cls.fokusMateri.map((materi, idx) => (
                      <li key={idx}>{materi}</li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>

      {/* ── 3. Roadmap Kurikulum ── */}
      <section className="tpq-section" style={{ background: '#ffffff' }} aria-labelledby="kurikulum-title">
        <Container size="xl">
          <div className="tpq-section-header">
            <p className="tpq-section-kicker">Roadmap Belajar</p>
            <h2 id="kurikulum-title" className="tpq-section-title">
              Tahapan Kurikulum Pembelajaran
            </h2>
            <p className="tpq-section-desc">
              Kurikulum terstruktur mulai dari pengenalan hijaiyah dasar hingga wisuda tahfiz dan pembiasaan adab keislaman.
            </p>
          </div>

          <div className="roadmap-grid">
            {KURIKULUM_ROADMAP.map((item, idx) => (
              <article key={idx} className="roadmap-card">
                <span className="roadmap-step-badge">{item.category}</span>
                <h4>{item.name}</h4>
                <p>{item.desc}</p>
                <div className="roadmap-target">
                  <strong>Target:</strong> {item.target}
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>

      {/* ── 4. Tim Pengajar Peran ── */}
      <section className="tpq-section" aria-labelledby="pengajar-title">
        <Container size="xl">
          <div className="tpq-section-header">
            <p className="tpq-section-kicker">Dedikasi & Pembimbingan</p>
            <h2 id="pengajar-title" className="tpq-section-title">
              Tim Pengajar TPQ Al Mardhotillah
            </h2>
            <p className="tpq-section-desc">
              Pengajar berdedikasi yang membimbing santri secara sabar, komunikatif, dan sesuai kaidah tajwid resmi.
            </p>
          </div>

          <div className="teaching-grid">
            {TPQ_TEACHING_TEAM.map((team) => (
              <article key={team.id} className="teacher-role-card">
                <div className="teacher-avatar-box">{team.icon}</div>
                <h4>{team.roleLabel}</h4>
                <div className="teacher-schedule-tag">{team.schedule}</div>
                <p>{team.desc}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      {/* ── 5. Agenda Kegiatan ── */}
      <section className="tpq-section" style={{ background: '#ffffff' }} aria-labelledby="agenda-tpq-title">
        <Container size="xl">
          <div className="tpq-section-header">
            <p className="tpq-section-kicker">Kalender Akademik</p>
            <h2 id="agenda-tpq-title" className="tpq-section-title">
              Agenda & Kegiatan TPQ
            </h2>
            <p className="tpq-section-desc">
              Jadwal kegiatan evaluasi pembelajaran, parenting wali santri, dan penyerahan raport berkala.
            </p>
          </div>

          <div className="roadmap-grid">
            {TPQ_AGENDA.map((ag) => (
              <article key={ag.id} className="roadmap-card">
                <span className="roadmap-step-badge">{ag.category}</span>
                <h4>{ag.title}</h4>
                <p>
                  <strong>Tanggal:</strong> {ag.date} · {ag.time}<br />
                  <strong>Lokasi:</strong> {ag.location}
                </p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      {/* ── 6. FAQ & Pendaftaran ── */}
      <section className="tpq-section" aria-labelledby="faq-title">
        <Container size="xl">
          <div className="tpq-section-header">
            <p className="tpq-section-kicker">Tanya Jawab & Informasi Pendaftaran</p>
            <h2 id="faq-title" className="tpq-section-title">
              Pertanyaan Umum Wali Santri
            </h2>
            <p className="tpq-section-desc">
              Informasi seputar pendaftaran santri baru dan teknis pelaksanaan mengaji di Masjid Al Ikhlas CGV.
            </p>
          </div>

          <div className="faq-grid">
            {FAQS.map((faq, idx) => (
              <div key={idx} className="faq-card">
                <h4>
                  <span className="faq-q-icon">Q:</span> {faq.question}
                </h4>
                <p>{faq.answer}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── 7. Wali Santri & Operator Gateway Banner ── */}
      <section className="operator-gateway-banner">
        <Container size="xl">
          <div className="operator-banner-card" style={{ background: 'linear-gradient(135deg, #0b3424 0%, #155737 100%)', marginBottom: '24px' }}>
            <div className="operator-banner-text">
              <h3>📱 Portal Wali Santri & Buku Penghubung Digital</h3>
              <p>
                Pantau kehadiran harian, setoran hafalan, catatan tajwid, serta pengumuman kelas putra/putri Anda secara langsung dari smartphone.
              </p>
            </div>
            <Button href="/login" variant="gold">
              Akses Portal Wali Santri →
            </Button>
          </div>

          <div className="operator-banner-card">
            <div className="operator-banner-text">
              <h3>Pengurus DKM / Pengampu TPQ Al Mardhotillah?</h3>
              <p>
                Masuk ke Portal Internal Operator untuk pencatatan presensi, progres juz, dan rekap nilai raport santri.
              </p>
            </div>
            <Button href="/app/tpq" variant="gold">
              Masuk Portal Operator TPQ →
            </Button>
          </div>
        </Container>
      </section>

      <Footer />
    </div>
  );
}
