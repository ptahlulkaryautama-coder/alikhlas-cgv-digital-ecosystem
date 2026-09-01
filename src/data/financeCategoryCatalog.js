const entry = (category, options = {}) => Object.freeze({
  category,
  studentCodeRequired: false,
  defaultFundPurpose: '',
  suggestedSubcategories: [],
  ...options,
});

export const FINANCE_CATEGORY_CATALOG = Object.freeze({
  dkm: Object.freeze({
    income: Object.freeze([
      entry('Infaq', { suggestedSubcategories: ['Infaq Operasional', 'Infaq Sosial', 'Infaq Kamis', 'Infaq Jumat', 'Kotak Jumat', 'Kotak Masjid', 'Transfer Rekening', 'QRIS Masjid', 'Operasional', 'Pembangunan', 'Renovasi', 'Ramadan', 'Idulfitri', 'Iduladha', 'Santunan', 'Kegiatan', 'Khusus Lainnya'] }),
      entry('Sedekah'), entry('Donasi'), entry('Zakat', { defaultFundPurpose: 'Dana Zakat' }),
      entry('Fidyah', { defaultFundPurpose: 'Dana Fidyah' }), entry('Wakaf', { defaultFundPurpose: 'Dana Wakaf' }),
      entry('Penerimaan Kegiatan'), entry('Pendapatan Lainnya'),
    ]),
    expense: Object.freeze([
      entry('Operasional Masjid'), entry('Listrik dan Utilitas'), entry('Kebersihan'), entry('Pemeliharaan'),
      entry('Bisyaroh'), entry('Kegiatan Dakwah'), entry('Sosial dan Santunan'), entry('Pembangunan dan Renovasi'),
      entry('Perlengkapan'), entry('Administrasi'), entry('Penyaluran Zakat'), entry('Penyaluran Fidyah'),
      entry('Penggunaan Wakaf'), entry('Pengeluaran Lainnya'),
    ]),
  }),
  tpq: Object.freeze({
    income: Object.freeze([
      entry('SPP', { studentCodeRequired: true, defaultFundPurpose: 'Operasional TPQ' }),
      entry('Pendaftaran', { studentCodeRequired: true, defaultFundPurpose: 'Operasional TPQ' }),
      entry('Buku Prestasi', { studentCodeRequired: true, defaultFundPurpose: 'Perlengkapan Santri' }),
      entry('Seragam', { studentCodeRequired: true, defaultFundPurpose: 'Perlengkapan Santri' }),
      entry('Infaq TPQ'), entry('Donasi Kegiatan'), entry('Bantuan/Subsidi'), entry('Pemasukan Lainnya'),
    ]),
    expense: Object.freeze([
      entry('Honor Pengajar'), entry('Buku dan Bahan Ajar'), entry('ATK'), entry('Seragam'),
      entry('Konsumsi'), entry('Kegiatan Santri'), entry('Sarana dan Peralatan'), entry('Kebersihan'),
      entry('Listrik dan Operasional'), entry('Transportasi'), entry('Pengembalian Pembayaran'), entry('Pengeluaran Lainnya'),
    ]),
  }),
});

export function findFinanceCategory(scope, direction, category) {
  return FINANCE_CATEGORY_CATALOG[scope]?.[direction]?.find((item) => item.category.toLowerCase() === String(category).trim().toLowerCase()) ?? null;
}

