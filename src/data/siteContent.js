export const siteBrand = {
  name: 'Masjid Al Ikhlas',
  fullName: 'Masjid Al Ikhlas Cipta Greenville',
  location: 'Cipta Greenville Batam',
};

export const publicWebsiteAssets = {
  logo: 'official-logo.png',
  qris: 'qris-alikhlas.png',
  hero: 'hero-desktop.png',
  storyKajianMalam: 'cerita-kajian-malam.jpg',
  storyKajianRutin: 'cerita-kajian-rutin.jpg',
};

export const publicNavigation = [
  { label: 'Program', href: '/program' },
  { label: 'Agenda', href: '/agenda' },
  { label: 'TPQ', href: '/tpq' },
  { label: 'Kabar', href: '/kabar' },
  { label: 'Transparansi', href: '/transparansi' },
  { label: 'Donasi', href: '/donasi' },
  { label: 'Kontak', href: '/kontak' },
];

export const pillars = [
  {
    title: 'Ibadah',
    arabic: 'العبادة',
    description: 'Salat berjamaah lima waktu, Jumat, Ramadan, dan kegiatan ibadah harian warga.',
  },
  {
    title: 'Ilmu',
    arabic: 'العلم',
    description: "Kegiatan belajar TPQ, tahsin Al-Qur'an, kelas Bahasa Arab, dan pengajian rutin.",
  },
  {
    title: 'Keluarga',
    arabic: 'الأسرة',
    description: 'Ruang belajar dan silaturahmi untuk anak, remaja, serta orang tua di perumahan.',
  },
  {
    title: 'Amanah',
    arabic: 'الأمانة',
    description: 'Pengelolaan kas, kegiatan, dan laporan masjid yang dicatat serta diumumkan secara terbuka.',
  },
];

export const programs = [
  {
    category: 'Kajian Kitab',
    title: "Al-Furqan Min Qasas Al-Qur'an",
    description:
      "Mempelajari kisah-kisah dalam Al-Qur'an dan pelajaran yang dapat diterapkan dalam kehidupan sehari-hari.",
    schedule: "Senin · Ba'da Maghrib",
    location: 'Aula Utama',
  },
  {
    category: "Tafsir Al-Qur'an",
    title: 'Tafsir QS Luqman',
    description: "Kajian tafsir ayat demi ayat untuk memahami pesan dan hikmah Al-Qur'an.",
    schedule: "Jumat · Ba'da Maghrib",
    location: 'Aula Utama',
  },
  {
    category: 'Bahasa Arab',
    title: 'Belajar Bahasa Arab dari Nol',
    description: 'Program dasar untuk memahami bahasa Arab secara bertahap.',
    schedule: "Rabu & Ahad · Ba'da Isya & Ba'da Subuh",
    location: 'Aula Utama',
  },
  {
    category: 'Kajian Keluarga',
    title: "Ad-Daa' Wad-Dawaa'",
    description:
      'Kajian bulanan untuk suami, istri, dan orang tua — biar keluarga lebih tenang dan terarah.',
    schedule: "Ahad pekan ke-2 & ke-4 · Ba'da Maghrib",
    location: 'Aula Utama',
  },
  {
    category: "Tahsin Al-Qur'an",
    title: 'Belajar Tahsin dari Nol',
    description: "Belajar membaca Al-Qur'an dengan tajwid yang benar mulai dari dasar.",
    schedule: "Sabtu · Ba'da Ashar",
    location: 'Aula Utama',
  },
  {
    category: 'Kajian Kitab',
    title: 'Al-Adab Al-Mufrad',
    description: 'Pembahasan adab dan akhlak berdasarkan karya Imam Al-Bukhari.',
    schedule: "Senin · Ba'da Maghrib",
    location: 'Aula Utama',
  },
];

export const agendaItems = [
  {
    id: 'agenda-1',
    category: 'Hari Besar Islam',
    title: 'Sholat Idul Adha 1447H & Qurban',
    date: 'Juni 2026',
    meta: 'Halaman Masjid · 07:00',
    location: 'Halaman Masjid & Area Parkir',
    description: 'Pelaksanaan Sholat Idul Adha berjamaah dilanjutkan penyembelihan dan pendistribusian hewan qurban.',
    image: '/src/assets/cerita-kajian-rutin.jpg',
    status: 'Selesai / Arsip',
  },
  {
    id: 'agenda-2',
    category: 'Kerja Bakti',
    title: 'Goro Akbar Bersama Warga CGV',
    date: 'Juli 2026',
    meta: 'Area Masjid · Pagi 07:30',
    location: 'Area Masjid & Lingkungan Sekitar',
    description: 'Gotong royong pembersihan karpet masjid, selasar, area wudhu, dan penataan taman hijau.',
    image: '/src/assets/masjid-al-ikhlas-remake.png',
    status: 'Selesai / Arsip',
  },
  {
    id: 'agenda-3',
    category: 'Sosial Umat',
    title: 'Penyaluran Santunan Jumat Peduli Umat (JPU)',
    date: 'Agustus 2026',
    meta: 'Aula Masjid · Ba\'da Ashar',
    location: 'Aula DKM & Rumah Warga Mustahik',
    description: 'Penyaluran sembako dan santunan tunai kepada kaum dhuafa dan warga terdampak di sekitar Greenville.',
    image: '/src/assets/cerita-kajian-malam.jpg',
    status: 'Selesai / Arsip',
  },
  {
    id: 'agenda-4',
    category: 'Rapat DKM',
    title: 'Rapat Kerja Pleno DKM Masa Bakti 2025–2027',
    date: 'September 2026',
    meta: "Aula Utama · Ba'da Isya",
    location: 'Ruang Rapat DKM',
    description: 'Evaluasi program kerja triwulan III dan pemaparan rencana renovasi fasilitas kanopi jamaah.',
    image: '/src/assets/official-logo.png',
    status: 'Terjadwal',
  },
];

export const pustakaIlmuItems = [
  {
    id: 'pustaka-1',
    title: 'Kitab Al-Ushul Ats-Tsalatsah (Tiga Landasan Utama)',
    penulis: 'Syaikh Muhammad bin Abdul Wahhab',
    category: 'Aqidah & Tauhid',
    type: 'Buku / Kitab Rujukan',
    description: 'Panduan mengenal Allah, mengenal agama Islam dengan dalil-dalilnya, dan mengenal Nabi Muhammad shallallahu \'alaihi wa sallam.',
    fileUrl: 'https://archive.org/details/ushul-tsalatsah-terjemah',
    image: '/src/assets/cerita-kajian-malam.jpg',
    status: 'Tersedia di Perpustakaan & Unduhan',
    downloads: '142 kali diunduh',
  },
  {
    id: 'pustaka-2',
    title: 'Modul Tahsin Mandiri: Kaidah Makhorijul Huruf & Tajwid',
    penulis: 'Tim Asatidz TPQ Al Ikhlas CGV',
    category: 'Tahsin Al-Qur\'an',
    type: 'Modul Belajar PDF',
    description: 'Diktat pembelajaran tahsin dasar untuk santri dewasa dan umum, lengkap dengan diagram letak makhraj dan latihan lidah.',
    fileUrl: 'https://drive.google.com',
    image: '/src/assets/cerita-kajian-rutin.jpg',
    status: 'Tersedia Online',
    downloads: '280 kali diunduh',
  },
  {
    id: 'pustaka-3',
    title: 'Kitab Al-Adab Al-Mufrad (Kumpulan Hadits Adab)',
    penulis: 'Imam Al-Bukhari rahimahullah',
    category: 'Adab & Akhlaq',
    type: 'Kitab Rujukan Kajian',
    description: 'Kumpulan hadits shahih tentang berbakti kepada kedua orang tua, silaturahim tetangga, dan etika adab seorang muslim.',
    fileUrl: 'https://archive.org',
    image: '/src/assets/cerita-kajian-malam.jpg',
    status: 'Tersedia di Perpustakaan',
    downloads: '95 kali dipinjam',
  },
  {
    id: 'pustaka-4',
    title: 'Buku Saku Fiqih Shalat Berjamaah Sesuai Sunnah',
    penulis: 'DKM Al Ikhlas CGV Divisi Dakwah',
    category: 'Fiqih Ibadah',
    type: 'Buku Saku Digital',
    description: 'Pedoman ringkas tata cara meluruskan shaf, adab masbuq, dan dzikir ba\'da shalat fardhu di Masjid Al Ikhlas.',
    fileUrl: 'https://drive.google.com',
    image: '/src/assets/masjid-al-ikhlas-remake.png',
    status: 'Tersedia Online & Cetak',
    downloads: '512 kali dibaca',
  },
];

export const mediaDakwahItems = [
  {
    id: 'media-1',
    title: 'Rekaman Kajian: Meneladani Keteguhan Nabi Ibrahim \'Alaihis Salam',
    type: 'Video YouTube (4K)',
    speaker: 'Ust. Abu Usamah, Lc.',
    date: 'Ahad Pekan 3 Agustus 2026',
    duration: '1 Jam 24 Menit',
    youtubeId: 'live_kajian_01',
    videoUrl: 'https://www.youtube.com/@MasjidAlIkhlasCGV',
    image: '/src/assets/cerita-kajian-rutin.jpg',
    status: 'Tayang Publik',
    views: '840 tayangan',
  },
  {
    id: 'media-2',
    title: 'Rekaman Kajian Tematik: 7 Kunci Meraih Keluarga Sakinah',
    type: 'Video YouTube (HD)',
    speaker: 'Ust. Dr. Muhammad Firanda Andirja (Kajian Tamu)',
    date: 'Ahad Malam 24 Agustus 2026',
    duration: '1 Jam 45 Menit',
    youtubeId: 'live_kajian_02',
    videoUrl: 'https://www.youtube.com/@MasjidAlIkhlasCGV',
    image: '/src/assets/cerita-kajian-malam.jpg',
    status: 'Tayang Publik',
    views: '1.250 tayangan',
  },
  {
    id: 'media-3',
    title: 'Poster Digital: Jadwal Kajian Rutin Pekanan September 2026',
    type: 'Flyer Digital (Sosial Media)',
    speaker: 'Dewan Asatidz DKM Al Ikhlas',
    date: 'Perilisan 1 September 2026',
    duration: 'Resolusi 1080x1350px (Instagram & WA)',
    youtubeId: '',
    videoUrl: '',
    image: '/src/assets/masjid-al-ikhlas-remake.png',
    status: 'Aktif Dipublikasikan',
    views: 'Disebar di 8 Grup Warga CGV',
  },
  {
    id: 'media-4',
    title: 'Poster Ajakan Infaq Jumat Peduli Umat (JPU)',
    type: 'Flyer Banner Digital',
    speaker: 'Tim Sosial JPU DKM',
    date: 'Update Agustus 2026',
    duration: 'Format Banner & Status',
    youtubeId: '',
    videoUrl: '',
    image: '/src/assets/cerita-kajian-malam.jpg',
    status: 'Aktif Dipublikasikan',
    views: 'Disebar di Broadcast Jamaah',
  },
];

export const donationPrograms = [
  {
    title: 'Operasional Masjid',
    description: 'Biaya listrik, air, kebersihan, perawatan sound system, dan peralatan shalat.',
  },
  {
    title: 'Pendidikan Anak',
    description: 'Honor pengajar TPQ, buku materi santri, serta perlengkapan belajar.',
  },
  {
    title: 'Fasilitas Jamaah',
    description: "Pemeliharaan AC, karpet shalat, tempat wudhu, dan rak Al-Qur'an.",
  },
  {
    title: 'Sosial Warga',
    description: 'Penyaluran bantuan warga, konsumsi kegiatan, dan program Jumat Berkah.',
  },
];

export const financePeriods = {
  agustus2026: {
    label: "Agustus 2026",
    periodRange: "1–31 Agustus 2026 (1 Bulan Penuh)",
    updatedAt: "31 Agustus 2026",
    saldoAwal: "Rp 18.386.130",
    saldoAwalRaw: 18386130,
    kasMasuk: "Rp 10.782.000",
    kasMasukRaw: 10782000,
    kasMasukHint: "11 transaksi masuk (Infaq Jumat, Taklim, Donatur, Kencleng, QRIS)",
    kasKeluar: "Rp 12.854.463",
    kasKeluarRaw: 12854463,
    kasKeluarHint: "27 transaksi keluar (Bisyaroh Imam Rp5,5jt, Listrik, Bisyaroh)",
    saldoAkhir: "Rp 16.313.667",
    saldoAkhirRaw: 16313667,
    saldoAkhirHint: "Saldo akhir Kas Masjid per 31 Ags 2026",
    totalKas: "Rp 29.168.130",
    status: "Terverifikasi",
    source: "Laporan Kas DKM Periode Agustus 2026 (Disahkan Bendahara Bambang S, Ketua DKM Karya HP, & Sekretaris Zulhendy M)",
    transactionCount: "38",
    // Dana Sosial: Jumat Peduli Umat (JPU)
    jpu: {
      label: "Jumat Peduli Umat (JPU)",
      programName: "Dana Sosial Jumat Peduli Umat",
      saldoAwal: "Rp 1.700.000",
      saldoAwalRaw: 1700000,
      kasMasuk: "Rp 7.750.000",
      kasMasukRaw: 7750000,
      kasKeluar: "Rp 4.750.000",
      kasKeluarRaw: 4750000,
      saldoAkhir: "Rp 4.700.000",
      saldoAkhirRaw: 4700000,
      transactionCount: "32",
      source: "Laporan Keuangan JPU Agustus 2026 (Disahkan DKM Al Ikhlas CGV)",
    },
    // Total Likuiditas Gabungan (Kas Operasional + Dana Sosial JPU)
    combined: {
      totalSaldoAkhir: "Rp 21.013.667",
      totalSaldoAkhirRaw: 21013667,
      totalMasuk: "Rp 18.532.000",
      totalMasukRaw: 18532000,
      totalKeluar: "Rp 17.604.463",
      totalKeluarRaw: 17604463,
      totalTransactions: "70",
    },
    incomeBreakdown: [
      { label: 'Infaq Jumat (4 Pekan)', amount: 'Rp 6.673.000', percent: 62, color: '#0c2b1d' },
      { label: 'Infaq Kajian & Majelis Taklim', amount: 'Rp 1.712.000', percent: 16, color: '#c9a55a' },
      { label: 'Infaq Donatur & Operasional', amount: 'Rp 1.600.000', percent: 15, color: '#0f6130' },
      { label: 'Kencleng & QRIS Masjid', amount: 'Rp 797.000', percent: 7, color: '#6b7f74' },
    ],
    expenseBreakdown: [
      { label: 'Bisyaroh (Imam, Khotib, Guru Tahsin & Kajian)', amount: 'Rp 9.100.000', percent: 71 },
      { label: 'Utilitas Masjid (PLN, WiFi, Galon, Perawatan)', amount: 'Rp 2.394.463', percent: 19 },
      { label: 'Konsumsi Kajian, Rapat DKM & Acara Maulid', amount: 'Rp 1.060.000', percent: 8 },
      { label: 'Operasional Pendukung & Perlengkapan', amount: 'Rp 300.000', percent: 2 },
    ],
  },
  juni2026: {
    label: "Juni 2026",
    updatedAt: "2 Juli 2026",
    kasMasuk: "Rp 12.850.000",
    kasMasukRaw: 12850000,
    kasMasukHint: "24 transaksi",
    kasKeluar: "Rp 7.650.000",
    kasKeluarRaw: 7650000,
    kasKeluarHint: "18 transaksi",
    saldoAkhir: "Rp 5.200.000",
    saldoAkhirRaw: 5200000,
    saldoAkhirHint: "Surplus bulan ini",
    status: "Arsip internal",
    source: "Laporan DKM Juni 2026",
    transactionCount: "24",
    incomeBreakdown: [
      { label: 'Kotak infaq dan sedekah jamaah', amount: 'Rp 5.400.000', percent: 42, color: '#0c2b1d' },
      { label: 'Transfer rekening masjid',       amount: 'Rp 4.350.000', percent: 34, color: '#c9a55a' },
      { label: 'QRIS masjid',                    amount: 'Rp 2.100.000', percent: 16, color: '#6b7f74' },
      { label: 'Program khusus',                 amount: 'Rp 1.000.000', percent: 8,  color: '#8b5e34' },
    ],
    expenseBreakdown: [
      { label: 'Operasional masjid',        amount: 'Rp 3.250.000', percent: 42 },
      { label: 'Pendidikan dan TPQ',        amount: 'Rp 1.700.000', percent: 22 },
      { label: 'Kebersihan dan fasilitas',  amount: 'Rp 1.450.000', percent: 19 },
      { label: 'Sosial warga dan kegiatan', amount: 'Rp 1.250.000', percent: 17 },
    ]
  },
  mei2026: {
    label: "Mei 2026",
    updatedAt: "27 Mei 2026",
    kasMasuk: "Rp 19.431.000",
    kasMasukRaw: 19431000,
    kasMasukHint: "44 transaksi",
    kasKeluar: "Rp 8.268.292",
    kasKeluarRaw: 8268292,
    kasKeluarHint: "20 transaksi",
    saldoAkhir: "Rp 11.162.708",
    saldoAkhirRaw: 11162708,
    saldoAkhirHint: "Surplus bulan ini",
    status: "Arsip internal",
    source: "Laporan DKM Mei 2026",
    transactionCount: "44",
    incomeBreakdown: [
      { label: 'Infaq Jumat',   amount: 'Rp 8.785.000',  percent: 45, color: '#0c2b1d' },
      { label: 'Infaq Event',   amount: 'Rp 4.874.000',  percent: 25, color: '#c9a55a' },
      { label: 'Infaq Cluster', amount: 'Rp 4.272.000',  percent: 22, color: '#6b7f74' },
      { label: 'Donasi Khusus', amount: 'Rp 1.500.000',  percent: 8,  color: '#8b5e34' },
    ],
    expenseBreakdown: [
      { label: 'Operasional masjid', amount: 'Rp 4.868.292', percent: 58 },
      { label: 'Pendidikan dan TPQ', amount: 'Rp 2.150.000', percent: 26 },
      { label: 'Kebersihan dan fasilitas', amount: 'Rp 1.250.000', percent: 16 },
    ],
  }
};

export const transparencyStats = [
  { label: 'Total Likuiditas (Kas + JPU)', value: 'Rp 21,01 jt' },
  { label: 'Saldo Kas Masjid', value: 'Rp 16,31 jt' },
  { label: 'Saldo Dana JPU', value: 'Rp 4,70 jt' },
  { label: 'Total Mutasi Tercatat', value: '70 Transaksi' },
];

export const publicFinanceSummary = {
  period: financePeriods.agustus2026.label,
  periodRange: financePeriods.agustus2026.periodRange,
  updatedAt: financePeriods.agustus2026.updatedAt,
  saldoAwal: financePeriods.agustus2026.saldoAwal,
  totalIn: financePeriods.agustus2026.kasMasuk,
  totalOut: financePeriods.agustus2026.kasKeluar,
  endingBalance: financePeriods.agustus2026.saldoAkhir,
  transactionCount: financePeriods.agustus2026.transactionCount,
  status: financePeriods.agustus2026.status,
  jpu: financePeriods.agustus2026.jpu,
  combined: financePeriods.agustus2026.combined,
  donorCount: '',
  activeCampaign: 'Operasional, tahsin, kajian dakwah & Jumat Peduli Umat',
  note:
    'Laporan Keuangan Kas Masjid & Jumat Peduli Umat (JPU) periode Agustus 2026 telah disahkan oleh Ketua DKM (Karya HP), Sekretaris (Zulhendy M), dan Bendahara (Bambang S) Masjid Al Ikhlas CGV.',
};

export const financeBreakdown = financePeriods.agustus2026.expenseBreakdown;

export const incomeBreakdown = financePeriods.agustus2026.incomeBreakdown;

export const monthlyReports = [
  {
    month: 'Agustus 2026',
    title: 'Laporan Kas Masjid & JPU Al Ikhlas',
    status: 'Terverifikasi',
    summary: 'Bisyaroh Imam (Rp5,5jt), listrik PLN, khotib, tahsin, kajian, serta santunan sosial & paket Jumat Peduli Umat (JPU).',
  },
  {
    month: financePeriods.juni2026.label,
    title: 'Ringkasan Kas Masjid',
    status: financePeriods.juni2026.status,
    summary: 'Operasional shalat, honor guru TPQ, perawatan inventaris, dan kegiatan warga.',
  },
  {
    month: financePeriods.mei2026.label,
    title: 'Ringkasan Kas Masjid',
    status: financePeriods.mei2026.status,
    summary: 'Rincian infaq masuk dan pengeluaran masjid bulan ini.',
  },
  {
    month: 'April 2026',
    title: 'Ringkasan Kas Masjid',
    status: 'Arsip internal',
    summary: 'Catatan kas bulanan tanpa mencantumkan nama atau data pribadi donatur.',
  },
];

export const donationInfo = {
  bank: 'BSI',
  accountNumber: '1500600069',
  accountName: 'Masjid Al Ikhlas Cipta Green Ville',
  qrisName: 'MASJID AL IKHLAS CGV',
  nmid: 'ID1024337942592',
  confirmationName: 'Zulhendy Masruddin',
  confirmationPhone: '+62 813-7541-0997',
  confirmationUrl: 'https://wa.me/6281375410997',
};

export const stories = [
  {
    imageKey: 'hero',
    alt: 'Suasana Masjid Al Ikhlas',
    title: 'Dari townhouse menjadi rumah ibadah',
    description: 'Sebuah tempat sederhana yang menjadi pusat salat, belajar, dan pertemuan warga.',
  },
  {
    imageKey: 'storyKajianRutin',
    alt: 'Kelas Bahasa Arab di Masjid Al Ikhlas, dihadiri jamaah berbagai usia',
    label: 'Kelas Bahasa Arab',
    title: 'Belajar dari nol, bersama-sama',
    description:
      'Dari anak-anak sampai jamaah dewasa, duduk di lingkaran yang sama setiap pekan.',
  },
  {
    imageKey: 'storyKajianMalam',
    alt: 'Jamaah menyimak Kelas Bahasa Arab di Masjid Al Ikhlas',
    label: 'Kelas Bahasa Arab',
    title: 'Yang datang minggu demi minggu',
    description: 'Bukan keramaian sesaat - konsistensi ini yang menjaga kelas tetap hidup.',
  },
];

export const ecosystemItems = [
  { title: 'Website Publik', description: 'Jadwal shalat, program kajian, laporan kas, dan kontak DKM.' },
  { title: 'Portal Jamaah', description: 'Informasi keluarga, pendaftaran kelas, dan catatan donasi.' },
  { title: 'Transparansi', description: 'Rincian kas masuk, pengeluaran rutin, dan laporan bulanan.' },
  { title: 'Manajemen DKM', description: 'Pengelolaan kegiatan, keuangan, dan agenda pengurus.' },
  { title: 'Pendidikan TPQ', description: 'Jadwal mengaji, materi santri, dan rekap absensi.' },
];
