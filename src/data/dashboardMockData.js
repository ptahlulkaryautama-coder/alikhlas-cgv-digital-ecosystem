/**
 * dashboardMockData.js
 *
 * All data in this file is mock / illustrative only.
 * It is used to populate the dashboard prototype UI while the real
 * admin data pipeline is being built.
 *
 * Rules:
 *   - No real donor names, phone numbers, or private notes.
 *   - No real santri / child data.
 *   - Amounts are approximate illustrative figures, NOT live cash-book.
 *   - This file will be replaced with real API hooks in a later phase.
 */

export const mockPeriod = 'Mei – Juni 2026';

// ── KPI ────────────────────────────────────────────────────────────────────
export const mockKpi = {
  kasMasuk: { value: '19.069.526', hint: '34 transaksi bulan ini', raw: 19069526 },
  kasKeluar: { value: '5.599.396', hint: '17 transaksi', raw: 5599396 },
  saldoAkhir: { value: '13.470.130', hint: 'Surplus berjalan', raw: 13470130 },
  programAktif: { value: '6', hint: '6 kajian aktif di sheet', raw: 6 },
  agendaBulanIni: { value: '3', hint: 'Agenda dijadwalkan', raw: 3 },
  donasiAktif: { value: '1', hint: 'Kampanye sedang berjalan', raw: 1 },
};

// ── Kas bulanan chart (Jan–Jun 2026) ──────────────────────────────────────
export const mockBulananChart = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun'],
  masuk:  [8400000, 9200000, 11500000, 12000000, 19069526, 12850000],
  keluar: [4200000, 5100000, 6800000,  7200000,  5599396,  7650000],
};

// ── Income source breakdown (donut) ───────────────────────────────────────
export const mockIncomeSources = [
  { label: 'Infaq Jumat',   amount: 'Rp 6,5 jt',  percent: 34, color: '#1A7A50' },
  { label: 'Infaq Idul Adha', amount: 'Rp 4,9 jt', percent: 26, color: '#C9A55A' },
  { label: 'Infaq Cluster', amount: 'Rp 4,8 jt',  percent: 25, color: '#2B6CB0' },
  { label: 'Support Khusus', amount: 'Rp 1,5 jt', percent: 8,  color: '#6B46C1' },
  { label: 'Lainnya',       amount: 'Rp 1,3 jt',  percent: 7,  color: '#C8C4BC' },
];

// ── Budget realization progress bars ─────────────────────────────────────
export const mockAnggaran = [
  { label: 'Operasional Masjid',   pct: 68, realisasi: 'Rp 6,8 jt', target: 'Rp 10 jt', color: 'g' },
  { label: 'Program Pendidikan',   pct: 82, realisasi: 'Rp 4,1 jt', target: 'Rp 5 jt',  color: 'g' },
  { label: 'Sosial & Santunan',    pct: 45, realisasi: 'Rp 2,25 jt',target: 'Rp 5 jt',  color: 'o' },
  { label: 'Pemeliharaan Gedung',  pct: 91, realisasi: 'Rp 3,6 jt', target: 'Rp 4 jt',  color: 'g' },
];

// ── Program list (mirrors public programs, no private fields) ──────────────
export const mockPrograms = [
  {
    id: 1,
    emoji: '📖',
    bgColor: '#E8F5EE',
    kategori: 'Kajian Kitab',
    nama: "Al-Furqan Min Qasas Al-Qur'an",
    hari: 'Senin',
    waktu: "Ba'da Maghrib",
    pilar: 'Ilmu',
    pilarColor: 'pl-ilmu',
  },
  {
    id: 2,
    emoji: '🕌',
    bgColor: '#E0EEFF',
    kategori: "Tafsir Al-Qur'an",
    nama: 'Tafsir QS Luqman',
    hari: 'Jumat',
    waktu: "Ba'da Maghrib",
    pilar: 'Ibadah',
    pilarColor: 'pl-ibadah',
  },
  {
    id: 3,
    emoji: '🔤',
    bgColor: '#F0EAF8',
    kategori: 'Bahasa Arab',
    nama: 'Belajar Bahasa Arab dari Nol',
    hari: 'Rabu & Ahad',
    waktu: "Ba'da Isya & Ba'da Subuh",
    pilar: 'Ilmu',
    pilarColor: 'pl-ilmu',
  },
  {
    id: 4,
    emoji: '👨‍👩‍👧',
    bgColor: '#FDF4E3',
    kategori: 'Kajian Keluarga',
    nama: "Ad-Daa' Wad-Dawaa'",
    hari: 'Ahad pekan 2 & 4',
    waktu: "Ba'da Maghrib",
    pilar: 'Keluarga',
    pilarColor: 'pl-keluarga',
  },
  {
    id: 5,
    emoji: '📿',
    bgColor: '#E8F5EE',
    kategori: "Tahsin Al-Qur'an",
    nama: 'Belajar Tahsin dari Nol',
    hari: 'Sabtu',
    waktu: "Ba'da Ashar",
    pilar: 'Ilmu',
    pilarColor: 'pl-ilmu',
  },
];

// ── Agenda items (upcoming, no private data) ───────────────────────────────
export const mockAgenda = [
  {
    id: 1,
    kategori: 'Hari Besar Islam',
    badgeClass: 'ag-hbi',
    nama: 'Sholat Idul Adha 1447H',
    tanggal: '2026-06-07',
    displayDay: '07',
    displayMonth: 'Jun',
    waktu: '07:00',
    lokasi: 'Halaman Masjid',
  },
  {
    id: 2,
    kategori: 'Kerja Bakti',
    badgeClass: 'ag-goro',
    nama: 'Goro Bersama Warga',
    tanggal: '2026-06-14',
    displayDay: '14',
    displayMonth: 'Jun',
    waktu: 'Pagi',
    lokasi: 'Area Masjid',
  },
  {
    id: 3,
    kategori: 'Rapat',
    badgeClass: 'ag-rapat',
    nama: 'Koordinasi Program DKM',
    tanggal: '2026-06-21',
    displayDay: '21',
    displayMonth: 'Jun',
    waktu: "Ba'da Isya",
    lokasi: 'Aula Utama',
  },
];

// ── Recent activity (mock only — no real donor data) ──────────────────────
export const mockActivity = [
  {
    id: 1,
    dotClass: 'g',
    emoji: '↑',
    text: 'Infaq Jumat diterima',
    sub: 'Kas masuk kategori Infaq Jumat',
    time: '2 hari lalu',
  },
  {
    id: 2,
    dotClass: 'r',
    emoji: '↓',
    text: 'Pembayaran listrik PLN',
    sub: 'Kas keluar kategori Operasional',
    time: '4 hari lalu',
  },
  {
    id: 3,
    dotClass: 'b',
    emoji: '📋',
    text: 'Program kajian diperbarui',
    sub: 'Belajar Bahasa Arab — jadwal diperbarui',
    time: '1 minggu lalu',
  },
  {
    id: 4,
    dotClass: 'g',
    emoji: '↑',
    text: 'Infaq cluster diterima',
    sub: 'Kas masuk kategori Infaq Cluster',
    time: '1 minggu lalu',
  },
  {
    id: 5,
    dotClass: 'o',
    emoji: '📅',
    text: 'Agenda Idul Adha ditambahkan',
    sub: 'Sholat Idul Adha 1447H — 07 Jun 2026',
    time: '10 hari lalu',
  },
];
