# Peta Archetype & Panduan Desain Visual (Masjid Al Ikhlas CGV v2)

Dokumen ini mendefinisikan pemetaan archetype desain visual publik untuk setiap rute di situs Masjid Al Ikhlas Cipta Greenville Batam, mengacu pada rak referensi dalam skill `web-design-archetypes` (`serious-corporate.md`, `luxurious-elegant.md`, dan `playful-charming.md`).

---

## Matriks Archetype Rute Publik

| Rute | Archetype Utama (70%) | Archetype Aksesori (30%) | Karakter Visual Utama | Tone CTA |
|---|---|---|---|---|
| `/` (Homepage) | **Serious / Corporate** | **Luxurious / Elegant** | Kredibel, tertata rapi dengan sentuhan aksen emas muted & whitespace editorial mewah. | Confident, mengundang tanpa paksaan (*"Lihat Kegiatan"*, *"Dukung Masjid"*). |
| `/program` | **Serious / Corporate** | **Playful / Charming** (ringan) | Struktur grid rapi dengan kartu kategori warna hangat & badge ikon humanis. | Keingintahuan & partisipasi (*"Lihat Semua Program Kajian"*). |
| `/agenda` | **Serious / Corporate** | **Playful / Charming** (ringan) | Presisi kalender & garis waktu dengan aksen indikator emas dan filter interaktif. | Informatif & interaktif (*"Pilih Tanggal"*, *"Hubungi Pengurus"*). |
| `/kabar`, `/kabar/:slug` | **Playful / Charming** | **Serious / Corporate** | Hangat, pendekatan majalah/editorial cerita warga dengan tipografi serif klasik. | Ramah & komunikatif (*"Baca selengkapnya →"*, *"Hubungi Humas DKM"*). |
| `/transparansi` | **Serious / Corporate** | **Luxurious / Elegant** | Presisi data keuangan tinggi, chart bersih, hairline divider, badge status resmi. | Amanah & transparan (*"Ringkasan"*, *"Donasi"*). |
| `/donasi` | **Serious / Corporate** | **Luxurious / Elegant** | Terpercaya, pilihan program ber-kartu rapi, aksen QRIS & BSI yang elegan. | Jelas & praktis (*"Konfirmasi Donasi via WhatsApp"*). |
| `/kontak` | **Serious / Corporate** | **Playful / Charming** (hangat) | Praktis, responsif, peta lokasi terintegrasi dengan form interaktif. | Langsung & membantu (*"Kirim Pesan via WhatsApp"*). |

---

## Panduan Elemen Desain per Archetype Blend

### 1. Tipografi & Hierarki Visual
- **Display / Heading (H1, H2)**: 
  - Kombinasi sans geometris bersih (*Inter* / *Outfit*) untuk kesan **Serious/Corporate**, dipadukan dengan serif editorial kontras tinggi (*DM Serif Display* / *Georgia*) untuk aksen **Luxurious/Elegant** di judul utama halaman dan kutipan Al-Qur'an.
- **Sub-heading & Label / Eyebrow**:
  - Small caps atau uppercase dengan letter-spacing lebar (`letter-spacing: 0.08em` s.d. `0.12em`) khas **Luxurious/Elegant** untuk label kicker (misal: `LOKASI & KONTAKT`, `TRANSPARANSI & AMANAH`).
- **Body Text**:
  - Sans-serif legibel (*Inter*, *system-ui*) dengan `line-height: 1.6` s.d. `1.8` agar mudah dibaca di perangkat mobile.

### 2. Palet Warna & Aksentuasi
- **Base Neutral**: Deep Forest `#0C2B1D` / `#0B0F0D` (gelap netral) dan Off-White / Gading `#FAF8F5` / `#F7F8FA`.
- **Aksen Emas Muted (Luxury)**: `#C9A55A` & `#B8973F` untuk CTA premium, border halus, dan angka highlight. *Hindari emas neon/kuning terang.*
- **Aksen Komunitas Warm (Charming)**: Terracotta `#E07856` & Hijau Sage `#8BA888` untuk badge kategori kabar dan label agenda.

### 3. Karakter Kartu & Spacing
- **Serious / Corporate + Elegant**: Card dengan border hairline tipis (`1px solid rgba(12,24,16,0.08)`), tanpa shadow tebal/berisik. Whitespace antar section lega (`60px` - `80px` padding).
- **Playful / Charming (Kabar & Program)**: Border radius sedikit membulat (`12px` - `16px`), efek hover mikro yang halus (`transform: translateY(-2px)` dalam durasi `250ms`).

### 4. Elemen Visual yang Wajib Dihindari (Anti-Patterns)
- ❌ **Gradiensi Neon / Warna-warni Mencolok**: Merusak kesan kredibel dan amanah masjid.
- ❌ **Shadow Tebal & Ornamen Berisik**: Terlalu banyak sticker/badge kecil membuat situs terlihat seperti template murah.
- ❌ **Stock Photo Generik**: Selalu prioritaskan aset foto asli Masjid Al Ikhlas (suasana townhouse, kajian warga, santri TPQ).
- ❌ **Pop-up / Banner Desakan Murahan**: Tidak boleh ada timer mundur palsu atau banner melayang yang mengganggu kenyamanan jamaah.

---

## Ringkasan Eksekusi Desain

Dengan pemetaan archetype ini, seluruh halaman publik Masjid Al Ikhlas CGV v2 tetap berada dalam satu kesatuan desain brand yang konsisten (**Kredibel & Transparan** sebagai fondasi utama), sembari memberikan warna dan kehangatan yang pas untuk setiap jenis halaman (cerita warga yang hangat di `/kabar`, serta kemewahan subtle dan presisi di `/transparansi` dan `/donasi`).
