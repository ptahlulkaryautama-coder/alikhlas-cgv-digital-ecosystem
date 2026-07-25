# Audit Gaya Bahasa & Public Copy (Masjid Al Ikhlas CGV v2)

Dokumen ini mencatat hasil evaluasi komprehensif gaya bahasa publik di seluruh rute publik Masjid Al Ikhlas Cipta Greenville Batam berdasarkan aturan dalam skill `gaya-bahasa-natural`.

---

## Ringkasan Hasil Audit Copy

Secara keseluruhan, konten publik existing sudah menyampaikan informasi utama masjid dengan baik. Namun, terdapat beberapa pola khas tulisan berbasis AI/template yang masih sering muncul:
1. **Pola Tricolon / Deretan Kata Sifat (Aturan #1)**: Penggunaan 3 klausa/frasa berderet dalam satu kalimat (misal: *"dokumentasi kegiatan, cerita jamaah, dan kabar terbaru"*).
2. **Penggunaan Kata Modalitas "Dapat" & Kata Kerja Pasif Formal (Aturan #2)**: Istilah seperti *"dapat diterapkan"*, *"mempublikasikan dokumentasi"*, *"menyajikan rekapitulasi"*.
3. **Jargon & Terminology Korporat (Aturan & Red Flags)**: Istilah seperti *"Ekosistem Digital"*, *"ekosistem yang hidup"*, *"narasi pembangunan"*, dan *"operasional sosial kemasyarakatan"*.
4. **Kehilangan Spesifisitas Konkret (Aturan #4)**: Kalimat yang terlalu umum sehingga bisa ditempel ke masjid mana saja tanpa ciri khas perumahan Cipta Greenville / townhouse.

---

## Temuan Detail per Rute Publik

### 1. Halaman Utam / Homepage (`/`)

| Rute / Komponen | Teks Saat Ini (Current Wording) | Alasan Unnatural / Red Flag | Usulan Perbaikan (Natural) | Prioritas |
|---|---|---|---|---|
| `/` — `FourPillars.jsx` | *"Bukan bangunan megah. Ekosistem yang hidup."* | Penggunaan kata "Ekosistem" terasa seperti jargon tech-startup/corporate, bukan bahasa masjid warga perumahan. | *"Bukan sekadar bangunan. Kegiatan harian yang benar-benar berjalan."* | **Tinggi** |
| `/` — `FourPillars.jsx` | *"Kekuatan Masjid Al Ikhlas bukan dari bentuk arsitektur besar, tetapi dari ritme ibadah, ilmu, keluarga, dan amanah yang berjalan setiap hari."* | Kalimat terlalu panjang dan memakai 4 pilar berderet tanpa fokus detail konkret lokasi townhouse. | *"Masjid ini berdiri di unit townhouse Cipta Greenville. Kekuatannya ada pada shalat berjamaah, TPQ anak, dan kas yang terbuka tiap bulan."* | **Tinggi** |
| `/` — `DigitalEcosystem.jsx` | *"Ekosistem Digital Masjid"* / *"Website Publik: Identitas, jadwal, program, kontak."* | Istilah "Ekosistem Digital" berasa seperti brosur produk SaaS korporat. | *"Portal & Services Jamaah"* / *"Website Utama: Jadwal shalat, program kajian, kas terbuka, dan kontak DKM."* | **Tinggi** |
| `/` — `Hero.jsx` | *"Masjid yang dihidupkan dari keikhlasan."* | Slogan terlalu umum dan puitis tanpa menyebutkan identitas unik sebagai masjid townhouse perumahan. | *"Berawal dari ruko townhouse, dihidupkan bersama oleh warga Cipta Greenville."* | **Sedang** |

---

### 2. Program & Kajian (`/program`)

| Rute / Komponen | Teks Saat Ini (Current Wording) | Alasan Unnatural / Red Flag | Usulan Perbaikan (Natural) | Prioritas |
|---|---|---|---|---|
| `/program` — `PublicProgram.jsx` (Hero) | *"Majelis ilmu, TPA, tahsin, kelas bahasa Arab, dan pembelajaran keluarga yang diselenggarakan secara teratur untuk jamaah Cipta Greenville."* | Istilah "diselenggarakan secara teratur" sangat kaku/birokratis. | *"Jadwal pengajian rutin, TPQ anak, kelas tahsin, dan Bahasa Arab dari nol untuk warga Cipta Greenville."* | **Tinggi** |
| `/program` — `ProgramKegiatan.jsx` | *"PROGRAM & KELAS ILMU"* / *"3 program belajar aktif."* | Heading ALL-CAPS kaku, frasa "program belajar aktif" berasa laporan admin. | *"Pilihan Kelas & Kajian Rutin"* / *"3 kelas kajian aktif minggu ini."* | **Sedang** |
| `/program` — `PublicProgram.jsx` (CTA Block) | *"Masjid Al Ikhlas menyelenggarakan berbagai peringatan hari besar Islam, gotong royong, dan rapat koordinasi warga. Mari lihat jadwal lengkap kegiatan kami berikutnya."* | Kalimat pasif template AI ("menyelenggarakan berbagai..."). | *"Dari shalat Id, gotong royong perumahan, sampai rapat DKM—semua jadwal kegiatan warga bisa Anda cek di sini."* | **Sedang** |

---

### 3. Agenda & Event Mendatang (`/agenda`)

| Rute / Komponen | Teks Saat Ini (Current Wording) | Alasan Unnatural / Red Flag | Usulan Perbaikan (Natural) | Prioritas |
|---|---|---|---|---|
| `/agenda` — `PublicAgenda.jsx` (Hero) | *"Jadwal lengkap kegiatan ibadah, hari besar Islam, gotong royong warga, dan rapat koordinasi DKM Masjid Al Ikhlas Cipta Greenville."* | List 4 frasa berderet dengan koma ("kegiatan ibadah, hari besar Islam, gotong royong..."). | *"Catat tanggal gotong royong perumahan, shalat Id, dan jadwal kumpul pengurus DKM Al Ikhlas."* | **Sedang** |
| `/agenda` — `ProgramKegiatan.jsx` (Sidebar Detail) | *"Tidak ada agenda khusus terjadwal pada tanggal ini."* | Kalimat notifikasi terlalu kaku dan formal. | *"Belum ada kegiatan di tanggal ini. Coba pilih tanggal yang memiliki titik emas di kalender."* | **Rendah** |

---

### 4. Kabar Masjid (`/kabar` & `/kabar/:slug`)

| Rute / Komponen | Teks Saat Ini (Current Wording) | Alasan Unnatural / Red Flag | Usulan Perbaikan (Natural) | Prioritas |
|---|---|---|---|---|
| `/kabar` — `PublicNews.jsx` (Hero) | *"Dokumentasi kegiatan, cerita jamaah, dan kabar terbaru dari Masjid Al Ikhlas CGV."* | **Tricolon Red Flag (Aturan #1)**: 3 klausa berderet ("dokumentasi X, cerita Y, dan kabar Z"). | *"Cerita kegiatan warga, catatan pengajian, dan pengumuman resmi DKM Al Ikhlas."* | **Tinggi** |
| `/kabar` — `PublicNews.jsx` (CTA Block) | *"Ingin mempublikasikan dokumentasi kegiatan warga? Bagi pengurus RT... yang ingin mempublikasikan dokumentasi kegiatan..."* | Pengulangan frasa "mempublikasikan dokumentasi kegiatan" 2 kali dalam 2 kalimat berurutan! Sangat kaku & redundant. | *"Punya foto atau catatan kegiatan warga? Kalau pengurus RT, ustadz TPQ, atau relawan punya liputan acara perumahan, kirimkan ke tim Humas DKM untuk kita tayangkan di sini."* | **Tinggi** |
| `/kabar/:slug` — `PublicNewsDetail.jsx` (CTA) | *"Setiap bantuan yang disalurkan jamaah digunakan langsung untuk menunjang fasilitas belajar santri TPQ dan operasional sosial kemasyarakatan di perumahan Cipta Greenville."* | Jargon kaku: "operasional sosial kemasyarakatan". | *"Setiap infaq jamaah dipakai langsung untuk operasional TPQ anak-anak dan kegiatan sosial warga Cipta Greenville."* | **Tinggi** |

---

### 5. Transparansi Keuangan (`/transparansi`)

| Rute / Komponen | Teks Saat Ini (Current Wording) | Alasan Unnatural / Red Flag | Usulan Perbaikan (Natural) | Prioritas |
|---|---|---|---|---|
| `/transparansi` — `TransparencyHero.jsx` | *"Ringkasan keuangan publik yang mudah dibaca jamaah. Kami menyajikan rekapitulasi kas masuk dan keluar secara terbuka dan amanah."* | Frasa "menyajikan rekapitulasi" terdengar kaku seperti pengantar surat audit internal kantor. | *"Laporan kas masjid yang bisa dicek siapa saja. Semua infaq masuk dan pengeluaran dicatat terbuka tiap bulan."* | **Tinggi** |
| `/transparansi` — `DonationInfo.jsx` | *"Salurkan amanah melalui rekening resmi masjid. Gunakan rekening atau QRIS resmi... agar pencatatan dapat diselesaikan dengan amanah."* | Kata "amanah" diulang 3 kali dalam 2 kalimat. Juga memakai kata "dapat" tanpa perlu. | *"Transfer donasi ke rekening atau QRIS resmi DKM. Setelah transfer, kabari kami via WhatsApp supaya bisa langsung dimasukkan ke laporan bulanan."* | **Tinggi** |

---

### 6. Donasi & Infaq (`/donasi`)

| Rute / Komponen | Teks Saat Ini (Current Wording) | Alasan Unnatural / Red Flag | Usulan Perbaikan (Natural) | Prioritas |
|---|---|---|---|---|
| `/donasi` — `PublicDonation.jsx` (Hero) | *"Dukungan nyata untuk operasional ibadah harian, pendidikan TPQ anak-anak, penyediaan fasilitas jamaah, dan pelayanan sosial bagi warga Cipta Greenville."* | Pola daftar 4 frasa berurutan ("operasional X, pendidikan Y, penyediaan Z, dan pelayanan W"). | *"Infaq Anda dipakai langsung untuk bayar listrik & air masjid, mengajar anak-anak TPQ, serta membantu warga yang membutuhkan."* | **Tinggi** |
| `/donasi` — `DonationSection.jsx` | *"Fokus donasi bukan narasi pembangunan besar, tetapi kebutuhan nyata: operasional ibadah, pendidikan anak, kebersihan, fasilitas, dan layanan sosial warga."* | Frasa "narasi pembangunan besar" berasa meta-commentary AI. | *"Setiap rupiah digunakan untuk kebutuhan harian masjid: dari operasional shalat, guru TPQ, sampai peralatan dan kebersihan."* | **Tinggi** |

---

### 7. Kontak DKM (`/kontak`)

| Rute / Komponen | Teks Saat Ini (Current Wording) | Alasan Unnatural / Red Flag | Usulan Perbaikan (Natural) | Prioritas |
|---|---|---|---|---|
| `/kontak` — `ContactSection.jsx` | *"Datang, bertanya, atau ikut menghidupkan."* | Pola tricolon 3 kata kerja ("Datang, bertanya, atau menghidupkan"). | *"Alamat Masjid & Kontak Pengurus"* | **Tinggi** |
| `/kontak` — `PublicContact.jsx` | *"Silakan datang langsung ke lokasi masjid kami di Cipta Greenville Batam, atau kirimkan pesan online ke sekretariat DKM Al Ikhlas."* | Frasa "kirimkan pesan online ke sekretariat" terasa formal dan impersonal. | *"Silakan mampir langsung ke perumahan Cipta Greenville Batam, atau kirim pesan WhatsApp ke pengurus DKM."* | **Sedang** |

---

## Kesimpulan Audit Copy
Seluruh rekomendasi di atas mempertahankan fakta teknis masjid (lokasi Cipta Greenville, rekening BSI, kontak WA), namun mengubah cara penyampaiannya agar terasa hangat, transparan, dan ditulis oleh warga lokal Batam—bukan hasil kompilasi AI template.
