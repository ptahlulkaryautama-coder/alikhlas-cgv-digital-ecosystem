import qrisUrl from '../../assets/qris-alikhlas.png';
import Button from '../common/Button.jsx';
import Container from '../common/Container.jsx';

export default function DonationInfo({ donation }) {
  return (
    <section className="transparency-donation-section" aria-labelledby="donation-info-title">
      <Container className="transparency-donation-grid">
        <div className="donation-info-copy">
          <p className="label">Donasi Publik</p>
          <h2 id="donation-info-title" className="section-title">
            Salurkan amanah melalui rekening resmi masjid.
          </h2>
          <p className="section-copy">
            Gunakan rekening atau QRIS yang sudah dipublikasikan masjid. Konfirmasi dapat
            dilakukan ke pengurus untuk membantu pencatatan.
          </p>
          <Button href={donation.confirmationUrl} variant="gold">
            Konfirmasi Donasi
          </Button>
        </div>
        <div className="donation-info-card">
          <article>
            <span>Rekening Donasi</span>
            <strong>{donation.bank} - {donation.accountNumber}</strong>
            <p>a.n. {donation.accountName}</p>
          </article>
          <article>
            <span>Kontak Konfirmasi</span>
            <strong>{donation.confirmationPhone}</strong>
            <p>{donation.confirmationName}</p>
          </article>
          <figure>
            <img src={qrisUrl} alt="QRIS Masjid Al Ikhlas CGV" />
            <figcaption>
              {donation.qrisName} - NMID: {donation.nmid}
            </figcaption>
          </figure>
        </div>
      </Container>
    </section>
  );
}
