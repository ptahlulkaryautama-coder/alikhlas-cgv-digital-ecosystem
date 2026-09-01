import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logoUrl from '../assets/official-logo.png';
import { useAuth } from '../context/AuthContext.jsx';
import '../styles/login.css';

function friendlyLoginError(error) {
  if (error?.message === 'AUTH_NOT_CONFIGURED') return 'Konfigurasi login belum tersedia.';
  if (/invalid login credentials/i.test(error?.message ?? '')) return 'Email atau password tidak sesuai.';
  if (/email not confirmed/i.test(error?.message ?? '')) return 'Email akun belum dikonfirmasi.';
  return 'Login belum berhasil. Periksa koneksi lalu coba lagi.';
}

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isLoading, accessError, signIn } = useAuth();
  const from = location.state?.from?.pathname ?? '/app';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(location.state?.accessError ?? '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && isAuthenticated) navigate(from, { replace: true });
  }, [from, isAuthenticated, isLoading, navigate]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const result = await signIn(email.trim(), password);
      if (!result.isAuthenticated) setError(result.accessError || 'Akun belum memiliki akses dashboard.');
    } catch (loginError) {
      setError(friendlyLoginError(loginError));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-card" aria-labelledby="login-heading">
        <div className="login-brand">
          <img src={logoUrl} alt="Logo resmi Masjid Al Ikhlas" className="login-logo" width="56" height="56" />
          <div>
            <strong className="login-brand-name">Masjid Al Ikhlas</strong>
            <small className="login-brand-sub">Cipta Greenville Batam</small>
          </div>
        </div>

        <div>
          <h1 id="login-heading" className="login-heading">Masuk Dashboard</h1>
          <p className="login-subheading">Gunakan email dan password akun pengurus Anda.</p>
        </div>

        <div className="login-security-note" role="note">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 10V8a5 5 0 0110 0v2m-9 0h8a2 2 0 012 2v7H6v-7a2 2 0 012-2z" /></svg>
          <span>Login aman menggunakan Supabase Authentication</span>
        </div>

        <form onSubmit={handleSubmit} className="login-form" noValidate>
          <div className="login-field">
            <label htmlFor="admin-email" className="login-label">Email</label>
            <input id="admin-email" type="email" autoComplete="username" placeholder="nama@email.com" value={email}
              onChange={(event) => setEmail(event.target.value)} className={`login-input${error ? ' login-input-error' : ''}`}
              disabled={isSubmitting} required aria-describedby={error ? 'login-error' : undefined} />
          </div>

          <div className="login-field">
            <label htmlFor="admin-password" className="login-label">Password</label>
            <div className="login-password-wrap">
              <input id="admin-password" type={showPassword ? 'text' : 'password'} autoComplete="current-password"
                placeholder="Masukkan password" value={password} onChange={(event) => setPassword(event.target.value)}
                className={`login-input${error ? ' login-input-error' : ''}`} disabled={isSubmitting} required
                aria-describedby={error ? 'login-error' : undefined} />
              <button type="button" className="login-password-toggle" onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'} aria-pressed={showPassword}>
                {showPassword ? 'Sembunyikan' : 'Tampilkan'}
              </button>
            </div>
          </div>

          {error && <p id="login-error" className="login-error" role="alert">{error}</p>}
          <button type="submit" className="login-submit" disabled={isSubmitting || !email.trim() || !password}>
            {isSubmitting ? 'Memeriksa akun…' : 'Masuk'}
          </button>
        </form>

        <Link to="/" className="login-back-link">← Kembali ke beranda</Link>
      </section>
    </main>
  );
}
