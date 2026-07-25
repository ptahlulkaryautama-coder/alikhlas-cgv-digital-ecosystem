import DonationSection from '../components/website/DonationSection.jsx';
import Footer from '../components/website/Footer.jsx';
import Header from '../components/website/Header.jsx';
import { donationInfo } from '../data/siteContent.js';
import DonationInfo from '../components/transparency/DonationInfo.jsx';
import Container from '../components/common/Container.jsx';
import '../styles/home.css';
import '../styles/transparency.css';

export default function PublicDonation() {
  return (
    <div className="home-page">
      <Header />
      <main>
        {/* Page Hero Section */}
        <section className="page-hero page-hero--donasi">
          <Container>
            <div className="page-hero-content animate-fade-in">
              <div className="page-hero-kicker">
                <span>Kanal Donasi &amp; Infaq</span>
                <span className="kicker-sep" aria-hidden="true">·</span>
                <span className="kicker-arabic">الصدقة والأمانة</span>
              </div>
              <h1>Kanal Donasi &amp; Infaq</h1>
              <p>
                Infaq jamaah membantu membiayai operasional masjid, kegiatan belajar TPQ, kajian rutin, dan kebutuhan sosial warga.
              </p>

            </div>
          </Container>
        </section>

        {/* Content Sections */}
        <div style={{ paddingBlock: '60px 20px' }}>
          <DonationSection hideCta={true} />
        </div>

        <div id="donasi-transparansi" style={{ paddingBottom: '60px' }}>
          <DonationInfo donation={donationInfo} />
        </div>

        {/* Page CTA Section */}
        <section style={{ paddingBottom: '80px' }}>
          <Container>
            <div className="page-cta-block animate-fade-in">
              <h3>Konfirmasi Donasi</h3>
              <p>
                Kabari pengurus DKM setelah berinfaq agar pencatatan kas bulanan dapat langsung diperbarui.
              </p>
              <a 
                href={donationInfo.confirmationUrl} 
                className="button button-gold"
                target="_blank"
                rel="noopener noreferrer"
              >
                Konfirmasi Donasi
              </a>
            </div>
          </Container>
        </section>

      </main>
      <Footer />
    </div>
  );
}

