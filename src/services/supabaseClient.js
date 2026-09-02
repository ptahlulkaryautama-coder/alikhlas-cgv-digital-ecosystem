import { createClient } from '@supabase/supabase-js';

let browserClient;

function readBrowserConfig() {
  const url = String(import.meta.env.VITE_SUPABASE_URL ?? '').trim();
  const publishableKey = String(import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? '').trim();
  return { url, publishableKey };
}

export function isSupabaseConfigured() {
  const { url, publishableKey } = readBrowserConfig();
  return Boolean(url && publishableKey);
}

export function getSupabaseBrowserClient() {
  const { url, publishableKey } = readBrowserConfig();
  if (!url || !publishableKey) {
    throw new Error('Supabase browser configuration is unavailable');
  }
  if (new URL(url).protocol !== 'https:') {
    throw new Error('Supabase URL must use HTTPS');
  }

  if (!browserClient) {
    browserClient = createClient(url, publishableKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }
  return browserClient;
}

export function getSupabasePublicStorageUrl(bucket, path) {
  if (!bucket || !path || !isSupabaseConfigured()) return '';
  return getSupabaseBrowserClient().storage.from(bucket).getPublicUrl(path).data.publicUrl;
}

export function formatSupabaseError(error, fallback = 'Aksi belum berhasil. Coba ulang atau hubungi Super Admin.') {
  const raw = String(error?.message ?? error ?? '').trim();
  if (!raw) return fallback;
  const message = raw.toLowerCase();
  if (message.includes('permission denied') || message.includes('forbidden') || message.includes('not authorized')) {
    return 'Akun ini belum punya otoritas untuk aksi tersebut, atau migration permission terbaru belum dijalankan.';
  }
  if (message.includes('writes_disabled') || message.includes('write_disabled') || message.includes('disabled')) {
    return 'Mode aman masih aktif. Aktifkan switch test/write hanya saat trial, lalu coba lagi.';
  }
  if (message.includes('test_mode') || message.includes('production_write')) {
    return 'Lingkungan uji/production belum dibuka untuk aksi ini. Periksa kill switch di Supabase.';
  }
  if (message.includes('version') || message.includes('expected_version') || message.includes('stale')) {
    return 'Data sudah berubah di sesi lain. Refresh halaman, cek ulang isi data, lalu ulangi aksi.';
  }
  if (message.includes('invalid_email_format')) {
    return 'Format email tidak valid. Pastikan penulisan email sudah benar (contoh: nama@domain.com).';
  }
  if (message.includes('password_too_short')) {
    return 'Password terlalu pendek. Gunakan minimal 6 karakter.';
  }
  if (message.includes('email_already_exists')) {
    return 'Email tersebut sudah terdaftar di sistem. Gunakan email lain atau pulihkan akun yang ada.';
  }
  if (message.includes('duplicate') || message.includes('already exists')) {
    return 'Data serupa sudah pernah tersimpan. Cek daftar/riwayat sebelum membuat ulang.';
  }
  if (message.includes('super_admin_required')) {
    return 'Hanya Super Admin yang berwenang menambahkan atau mengelola akun pengurus.';
  }
  if (message.includes('row-level security') || message.includes('rls')) {
    return 'Akses data ditolak oleh aturan keamanan. Pastikan akun, role, dan permission sudah sesuai.';
  }
  if (message.includes('network') || message.includes('failed to fetch')) {
    return 'Koneksi ke Supabase belum stabil. Cek internet, lalu coba ulang.';
  }
  return raw.length > 180 ? `${raw.slice(0, 177)}…` : raw;
}
