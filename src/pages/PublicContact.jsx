import ContactSection from '../components/website/ContactSection.jsx';
import Footer from '../components/website/Footer.jsx';
import Header from '../components/website/Header.jsx';
import Container from '../components/common/Container.jsx';
import '../styles/home.css';

export default function PublicContact() {
  return (
    <div className="home-page">
      <Header />
      <main>
        {/* Page Hero Section */}
        <section className="page-hero page-hero--kontak">
          <Container>
            <div className="page-hero-content animate-fade-in">
              <div className="page-hero-kicker">
                <span>Kontak DKM</span>
                <span className="kicker-sep" aria-hidden="true">·</span>
                <span className="kicker-arabic">اتصل بنا</span>
              </div>
              <h1>Hubungi Kami dan Lokasi</h1>
              <p>
                Silakan mampir langsung ke perumahan Cipta Greenville Batam, atau kirim pesan WhatsApp ke pengurus DKM.
              </p>
            </div>
          </Container>
        </section>


        {/* Content Section */}
        <div style={{ paddingBlock: '40px 80px' }}>
          <ContactSection hideCta={true} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
