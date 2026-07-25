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
import { financePeriods } from './siteContent.js';

export { financePeriods };

export const mockPeriod = 'Juni 2026';

export const mockFinanceSummary = {
  period: 'Juni 2026',
  updatedAt: '2 Juli 2026',
  totalIn: 'Rp 12.850.000',
  totalOut: 'Rp 7.650.000',
  endingBalance: 'Rp 5.200.000',
  transactionCount: '24',
  donorCount: '',
  activeCampaign: 'Operasional dan pendidikan anak',
  note: 'Data Buku Kas DKM Masjid Al Ikhlas CGV periode Juni 2026.',
};

// ── KPI (Exact values from the PDF Page 1) ──────────────────────────────────
export const mockKpi = {
  kasMasuk: { value: '12.850.000', hint: '24 transaksi', raw: 12850000 },
  kasKeluar: { value: '7.650.000', hint: '18 transaksi', raw: 7650000 },
  saldoAkhir: { value: '5.200.000', hint: 'Surplus bulan ini', raw: 5200000 },
  programAktif: { value: '6', hint: '6 kajian aktif', raw: 6 },
  agendaBulanIni: { value: '4', hint: '4 agenda aktif', raw: 4 },
  donasiAktif: { value: '4', hint: 'Kampanye sedang berjalan', raw: 4 },
};

// ── Kas bulanan chart (Jan–Jun 2026) ──────────────────────────────────────
export const mockBulananChart = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun'],
  masuk:  [8400000, 9200000, 11500000, 12000000, 19431000, 12850000],
  keluar: [4200000, 5100000, 6800000,  7200000,  8268292,  7650000],
};

// ── Income source breakdown (donut) ───────────────────────────────────────
export const mockIncomeSources = [
  { label: 'Kotak Infaq',      amount: 'Rp 5.400.000',  percent: 42, color: '#0c2b1d' },
  { label: 'Transfer Rekening', amount: 'Rp 4.350.000',  percent: 34, color: '#c9a55a' },
  { label: 'QRIS Masjid',      amount: 'Rp 2.100.000',  percent: 16, color: '#6b7f74' },
  { label: 'Program Khusus',   amount: 'Rp 1.000.000',  percent: 8,  color: '#8b5e34' },
];

// ── Budget realization progress bars ─────────────────────────────────────
export const mockAnggaran = [
  { label: 'Operasional Masjid',     pct: 42, realisasi: 'Rp 3.250.000', target: 'Rp 7,8 jt', color: 'g' },
  { label: 'Pendidikan & TPQ',       pct: 22, realisasi: 'Rp 1.700.000', target: 'Rp 7,5 jt', color: 'o' },
  { label: 'Kebersihan & Fasilitas', pct: 19, realisasi: 'Rp 1.450.000', target: 'Rp 7,8 jt', color: 'g' },
  { label: 'Sosial & Kegiatan',      pct: 17, realisasi: 'Rp 1.250.000', target: 'Rp 7,2 jt', color: 'o' },
];

// ── Program list ────────────────────────────────────────────────────────────
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
];

// ── Agenda items ────────────────────────────────────────────────────────────
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
    deskripsi: 'Pelaksanaan Sholat Idul Adha berjamaah dilanjutkan dengan penyembelihan hewan qurban warga Cipta Greenville.',
  },
  {
    id: 2,
    kategori: 'Kerja Bakti',
    badgeClass: 'ag-goro',
    nama: 'Goro Bersama Warga CGV',
    tanggal: '2026-06-21',
    displayDay: '21',
    displayMonth: 'Jun',
    waktu: '07:30',
    lokasi: 'Area Lingkungan Masjid',
    deskripsi: 'Gotong royong membersihkan area halaman, drainase, dan persiapan penataan taman depan masjid.',
  },
  {
    id: 3,
    kategori: 'Rapat',
    badgeClass: 'ag-rapat',
    nama: 'Rapat Koordinasi DKM & Warga',
    tanggal: '2026-06-14',
    displayDay: '14',
    displayMonth: 'Jun',
    waktu: '20:00',
    lokasi: 'Aula Utama Masjid',
    deskripsi: 'Evaluasi program bulanan, laporan keuangan triwulan, serta pembahasan rencana kegiatan kajian remaja.',
  },
  {
    id: 4,
    kategori: 'Pendidikan',
    badgeClass: 'ag-lain',
    nama: 'Pembagian Raport Santri TPQ',
    tanggal: '2026-06-28',
    displayDay: '28',
    displayMonth: 'Jun',
    waktu: '09:00',
    lokasi: 'Ruang TPQ Al Mardhotillah',
    deskripsi: 'Penerimaan hasil belajar santri TPQ Al Mardhotillah semester genap tahun ajaran 1447H.',
  },
];

// ── Recent activity ─────────────────────────────────────────────────────────
export const mockActivity = [
  {
    id: 1,
    dotClass: 'g',
    emoji: '↑',
    text: 'Infaq Sholat Idul Adha diterima',
    sub: 'Kas masuk kategori Infaq Event',
    time: '2 hari lalu',
  },
  {
    id: 2,
    dotClass: 'b',
    emoji: '📰',
    text: 'Warta Sedekah Jumat diterbitkan',
    sub: 'Oleh DKM Al Ikhlas - Kategori Sosial',
    time: '4 hari lalu',
  },
  {
    id: 3,
    dotClass: 'b',
    emoji: '📰',
    text: 'Dokumentasi TPQ Al Ikhlas diunggah',
    sub: 'Oleh Ustadzah Aminah - Kategori TPQ',
    time: '1 minggu lalu',
  },
];

// ── Read-only Transaction List (Exact 44 transactions from PDF) ──────────────
export const mockTransactionsJuni = [
  { id: '1', tanggal: '27 Jun', kategori: 'Infaq Event', keterangan: 'Infaq Sholat Idul Adha', masuk: 'Rp 4.874.000', keluar: '-', saldo: 'Rp 5.200.000' },
  { id: '2', tanggal: '26 Jun', kategori: 'Donasi Khusus', keterangan: 'Infaq support pembayaran Listrik dr Greenwich 25 TF', masuk: 'Rp 1.500.000', keluar: '-', saldo: 'Rp 326.000' },
  { id: '3', tanggal: '22 Jun', kategori: 'Bisyaroh', keterangan: 'Bisyaroh Khotib Jumat', masuk: '-', keluar: 'Rp 250.000', saldo: 'Rp 1.174.000' },
  { id: '4', tanggal: '22 Jun', kategori: 'Infaq Jumat', keterangan: 'Infaq Jumat', masuk: 'Rp 1.388.000', keluar: '-', saldo: 'Rp 1.424.000' },
  { id: '5', tanggal: '22 Jun', kategori: 'Jumber', keterangan: 'Pembayaran Jumber Pinnata 32', masuk: '-', keluar: 'Rp 200.000', saldo: 'Rp 36.000' },
  { id: '6', tanggal: '22 Jun', kategori: 'Jumber', keterangan: 'Pembayaran Jumber Canyon 16', masuk: '-', keluar: 'Rp 500.000', saldo: 'Rp 236.000' },
  { id: '7', tanggal: '21 Jun', kategori: 'Infaq Cluster', keterangan: 'Infaq Jumber Pinnata 32', masuk: 'Rp 200.000', keluar: '-', saldo: 'Rp 736.000' },
  { id: '8', tanggal: '21 Jun', kategori: 'Infaq Cluster', keterangan: 'Infaq Jumber Canyon 16', masuk: 'Rp 500.000', keluar: '-', saldo: 'Rp 536.000' },
  { id: '9', tanggal: '19 Jun', kategori: 'Infaq Cluster', keterangan: 'Infaq Masjid Aurora 19', masuk: 'Rp 200.000', keluar: '-', saldo: 'Rp 36.000' },
  { id: '10', tanggal: '15 Jun', kategori: 'Bisyaroh', keterangan: 'Bisyaroh Khotib Jumat', masuk: '-', keluar: 'Rp 250.000', saldo: 'Rp 164.000' },
  { id: '11', tanggal: '15 Jun', kategori: 'Infaq Jumat', keterangan: 'Infaq Jumat', masuk: 'Rp 1.283.000', keluar: '-', saldo: 'Rp 414.000' },
  { id: '12', tanggal: '15 Jun', kategori: 'Jumber', keterangan: 'Pembayaran Jumber Mandeville 09', masuk: '-', keluar: 'Rp 150.000', saldo: 'Rp 869.000' },
  { id: '13', tanggal: '15 Jun', kategori: 'Jumber', keterangan: 'Pembayaran Jumber Aurora 42', masuk: '-', keluar: 'Rp 150.000', saldo: 'Rp 1.019.000' },
  { id: '14', tanggal: '15 Jun', kategori: 'Infaq Cluster', keterangan: 'Infaq Jumber Mandeville 09 TF ke rekening', masuk: 'Rp 150.000', keluar: '-', saldo: 'Rp 1.169.000' },
  { id: '15', tanggal: '15 Jun', kategori: 'Infaq Cluster', keterangan: 'Infaq Jumber Aurora 42 TF ke rekening', masuk: 'Rp 150.000', keluar: '-', saldo: 'Rp 1.019.000' },
  { id: '16', tanggal: '12 Jun', kategori: 'Infaq Cluster', keterangan: 'Infaq Masjid dr Meteora 23A TF ke rekening', masuk: 'Rp 322.000', keluar: '-', saldo: 'Rp 869.000' },
  { id: '17', tanggal: '10 Jun', kategori: 'Operasional', keterangan: 'Pengeluaran Goro (pel – beton – sikat – sabun – dll)', masuk: '-', keluar: 'Rp 630.500', saldo: 'Rp 547.000' },
  { id: '18', tanggal: '8 Jun', kategori: 'Bisyaroh', keterangan: 'Pembayaran Bisyaroh Khotib Jumat', masuk: '-', keluar: 'Rp 250.000', saldo: 'Rp 1.177.500' },
  { id: '19', tanggal: '8 Jun', kategori: 'Infaq Jumat', keterangan: 'Infaq Jumat', masuk: 'Rp 1.632.000', keluar: '-', saldo: 'Rp 1.427.500' },
  { id: '20', tanggal: '8 Jun', kategori: 'Jumber', keterangan: 'Pembayaran Jumber Meteora 10', masuk: '-', keluar: 'Rp 100.000', saldo: 'Rp 204.500' },
  { id: '21', tanggal: '8 Jun', kategori: 'Infaq Cluster', keterangan: 'Infaq Jumber Meteora 10 TF ke rekening', masuk: 'Rp 100.000', keluar: '-', saldo: 'Rp 304.500' },
  { id: '22', tanggal: '8 Jun', kategori: 'Infaq Cluster', keterangan: 'Infaq Bisyaroh Khotib Jumat dr Aurora 27 Cash', masuk: 'Rp 250.000', keluar: '-', saldo: 'Rp 204.500' },
  { id: '23', tanggal: '8 Jun', kategori: 'Jumber', keterangan: 'Pembayaran Jumber Mandeville 09', masuk: '-', keluar: 'Rp 150.000', saldo: 'Rp 45.500' },
  { id: '24', tanggal: '8 Jun', kategori: 'Jumber', keterangan: 'Pembayaran Jumber Aurora 42', masuk: '-', keluar: 'Rp 150.000', saldo: 'Rp 195.500' },
  { id: '25', tanggal: '8 Jun', kategori: 'Infaq Cluster', keterangan: 'Infaq Jumber Mandeville 09 TF ke rekening', masuk: 'Rp 150.000', keluar: '-', saldo: 'Rp 345.500' },
  { id: '26', tanggal: '8 Jun', kategori: 'Infaq Cluster', keterangan: 'Infaq Jumber Aurora 42 TF ke rekening', masuk: 'Rp 150.000', keluar: '-', saldo: 'Rp 195.500' },
  { id: '27', tanggal: '5 Jun', kategori: 'Infaq Cluster', keterangan: 'Infaq Masjid dr Meteora 62 TF ke rekening', masuk: 'Rp 300.000', keluar: '-', saldo: 'Rp 45.500' },
  { id: '28', tanggal: '3 Jun', kategori: 'Infaq Cluster', keterangan: 'Infaq Masjid dr Prima Jaya Aluminium Cash', masuk: 'Rp 400.000', keluar: '-', saldo: 'Rp 2.913.104' },
  { id: '29', tanggal: '3 Jun', kategori: 'Operasional', keterangan: 'Pembayaran WiFi', masuk: '-', keluar: 'Rp 233.000', saldo: 'Rp 2.513.104' },
  { id: '30', tanggal: '3 Jun', kategori: 'Operasional', keterangan: 'Pembayaran Listrik PLN', masuk: '-', keluar: 'Rp 1.885.896', saldo: 'Rp 2.746.104' },
  { id: '31', tanggal: '1 Jun', kategori: 'Bisyaroh', keterangan: 'Pembayaran Bisyaroh Imam', masuk: '-', keluar: 'Rp 250.000', saldo: 'Rp 4.632.104' },
  { id: '32', tanggal: '1 Jun', kategori: 'Infaq Jumat', keterangan: 'Infaq Jumat', masuk: 'Rp 2.241.000', keluar: '-', saldo: 'Rp 4.882.104' },
  { id: '33', tanggal: '1 Jun', kategori: 'Jumber', keterangan: 'Pembayaran Jumber Meteora 62', masuk: '-', keluar: 'Rp 300.000', saldo: 'Rp 2.641.104' },
  { id: '34', tanggal: '1 Jun', kategori: 'Infaq Cluster', keterangan: 'Infaq Jumber Meteora 62 TF ke rekening', masuk: 'Rp 150.000', keluar: '-', saldo: 'Rp 2.941.104' },
  { id: '35', tanggal: '1 Jun', kategori: 'Infaq Cluster', keterangan: 'Infaq Jumber Meteora 62 TF ke rekening', masuk: 'Rp 300.000', keluar: '-', saldo: 'Rp 2.791.104' },
  { id: '36', tanggal: '1 Jun', kategori: 'Infaq Cluster', keterangan: 'Infaq Masjid dr Meteora 25 TF ke rekening', masuk: 'Rp 500.000', keluar: '-', saldo: 'Rp 2.491.104' },
  { id: '37', tanggal: '1 Jun', kategori: 'Bisyaroh', keterangan: 'Pembayaran Bisyaroh Imam', masuk: '-', keluar: 'Rp 250.000', saldo: 'Rp 1.991.104' },
  { id: '38', tanggal: '1 Jun', kategori: 'Infaq Jumat', keterangan: 'Infaq Jumat', masuk: 'Rp 2.241.000', keluar: '-', saldo: 'Rp 2.241.104' },
  { id: '39', tanggal: '1 Jun', kategori: 'Jumber', keterangan: 'Pembayaran Jumber Aurora 42', masuk: '-', keluar: 'Rp 150.000', saldo: 'Rp 0' },
  { id: '40', tanggal: '1 Jun', kategori: 'Jumber', keterangan: 'Pembayaran Jumber Meteora 62', masuk: '-', keluar: 'Rp 300.000', saldo: 'Rp 150.000' },
  { id: '41', tanggal: '1 Jun', kategori: 'Infaq Cluster', keterangan: 'Infaq Jumber Aurora 42 TF ke rekening', masuk: 'Rp 150.000', keluar: '-', saldo: 'Rp 450.000' },
  { id: '42', tanggal: '1 Jun', kategori: 'Infaq Cluster', keterangan: 'Infaq Jumber Meteora 62 TF ke rekening', masuk: 'Rp 300.000', keluar: '-', saldo: 'Rp 300.000' },
];

export const mockTransactionsMei = [
  { id: '1', tanggal: '27 Mei', kategori: 'Infaq Event', keterangan: 'Infaq Sholat Idul Adha', masuk: 'Rp 4.874.000', keluar: '-', saldo: 'Rp 11.162.708' },
  { id: '2', tanggal: '26 Mei', kategori: 'Donasi Khusus', keterangan: 'Infaq support pembayaran Listrik dr Greenwich 25 TF', masuk: 'Rp 1.500.000', keluar: '-', saldo: 'Rp 6.288.708' },
  { id: '3', tanggal: '22 Mei', kategori: 'Bisyaroh', keterangan: 'Bisyaroh Khotib Jumat', masuk: '-', keluar: 'Rp 250.000', saldo: 'Rp 4.788.708' },
  { id: '4', tanggal: '22 Mei', kategori: 'Infaq Jumat', keterangan: 'Infaq Jumat', masuk: 'Rp 1.388.000', keluar: '-', saldo: 'Rp 5.038.708' },
  { id: '5', tanggal: '22 Mei', kategori: 'Jumber', keterangan: 'Pembayaran Jumber Pinnata 32', masuk: '-', keluar: 'Rp 200.000', saldo: 'Rp 3.650.708' },
  { id: '6', tanggal: '22 Mei', kategori: 'Jumber', keterangan: 'Pembayaran Jumber Canyon 16', masuk: '-', keluar: 'Rp 500.000', saldo: 'Rp 3.850.708' },
  { id: '7', tanggal: '21 Mei', kategori: 'Infaq Cluster', keterangan: 'Infaq Jumber Pinnata 32', masuk: 'Rp 200.000', keluar: '-', saldo: 'Rp 4.350.708' },
  { id: '8', tanggal: '21 Mei', kategori: 'Infaq Cluster', keterangan: 'Infaq Jumber Canyon 16', masuk: 'Rp 500.000', keluar: '-', saldo: 'Rp 4.150.708' },
  { id: '9', tanggal: '19 Mei', kategori: 'Infaq Cluster', keterangan: 'Infaq Masjid Aurora 19', masuk: 'Rp 200.000', keluar: '-', saldo: 'Rp 3.650.708' },
  { id: '10', tanggal: '15 Mei', kategori: 'Bisyaroh', keterangan: 'Bisyaroh Khotib Jumat', masuk: '-', keluar: 'Rp 250.000', saldo: 'Rp 3.450.708' },
  { id: '11', tanggal: '15 Mei', kategori: 'Infaq Jumat', keterangan: 'Infaq Jumat', masuk: 'Rp 1.283.000', keluar: '-', saldo: 'Rp 3.700.708' },
  { id: '12', tanggal: '15 Mei', kategori: 'Jumber', keterangan: 'Pembayaran Jumber Mandeville 09', masuk: '-', keluar: 'Rp 150.000', saldo: 'Rp 2.417.708' },
  { id: '13', tanggal: '15 Mei', kategori: 'Jumber', keterangan: 'Pembayaran Jumber Aurora 42', masuk: '-', keluar: 'Rp 150.000', saldo: 'Rp 2.567.708' },
  { id: '14', tanggal: '15 Mei', kategori: 'Infaq Cluster', keterangan: 'Infaq Jumber Mandeville 09 TF ke rekening', masuk: 'Rp 150.000', keluar: '-', saldo: 'Rp 2.717.708' },
  { id: '15', tanggal: '15 Mei', kategori: 'Infaq Cluster', keterangan: 'Infaq Jumber Aurora 42 TF ke rekening', masuk: 'Rp 150.000', keluar: '-', saldo: 'Rp 2.567.708' },
  { id: '16', tanggal: '12 Mei', kategori: 'Infaq Cluster', keterangan: 'Infaq Masjid dr Meteora 23A TF ke rekening', masuk: 'Rp 322.000', keluar: '-', saldo: 'Rp 2.417.708' },
  { id: '17', tanggal: '10 Mei', kategori: 'Operasional', keterangan: 'Pengeluaran Goro (pel – beton – sikat – sabun – dll)', masuk: '-', keluar: 'Rp 630.500', saldo: 'Rp 2.095.708' },
  { id: '18', tanggal: '8 Mei', kategori: 'Bisyaroh', keterangan: 'Pembayaran Bisyaroh Khotib Jumat', masuk: '-', keluar: 'Rp 250.000', saldo: 'Rp 2.726.708' },
  { id: '19', tanggal: '8 Mei', kategori: 'Infaq Jumat', keterangan: 'Infaq Jumat', masuk: 'Rp 1.632.000', keluar: '-', saldo: 'Rp 2.976.708' },
  { id: '20', tanggal: '8 Mei', kategori: 'Jumber', keterangan: 'Pembayaran Jumber Meteora 10', masuk: '-', keluar: 'Rp 100.000', saldo: 'Rp 1.344.708' },
  { id: '21', tanggal: '8 Mei', kategori: 'Infaq Cluster', keterangan: 'Infaq Jumber Meteora 10 TF ke rekening', masuk: 'Rp 100.000', keluar: '-', saldo: 'Rp 1.444.708' },
  { id: '22', tanggal: '8 Mei', kategori: 'Infaq Cluster', keterangan: 'Infaq Bisyaroh Khotib Jumat dr Aurora 27 Cash', masuk: 'Rp 250.000', keluar: '-', saldo: 'Rp 1.344.708' },
  { id: '23', tanggal: '8 Mei', kategori: 'Jumber', keterangan: 'Pembayaran Jumber Mandeville 09', masuk: '-', keluar: 'Rp 150.000', saldo: 'Rp 1.094.708' },
  { id: '24', tanggal: '8 Mei', kategori: 'Jumber', keterangan: 'Pembayaran Jumber Aurora 42', masuk: '-', keluar: 'Rp 150.000', saldo: 'Rp 1.244.708' },
  { id: '25', tanggal: '8 Mei', kategori: 'Infaq Cluster', keterangan: 'Infaq Jumber Mandeville 09 TF ke rekening', masuk: 'Rp 150.000', keluar: '-', saldo: 'Rp 1.394.708' },
  { id: '26', tanggal: '8 Mei', kategori: 'Infaq Cluster', keterangan: 'Infaq Jumber Aurora 42 TF ke rekening', masuk: 'Rp 150.000', keluar: '-', saldo: 'Rp 1.244.708' },
  { id: '27', tanggal: '5 Mei', kategori: 'Infaq Cluster', keterangan: 'Infaq Masjid dr Meteora 62 TF ke rekening', masuk: 'Rp 300.000', keluar: '-', saldo: 'Rp 1.094.708' },
  { id: '28', tanggal: '3 Mei', kategori: 'Infaq Cluster', keterangan: 'Infaq Masjid dr Prima Jaya Aluminium Cash', masuk: 'Rp 400.000', keluar: '-', saldo: 'Rp 2.913.104' },
  { id: '29', tanggal: '3 Mei', kategori: 'Operasional', keterangan: 'Pembayaran WiFi', masuk: '-', keluar: 'Rp 233.000', saldo: 'Rp 2.513.104' },
  { id: '30', tanggal: '3 Mei', kategori: 'Operasional', keterangan: 'Pembayaran Listrik PLN', masuk: '-', keluar: 'Rp 1.885.896', saldo: 'Rp 2.746.104' },
  { id: '31', tanggal: '1 Mei', kategori: 'Bisyaroh', keterangan: 'Pembayaran Bisyaroh Imam', masuk: '-', keluar: 'Rp 250.000', saldo: 'Rp 4.632.104' },
  { id: '32', tanggal: '1 Mei', kategori: 'Infaq Jumat', keterangan: 'Infaq Jumat', masuk: 'Rp 2.241.000', keluar: '-', saldo: 'Rp 4.882.104' },
  { id: '33', tanggal: '1 Mei', kategori: 'Jumber', keterangan: 'Pembayaran Jumber Meteora 62', masuk: '-', keluar: 'Rp 300.000', saldo: 'Rp 2.641.104' },
  { id: '34', tanggal: '1 Mei', kategori: 'Infaq Cluster', keterangan: 'Infaq Jumber Meteora 62 TF ke rekening', masuk: 'Rp 150.000', keluar: '-', saldo: 'Rp 2.941.104' },
  { id: '35', tanggal: '1 Mei', kategori: 'Infaq Cluster', keterangan: 'Infaq Jumber Meteora 62 TF ke rekening', masuk: 'Rp 300.000', keluar: '-', saldo: 'Rp 2.791.104' },
  { id: '36', tanggal: '1 Mei', kategori: 'Infaq Cluster', keterangan: 'Infaq Masjid dr Meteora 25 TF ke rekening', masuk: 'Rp 500.000', keluar: '-', saldo: 'Rp 2.491.104' },
  { id: '37', tanggal: '1 Mei', kategori: 'Bisyaroh', keterangan: 'Pembayaran Bisyaroh Imam', masuk: '-', keluar: 'Rp 250.000', saldo: 'Rp 1.991.104' },
  { id: '38', tanggal: '1 Mei', kategori: 'Infaq Jumat', keterangan: 'Infaq Jumat', masuk: 'Rp 2.241.000', keluar: '-', saldo: 'Rp 2.241.104' },
  { id: '39', tanggal: '1 Mei', kategori: 'Jumber', keterangan: 'Pembayaran Jumber Aurora 42', masuk: '-', keluar: 'Rp 150.000', saldo: 'Rp 0' },
  { id: '40', tanggal: '1 Mei', kategori: 'Jumber', keterangan: 'Pembayaran Jumber Meteora 62', masuk: '-', keluar: 'Rp 300.000', saldo: 'Rp 150.000' },
  { id: '41', tanggal: '1 Mei', kategori: 'Infaq Cluster', keterangan: 'Infaq Jumber Aurora 42 TF ke rekening', masuk: 'Rp 150.000', keluar: '-', saldo: 'Rp 450.000' },
  { id: '42', tanggal: '1 Mei', kategori: 'Infaq Cluster', keterangan: 'Infaq Jumber Meteora 62 TF ke rekening', stroke: 'none', masuk: 'Rp 300.000', keluar: '-', saldo: 'Rp 300.000' },
];

export const mockTransactions = mockTransactionsJuni;
