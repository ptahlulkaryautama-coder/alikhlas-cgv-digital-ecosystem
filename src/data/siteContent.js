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
    category: 'Hari Besar Islam',
    title: 'Sholat Idul Adha 1447H',
    date: 'Juni 2026',
    meta: 'Halaman Masjid · 07:00',
  },
  {
    category: 'Kerja Bakti',
    title: 'Goro Bersama Warga',
    date: 'Juni 2026',
    meta: 'Area Masjid · Pagi',
  },
  {
    category: 'Rapat',
    title: 'Koordinasi Program DKM',
    date: 'Juni 2026',
    meta: "Aula Utama · Ba'da Isya",
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
    periodRange: "1–15 Agustus 2026",
    updatedAt: "15 Agustus 2026",
    saldoAwal: "Rp 18.386.130",
    saldoAwalRaw: 18386130,
    kasMasuk: "Rp 4.300.000",
    kasMasukRaw: 4300000,
    kasMasukHint: "5 transaksi masuk (1–15 Ags)",
    kasKeluar: "Rp 1.560.000",
    kasKeluarRaw: 1560000,
    kasKeluarHint: "7 transaksi keluar (1–15 Ags)",
    saldoAkhir: "Rp 21.126.130",
    saldoAkhirRaw: 21126130,
    saldoAkhirHint: "Saldo per 15 Ags 2026",
    totalKas: "Rp 22.686.130",
    status: "Terverifikasi",
    source: "Laporan Kas DKM Periode Agustus 2026 (Disahkan Bendahara Bambang S, Ketua DKM Karya HP, & Sekretaris Zulhendy M)",
    transactionCount: "12",
    incomeBreakdown: [
      { label: 'Infaq Jumat', amount: 'Rp 3.203.000', percent: 74, color: '#0c2b1d' },
      { label: 'Infaq Majelis Taklim & Ummahat', amount: 'Rp 797.000', percent: 19, color: '#c9a55a' },
      { label: 'Infaq Operasional (Hamba Allah M07)', amount: 'Rp 300.000', percent: 7, color: '#6b7f74' },
    ],
    expenseBreakdown: [
      { label: 'Bisyaroh (Tahsin, Khotib & Ustadzah Kajian)', amount: 'Rp 1.400.000', percent: 90 },
      { label: 'Operasional Masjid (Air Galon & Kebersihan)', amount: 'Rp 160.000', percent: 10 },
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
  { label: 'Dana Masuk (1–15 Ags)', value: 'Rp 4,30 jt' },
  { label: 'Dana Terpakai', value: 'Rp 1,56 jt' },
  { label: 'Saldo Kas Terverifikasi', value: 'Rp 21,13 jt' },
  { label: 'Transaksi', value: '12' },
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
  donorCount: '',
  activeCampaign: 'Operasional, tahsin, dan kajian dakwah',
  note:
    'Laporan Keuangan Kas Masjid periode 1–15 Agustus 2026 telah disahkan oleh Ketua DKM (Karya HP), Sekretaris (Zulhendy M), dan Bendahara (Bambang S) Masjid Al Ikhlas CGV.',
};

export const financeBreakdown = financePeriods.agustus2026.expenseBreakdown;

export const incomeBreakdown = financePeriods.agustus2026.incomeBreakdown;

export const monthlyReports = [
  {
    month: 'Agustus 2026 (1–15 Ags)',
    title: 'Laporan Kas Masjid Al Ikhlas',
    status: 'Terverifikasi',
    summary: 'Bisyaroh tahsin & khotib, infaq Jumat, infaq kajian majelis taklim, dan operasional masjid.',
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
