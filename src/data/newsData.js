import storyMalamUrl from '../assets/cerita-kajian-malam.jpg';
import storyRutinUrl from '../assets/cerita-kajian-rutin.jpg';
import heroUrl from '../assets/hero-desktop.png';

export const newsArticles = [
  {
    id: 1,
    title: 'Penyerahan Raport TPQ Al Ikhlas',
    slug: 'penyerahan-raport-tpq-al-ikhlas',
    category: 'TPQ',
    date: '28 Juni 2026',
    author: 'Ustadzah Aminah',
    image: storyRutinUrl,
    coverImage: storyRutinUrl,
    galleryImages: [storyRutinUrl, storyMalamUrl],
    status: 'Siap publik',
    visibility: 'Publik',
    excerpt: 'Alhamdulillah, TPQ Al Ikhlas telah melaksanakan penyerahan raport santri semester ganjil.',
    relatedProgramSlug: 'tpq-al-ikhlas',
    relatedAgendaSlug: '',
    ctaLabel: 'Lihat Program TPQ',
    ctaHref: '/program',
    seoTitle: 'Penyerahan Raport TPQ Al Ikhlas Cipta Greenville',
    seoDescription: 'Laporan kegiatan penyerahan raport santri TPQ Al Ikhlas Cipta Greenville semester ganjil tahun 2026.',
    tags: ['TPQ', 'Pendidikan', 'Santri'],
    body: `
      Alhamdulillah, seluruh rangkaian kegiatan belajar mengajar TPQ Al Ikhlas Cipta Greenville Semester Ganjil ditutup dengan penyerahan raport santri di ruang utama Masjid Al Ikhlas. Acara ini dihadiri oleh wali santri dan pengurus DKM.

      Penyerahan raport ini merekap perkembangan kelancaran bacaan Al-Qur'an (tajwid dan makhraj), hafalan surah-surah pendek Juz 30, serta pemahaman adab harian para santri.

      DKM Masjid Al Ikhlas menyampaikan terima kasih kepada para ustadz dan ustadzah yang mengajar dengan ikhlas, serta orang tua yang senantiasa mendampingi anak-anak mengaji di rumah.
    `,
    relatedSlugs: ['sedekah-jumat-untuk-jamaah-dan-warga', 'semangat-belajar-santri-tpq-al-ikhlas']
  },
  {
    id: 2,
    title: 'Sedekah Jumat untuk Jamaah dan Warga',
    slug: 'sedekah-jumat-untuk-jamaah-dan-warga',
    category: 'Sosial',
    date: '10 Juli 2026',
    author: 'DKM Al Ikhlas',
    image: storyMalamUrl,
    coverImage: storyMalamUrl,
    galleryImages: [storyMalamUrl, storyRutinUrl],
    status: 'Siap publik',
    visibility: 'Publik',
    excerpt: 'Penyaluran makanan gratis bagi jamaah sholat Jumat dan warga di sekitar perumahan Cipta Greenville.',
    relatedProgramSlug: '',
    relatedAgendaSlug: '',
    ctaLabel: 'Lihat Kanal Donasi',
    ctaHref: '/donasi',
    seoTitle: 'Sedekah Jumat Berkah Masjid Al Ikhlas CGV',
    seoDescription: 'Penyaluran paket makanan gratis untuk jamaah sholat Jumat di perumahan Cipta Greenville.',
    tags: ['Sosial', 'Sedekah', 'Jumat'],
    body: `
      Kegiatan Sedekah Jumat kembali terlaksana di Masjid Al Ikhlas Cipta Greenville. Seusai sholat Jumat, DKM menyalurkan paket makanan siap saji yang dibagikan kepada jamaah serta pekerja di sekitar perumahan.

      Paket makanan ini bersumber dari infaq donatur warga yang dikelola secara terbuka oleh tim DKM.

      Terima kasih kepada para donatur atas dukungannya. Jazakumullahu Khairan.
    `,
    relatedSlugs: ['penyerahan-raport-tpq-al-ikhlas', 'kerja-bakti-dan-perawatan-lingkungan-masjid']
  },
  {
    id: 3,
    title: 'Kajian Rutin Keluarga Muslim',
    slug: 'kajian-rutin-keluarga-muslim',
    category: 'Kajian',
    date: '12 Juli 2026',
    author: 'Humas DKM',
    image: heroUrl,
    coverImage: heroUrl,
    galleryImages: [],
    status: 'Siap publik',
    visibility: 'Publik',
    excerpt: 'Kajian bulanan keluarga membahas keteladanan orang tua dalam membimbing anak di era digital.',
    relatedProgramSlug: 'ad-daa-wad-dawaa',
    relatedAgendaSlug: '',
    ctaLabel: 'Lihat Jadwal Kajian',
    ctaHref: '/program',
    seoTitle: 'Kajian Rutin Keluarga Muslim - DKM Al Ikhlas',
    seoDescription: 'Kajian pembinaan keluarga sakinah dan tantangan mendidik anak di era digital.',
    tags: ['Kajian', 'Keluarga', 'Muslim'],
    body: `
      Pengajian bulanan keluarga muslim kembali digelar di Masjid Al Ikhlas Cipta Greenville. Topik bahasan kali ini berfokus pada keteladanan orang tua dalam membimbing akhlak anak di tengah tantangan teknologi.

      Jamaah menyimak kajian dengan antusias. Yang tidak sempat hadir, DKM siapkan rekaman audio dan catatan singkat dari sesi ini.
    `,
    relatedSlugs: ['penyerahan-raport-tpq-al-ikhlas', 'kerja-bakti-dan-perawatan-lingkungan-masjid']
  },
  {
    id: 4,
    title: 'Kerja Bakti dan Perawatan Lingkungan Masjid',
    slug: 'kerja-bakti-dan-perawatan-lingkungan-masjid',
    category: 'Kegiatan',
    date: '05 Juli 2026',
    author: 'DKM Al Ikhlas',
    image: storyRutinUrl,
    coverImage: storyRutinUrl,
    galleryImages: [storyRutinUrl],
    status: 'Siap publik',
    visibility: 'Publik',
    excerpt: 'Aksi gotong royong warga membersihkan area ibadah, halaman, dan fasilitas wudhu Masjid Al Ikhlas.',
    relatedProgramSlug: '',
    relatedAgendaSlug: 'goro-bersama-warga',
    ctaLabel: 'Lihat Agenda Masjid',
    ctaHref: '/agenda',
    seoTitle: 'Gotong Royong & Kerja Bakti Masjid Al Ikhlas CGV',
    seoDescription: 'Aksi bakti sosial warga Greenville merawat fasilitas ibadah dan lingkungan masjid.',
    tags: ['Kegiatan', 'Gotong Royong', 'Kebersihan'],
    body: `
      DKM bersama warga perumahan Cipta Greenville melaksanakan kerja bakti di lingkungan Masjid Al Ikhlas. Pembersihan meliputi area halaman, tempat wudhu, perapihan taman, serta perawatan unit pendingin ruangan (AC).

      Gotong royong ini sekaligus menjadi sarana silaturahmi antarwarga klaster. Terima kasih kepada seluruh bapak-bapak dan remaja yang sudah meluangkan waktu dan tenaga pekan ini.
    `,
    relatedSlugs: ['penyerahan-raport-tpq-al-ikhlas', 'sedekah-jumat-untuk-jamaah-dan-warga']
  },
  {
    id: 5,
    title: 'Semangat Belajar Santri TPQ Al Ikhlas',
    slug: 'semangat-belajar-santri-tpq-al-ikhlas',
    category: 'TPQ',
    date: '15 Juni 2026',
    author: 'Ustadzah Fatimah',
    image: storyRutinUrl,
    coverImage: storyRutinUrl,
    galleryImages: [],
    status: 'Siap publik',
    visibility: 'Publik',
    excerpt: 'Melihat suasana santri TPQ Al Ikhlas mempelajari makhraj, tajwid, dan hafalan surah Juz 30.',
    relatedProgramSlug: 'tpq-al-ikhlas',
    relatedAgendaSlug: '',
    ctaLabel: 'Lihat Program TPQ',
    ctaHref: '/program',
    seoTitle: 'Semangat Belajar Santri TPQ Masjid Al Ikhlas',
    seoDescription: "Dokumentasi antusiasme santri sore TPQ Al Ikhlas mempelajari tajwid dan hafalan Qur'an.",
    tags: ['TPQ', 'Santri', 'Mengaji'],
    body: `
      Alhamdulillah, suasana kelas sore TPQ Al Ikhlas berjalan lancar. Para pengajar mendampingi santri latihan makhraj huruf, kelancaran bacaan Al-Qur'an, serta hafalan doa harian.

      Pengajar dan orang tua terus berkoordinasi — biar santri bisa belajar mandiri di rumah juga.
    `,
    relatedSlugs: ['penyerahan-raport-tpq-al-ikhlas', 'menjaga-kebersihan-dan-kenyamanan-masjid']
  },
  {
    id: 6,
    title: 'Menjaga Kebersihan dan Kenyamanan Masjid',
    slug: 'menjaga-kebersihan-dan-kenyamanan-masjid',
    category: 'Kegiatan',
    date: '20 Juni 2026',
    author: 'DKM Al Ikhlas',
    image: heroUrl,
    coverImage: heroUrl,
    galleryImages: [],
    status: 'Siap publik',
    visibility: 'Publik',
    excerpt: 'Pembersihan karpet utama dan perawatan sound system secara berkala untuk kenyamanan shalat jamaah.',
    relatedProgramSlug: '',
    relatedAgendaSlug: '',
    ctaLabel: 'Lihat Agenda Masjid',
    ctaHref: '/agenda',
    seoTitle: 'Merawat Kebersihan & Kenyamanan Masjid Al Ikhlas',
    seoDescription: 'Agenda pembersihan berkala ruang salat utama dan sarana penunjang kenyamanan jamaah.',
    tags: ['Kegiatan', 'Kebersihan', 'Kenyamanan'],
    body: `
      Lantai dan area shalat dibersihkan rutin agar jamaah nyaman beribadah.

      Karpet disedot dan sound system dirawat berkala — biar azan dan bacaan imam terdengar jernih.
    `,
    relatedSlugs: ['kerja-bakti-dan-perawatan-lingkungan-masjid', 'semangat-belajar-santri-tpq-al-ikhlas']
  }
];

export const articles = newsArticles;
