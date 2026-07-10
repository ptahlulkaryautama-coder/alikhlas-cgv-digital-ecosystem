// ════════════════════════════════════════════════════════════
// AL IKHLAS DIGITAL ECOSYSTEM — KONEKTOR (v1.7)
//
// PERUBAHAN dari v1.6:
// - Daftarkan "02_Keuangan" ke SHEET_CONFIG.
//   Endpoint GET: ?sheet=02_Keuangan
//   Response tambahan (dihitung server-side, tidak ada di Sheet):
//     • Setiap baris dapat field "saldo" = running total kumulatif
//       (Kas Masuk - Kas Keluar) dari baris pertama sampai baris itu.
//     • Root response juga menyertakan "ringkasan" berisi:
//       totalMasuk, totalKeluar, saldoAkhir, jumlahTransaksi —
//       untuk konsumsi langsung oleh transparansi.html tanpa
//       perlu kalkulasi tambahan di browser.
//   Filter publik: semua transaksi dikembalikan (tidak ada filter
//   Status/Website karena buku kas memang semuanya publik untuk
//   transparansi). Diurutkan tanggal ascending (terlama dulu) supaya
//   running saldo dihitung benar.
//   publicLimit: tidak dibatasi (transparansi menampilkan semua).
//   Kolom "Lampiran" dikembalikan tapi bisa null/kosong.
//
// PERUBAHAN dari v1.5:
// - "01_Program_Kajian" dapat 3 kolom baru: kitab, muqaddimah, audio
//   (posisi kolom N/O/P di Sheet, tidak menggeser kolom lama).
//
// PERUBAHAN dari v1.4:
// - publicFilter "01_Program_Kajian" exclude kategori "TPQ".
//
// doPost TIDAK berubah — 02_Keuangan hanya untuk baca (GET).
// Tulis ke 02_Keuangan tetap via Dashboard (modul Keuangan).
// ════════════════════════════════════════════════════════════

const DATA_START_ROW = 4; // baris 1=judul, 2=kosong, 3=header, 4=data pertama

const SHEET_CONFIG = {
  "02_Keuangan": {
    columns: ["id","tanggal","kategori","cluster","keterangan","tipe","masuk","keluar","lampiran"],
    publicFilter: null,   // semua transaksi publik, tidak ada filter
    publicSort: (a, b) => String(a.tanggal).localeCompare(String(b.tanggal)), // ascending
    publicLimit: null,    // tidak dibatasi
    computeSaldo: true    // flag: GAS hitung running saldo server-side
  },
  "01_Program_Kajian": {
    columns: ["id","kategori","pilar","nama","deskripsi","hari","waktu","lokasi","pemateri","poster","status","website","jemaah","kitab","muqaddimah","audio"],
    publicFilter: row => row.status === "Active" && row.website === "Yes" && row.kategori !== "TPQ",
    publicSort: (a, b) => b.id - a.id,
    publicLimit: 6
  },
  "09_Agenda_Kalender": {
    columns: ["id","kategori","nama","tanggal","waktu","lokasi","deskripsi","galeri","status","website"],
    publicFilter: row => row.status !== "Dibatalkan" && row.website === "Yes",
    publicSort: (a, b) => String(a.tanggal).localeCompare(String(b.tanggal)),
    publicLimit: 6
  }
};

// ── doGet: endpoint baca (untuk Website) + cek status koneksi ──
function doGet(e) {
  const sheetName = e.parameter.sheet;

  if (!sheetName) {
    return jsonOut({
      ok: true,
      message: "Konektor Al Ikhlas v1.7 aktif. Sheet terdaftar: " + Object.keys(SHEET_CONFIG).join(", ") + ". Tambahkan ?sheet=NAMA_SHEET untuk membaca data."
    });
  }

  const config = SHEET_CONFIG[sheetName];
  if (!config) {
    return jsonOut({ ok: false, error: "Sheet '" + sheetName + "' belum dikonfigurasi di konektor" });
  }

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  if (!sheet) {
    return jsonOut({ ok: false, error: "Sheet '" + sheetName + "' tidak ditemukan di Google Sheet" });
  }

  let rows = readAllRows(sheet, config);
  if (config.publicFilter) rows = rows.filter(config.publicFilter);
  if (config.publicSort) rows.sort(config.publicSort);
  if (config.publicLimit) rows = rows.slice(0, config.publicLimit);

  // Hitung running saldo dan ringkasan untuk 02_Keuangan
  if (config.computeSaldo) {
    var runningSaldo = 0;
    var totalMasuk = 0;
    var totalKeluar = 0;
    rows = rows.map(function(row) {
      var masuk = Number(row.masuk) || 0;
      var keluar = Number(row.keluar) || 0;
      runningSaldo += masuk - keluar;
      totalMasuk += masuk;
      totalKeluar += keluar;
      var r = {};
      for (var k in row) r[k] = row[k];
      r.saldo = runningSaldo;
      return r;
    });
    return jsonOut({
      ok: true,
      sheet: sheetName,
      count: rows.length,
      ringkasan: {
        totalMasuk: totalMasuk,
        totalKeluar: totalKeluar,
        saldoAkhir: runningSaldo,
        jumlahTransaksi: rows.length
      },
      data: rows
    });
  }

  return jsonOut({ ok: true, sheet: sheetName, count: rows.length, data: rows });
}

// ── Baca semua baris tabel data (mulai DATA_START_ROW) jadi array object ──
function readAllRows(sheet, config) {
  const numCols = config.columns.length;
  const result = [];
  let r = DATA_START_ROW;
  while (true) {
    const idVal = sheet.getRange(r, 1).getValue();
    if (idVal === "" || idVal === null || typeof idVal !== "number") break;
    const rowValues = sheet.getRange(r, 1, 1, numCols).getValues()[0];
    const obj = {};
    config.columns.forEach((key, i) => { obj[key] = normalizeValue(rowValues[i]); });
    result.push(obj);
    r++;
  }
  return result;
}

function normalizeValue(val) {
  if (val instanceof Date) {
    return Utilities.formatDate(val, Session.getScriptTimeZone(), "yyyy-MM-dd");
  }
  if (val === null || val === undefined) return "";
  return val;
}

// ── doPost: create / update / delete ──
function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    const sheetName = payload.sheet;
    const config = SHEET_CONFIG[sheetName];

    if (!config) {
      return jsonOut({ ok: false, error: "Sheet '" + sheetName + "' belum dikonfigurasi di konektor" });
    }

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
    if (!sheet) {
      return jsonOut({ ok: false, error: "Sheet '" + sheetName + "' tidak ditemukan di Google Sheet. Pastikan nama tab sudah benar." });
    }

    return jsonOut(genericHandler(sheet, config, payload));

  } catch (err) {
    return jsonOut({ ok: false, error: String(err) });
  }
}

function findLastDataRow(sheet) {
  let row = DATA_START_ROW;
  while (true) {
    const val = sheet.getRange(row, 1).getValue();
    if (val === "" || val === null || typeof val !== "number") return row - 1;
    row++;
  }
}

// ── Cari nomor baris berdasarkan ID — return -1 jika tidak ketemu ──
function findRowById(sheet, id) {
  let r = DATA_START_ROW;
  while (true) {
    const val = sheet.getRange(r, 1).getValue();
    if (val === "" || val === null || typeof val !== "number") return -1;
    if (Number(val) === Number(id)) return r;
    r++;
  }
}

// ── Cari ID tertinggi yang sudah dipakai di tabel data (untuk auto-increment) ──
function getMaxId(sheet) {
  let r = DATA_START_ROW;
  let max = 0;
  while (true) {
    const val = sheet.getRange(r, 1).getValue();
    if (val === "" || val === null || typeof val !== "number") break;
    if (Number(val) > max) max = Number(val);
    r++;
  }
  return max;
}

// ── Handler generik: create / update / delete ──
function genericHandler(sheet, config, payload) {
  const d = payload.data;
  const action = payload.action;

  // ── DELETE ──
  if (action === "delete") {
    const r = findRowById(sheet, d.id);
    if (r === -1) {
      return { ok: true, action: "delete-not-found", id: d.id };
    }
    sheet.deleteRow(r);
    return { ok: true, action: "delete", id: d.id, row: r };
  }

  // ── UPDATE: cari ID yang sudah ada di tabel data ──
  if (action === "update") {
    const r = findRowById(sheet, d.id);
    if (r !== -1) {
      const row = config.columns.map(key => d[key] !== undefined ? d[key] : "");
      sheet.getRange(r, 1, 1, row.length).setValues([row]);
      return { ok: true, action: "update", id: d.id, row: r };
    }
    // ID tidak ditemukan -> JANGAN auto-create dengan ID lama (ini sumber bug duplikat
    // sebelumnya). Tolak dengan pesan jelas, supaya Admin sadar dan bisa cek manual.
    return {
      ok: false,
      action: "update-failed",
      error: "ID " + d.id + " tidak ditemukan di sheet '" + payload.sheet + "'. Mungkin sudah terhapus atau dipindah. Refresh Dashboard untuk data terbaru sebelum mencoba lagi."
    };
  }

  // ── CREATE: cek dulu apakah ID yang dikirim SUDAH dipakai di mana pun ──
  if (action === "create") {
    const existingRow = findRowById(sheet, d.id);
    if (existingRow !== -1) {
      // ID yang dikirim Dashboard sudah dipakai baris lain -> JANGAN buat duplikat.
      // Generate ID baru otomatis dari ID tertinggi + 1, lalu lanjutkan create.
      const newId = getMaxId(sheet) + 1;
      d.id = newId;
    }
    const row = config.columns.map(key => d[key] !== undefined ? d[key] : "");
    const lastDataRow = findLastDataRow(sheet);
    const newRowIndex = lastDataRow + 1;
    sheet.insertRowAfter(lastDataRow);
    sheet.getRange(newRowIndex, 1, 1, row.length).setValues([row]);
    return { ok: true, action: "create", id: d.id, row: newRowIndex };
  }

  return { ok: false, error: "Action '" + action + "' tidak dikenali. Gunakan: create, update, atau delete." };
}

function jsonOut(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
