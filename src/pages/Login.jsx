/**
 * Login.jsx
 *
 * Branded admin PIN gate page.
 *
 * ⚠️  PROTOTYPE SECURITY ONLY ⚠️
 * This page validates a PIN stored in VITE_ADMIN_PIN against client-side
 * logic in src/services/auth.js. It must be replaced with a proper
 * authentication flow (e.g. Firebase Auth, Supabase) before production.
 *
 * After a successful PIN entry the user is redirected to the route they
 * originally attempted to visit, or to /app as the default.
 */

import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import logoUrl from '../assets/official-logo.png';
import { attemptLogin } from '../services/auth.js';
import '../styles/login.css';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname ?? '/app';

  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    // Small artificial delay so the button doesn't flash instantly
    // and to give a hint that something is being checked.
    setTimeout(() => {
      const ok = attemptLogin(pin);
      if (ok) {
        navigate(from, { replace: true });
      } else {
        setError('PIN tidak valid. Silakan coba lagi.');
        setPin('');
        setIsSubmitting(false);
      }
    }, 320);
  }

  return (
    <div className="login-page" role="main">
      <div className="login-card" aria-labelledby="login-heading">
        {/* Brand */}
        <div className="login-brand">
          <img
            src={logoUrl}
            alt="Logo resmi Masjid Al Ikhlas"
            className="login-logo"
            width="56"
            height="56"
          />
          <div>
            <strong className="login-brand-name">Masjid Al Ikhlas</strong>
            <small className="login-brand-sub">Cipta Greenville Batam</small>
          </div>
        </div>

        {/* Heading */}
        <h1 id="login-heading" className="login-heading">
          Area Admin
        </h1>
        <p className="login-subheading">
          Masukkan PIN untuk melanjutkan ke halaman internal.
        </p>

        {/* Prototype warning badge */}
        <div className="login-proto-badge" role="note" aria-label="Prototype notice">
          <span className="login-proto-icon" aria-hidden="true">🔒</span>
          <span>Perlindungan sementara — prototype only</span>
        </div>

        {/* PIN form */}
        <form onSubmit={handleSubmit} className="login-form" noValidate>
          <div className="login-field">
            <label htmlFor="admin-pin" className="login-label">
              PIN Admin
            </label>
            <input
              id="admin-pin"
              type="password"
              inputMode="numeric"
              autoComplete="current-password"
              placeholder="••••••"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className={`login-input${error ? ' login-input-error' : ''}`}
              disabled={isSubmitting}
              required
              aria-describedby={error ? 'login-error' : undefined}
            />
          </div>

          {error && (
            <p id="login-error" className="login-error" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="login-submit"
            disabled={isSubmitting || pin.length === 0}
          >
            {isSubmitting ? 'Memverifikasi…' : 'Masuk'}
          </button>
        </form>

        {/* Back link */}
        <a href="/" className="login-back-link">
          ← Kembali ke beranda
        </a>
      </div>
    </div>
  );
}
