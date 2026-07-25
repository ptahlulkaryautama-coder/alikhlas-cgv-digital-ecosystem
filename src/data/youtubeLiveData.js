/**
 * youtubeLiveData.js
 * Data configuration for Youtube Live Streaming & Video Archive of Masjid Al Ikhlas CGV
 */

export const youtubeChannelInfo = {
  channelName: 'Masjid Al Ikhlas Cipta Greenville',
  handle: '@alikhlascgv',
  channelUrl: 'https://www.youtube me/channel/alikhlascgv', // YouTube channel link
  subscribersText: '1.2k Jamaah Subscribed',
  location: 'Batam, Kepulauan Riau',
};

export const currentLiveStream = {
  isLiveNow: true,
  badgeText: '🔴 SEDANG LIVE',
  title: 'Kajian Rutin Tafsir Al-Qur\'an: Hikmah Surah Luqman & Pembinaan Keluarga',
  speaker: 'Ustadz H. Abdul Malik, Lc., M.A.',
  schedule: 'Jumat Mubaarok · Ba\'da Maghrib (18:30 - 19:30 WIB)',
  location: 'Ruang Utama Masjid Al Ikhlas CGV',
  videoId: '5qap5aO4i9A', // Working sample YouTube video / live ID
  embedUrl: 'https://www.youtube-nocookie.com/embed/5qap5aO4i9A?autoplay=0&rel=0',
  currentViewers: '128 jamaah menyaksikan',
  description: 'Siaran langsung kajian tafsir dari mimbar utama Masjid Al Ikhlas Cipta Greenville. Mari menyimak ilmu dan mempererat tali silaturahmi.',
};

export const upcomingLiveSchedule = [
  {
    id: 'live-1',
    title: 'Kajian Kitab Al-Furqan Min Qasas Al-Qur\'an',
    speaker: 'Ustadz Abu Ziyad',
    schedule: 'Senin, 27 Juli 2026 · Ba\'da Maghrib (18:30 WIB)',
    category: 'Kajian Kitab',
  },
  {
    id: 'live-2',
    title: 'Belajar Bahasa Arab Dari Nol (Sesi 14)',
    speaker: 'Ustadz Rahmat Hidayat, M.Ag.',
    schedule: 'Rabu, 29 Juli 2026 · Ba\'da Isya (20:00 WIB)',
    category: 'Kelas Bahasa',
  },
  {
    id: 'live-3',
    title: 'Kajian Tematik Subuh: Membangun Generasi Rabbani',
    speaker: 'Ustadz Dr. H. Ahmad Fadhil',
    schedule: 'Ahad, 2 Agustus 2026 · Ba\'da Subuh (05:15 WIB)',
    category: 'Kajian Subuh',
  },
];

export const recordedLecturesArchive = [
  {
    id: 'rec-1',
    videoId: 'L_LUpnjgPso',
    title: 'Fiqih Adab Tetangga & Hak-Hak Sesama Muslim di Perumahan',
    speaker: 'Ustadz Farhan Abu Ziyad',
    date: '20 Juli 2026',
    duration: '48:12',
    views: '412 x ditonton',
    category: 'Kajian Adab',
  },
  {
    id: 'rec-2',
    videoId: 'jfKfPfyJRdk',
    title: 'Panduan Tahsin Surah Al-Fatihah & Tajwid Makhorijul Huruf',
    speaker: 'Ustadz Muhammad Ridwan',
    date: '17 Juli 2026',
    duration: '55:30',
    views: '680 x ditonton',
    category: 'Tahsin',
  },
  {
    id: 'rec-3',
    videoId: '3JZ_D3ELwOQ',
    title: 'Fiqih Shalat Berjamaah & Kedisiplinan Waktu Shalat di Masjid',
    speaker: 'Ustadz H. Abdul Malik, Lc.',
    date: '13 Juli 2026',
    duration: '42:05',
    views: '525 x ditonton',
    category: 'Fiqih',
  },
];
