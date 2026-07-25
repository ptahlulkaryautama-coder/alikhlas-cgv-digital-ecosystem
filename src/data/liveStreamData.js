/**
 * liveStreamData.js — YouTube Live Stream & Video Data Store
 *
 * Supported status values:
 * - "live"       : Active live stream broadcast
 * - "scheduled"  : Upcoming scheduled live stream
 * - "ended"      : Completed live stream (recorded video)
 * - "inactive"   : Off-air / No active stream
 */

export const currentLiveStream = {
  id: 'live-stream-01',
  title: 'Kajian Rutin Tafsir Al-Qur\'an: Hikmah Surah Luqman & Pembinaan Keluarga Rabbani',
  speaker: 'Ustadz H. Abdul Malik, Lc., M.A.',
  scheduleLabel: 'Jumat Mubaarok · 18:30 WIB (Ba\'da Maghrib)',
  youtubeUrl: 'https://www.youtube.com/watch?v=5qap5aO4i9A',
  videoId: '5qap5aO4i9A',
  channelUrl: 'https://www.youtube.com/@alikhlascgv',
  description: 'Siaran langsung kajian tafsir Al-Qur\'an dari mimbar utama Masjid Al Ikhlas Cipta Greenville Batam. Mari menyimak petunjuk kitabullah untuk keluarga Sakinah Mawaddah Warahmah.',
  status: 'live', // Options: "live" | "scheduled" | "ended" | "inactive"
  isPublic: true,
  relatedProgramHref: '/program',
  relatedAgendaHref: '/agenda',
};

export const upcomingLiveStreams = [
  {
    id: 'sched-01',
    title: 'Kajian Kitab Al-Furqan Min Qasas Al-Qur\'an: Qisas Al-Anbiya',
    speaker: 'Ustadz Abu Ziyad',
    scheduleLabel: 'Senin, 27 Juli 2026 · Ba\'da Maghrib (18:30 WIB)',
    youtubeUrl: 'https://www.youtube.com/watch?v=L_LUpnjgPso',
    videoId: 'L_LUpnjgPso',
    channelUrl: 'https://www.youtube.com/@alikhlascgv',
    description: 'Pelajaran berharga dari kisah para nabi dalam Al-Qur\'an untuk keteguhan iman dan adab sehari-hari.',
    status: 'scheduled',
    isPublic: true,
    relatedProgramHref: '/program',
    relatedAgendaHref: '/agenda',
  },
  {
    id: 'sched-02',
    title: 'Belajar Bahasa Arab Dari Nol: Dasar Nahwu & Sharaf (Sesi 14)',
    speaker: 'Ustadz Rahmat Hidayat, M.Ag.',
    scheduleLabel: 'Rabu, 29 Juli 2026 · Ba\'da Isya (20:00 WIB)',
    youtubeUrl: 'https://www.youtube.com/watch?v=jfKfPfyJRdk',
    videoId: 'jfKfPfyJRdk',
    channelUrl: 'https://www.youtube.com/@alikhlascgv',
    description: 'Pembelajaran bahasa Arab secara sistematis dan aplikatif untuk memahami Al-Qur\'an dan bacaan shalat.',
    status: 'scheduled',
    isPublic: true,
    relatedProgramHref: '/program',
    relatedAgendaHref: '/agenda',
  },
];

export const endedLiveStreams = [
  {
    id: 'ended-01',
    title: 'Fiqih Adab Tetangga & Hak-Hak Sesama Muslim di Perumahan CGV',
    speaker: 'Ustadz Farhan Abu Ziyad',
    scheduleLabel: 'Jumat, 17 Juli 2026',
    youtubeUrl: 'https://www.youtube.com/watch?v=3JZ_D3ELwOQ',
    videoId: '3JZ_D3ELwOQ',
    channelUrl: 'https://www.youtube.com/@alikhlascgv',
    description: 'Rekaman siaran langsung kajian adab bertetangga dan kerukunan bermasyarakat di perumahan Cipta Greenville.',
    status: 'ended',
    isPublic: true,
    relatedProgramHref: '/program',
    relatedAgendaHref: '/agenda',
  },
  {
    id: 'ended-02',
    title: 'Panduan Tahsin Surah Al-Fatihah & Tajwid Makhorijul Huruf',
    speaker: 'Ustadz Muhammad Ridwan',
    scheduleLabel: 'Sabtu, 11 Juli 2026',
    youtubeUrl: 'https://www.youtube.com/watch?v=jfKfPfyJRdk',
    videoId: 'jfKfPfyJRdk',
    channelUrl: 'https://www.youtube.com/@alikhlascgv',
    description: 'Rekaman sesi pembelajaran tahsin membaca Al-Qur\'an dengan tajwid tajwid makhraj yang tepat.',
    status: 'ended',
    isPublic: true,
    relatedProgramHref: '/program',
    relatedAgendaHref: '/agenda',
  },
];
