import { useEffect, useState } from 'react';
import logoUrl from '../../assets/official-logo.png';
import '../../styles/pwaInstallPrompt.css';

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if already running in standalone mode (already installed)
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone ||
      document.referrer.includes('android-app://');

    if (isStandalone) {
      return;
    }

    // Check if user previously dismissed the prompt in this session
    const isDismissed = localStorage.getItem('pwa_prompt_dismissed');
    if (isDismissed) {
      return;
    }

    // Detect iOS device (Safari doesn't support beforeinstallprompt)
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent) && !window.MSStream;

    if (isIosDevice) {
      setIsIOS(true);
      // Show iOS banner after a short delay for better UX
      const timer = setTimeout(() => setShowPrompt(true), 3000);
      return () => clearTimeout(timer);
    }

    // Listen for beforeinstallprompt event (Android / Chrome / Edge)
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('[PWA] User accepted the install prompt');
    } else {
      console.log('[PWA] User dismissed the install prompt');
    }

    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Don't show prompt again for 7 days
    localStorage.setItem('pwa_prompt_dismissed', Date.now().toString());
  };

  if (!showPrompt) {
    return null;
  }

  return (
    <div className="pwa-install-banner" role="dialog" aria-label="Pasang Aplikasi Masjid">
      <div className="pwa-install-header">
        <div className="pwa-brand-info">
          <img src={logoUrl} alt="Logo Masjid Al Ikhlas" className="pwa-app-icon" />
          <div className="pwa-title-group">
            <h4>Pasang Aplikasi Masjid Al Ikhlas</h4>
            <p>Akses cepat jadwal sholat & kajian langsung dari layar HP Anda</p>
          </div>
        </div>
        <button
          className="pwa-close-btn"
          onClick={handleDismiss}
          aria-label="Tutup pemberitahuan"
          title="Nanti saja"
        >
          ✕
        </button>
      </div>

      {isIOS ? (
        <div className="pwa-ios-instructions">
          Untuk memasang di iPhone/iPad: Ketuk tombol <span>Bagikan (Share)</span> ⎘ lalu pilih <span>"Tambah ke Layar Utama" (Add to Home Screen)</span> ➕
        </div>
      ) : (
        <div className="pwa-install-actions">
          <button className="pwa-btn-dismiss" onClick={handleDismiss}>
            Nanti Saja
          </button>
          <button className="pwa-btn-install" onClick={handleInstallClick}>
            📱 Pasang Aplikasi
          </button>
        </div>
      )}
    </div>
  );
}
