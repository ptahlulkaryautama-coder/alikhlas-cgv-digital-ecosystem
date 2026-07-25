/**
 * TPQ.jsx — Protected TPQ & Pendidikan Al Mardhotillah Portal Page
 *
 * Route: /app/tpq & /tpq (protected by ProtectedRoute)
 * Archetype: Serious/Corporate (70%) + Playful/Charming accents (30%)
 * Privacy-Safe & Read-Only Implementation
 */

import React from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout.jsx';
import TPQHeaderBanner from '../components/tpq/TPQHeaderBanner.jsx';
import TPQOverviewKPI from '../components/tpq/TPQOverviewKPI.jsx';
import TPQKelasSection from '../components/tpq/TPQKelasSection.jsx';
import TPQKurikulumSection from '../components/tpq/TPQKurikulumSection.jsx';
import TPQTeachersSection from '../components/tpq/TPQTeachersSection.jsx';
import TPQAgendaSection from '../components/tpq/TPQAgendaSection.jsx';
import TPQNewsSection from '../components/tpq/TPQNewsSection.jsx';
import TPQDocumentsSection from '../components/tpq/TPQDocumentsSection.jsx';
import TPQFutureModulesSection from '../components/tpq/TPQFutureModulesSection.jsx';
import TPQPrivacyNoticeCard from '../components/tpq/TPQPrivacyNoticeCard.jsx';
import { FAQS } from '../data/tpqData.js';
import '../styles/dashboard.css';
import '../styles/financeAdmin.css';
import '../styles/tpqPortal.css';

export default function TPQ() {
  return (
    <DashboardLayout
      title="TPQ & Pendidikan"
      subtitle="Portal Akademik TPQ Al Mardhotillah"
      activeId="tpq"
      period="Juli 2026"
    >
      <div className="db-page-container">
        {/* ── Bismillah & Header Banner ── */}
        <TPQHeaderBanner />

        {/* ── Section A: TPQ Header ── */}
        <div className="db-pg-header" style={{ flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
          <div>
            <div className="db-pg-eyebrow">PENDIDIKAN TPQ</div>
            <h1 className="db-pg-title">
              Portal TPQ Al Ikhlas
            </h1>
            <p className="db-pg-desc">
              Ringkasan jadwal belajar, kegiatan, dan informasi umum TPQ Al Ikhlas.
            </p>
            
            {/* Badges */}
            <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
              <span className="fin-pill fin-pill-gold" style={{ fontSize: '11px', fontWeight: 700 }}>
                Prototype internal
              </span>
              <span className="fin-pill fin-pill-green" style={{ fontSize: '11px', fontWeight: 700 }}>
                Read-only
              </span>
            </div>
          </div>

          <div>
            <button 
              className="fin-btn" 
              disabled 
              aria-disabled="true"
              type="button"
              style={{ opacity: 0.7, cursor: 'not-allowed', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              📥 Export Raport Santri <span style={{ fontSize: '9px', fontWeight: 600, color: 'var(--db-warn-text)', background: 'var(--db-warn-bg)', padding: '1px 4px', borderRadius: '3px' }}>Segera</span>
            </button>
          </div>
        </div>

        {/* ── Privacy & Security Notice Card ── */}
        <TPQPrivacyNoticeCard />

        {/* ── 1. Executive KPI Summary (Section B: Overview) ── */}
        <TPQOverviewKPI />

        {/* ── 2. Kelompok Belajar (Section C: Jadwal Kelas) ── */}
        <TPQKelasSection />

        {/* ── 3. Kurikulum & Roadmap Capaian (Section D: Fokus Pembelajaran) ── */}
        <TPQKurikulumSection />

        {/* ── 4. Profil Ustadz & Ustadzah ── */}
        <TPQTeachersSection />

        {/* ── 5. Agenda Akademik & Kegiatan (Section E: Agenda TPQ) ── */}
        <TPQAgendaSection />

        {/* ── 6. Kabar TPQ Terbaru (Section F: Kabar TPQ) ── */}
        <TPQNewsSection />

        {/* ── 7. Dokumen & Raport (Section G: Dokumen dan Raport Locked/Disabled) ── */}
        <TPQDocumentsSection />

        {/* ── 8. Rencana Pengembangan (Section H: Future module overview) ── */}
        <TPQFutureModulesSection />

        {/* ── 9. Informasi Umum TPQ (formerly FAQ) ── */}
        <div className="tpq-sec-wrapper">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '6px' }}>
            <div className="db-sec-eyebrow" style={{ margin: 0 }}>
              Informasi Umum TPQ
            </div>
            <span
              style={{
                fontSize: '9.5px',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '4px',
                background: '#f0f0f0',
                color: '#555',
                border: '1px solid rgba(0,0,0,0.1)',
              }}
              aria-label="Sumber: Prototipe Legacy HTML. Belum diverifikasi secara independen."
            >
              ℹ Sumber: Prototipe. Belum diverifikasi resmi.
            </span>
          </div>
          <p style={{ fontSize: '12px', color: '#8a9e93', marginBottom: '14px', lineHeight: 1.5 }}>
            Jawaban berikut bersumber dari prototipe awal dan informasi operasional umum DKM.
            Belum melalui verifikasi independen terhadap dokumen resmi DKM.
          </p>
          <div className="tpq-faq-grid">
            {FAQS.map((faq, idx) => (
              <div className="tpq-faq-card" key={idx}>
                <h4 className="tpq-faq-q">
                  <span aria-hidden="true">❓</span> {faq.question}
                </h4>
                <p className="tpq-faq-a">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Context Navigation / Quick Links ── */}
        <div className="db-sec-eyebrow">Tautan Cepat Dashboard</div>
        <div className="db-quick-link-grid">
          {[
            {
              icon: '📋',
              label: 'Program & Kegiatan',
              href: '/app/program',
              desc: 'Lihat daftar program kajian dan kegiatan pengurus DKM.',
            },
            {
              icon: '💵',
              label: 'Donasi Pendidikan TPQ',
              href: '/app/donasi',
              desc: 'Monitoring donasi dan beasiswa santri TPQ.',
            },
            {
              icon: '📊',
              label: 'Dashboard Utama',
              href: '/app',
              desc: 'Kembali ke ringkasan panel admin utama.',
            },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="db-quick-link-card"
            >
              <div className="card-icon-wrapper">
                {link.icon}
              </div>
              <div className="card-title">{link.label}</div>
              <div className="card-desc">{link.desc}</div>
            </a>
          ))}
        </div>
      </div>

      {/* ── Page Footer ── */}
      <div className="db-pg-footer">
        <div className="db-pg-footer-id">
          <strong>DKM Masjid Al Ikhlas Cipta Greenville</strong> · TPQ Al Mardhotillah · Portal Akademik
        </div>
        <div className="db-pg-footer-quote">
          "Sebaik-baik kalian adalah orang yang mempelajari Al-Qur'an dan mengajarkannya." — HR. Bukhari
        </div>
      </div>
    </DashboardLayout>
  );
}
