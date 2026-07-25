# Panduan & Templat Penulisan Kabar Masjid Al Ikhlas
## Digital Ecosystem Content Guidelines

Dokumen ini mendefinisikan standar struktur data, nada penulisan, panduan privasi, konvensi penamaan berkas, rekomendasi panjang artikel, serta templat siap pakai untuk seluruh publikasi warta pada ekosistem digital Masjid Al Ikhlas Cipta Greenville.

---

## 🗣️ 1. Nada Penulisan (Tone of Voice)

Untuk menjaga kedekatan dengan jamaah sekaligus mempertahankan kredibilitas organisasi, gunakan nada bicara **Indonesia yang Hangat, Resmi, Bersahabat, dan Islami (Warm, Official, Jamaah-Friendly Indonesian Tone)**.

*   **Hangat & Islami:** Awali kabar dengan ucapan syukur (*Alhamdulillah*, *Insya Allah*, *Barakallahu lakum*) dan iringi dengan untaian doa bagi warga. Hindari kesan dingin atau kaku.
*   **Resmi & Profesional:** Gunakan tata bahasa Indonesia baku yang sesuai dengan PUEBI/EYD. Struktur kalimat harus rapi, santun, dan dapat dipertanggungjawabkan sebagai rilis resmi DKM.
*   **Bersahabat & Dekat:** Sapa warga sebagai *"Jamaah Masjid Al Ikhlas"*, *"Warga Cipta Greenville"*, atau *"Saudara-saudari seiman"*.
*   **Hindari Bahasa Robot/AI:** Penulisan tidak boleh terkesan generik, penuh pengulangan frasa yang tidak perlu, atau menggunakan diksi terjemahan mesin yang tidak lazim dalam interaksi sehari-hari masyarakat muslim Indonesia. Gunakan gaya bercerita (*storytelling*) yang mengalir dan tulus.

---

## 🔒 2. Panduan Keamanan Publik & Privasi (Public Safety Guidance)

Keamanan informasi jamaah adalah prioritas utama. DKM wajib mematuhi batasan publikasi berikut:
1.  **Lindungi Nama Donatur Pribadi:** Jangan pernah mempublikasikan nama lengkap donatur yang menginginkan privasi atau jumlah donasi spesifik yang disandingkan dengan identitas lengkap di ruang publik. Gunakan sebutan *"Hamba Allah"* atau gunakan inisial nama demi menjaga keikhlasan dan privasi donatur.
2.  **Batasi Nama Lengkap Anak-anak:** Untuk kegiatan TPQ atau santri anak-anak, gunakan nama panggilan atau inisial saja. Jangan pernah menuliskan nama lengkap anak beserta nama orang tua secara mendetail tanpa izin tertulis dari orang tua/wali santri demi keselamatan anak.
3.  **Hindari Data Pribadi Sensitif (PII):** Dilarang menampilkan nomor telepon pribadi warga, alamat rumah lengkap (blok dan nomor rumah), nomor induk kependudukan (NIK), atau nomor rekening bank tanpa sensor di dalam artikel kabar.
4.  **Tunda Klaim Finansial yang Belum Terverifikasi:** Segala bentuk laporan penerimaan uang, pengeluaran kas pembangunan, atau laporan nilai qurban wajib melalui verifikasi dan persetujuan Bendahara DKM sebelum ditulis ke dalam artikel kabar.

---

## ⚙️ 3. Konvensi Teknis & Struktur Data

Setiap postingan artikel kabar disimpan dalam file data [src/data/newsData.js](file:///C:/Users/lenovo/Desktop/afiryu-project/Masjid%20Al%20Ikhlas/alikhlas-cgv-v2/src/data/newsData.js). Struktur data artikel harus mencakup field-field standar berikut:

### A. Skema Data Artikel (JSON/JS Fields)
| Field | Tipe Data | Deskripsi |
| :--- | :--- | :--- |
| `title` | `String` | Judul artikel kabar yang menarik dan informatif. |
| `slug` | `String` | URL unik ramah SEO (lowercase dan tanda hubung). |
| `category` | `String` | Kategori artikel (contoh: `TPQ`, `Sosial`, `Kajian`, `Kegiatan`). |
| `date` | `String` | Tanggal publikasi kabar (contoh: `28 Juni 2026`). |
| `excerpt` | `String` | Ringkasan pendek (1-2 kalimat) untuk kartu pratinjau halaman depan. |
| `coverImage` | `String` | Referensi impor file gambar utama yang digunakan sebagai cover. |
| `author` | `String` | Penulis artikel atau divisi pengurus DKM yang merilis kabar. |
| `status` | `String` | Status alur kerja: `Draft` (belum tayang) atau `Siap publik` (siap tayang). |
| `visibility`| `String` | Aksesibilitas: `Privat` (hanya admin) atau `Publik` (semua pengunjung). |
| `tags` | `Array` | Kumpulan kata kunci terkait artikel (maksimal 3-4 tag). |
| `body` | `String` | Isi paragraf lengkap artikel kabar (mendukung format multiline/markdown). |
| `CTA` | `Object` | Panggilan aksi interaktif bagi jamaah (misal: link donasi, daftar kajian, dsb). |

### B. Konvensi Slug
Slug dibuat secara manual dengan aturan huruf kecil (*lowercase*), menggunakan tanda hubung (`-`) sebagai pengganti spasi, tanpa karakter khusus, dan mencerminkan isi judul kabar.
*   *Judul:* Penyerahan Raport TPQ Al Ikhlas
*   *Slug:* `penyerahan-raport-tpq-al-ikhlas`

### C. Konvensi Penamaan File Gambar (Image Filename)
Setiap file dokumentasi gambar wajib diganti namanya sebelum dimasukkan ke dalam folder proyek agar mempermudah pelacakan aset. Format penamaannya adalah:
```markdown
kabar-[kategori]-[deskripsi-singkat]-[bulan]-[tahun].[ekstensi]
```
*   *Contoh:* `kabar-tpq-pembagianraport-juni-2026.jpg`
*   *Contoh:* `kabar-muslimat-yasinan-juli-2026.png`

### D. Rekomendasi Panjang Artikel
Demi menjaga keterbacaan jamaah yang mengakses portal melalui perangkat seluler (*smartphone*):
*   **Panjang Optimal:** Berkisar antara **150 hingga 300 kata**.
*   **Struktur Paragraf:** Terdiri atas 3 sampai 4 paragraf pendek dengan pemisah baris kosong yang jelas untuk menghindari dinding teks (*wall of text*).

---

## 📌 4. Contoh 10 Judul Editorial Kabar Masjid

Gunakan judul-judul yang menarik, memancarkan aura positif, dan bernada hangat. Berikut 10 contoh judul yang direkomendasikan:

1.  *Penyerahan Raport TPQ Al Ikhlas: Mengapresiasi Semangat Belajar Santri*
2.  *Menjemput Berkah Hari Jumat Melalui Penyaluran Makanan Gratis untuk Warga*
3.  *Mengokohkan Silaturahmi Warga Melalui Gotong Royong Kebersihan Masjid*
4.  *Kajian Rutin Keluarga: Membina Rumah Tangga Harmonis di Era Digital*
5.  *Indahnya Berbagi: Penyaluran Paket Sembako DKM Al Ikhlas untuk Dhuafa*
6.  *Semarak Ramadhan 1447H: Kehangatan Buka Puasa Bersama Jamaah Greenville*
7.  *Idul Adha 1447H: Menyalurkan Amanah Qurban untuk Warga Sekitar*
8.  *Majelis Muslimat Al Ikhlas: Mempererat Ukhuwah Melalui Kajian Fiqih Wanita*
9.  *Pembersihan Karpet Utama: Menjaga Kekhusyukan dan Kenyamanan Sholat Jamaah*
10. *Santunan Yatim Piatu DKM Al Ikhlas: Menghadirkan Kebahagiaan untuk Sesama*

---

## 📝 5. Templat Penulisan Siap Pakai

Berikut adalah 8 templat kabar berdasarkan kategori kegiatan di lingkungan Masjid Al Ikhlas Cipta Greenville. Isi di dalam tanda kurung siku `[...]` wajib disesuaikan dengan fakta di lapangan.

### Templat 1: Penyerahan Raport TPQ
*   **Kategori:** `TPQ`
*   **Tags:** `['TPQ', 'Pendidikan', 'Santri']`
*   **Excerpt:** Alhamdulillah, TPQ Al Ikhlas telah menyelesaikan evaluasi belajar dan penyerahan raport santri semester [Ganjil/Genap] dengan khidmat.
*   **Template Body:**
    ```markdown
    Alhamdulillah, seluruh rangkaian kegiatan belajar mengajar TPQ Al Ikhlas Cipta Greenville Semester [Ganjil/Genap] telah resmi ditutup dengan dilaksanakannya penyerahan raport santri. Kegiatan ini berlangsung dengan penuh rasa syukur di ruang utama Masjid Al Ikhlas, dihadiri oleh para wali santri, ustadz/ustadzah pengajar, serta jajaran pengurus DKM.

    Penyerahan raport ini merupakan momentum penting untuk melaporkan perkembangan belajar membaca Al-Qur'an (tajwid dan makhraj), hafalan surah-surah pendek Juz 30, serta pemahaman adab harian santri selama [enam] bulan terakhir. [Tulis detail pencapaian santri terbaik atau catatan umum guru di sini].

    DKM Masjid Al Ikhlas menyampaikan apresiasi yang tinggi kepada para ustadz dan ustadzah atas keikhlasannya mendidik generasi muda, serta seluruh orang tua wali santri yang senantiasa mendukung pembelajaran anak di rumah. Semoga para santri semakin termotivasi untuk mencintai Al-Qur'an.
    ```
*   **Template CTA:**
    ```javascript
    CTA: {
      text: 'Lihat Galeri Foto TPQ',
      link: '/galeri/tpq'
    }
    ```

---

### Templat 2: Sedekah Jumat
*   **Kategori:** `Sosial`
*   **Tags:** `['Sosial', 'Sedekah', 'Jumat']`
*   **Excerpt:** Penyaluran amanah paket makanan gratis bagi jamaah sholat Jumat serta warga pekerja di sekitar perumahan Cipta Greenville.
*   **Template Body:**
    ```markdown
    Kegiatan rutin Sedekah Jumat kembali terlaksana dengan penuh berkah di Masjid Al Ikhlas Cipta Greenville. Pekan ini, divisi sosial DKM berhasil menyalurkan sebanyak [jumlah] paket makanan siap saji yang dibagikan secara gratis kepada para jamaah setelah pelaksanaan sholat Jumat serta warga pekerja di sekitar kawasan perumahan.

    Program sosial ini bertujuan untuk memupuk rasa kepedulian antar sesama, meringankan beban pekerja harian, serta mempererat tali silaturahmi antarwarga. Seluruh paket makanan yang disalurkan bersumber sepenuhnya dari donasi sukarela warga yang dikelola secara transparan dan amanah oleh pengurus.

    DKM Al Ikhlas mengucapkan terima kasih yang sebesar-besarnya kepada para donatur atas kepercayaan dan dukungannya yang konsisten. Semoga amal ibadah kita semua diterima dan dilipatgandakan pahalanya oleh Allah SWT.
    ```
*   **Template CTA:**
    ```javascript
    CTA: {
      text: 'Salurkan Sedekah Jumat Anda',
      link: '/donasi/sedekah-jumat'
    }
    ```

---

### Templat 3: Kajian Rutin
*   **Kategori:** `Kajian`
*   **Tags:** `['Kajian', 'Ilmu', 'Keluarga']`
*   **Excerpt:** Dokumentasi jalannya kajian kitab rutin membahas tema [Tema Utama Kajian] demi mengokohkan keimanan keluarga muslim.
*   **Template Body:**
    ```markdown
    Majelis ta'lim Masjid Al Ikhlas Cipta Greenville kembali menyelenggarakan Kajian Rutin dengan menghadirkan narasumber [Nama Ustadz] untuk membahas kitab [Nama Kitab]. Kajian kali ini berfokus pada tema "[Tema Pembahasan Kajian]" yang sangat relevan dengan kehidupan sehari-hari jamaah.

    Kajian yang dihadiri oleh jamaah bapak-bapak, ibu-ibu, serta remaja masjid ini berjalan secara interaktif. Pemateri memaparkan materi dengan detail, membahas [tulis 1-2 poin penting materi kajian di sini]. Sesi tanya jawab di akhir kajian juga dimanfaatkan jamaah untuk berkonsultasi seputar hukum Islam praktis.

    Semoga kajian rutin ini senantiasa menambah khazanah keilmuan islam kita, memperkuat keimanan, serta mengokohkan ukhuwah islamiyah di lingkungan perumahan Cipta Greenville. Pengurus mengundang seluruh warga untuk dapat hadir pada kajian berikutnya.
    ```
*   **Template CTA:**
    ```javascript
    CTA: {
      text: 'Jadwal Kajian Lengkap',
      link: '/agenda/kajian'
    }
    ```

---

### Templat 4: Kerja Bakti Masjid
*   **Kategori:** `Kegiatan`
*   **Tags:** `['Kegiatan', 'Gotong Royong', 'Kebersihan']`
*   **Excerpt:** Aksi gotong royong warga Cipta Greenville dalam membersihkan area ibadah, ruang wudhu, dan merawat taman Masjid Al Ikhlas.
*   **Template Body:**
    ```markdown
    Dalam rangka menjaga kenyamanan, keindahan, dan kekhusyukan ibadah, DKM bersama warga perumahan Cipta Greenville melaksanakan kegiatan kerja bakti gotong royong bersama. Agenda utama goro kali ini berfokus pada pembersihan menyeluruh area taman luar, ruang wudhu, toilet, pengecatan pagar yang mulai pudar, serta perawatan rutin pendingin ruangan (AC).

    Sejak pagi hari, warga dari berbagai klaster berkumpul dengan membawa berbagai peralatan kebersihan. Kerja bakti ini tidak hanya membuat lingkungan masjid menjadi bersih dan segar, tetapi juga menjadi sarana yang sangat baik untuk mempererat silaturahmi dan ukhuwah islamiyah antar tetangga.

    DKM menyampaikan terima kasih yang setinggi-tingginya kepada seluruh warga yang telah meluangkan waktu, tenaga, serta menyumbangkan konsumsi dalam menyukseskan gotong royong ini. Semoga kebersamaan ini terus terjaga.
    ```
*   **Template CTA:**
    ```javascript
    CTA: {
      text: 'Hubungi Hub Humas DKM',
      link: '/hubungi-kami'
    }
    ```

---

### Templat 5: Kegiatan Sosial
*   **Kategori:** `Sosial`
*   **Tags:** `['Sosial', 'Bantuan', 'Santunan']`
*   **Excerpt:** Dokumentasi penyaluran bantuan sosial kemasyarakatan dari donatur Masjid Al Ikhlas untuk meringankan beban sesama yang membutuhkan.
*   **Template Body:**
    ```markdown
    Alhamdulillah, sebagai wujud kepedulian sosial dan solidaritas kemanusiaan, DKM Masjid Al Ikhlas Cipta Greenville telah menyelenggarakan kegiatan sosial kemasyarakatan berupa [Nama Kegiatan, misal: Penyaluran Paket Sembako / Khitanan Massal / Santunan Anak Yatim]. Kegiatan kemanusiaan ini diselenggarakan di aula utama masjid dengan menyasar [Kelompok Penerima, misal: anak yatim piatu / keluarga dhuafa / warga pekerja perumahan].

    Dalam agenda kali ini, pengurus berhasil menyalurkan [Rincian Bantuan, misal: 50 paket sembako lengkap / santunan uang tunai] yang dikumpulkan dari sumbangan para donatur dan jamaah Masjid Al Ikhlas. Acara berlangsung dengan tertib dan diisi dengan doa bersama demi keselamatan, keberkahan, serta kelancaran rezeki para donatur.

    DKM Al Ikhlas menyampaikan rasa syukur dan terima kasih yang mendalam kepada seluruh muhsinin (para donatur) yang telah menyisihkan sebagian hartanya. Semoga kepedulian ini menjadi pemberat amal kebaikan di akhirat kelak dan membawa keberkahan bagi lingkungan tempat tinggal kita.
    ```
*   **Template CTA:**
    ```javascript
    CTA: {
      text: 'Program Sosial DKM',
      link: '/program/sosial'
    }
    ```

---

### Templat 6: Ramadhan
*   **Kategori:** `Kegiatan`
*   **Tags:** `['Ramadhan', 'Ibadah', 'Tarawih']`
*   **Excerpt:** Suasana hangat dan penuh keberkahan ibadah puasa dan sholat tarawih berjamaah warga di Masjid Al Ikhlas.
*   **Template Body:**
    ```markdown
    Suasana hangat dan penuh keberkahan menyelimuti Masjid Al Ikhlas Cipta Greenville dalam menyemarakkan bulan suci Ramadan [Tahun/1447H]. Salah satu agenda utama yang rutin diselenggarakan adalah [Buka Puasa Bersama / Sholat Tarawih Berjamaah / Kajian Nuzulul Qur'an] yang dihadiri secara antusias oleh jamaah dewasa, remaja, hingga anak-anak.

    DKM menyediakan hidangan takjil dan makan malam yang disiapkan secara gotong royong oleh para ibu jamaah masjid dari donasi warga yang masuk. Kegiatan sholat tarawih berjamaah juga diiringi dengan ceramah agama singkat sebelum sholat tarawih dimulai untuk memperdalam ilmu agama jamaah.

    DKM Masjid Al Ikhlas mengucapkan Jazakumullahu Khairan Katsiran kepada seluruh donatur Ramadan yang telah mempercayakan ibadahnya melalui masjid kita. Semoga Allah menerima amal ibadah dan puasa kita semua.
    ```
*   **Template CTA:**
    ```javascript
    CTA: {
      text: 'Jadwal Imsakiyah & Tarawih',
      link: '/agenda/ramadhan'
    }
    ```

---

### Templat 7: Qurban
*   **Kategori:** `Kegiatan`
*   **Tags:** `['Idul Adha', 'Qurban', 'Sosial']`
*   **Excerpt:** Dokumentasi pelaksanaan ibadah penyembelihan dan penyaluran hewan qurban Hari Raya Idul Adha di Masjid Al Ikhlas.
*   **Template Body:**
    ```markdown
    Gema takbir mengiringi pelaksanaan penyembelihan dan penyaluran hewan qurban dalam rangka Hari Raya Idul Adha [Tahun/1447H] di area Masjid Al Ikhlas. Divisi qurban DKM bekerja sama dengan warga perumahan berhasil mengelola penyembelihan sebanyak [jumlah] ekor sapi dan [jumlah] ekor kambing.

    Daging qurban tersebut kemudian dikemas dengan rapi menggunakan wadah ramah lingkungan dan disalurkan secara amanah kepada warga perumahan Greenville, pekerja lapangan, serta masyarakat sekitar yang berhak menerima. Kegiatan suci ini berjalan dengan lancar berkat kerja sama yang solid antara panitia pelaksana dan warga yang bahu-membahu menyukseskan acara.

    DKM Masjid Al Ikhlas mengucapkan terima kasih yang tulus kepada seluruh shohibul qurban yang telah mempercayakan amanahnya kepada panitia DKM. Semoga Allah menerima amal qurban dan ibadah kita semua.
    ```
*   **Template CTA:**
    ```javascript
    CTA: {
      text: 'Laporan Keuangan Qurban',
      link: '/laporan/qurban'
    }
    ```

---

### Templat 8: Muslimat
*   **Kategori:** `Kegiatan`
*   **Tags:** `['Muslimat', 'Kajian', 'Silaturahmi']`
*   **Excerpt:** Agenda rutin silaturahmi dan kajian keagamaan majelis taklim Muslimat Al Ikhlas Cipta Greenville.
*   **Template Body:**
    ```markdown
    Alhamdulillah, majelis taklim Muslimat Masjid Al Ikhlas Cipta Greenville telah menyelenggarakan kegiatan [kajian rutin bulanan / yasinan bersama / pelatihan keterampilan]. Kegiatan ini dilaksanakan di ruang utama masjid dan dihadiri secara antusias oleh ibu-ibu jamaah perumahan Cipta Greenville.

    Acara kali ini diawali dengan pembacaan ayat suci Al-Qur'an dan dilanjutkan dengan penyampaian materi keagamaan oleh [Nama Ustadzah/Penceramah] dengan tema "[Tema Kajian Muslimat]". Kegiatan ini tidak hanya menjadi sarana menambah ilmu keislaman, tetapi juga menjadi wadah silaturahmi yang erat antar-ibu rumah tangga lintas klaster.

    Pengurus Muslimat menyampaikan terima kasih atas kehadiran dan partisipasi aktif seluruh jamaah ibu-ibu. Semoga majelis ilmu ini membawa keberkahan bagi keluarga dan lingkungan tempat tinggal kita.
    ```
*   **Template CTA:**
    ```javascript
    CTA: {
      text: 'Gabung Komunitas Muslimat',
      link: '/program/muslimat'
    }
    ```

---

## 📖 6. Contoh Artikel Lengkap (Completed Article Example)

Berikut adalah contoh artikel yang telah diisi lengkap mengikuti seluruh panduan di atas:

```javascript
{
  id: 1,
  title: 'Penyerahan Raport TPQ Al Ikhlas: Mengapresiasi Semangat Belajar Santri',
  slug: 'penyerahan-raport-tpq-al-ikhlas-mengapresiasi-semangat-belajar-santri',
  category: 'TPQ',
  date: '28 Juni 2026',
  excerpt: 'Alhamdulillah, TPQ Al Ikhlas telah melaksanakan evaluasi belajar dan penyerahan raport santri Semester Ganjil dengan penuh rasa syukur.',
  coverImage: 'kabar-tpq-pembagianraport-juni-2026.jpg',
  author: 'Ustadzah Aminah',
  status: 'Siap publik',
  visibility: 'Publik',
  tags: ['TPQ', 'Pendidikan', 'Santri'],
  body: `
    Alhamdulillah, seluruh rangkaian kegiatan belajar mengajar TPQ Al Ikhlas Cipta Greenville Semester Ganjil telah resmi ditutup dengan dilaksanakannya penyerahan raport santri. Kegiatan ini berlangsung dengan penuh rasa syukur di ruang utama Masjid Al Ikhlas, dihadiri oleh para wali santri, ustadz/ustadzah pengajar, serta jajaran pengurus DKM.

    Penyerahan raport ini merupakan momentum penting untuk melaporkan perkembangan belajar membaca Al-Qur'an (tajwid dan makhraj), hafalan surah-surah pendek Juz 30, serta pemahaman adab harian santri selama enam bulan terakhir. Evaluasi dilakukan secara berkala demi memastikan kualitas serapan ilmu keagamaan santri.

    DKM Masjid Al Ikhlas menyampaikan apresiasi yang tinggi kepada para ustadz dan ustadzah atas keikhlasannya mendidik generasi muda, serta seluruh orang tua wali santri yang senantiasa mendukung pembelajaran anak di rumah. Semoga para santri semakin termotivasi untuk mencintai Al-Qur'an.
  `,
  CTA: {
    text: 'Lihat Galeri Foto TPQ',
    link: '/galeri/tpq'
  }
}
```
