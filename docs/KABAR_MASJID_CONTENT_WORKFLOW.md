# Alur Kerja & Panduan Publikasi Konten Kabar Masjid

Dokumen ini menjelaskan tata cara penulisan warta baru, standar penamaan berkas, keamanan data, serta konvensi teknis yang wajib diikuti oleh redaksi Humas DKM Masjid Al Ikhlas Cipta Greenville.

---

## 1. Menambahkan Artikel Warta Baru

Saat ini warta dimuat menggunakan struktur data terpusat di `src/data/newsData.js`. Untuk menambahkan artikel baru:
1. Buka berkas `src/data/newsData.js`.
2. Impor berkas gambar sampul jika berada di dalam folder aset, atau gunakan rujukan string URL eksternal yang aman.
3. Tambahkan objek artikel baru ke dalam array `newsArticles` menggunakan format model data yang baku.

---

## 2. Model Data & Konvensi

Setiap objek warta wajib mengikuti struktur data model berikut:

```javascript
{
  id: 7,                                    // ID unik bertipe angka atau string
  title: 'Judul Artikel Menarik',           // Judul editorial warta
  slug: 'judul-artikel-menarik',            // URL slug unik
  category: 'TPQ',                          // TPQ | Kajian | Sosial | Kegiatan | Ramadhan | Qurban
  date: '18 Juli 2026',                     // Format: Tanggal NamaBulan Tahun (Bahasa Indonesia)
  author: 'Nama Penulis/Pengurus',          // Nama penulis atau penanggung jawab rilis warta
  image: coverUrl,                          // Rujukan thumbnail / fallback gambar
  coverImage: coverUrl,                     // Gambar banner utama (dimensi lebar)
  galleryImages: [img1, img2],              // Opsional: array foto dokumentasi kegiatan tambahan
  status: 'Siap publik',                    // Draft | Dalam peninjauan | Siap publik
  visibility: 'Publik',                     // Publik | Privat
  relatedProgramSlug: 'tpq-al-ikhlas',      // Opsional: slug program terkait (siteContent.js)
  relatedAgendaSlug: '',                    // Opsional: slug agenda terkait (siteContent.js)
  ctaLabel: 'Daftar Kelas TPQ',             // Opsional: teks khusus tombol CTA
  ctaHref: '/program',                      // Opsional: URL tujuan aksi
  seoTitle: 'Judul Lengkap Untuk SEO',      // Judul halaman browser
  seoDescription: 'Ringkasan singkat SEO',  // Meta description maksimal 160 karakter
  tags: ['Pendidikan', 'Santri'],           // Array tag kata kunci pencarian warta
  body: `Isi lengkap tulisan berita di sini...`
}
```

### Konvensi Slug (Slug Convention)
* Harus menggunakan huruf kecil saja (`lowercase`).
* Pisahkan kata dengan tanda hubung datar (`-`).
* Jangan gunakan karakter khusus, spasi, atau tanda baca (contoh: `penyerahan-raport-tpq-al-ikhlas`).

### Konvensi Gambar (Image Filename Convention)
* Simpan aset gambar dokumentasi di dalam folder `src/assets/`.
* Gunakan nama berkas deskriptif berhuruf kecil yang relevan dengan topik kegiatan: `kategori-topik-kegiatan.jpg` (contoh: `cerita-kajian-rutin.jpg`, `tpq-raport-distribusi.jpg`).
* Resolusi yang disarankan untuk gambar sampul (`coverImage`) adalah **16:9** (minimum width 1200px) dengan format `.jpg` atau `.png` terkompresi.

---

## 3. Aturan Keamanan & Privasi Data (Safety Rules)

Masjid Al Ikhlas berkomitmen penuh menjaga privasi jamaah dan warga:
* 🔒 **Donatur & Nilai Transaksi**: Jangan menampilkan nama asli donatur perorangan, nomor rekening, atau catatan transfer peribadi di halaman warta publik. Gunakan nama samaran umum (seperti *Hamba Allah*) jika mereferensikan kontribusi warga.
* 🔒 **Data Santri / Anak-anak**: Dilarang mempublikasikan nama lengkap anak-anak santri TPQ, nilai akademik personal, atau informasi identitas pribadi sensitif anak.
* 🔒 **Kontak Pribadi**: Jangan menyebarluaskan nomor handphone pribadi pengurus atau warga tanpa izin tertulis. Gunakan nomor resmi kontak DKM/Humas yang tertera di `siteContent.js`.

---

## 4. Konfigurasi Status & Aksesibilitas (Status/Visibility Rules)

Pengontrolan visibilitas konten warta diatur secara ketat melalui kombinasi dua nilai:

| Nilai Status | Nilai Visibility | Keterangan & Akses Halaman |
| :--- | :--- | :--- |
| **`Siap publik`** | **`Publik`** | Tampil di daftar warta umum, sidebar preview homepage, dan dapat diakses detailnya secara bebas oleh publik. |
| **`Dalam peninjauan`** | **`Publik` / `Privat`** | Disembunyikan dari seluruh halaman publik. Hanya dapat ditinjau oleh tim admin DKM di panel `/app/kabar` (Review Mode). |
| **`Draft`** | **`Publik` / `Privat`** | Status awal penulisan warta. Hanya dapat diakses dan diedit dari panel admin internal. |
| **`Siap publik`** | **`Privat`** | Hanya dapat diakses oleh pengguna yang memiliki hak login admin (tidak tampil di publik). |

---

## 5. Format Penulisan Rekomendasi (Recommended Article Format)

Guna menjaga kualitas tata bahasa warta yang profesional dan nyaman dibaca (amanah & terpercaya):
* **Paragraf Pembuka**: Gunakan kalimat berisikan fakta dasar (5W+1H: apa kegiatannya, kapan dilaksanakan, siapa penyelenggara/pesertanya).
* **Paragraf Isi**: Jelaskan jalannya kegiatan secara runtut, hikmah agenda tersebut, dan rasa syukur atas kerja sama jamaah.
* **Paragraf Penutup**: Sampaikan ucapan terima kasih (syukron) kepada warga, donatur, atau relawan, serta selipkan doa kemaslahatan bersama (Jazakumullahu Khairan).
* **Pemformatan**: Manfaatkan jeda baris kosong ganda (`\n\n`) di antara paragraf agar teks di-render dengan rapi menjadi paragraf editorial terpisah.
