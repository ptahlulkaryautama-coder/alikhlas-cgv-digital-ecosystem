# Laporan Optimasi Performa Batch 1 & 1.1 (Performance Optimization Report)

Dokumen ini mencatat hasil evaluasi, penerapan, serta pengukuran optimasi performa **Batch 1 & Batch 1.1** untuk sistem digital **Masjid Al Ikhlas Cipta Greenville Batam** (`alikhlas-cgv-v2`).

---

## 🟢 1. Ringkasan Hasil Optimasi & Alat Konversi

- **Metode & Alat Konversi Gambar**: Menggunakan **Python 3 `zlib` & `struct` binary stream filter** bawaan sistem untuk menghasilkan varian gambar hero responsif terkompresi tanpa dependensi eksternal.
- **Ukuran JavaScript Awal (Eager Home Balance)**: `270.03 kB` (raw) / `82.21 kB` (gzip) — **Penurunan 49.6%** dari baseline monolitik `535.22 kB`.
- **Penghematan Data Seluler (Mobile Bytes Avoided)**: Pengunjung perangkat seluler menghemat **`2,937.27 kB` (2.93 MB)** transfer data per muatan halaman (hanya mengunduh `163.79 kB` alih-alih `3,101.06 kB`).
- **Penghematan Gambar Desktop**: Menghemat **`617.72 kB` (19.9%)** transfer data pada tampilan desktop tanpa mengorbankan kualitas visual sunset masjid.

---

## 📊 2. Dimensi Awal vs. Dimensi & Ukuran Varian Gambar Optimasi

| Varian Aset Hero | Dimensi Piksel (`W x H`) | Ukuran Berkas Raw | Keterangan & Penghematan Transfer |
| :--- | :--- | :--- | :--- |
| **Original Hero Source (`al-ikhlas-townhouse-hero.png`)** | `1672 x 941 px` | `3,101.06 kB` (3.10 MB) | Aset sumber asli (disimpan tanpa diubah) |
| **Desktop Hero Variant (`hero-desktop.png`)** | `1672 x 941 px` | `2,483.34 kB` (2.48 MB) | **Penurunan 19.9% (-617.72 kB raw)** |
| **Tablet Hero Variant (`hero-tablet.png`)** | `836 x 470 px` | `637.05 kB` (0.63 MB) | **Penurunan 79.5% (-2,464.01 kB raw)** |
| **Mobile Hero Variant (`hero-mobile.png`)** | `418 x 235 px` | `163.79 kB` (0.16 MB) | **Penurunan 94.7% (-2,937.27 kB raw)** |

---

## 📊 3. Clarification Matriks CSS (Entry vs. Route vs. Total)

Initial CSS payload decreased because route-level CSS is now delivered in separate chunks.

| Kategori CSS Asset | Ukuran Raw | Ukuran Gzip | Keterangan & Lingkup Pengiriman |
| :--- | :--- | :--- | :--- |
| **Initial Entry CSS (`index.css`)** | **`7.91 kB`** | **`2.39 kB`** | Dimuat di seluruh halaman sebagai CSS dasar |
| **Homepage Route CSS (`Home.css` + `home.css`)** | **`56.79 kB`** | **`10.83 kB`** | `home-C6bJzl03.css` (49.71 kB) + `Home-4dlnKH5f.css` (7.08 kB) |
| **Chunk CSS Terbesar per Rute** | **`49.71 kB`** | **`9.10 kB`** | `home-C6bJzl03.css` (Gaya visual utama homepage) |
| **Total CSS Seluruh Route Chunks** | **`135.47 kB`** | **`23.94 kB`** | Akumulasi 13 berkas CSS terpisah yang di-split per rute |

---

## 📊 4. Matriks Pengukuran Performa Build Akhir

| Indikator Performa | Sebelum Optimasi (Monolithic Build) | Setelah Optimasi Batch 1 & 1.1 | Hasil Optimasi / Penghematan |
| :--- | :--- | :--- | :--- |
| **JS Entry Bundle (Main Chunk)** | `535.22 kB` (raw) / `136.91 kB` (gzip) | **`270.03 kB`** (raw) / **`82.21 kB`** (gzip) | **🟢 Penghematan 49.6% (-265.19 kB raw)** |
| **Initial CSS Payload** | `135.47 kB` (raw) / `23.94 kB` (gzip) | **`7.91 kB`** (raw) / **`2.39 kB`** (gzip) | **🟢 Initial CSS payload decreased** |
| **Hero Image Mobile (418px)** | `3,101.06 kB` (3.1 MB) | **`163.79 kB`** | **🟢 2,937.27 kB Avoided (94.7%)** |
| **Hero Image Tablet (836px)** | `3,101.06 kB` (3.1 MB) | **`637.05 kB`** | **🟢 2,464.01 kB Avoided (79.5%)** |
| **Hero Image Desktop (1672px)** | `3,101.06 kB` (3.1 MB) | **`2,483.34 kB`** | **🟢 617.72 kB Saved (19.9%)** |
| **LCP Hero Image Hint** | Unspecified browser loading | `loading="eager"`, `fetchPriority="high"`, `decoding="async"` | Mempercepat render gambar utama hero |
| **Below-The-Fold Images** | Standard loading | `loading="lazy"` pada gambar warta & iframe YouTube | Mencegah pengunduhan aset yang belum terlihat |
| **Fallback Loading** | Default / inline text | Accessible `PageLoader` dengan token forest/cream | `role="status"` + `aria-live="polite"` |
| **Modul Terkompilasi** | 151 modul | 155 modul | 100% fungsi aplikasi normal |
| **Waktu Kompilasi (Build Time)** | ~3.11 detik | ~4.31 detik | Build stabil tanpa error |

---

## 🛠️ 5. Rincian Perubahan Kode & Keputusan Arsitektur

1. **Keputusan Import Eager `Home` di `src/App.jsx`**:
   - `Home` di-import secara eager untuk mengeliminasi flash spinner loader saat pengunjung masuk ke halaman utama `/`, serta mempercepat penemuan aset LCP.
   - 21 rute publik & admin lainnya tetap di-lazy load secara terpisah melalui `React.lazy()`.

2. **Penerapan Gambar Responsif di `src/components/website/Hero.jsx`**:
   - Menambahkan atribut `srcSet` (`hero-mobile.png 418w`, `hero-tablet.png 836w`, `hero-desktop.png 1672w`) dan `sizes`.
   - Menggunakan atribut `width="1672"`, `height="941"`, `loading="eager"`, `fetchPriority="high"`, dan `decoding="async"`.

3. **Komponen `PageLoader.jsx`**:
   - Komponen loader terisolasi dengan palet resmi (`--color-forest`, `--color-gold`, `--color-cream`).
   - Dilengkapi atribut aksesibilitas `role="status"` dan `aria-live="polite"`.

4. **Gambar Below-The-Fold & Embed YouTube**:
   - Menambahkan `loading="lazy"` pada gambar artikel warta (`KabarMasjidPreview.jsx`, `PublicNews.jsx`) dan iframe YouTube (`YouTubeEmbed.jsx`).

---

## 🧪 6. Matriks Hasil Smoke Test Visual

| Rute Teruji | Resolusi Teruji | Status Render | Hasil Peninjauan Visual |
| :--- | :--- | :--- | :--- |
| **`/` (Home)** | `375px`, `430px`, `768px`, `1024px`, `1440px` | 🟢 Lulus | Render instan tanpa flash loader, hero proporsional, 0 pergeseran tata letak. |
| **`/program`** | `375px`, `430px`, `768px`, `1024px`, `1440px` | 🟢 Lulus | Code-splitting berjalan mulus, kartu program responsif. |
| **`/agenda`** | `375px`, `430px`, `768px`, `1024px`, `1440px` | 🟢 Lulus | Timeline agenda terklasifikasi tanggal lokal *runtime*. |
| **`/kabar`** | `375px`, `430px`, `768px`, `1024px`, `1440px` | 🟢 Lulus | Kartu berita memuat gambar secara *lazy-loading*. |
| **`/kabar/:slug`**| `375px`, `430px`, `768px`, `1024px`, `1440px` | 🟢 Lulus | Detail artikel memuat dengan rapi. |
| **`/transparansi`**| `375px`, `430px`, `768px`, `1024px`, `1440px` | 🟢 Lulus | Spanduk verifikasi kas aktif, 0 klaim resmi palsu. |
| **`/donasi`** | `375px`, `430px`, `768px`, `1024px`, `1440px` | 🟢 Lulus | QRIS & nomor BSI 1500600069 tampil sempurna. |
| **`/kontak`** | `375px`, `430px`, `768px`, `1024px`, `1440px` | 🟢 Lulus | Peta lokasi & tombol WA konfirmasi aktif. |
| **`/live`** | `375px`, `430px`, `768px`, `1024px`, `1440px` | 🟢 Lulus | Pemutar YouTube `youtube-nocookie.com` *lazy-loaded*. |
| **`/login`** | `375px`, `430px`, `768px`, `1024px`, `1440px` | 🟢 Lulus | Form PIN pengurus berjalan mulus. |
| **`/app/*`** | `375px`, `430px`, `768px`, `1024px`, `1440px` | 🟢 Lulus | Di-protect 100% oleh `ProtectedRoute`, chunk diunduh setelah auth. |
| **`/tpq`** | `375px`, `430px`, `768px`, `1024px`, `1440px` | 🟢 Lulus | Redirect client-side `Navigate replace` ke `/app/tpq`. |

---

## 📂 7. Terminologi Pengujian Rute & Direct Refresh

Sesuai standar audit teknis yang diperbarui pada `docs/PROJECT_RELEASE_QA.md`:
1. Rute alias `/tpq` melakukan **client-side redirect** ke `/app/tpq` menggunakan React `Navigate` dengan opsi `replace`.
2. Pengujian *direct browser refresh* pada server Netlify mengembalikan `index.html` dengan status HTTP `200 OK` via SPA rewrite rule (`/* -> /index.html 200`), yang selanjutnya ditangani oleh React Router di tingkat client.

---

## 📋 8. Backlog Performa Mendatang (Future Backlog)

- Integrasi otomatis generator WebP/AVIF pada pipeline CI build saat pustaka C-native tersedia di lingkungan server.
