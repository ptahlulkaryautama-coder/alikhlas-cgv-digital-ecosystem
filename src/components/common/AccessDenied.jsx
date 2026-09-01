import { Link } from 'react-router-dom';
import '../../styles/accessDenied.css';

export default function AccessDenied() {
  return (
    <main className="access-denied-page">
      <section className="access-denied-card" aria-labelledby="access-denied-title">
        <svg className="access-denied-icon" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M7 10V8a5 5 0 0110 0v2m-9 0h8a2 2 0 012 2v7H6v-7a2 2 0 012-2z" />
        </svg>
        <p className="access-denied-kicker">Akses dibatasi</p>
        <h1 id="access-denied-title">Anda belum memiliki izin untuk halaman ini</h1>
        <p>Menu dashboard disesuaikan dengan role pengurus. Hubungi administrator jika tanggung jawab Anda memerlukan akses ini.</p>
        <Link to="/app" className="access-denied-action">Kembali ke Dashboard</Link>
      </section>
    </main>
  );
}
