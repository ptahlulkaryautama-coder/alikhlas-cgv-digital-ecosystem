/**
 * tpqData.js — Data layer for TPQ Al Mardhotillah Portal
 *
 * Privacy-Compliant & Data-Verified Schema:
 * - NO student names / rosters
 * - NO student photos
 * - NO parent contacts
 * - NO personal teacher data (only approved public teaching roles)
 * - NO addresses (only public mosque location)
 * - NO grades / individual evaluation notes
 * - NO attendance identities
 * - NO individual payment / SPP records
 * - NO teacher honorarium information
 * - NO formal accreditation claims
 * - ONLY dates present in approved data (28 Juni 2026, 15 Juni 2026, 12 Juli 2026, 05 Juli 2026, 10 Juli 2026)
 */

export const TPQ_PORTAL_INFO = {
  nama: 'TPQ Al Mardhotillah',
  naungan: 'Masjid Al Ikhlas Cipta Greenville Batam',
  skPengesahan: 'SK DKM No. 04/DKM-AI/TPQ/2024',
  alamat: 'Perumahan Cipta Greenville, Kel. Tembesi, Kec. Sagulung, Kota Batam',
  jamOperasional: 'Senin s.d. Kamis (16.00 – 17.30 WIB) & Jumat-Sabtu (Tahfiz)',
  tahunAjaran: '2026/2027',
  periodeAktif: 'Juli 2026',
};

export const TPQ_STATS = {
  totalSantri: {
    displayValue: 'Data belum diverifikasi',
    isVerified: false,
    hint: 'Jumlah santri aktif dalam proses verifikasi pendataan DKM',
  },
  totalKelas: {
    displayValue: '4 Kelompok',
    isVerified: false,
    hint: 'Iqra 1–3, Iqra 4–6, Al-Qur\'an & Tajwid, Tahfiz Juz 30',
  },
  totalPengajar: {
    displayValue: '4 Pengajar',
    isVerified: false,
    hint: 'Tim pengajar aktif TPQ Al Mardhotillah (Tampilan Prototipe)',
  },
  kehadiranRataRata: {
    displayValue: 'Data belum diverifikasi',
    isVerified: false,
    hint: 'Rekap persentase presensi menunggu verifikasi backend',
  },
};

export const CLASS_GROUPS = [
  {
    id: 'k1',
    name: 'Kelas Iqra 1 - 3',
    icon: '📖',
    level: 'Tingkat Dasar (Iqra 1 – 3)',
    day: 'Senin s.d. Kamis',
    time: '16.00 – 17.15 WIB',
    room: 'Ruang TPQ 1',
    audience: 'Santri Pemula (Usia 5 – 7 Tahun)',
    // pengajar name removed — not approved for display
    pengajar: 'Pengajar Iqra Tingkat Dasar',
    badgeColor: '#0f6130',
    description: 'Bimbingan awal pengenalan makhraj huruf hijaiyah, harakat dasar, dan latihan membaca kata sederhana.',
    fokusMateri: ['Pengenalan 28 Huruf Hijaiyah', 'Harakat Fathah, Kasrah, Dammah', 'Membaca Kata 2-3 Suku Kata'],
  },
  {
    id: 'k2',
    name: 'Kelas Iqra 4 - 6',
    icon: '📗',
    level: 'Tingkat Menengah (Iqra 4 – 6)',
    day: 'Senin s.d. Kamis',
    time: '16.00 – 17.15 WIB',
    room: 'Ruang TPQ 2',
    audience: 'Santri Lanjutan (Usia 7 – 9 Tahun)',
    // pengajar name removed — not approved for display
    pengajar: 'Pengajar Iqra Tingkat Menengah',
    badgeColor: '#1565C0',
    description: 'Penyempurnaan hukum tajwid dasar, pembiasaan bacaan mad (panjang), waqaf, dan persiapan membaca Al-Qur\'an.',
    fokusMateri: ['Hukum Mad & Sukun', 'Tanwin & Nun Mati Dasar', 'Latihan Kelancaran Membaca Ayat'],
  },
  {
    id: 'k3',
    name: 'Kelas Al-Qur\'an & Tajwid',
    icon: '🕌',
    level: 'Tingkat Utama (30 Juz)',
    day: 'Senin s.d. Kamis',
    time: '16.00 – 17.30 WIB',
    room: 'Ruang Utama Masjid',
    audience: 'Santri Al-Qur\'an (Usia 8 – 12+ Tahun)',
    // pengajar name removed — not approved for display
    pengajar: 'Pengajar Al-Qur\'an & Tajwid',
    badgeColor: '#8A6200',
    description: 'Tadarus Al-Qur\'an 30 Juz berstandar tahsin dengan penekanan pada tartil, makhorijul huruf, dan pemahaman tajwid.',
    fokusMateri: ['Tahsin & Tartil 30 Juz', 'Hukum Tajwid Lengkap (Gharib)', 'Adab & Etika Membaca Al-Qur\'an'],
  },
  {
    id: 'k4',
    name: 'Kelas Tahfiz Juz 30',
    icon: '⭐',
    level: 'Program Khusus (Juz Amma)',
    day: 'Jumat & Sabtu',
    time: '16.00 – 17.30 WIB',
    room: 'Selasar Utama Masjid',
    audience: 'Santri Program Hafalan (Usia 7 – 12+ Tahun)',
    // pengajar name removed — not approved for display
    pengajar: 'Pengajar Program Tahfiz',
    badgeColor: '#5C2D8A',
    description: 'Program khusus pembimbingan hafalan dan murojaah rutin 37 surah pendek Juz Amma (An-Naba s.d. An-Nas).',
    fokusMateri: ['Setoran Hafalan Surat Pendek', 'Murojaah Pekanan', 'Kuis & Sambung Ayat Hafalan'],
  },
];


/**
 * TPQ_TEACHING_TEAM — Aggregate overview, safe for prototype display.
 *
 * Describes the teaching team by role capacity and specialisation only.
 * No personal names, no personal schedules, no photographs.
 * Source: TPQ_PORTAL_INFO + CLASS_GROUPS structure (both approved).
 */
export const TPQ_TEACHING_TEAM = [
  {
    id: 'tt1',
    roleLabel: 'Pengajar Iqra Tingkat Dasar',
    icon: '📖',
    schedule: 'Senin – Kamis · 16.00–17.15 WIB',
    focus: 'Pendampingan Hijaiyah & Adab Belajar',
    desc: 'Membimbing santri usia dini dalam pengenalan huruf hijaiyah dengan pendekatan sabar dan bertahap.',
  },
  {
    id: 'tt2',
    roleLabel: 'Pengajar Iqra Tingkat Menengah',
    icon: '📗',
    schedule: 'Senin – Kamis · 16.00–17.15 WIB',
    focus: 'Tajwid Dasar & Kelancaran Membaca',
    desc: 'Mendampingi santri menguasai bacaan mad, sukun, waqaf, dan persiapan naik ke kelas Al-Qur\'an.',
  },
  {
    id: 'tt3',
    roleLabel: 'Pengajar Al-Qur\'an & Tajwid',
    icon: '🕌',
    schedule: 'Senin – Kamis · 16.00–17.30 WIB',
    focus: 'Tahsin Tartil & Hukum Tajwid Lanjutan',
    desc: 'Mendampingi santri tadarus Al-Qur\'an 30 Juz secara fasih sesuai kaidah makhraj dan tajwid.',
  },
  {
    id: 'tt4',
    roleLabel: 'Pengajar Program Tahfiz',
    icon: '⭐',
    schedule: 'Jumat & Sabtu · 16.00–17.30 WIB',
    focus: 'Teknik Menghafal & Murojaah Terstruktur',
    desc: 'Membimbing hafalan Juz Amma (37 surah) dengan teknik murojaah yang konsisten dan terprogram.',
  },
];

export const KURIKULUM_ROADMAP = [
  {
    level: 'Iqra 1',
    name: 'Iqra 1 (Hijaiyah Tunggal)',
    category: 'Tingkat Iqra',
    desc: 'Pengenalan 28 huruf hijaiyah tunggal dengan harakat fathah.',
    target: 'Lancar melafalkan huruf A s.d. Ya tanpa terbalik.',
  },
  {
    level: 'Iqra 2',
    name: 'Iqra 2 (Huruf Sambung)',
    category: 'Tingkat Iqra',
    desc: 'Huruf sambung awal, tengah, dan akhir dengan harakat kasrah & dammah.',
    target: 'Mampu menyambung huruf dan membedakan bentuk perubahan huruf.',
  },
  {
    level: 'Iqra 3',
    name: 'Iqra 3 (Bacaan Mad)',
    category: 'Tingkat Iqra',
    desc: 'Pengenalan bacaan panjang (Mad thabi\'i) dan harakat tanwin.',
    target: 'Mampu membedakan bacaan pendek 1 harakat dan panjang 2 harakat.',
  },
  {
    level: 'Iqra 4',
    name: 'Iqra 4 (Sukun & Tasydid)',
    category: 'Tingkat Iqra',
    desc: 'Pelajaran bacaan sukun (mati), tasydid, dan dasar nun mati/tanwin.',
    target: 'Fasih menyebutkan huruf mati dan tajwid sederhana.',
  },
  {
    level: 'Iqra 5',
    name: 'Iqra 5 (Tajwid & Waqaf)',
    category: 'Tingkat Iqra',
    desc: 'Hukum ikhfa, idgham, alif lam ma\'rifah, dan teknik berhenti (waqaf).',
    target: 'Membaca kalimat panjang dengan intonasi dan tajwid yang pas.',
  },
  {
    level: 'Iqra 6',
    name: 'Iqra 6 (Pra Al-Qur\'an)',
    category: 'Tingkat Iqra',
    desc: 'Variasi ayat Al-Qur\'an, fawatihussuwar, dan rasm Usmani.',
    target: 'Siap ujian kelulusan (Munaqasyah) untuk naik ke Al-Qur\'an.',
  },
  {
    level: 'Tahsin',
    name: 'Tahsin Al-Qur\'an 30 Juz',
    category: 'Tahsin & Bacaan',
    desc: 'Tadarus Al-Qur\'an 30 Juz dengan tajwid, gharib, dan kelancaran tartil.',
    target: 'Membaca Al-Qur\'an dengan lancar, fasih, dan sesuai kaidah tajwid.',
  },
  {
    level: 'Hafalan',
    name: 'Tahfiz Juz 30 (Juz Amma)',
    category: 'Hafalan Qur\'an',
    desc: 'Program bimbingan hafalan 37 surah pendek An-Naba s.d. An-Nas.',
    target: 'Hafal fasih Juz 30 dan siap tampil pada kegiatan wisuda santri.',
  },
  {
    level: 'Adab',
    name: 'Adab & Keislaman Dasar',
    category: 'Adab & Karakter',
    desc: 'Pembiasaan adab harian, bacaan doa sehari-hari, fiqih wudhu & shalat, serta hadits pendek.',
    target: 'Memiliki karakter santun, terbiasa berdoa harian, dan mampu praktik shalat dengan benar.',
  },
];

// ONLY approved dates from existing data files.
// isoDate added for machine-readable past/future classification.
// Display text (date, title, location) is unchanged from approved source.
export const TPQ_AGENDA = [
  {
    id: 'ag1',
    title: 'Penyerahan Raport TPQ Al Ikhlas',
    date: '28 Juni 2026',
    isoDate: '2026-06-28',
    time: '16.00 WIB',
    location: 'Ruang Utama Masjid Al Ikhlas',
    category: 'Pembagian Raport',
    status: 'Arsip Agenda',
  },
  {
    id: 'ag2',
    title: 'Semangat Belajar Santri & Evaluasi Pembelajaran',
    date: '15 Juni 2026',
    isoDate: '2026-06-15',
    time: '16.00 WIB',
    location: 'Ruang TPQ Masjid Al Ikhlas',
    category: 'Ujian / Evaluasi Umum',
    status: 'Arsip Agenda',
  },
  {
    id: 'ag3',
    title: 'Kajian Rutin Pembinaan Keluarga Muslim',
    date: '12 Juli 2026',
    isoDate: '2026-07-12',
    time: '09.00 WIB',
    location: 'Ruang Utama Masjid Al Ikhlas',
    category: 'Parenting / Orang Tua',
    status: 'Arsip Agenda',
  },
];

/**
 * FAQS — Source: Legacy HTML prototype only. No independent approved official source.
 * Answers are informational; not independently verified against DKM records.
 * Staff names purged for privacy compliance.
 */
export const FAQS = [
  {
    question: 'Bagaimana cara mendaftarkan putra-putri di TPQ Al Mardhotillah?',
    // Staff name removed — pending name-display approval from DKM.
    answer: 'Pendaftaran dilakukan langsung melalui pengurus DKM di sekretariat TPQ Masjid Al Ikhlas setiap hari kerja pukul 16.00 WIB.',
  },
  {
    question: 'Kapan jadwal kegiatan mengaji TPQ berlangsung?',
    // Source matches TPQ_PORTAL_INFO.jamOperasional — approved.
    answer: 'Kegiatan mengaji rutin berlangsung hari Senin s.d. Kamis pukul 16.00–17.30 WIB untuk kelas Iqra & Al-Qur\'an, serta Jumat & Sabtu khusus program Tahfiz Juz 30.',
  },
  {
    question: 'Apakah ada fasilitas pemantauan perkembangan anak untuk orang tua?',
    // Source: legacy HTML only — no approved official source.
    answer: 'Saat ini pengurus DKM menyediakan laporan rekap akademik berkala. Portal digital wali santri akan disiapkan pada pengembangan selanjutnya.',
  },
];
