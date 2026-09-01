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
                <span>Kanal Donasi dan Infaq</span>
                <span className="kicker-sep" aria-hidden="true">·</span>
                <span className="kicker-arabic">الصدقة والأمانة</span>
              </div>
              <h1>Kanal Donasi dan Infaq</h1>
              <p>
                Infaq jamaah membantu membiayai operasional masjid, kegiatan belajar TPQ, kajian rutin, dan kebutuhan sosial warga.
              </p>
            </div>
          </Container>
        </section>

        {/* 1. Payment Channels (Action First: Bank & QRIS) */}
        <div id="donasi-transparansi" style={{ paddingBlock: '40px 20px' }}>
          <DonationInfo donation={donationInfo} />
        </div>

        {/* 2. Usage Cards (Secondary Context) */}
        <div style={{ paddingBottom: '60px' }}>
          <DonationSection hideCta={true} />
        </div>

      </main>
      <Footer />
    </div>
  );
}

