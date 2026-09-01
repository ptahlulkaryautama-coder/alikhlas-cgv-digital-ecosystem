import { useState } from 'react';
import qrisUrl from '../../assets/qris-alikhlas.png';
import Container from '../common/Container.jsx';

export default function DonationInfo({ donation, compact = false }) {
  const [copiedType, setCopiedType] = useState(null); // 'bank' | 'nmid' | null

  const handleCopy = (text, type) => {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      setCopiedType(type);
      setTimeout(() => {
        setCopiedType(null);
      }, 2000);
    });
  };

  return (
    <section className="transparency-donation-section" aria-labelledby="donation-info-title">
      <Container className="transparency-donation-grid">
        <div className="donation-info-copy">
          <div className="transparency-hero-label" style={{ color: '#0c2b1d', marginBottom: '8px' }}>
            <span className="fin-line" style={{ background: '#0c2b1d' }} aria-hidden="true"></span> KANAL DONASI DAN INFAQ
          </div>
          <h2 id="donation-info-title">
            Rekening dan QRIS Resmi DKM
          </h2>
          <p>
            Transfer donasi ke rekening atau QRIS resmi DKM. Setelah transfer, kabari kami via WhatsApp supaya bisa langsung dimasukkan ke laporan bulanan.
          </p>
          <div className="donation-steps-mini" style={{ marginBlock: '20px', padding: '16px', background: 'rgba(12, 43, 29, 0.04)', borderRadius: '12px', border: '1px solid rgba(12, 43, 29, 0.08)' }}>
            <strong style={{ display: 'block', fontSize: '13px', color: '#0c2b1d', marginBottom: '10px' }}>Panduan Ringkas Berinfaq:</strong>
            <ol style={{ margin: 0, paddingLeft: '18px', fontSize: '13px', color: '#3a5244', lineHeight: 1.6 }}>
              <li>Pilih rekening BSI atau scan kode QRIS resmi DKM.</li>
              <li>Lakukan transfer sesuai nominal infaq sukarela Anda.</li>
              <li>Konfirmasi via WhatsApp agar dicatat di buku kas bulanan.</li>
            </ol>
          </div>

          <div className="donation-copy-actions">
            <a 
              href={donation.confirmationUrl} 
              className="transparency-hero-btn transparency-hero-btn-gold" 
              style={{ textDecoration: 'none' }}
              target="_blank" 
              rel="noopener noreferrer"
            >
              Konfirmasi Donasi
            </a>
            {compact && (
              <a 
                href="/donasi" 
                className="transparency-hero-btn transparency-hero-btn-outline" 
                style={{ textDecoration: 'none', color: '#0c2b1d', borderColor: 'rgba(12, 43, 29, 0.2)', marginLeft: '12px' }}
              >
                Kanal Donasi Lengkap →
              </a>
            )}
          </div>
        </div>
        
        <div className="donation-info-card">
          {/* Channel 1: Bank Transfer */}
          <article className="donation-info-item donation-channel-bank">
            <div className="donation-info-header">
              <span className="channel-badge">Transfer Bank</span>
              <button 
                onClick={() => handleCopy(donation.accountNumber, 'bank')} 
                className={`copy-btn ${copiedType === 'bank' ? 'copied' : ''}`}
                aria-label="Salin nomor rekening BSI"
              >
                {copiedType === 'bank' ? (
                  <>
                    <svg className="copy-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>Tersalin!</span>
                  </>
                ) : (
                  <>
                    <svg className="copy-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                    <span>Salin Nomor Rekening</span>
                  </>
                )}
              </button>
            </div>
            <strong className="account-number">{donation.bank} · {donation.accountNumber}</strong>
            <p className="account-name">a.n. {donation.accountName}</p>
          </article>

          {/* Channel 2: Confirmation Contact */}
          <article className="donation-info-item donation-channel-contact">
            <span className="channel-badge">Kontak Konfirmasi</span>
            <strong className="contact-phone">{donation.confirmationPhone}</strong>
            <p className="contact-name">{donation.confirmationName} (Pengurus DKM)</p>
          </article>

          {/* Channel 3: QRIS (Clean white card for optical QR scanning quality) */}
          <figure className="donation-qris-figure">
            <div className="qris-img-container">
              <img src={qrisUrl} alt="Kode QRIS resmi DKM Masjid Al Ikhlas CGV" />
            </div>
            <figcaption>
              <div className="qris-header-row">
                <strong className="qris-title">{donation.qrisName}</strong>
                <button 
                  onClick={() => handleCopy(donation.nmid, 'nmid')} 
                  className={`copy-btn-mini ${copiedType === 'nmid' ? 'copied' : ''}`}
                  aria-label="Salin NMID QRIS"
                >
                  {copiedType === 'nmid' ? 'Tersalin!' : 'Salin NMID'}
                </button>
              </div>
              <span className="qris-meta">NMID: <strong>{donation.nmid}</strong></span>
              <span className="qris-bank-label">Bank Syariah Indonesia (BSI)</span>
              <p className="qris-helper-text" style={{ fontSize: '12px', color: '#6b7f74', marginTop: '8px', marginBottom: 0, lineHeight: 1.4 }}>
                Scan QRIS melalui aplikasi mobile banking atau dompet digital.
              </p>
            </figcaption>
          </figure>
        </div>
      </Container>
    </section>
  );
}


