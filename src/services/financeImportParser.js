import { findFinanceCategory } from '../data/financeCategoryCatalog.js';

const REQUIRED_HEADERS = [
  'Tanggal', 'Jenis', 'Kategori', 'Subkategori', 'Dana/Tujuan', 'Kode Santri', 'Keterangan Publik',
  'Metode', 'Nominal (Rp)', 'Referensi Eksternal', 'Status', 'Catatan Internal',
];

const ALLOWED_DIRECTIONS = new Map([
  ['pemasukan', 'income'],
  ['pengeluaran', 'expense'],
]);

const normalize = (value) => String(value ?? '').trim();

function excelDateToIso(value) {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }
  if (typeof value === 'number' && Number.isFinite(value)) {
    const utc = Date.UTC(1899, 11, 30) + Math.round(value) * 86400000;
    return new Date(utc).toISOString().slice(0, 10);
  }
  const text = normalize(value);
  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) return text;
  const match = text.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
  if (!match) return '';
  const [, day, month, year] = match;
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

function readCell(cell) {
  const value = cell?.value;
  if (value && typeof value === 'object' && 'result' in value) return value.result;
  if (value && typeof value === 'object' && 'text' in value) return value.text;
  return value;
}

function findHeaderRow(worksheet) {
  for (let rowNumber = 1; rowNumber <= Math.min(worksheet.rowCount, 30); rowNumber += 1) {
    const values = worksheet.getRow(rowNumber).values.slice(1).map(normalize);
    if (REQUIRED_HEADERS.every((header) => values.includes(header))) return rowNumber;
  }
  return 0;
}

export async function parseFinanceWorkbook(file, scope) {
  if (!file || !/\.xlsx$/i.test(file.name)) throw new Error('Pilih file Excel dengan ekstensi .xlsx.');
  if (file.size > 5 * 1024 * 1024) throw new Error('Ukuran file maksimal 5 MB.');

  const { default: ExcelJS } = await import('exceljs');
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(new Uint8Array(await file.arrayBuffer()));
  const worksheet = workbook.getWorksheet('Import_Transaksi') ?? workbook.worksheets[0];
  if (!worksheet) throw new Error('Workbook tidak memiliki sheet yang dapat dibaca.');

  const headerRowNumber = findHeaderRow(worksheet);
  if (!headerRowNumber) throw new Error('Kolom standar tidak ditemukan. Gunakan sheet Import_Transaksi dari template resmi.');

  const headers = new Map();
  worksheet.getRow(headerRowNumber).eachCell((cell, columnNumber) => headers.set(normalize(readCell(cell)), columnNumber));
  const rows = [];
  const errors = [];

  for (let rowNumber = headerRowNumber + 1; rowNumber <= worksheet.rowCount; rowNumber += 1) {
    const row = worksheet.getRow(rowNumber);
    const raw = Object.fromEntries(REQUIRED_HEADERS.map((header) => [header, readCell(row.getCell(headers.get(header)))]));
    if (REQUIRED_HEADERS.every((header) => normalize(raw[header]) === '')) continue;

    const direction = ALLOWED_DIRECTIONS.get(normalize(raw.Jenis).toLowerCase()) ?? '';
    const transactionDate = excelDateToIso(raw.Tanggal);
    const amount = Number(raw['Nominal (Rp)']);
    const category = normalize(raw.Kategori);
    const subcategory = normalize(raw.Subkategori);
    const fundPurpose = normalize(raw['Dana/Tujuan']);
    const studentCode = normalize(raw['Kode Santri']);
    const categoryRule = direction && category ? findFinanceCategory(scope, direction, category) : null;
    const rowErrors = [];
    if (!transactionDate) rowErrors.push('Tanggal tidak valid');
    if (!direction) rowErrors.push('Jenis harus Pemasukan/Pengeluaran');
    if (!category) rowErrors.push('Kategori wajib');
    else if (!categoryRule) {
      const otherScope = scope === 'tpq' ? 'dkm' : 'tpq';
      const belongsToOtherScope = findFinanceCategory(otherScope, direction, category);
      if (belongsToOtherScope) {
        rowErrors.push(scope === 'dkm'
          ? 'Kategori TPQ terdeteksi; unggah file melalui menu TPQ & Pendidikan'
          : 'Kategori DKM terdeteksi; unggah file melalui menu Keuangan DKM');
      } else {
        rowErrors.push('Kategori tidak sesuai standar');
      }
    }
    if (!subcategory) rowErrors.push('Subkategori wajib');
    if (!fundPurpose) rowErrors.push('Dana/Tujuan wajib');
    if (!Number.isFinite(amount) || amount <= 0) rowErrors.push('Nominal harus lebih dari 0');
    if (scope === 'dkm' && studentCode) rowErrors.push('Kode Santri hanya boleh digunakan pada laporan TPQ');
    if (categoryRule?.studentCodeRequired && !studentCode) rowErrors.push(`Kode Santri wajib untuk ${categoryRule.category}`);

    const parsed = {
      rowNumber,
      transactionDate,
      direction,
      category,
      subcategory,
      fundPurpose,
      studentCode: scope === 'tpq' ? studentCode : '',
      publicDescription: normalize(raw['Keterangan Publik']),
      paymentMethod: normalize(raw.Metode),
      amount: Number.isFinite(amount) ? amount : 0,
      externalReference: normalize(raw['Referensi Eksternal']),
      recordStatus: normalize(raw.Status) || 'Draft',
      internalNote: normalize(raw['Catatan Internal']),
      errors: rowErrors,
    };
    rows.push(parsed);
    if (rowErrors.length) errors.push({ rowNumber, messages: rowErrors });
  }

  const refs = rows.map((row) => row.externalReference).filter(Boolean);
  const duplicates = new Set(refs.filter((ref, index) => refs.indexOf(ref) !== index));
  rows.forEach((row) => {
    if (row.externalReference && duplicates.has(row.externalReference)) {
      row.errors.push('Referensi duplikat dalam file');
      errors.push({ rowNumber: row.rowNumber, messages: ['Referensi duplikat dalam file'] });
    }
  });
  if (!rows.length) throw new Error('Tidak ada transaksi yang ditemukan di file.');

  const validRows = rows.filter((row) => row.errors.length === 0);
  return {
    sheetName: worksheet.name,
    rows,
    errors,
    validRows,
    totalIncome: validRows.filter((row) => row.direction === 'income').reduce((sum, row) => sum + row.amount, 0),
    totalExpense: validRows.filter((row) => row.direction === 'expense').reduce((sum, row) => sum + row.amount, 0),
  };
}

export async function sha256File(file) {
  const digest = await crypto.subtle.digest('SHA-256', await file.arrayBuffer());
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}
