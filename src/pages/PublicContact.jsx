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
              <h1>Hubungi Kami &amp; Lokasi</h1>
              <p>
                Silakan mampir langsung ke perumahan Cipta Greenville Batam, atau kirim pesan WhatsApp ke pengurus DKM.
              </p>
            </div>
          </Container>
        </section>


        {/* Content Section */}
        <div style={{ paddingBlock: '60px' }}>
          <ContactSection hideCta={true} />
        </div>

        {/* Page CTA Section */}
        <section style={{ paddingBottom: '80px' }}>
          <Container>
            <div className="page-cta-block animate-fade-in">
              <h3>Kontak Pengurus DKM</h3>
              <p>
                Tanya soal jadwal kajian, TPQ, atau donasi? Hubungi pengurus DKM.
              </p>
              <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <a 
                  href="https://maps.google.com/?q=Cipta%20Greenville%20Tembesi%20Batam" 
                  className="button button-gold"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: 'none' }}
                >
                  Buka Lokasi
                </a>
                <a 
                  href="https://wa.me/6281375410997" 
                  className="button button-primary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Hubungi Pengurus
                </a>
              </div>

            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </div>
  );
}
