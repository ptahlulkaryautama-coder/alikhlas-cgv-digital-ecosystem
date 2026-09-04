/**
 * tpqRegistrationPdfGenerator.js — Generator Formulir Pendaftaran Santri Resmi TPQ Al Mardhotillah
 * Standard A4 Printable & Save-as-PDF Document Generator
 */

export function generateRegistrationPdfHtml(registrationData) {
  const regNumber = registrationData.registrationNumber || `REG-TPQ-${Date.now().toString().slice(-6)}`;
  const submitDate = registrationData.submittedAt 
    ? new Date(registrationData.submittedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    : new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

  return `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Formulir Pendaftaran - ${registrationData.namaLengkap || 'Santri Baru'} (${regNumber})</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 15mm 15mm 15mm 15mm;
    }
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    body {
      font-family: 'Times New Roman', Times, serif;
      color: #111;
      line-height: 1.4;
      margin: 0;
      padding: 0;
      background: #fff;
      font-size: 12pt;
    }
    .header-kop {
      display: flex;
      align-items: center;
      border-bottom: 3px double #000;
      padding-bottom: 10px;
      margin-bottom: 16px;
    }
    .kop-logo {
      width: 75px;
      height: 75px;
      margin-right: 15px;
      object-fit: contain;
    }
    .kop-text {
      flex: 1;
      text-align: center;
    }
    .kop-text h2 {
      margin: 0;
      font-size: 15pt;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .kop-text h1 {
      margin: 2px 0;
      font-size: 18pt;
      font-weight: bold;
      color: #0d4a2b;
      text-transform: uppercase;
    }
    .kop-text p {
      margin: 0;
      font-size: 9pt;
      font-style: italic;
      color: #333;
    }
    .doc-title {
      text-align: center;
      margin-bottom: 14px;
    }
    .doc-title h3 {
      margin: 0;
      font-size: 13pt;
      font-weight: bold;
      text-decoration: underline;
      text-transform: uppercase;
    }
    .doc-title .reg-meta {
      font-size: 10pt;
      margin-top: 4px;
      color: #444;
    }
    .top-meta-grid {
      display: flex;
      justify-content: space-between;
      margin-bottom: 12px;
      font-size: 10pt;
    }
    .section-box {
      margin-bottom: 12px;
    }
    .section-heading {
      font-size: 11pt;
      font-weight: bold;
      background-color: #f0f4f1;
      border-left: 4px solid #0d4a2b;
      padding: 4px 8px;
      margin-bottom: 6px;
      text-transform: uppercase;
    }
    .data-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 10.5pt;
    }
    .data-table td {
      padding: 3.5px 6px;
      vertical-align: top;
    }
    .data-table td.label-col {
      width: 28%;
      font-weight: 500;
      color: #222;
    }
    .data-table td.colon-col {
      width: 2%;
      text-align: center;
    }
    .data-table td.value-col {
      width: 70%;
      font-weight: bold;
    }
    .photo-and-info-wrap {
      display: flex;
      gap: 15px;
      align-items: flex-start;
    }
    .photo-box {
      width: 110px;
      height: 140px;
      border: 1px dashed #666;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-size: 9pt;
      color: #777;
      text-align: center;
      flex-shrink: 0;
      background: #fafafa;
    }
    .placement-test-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 4px;
      font-size: 9.5pt;
    }
    .placement-test-table th, .placement-test-table td {
      border: 1px solid #777;
      padding: 5px 8px;
      text-align: left;
    }
    .placement-test-table th {
      background-color: #f0f4f1;
      text-align: center;
    }
    .sig-grid {
      display: flex;
      justify-content: space-between;
      margin-top: 24px;
      page-break-inside: avoid;
    }
    .sig-col {
      width: 45%;
      text-align: center;
      font-size: 10.5pt;
    }
    .sig-space {
      height: 60px;
    }
    .sig-name {
      font-weight: bold;
      text-decoration: underline;
    }
    .print-footer {
      margin-top: 20px;
      font-size: 8pt;
      color: #777;
      text-align: center;
      border-top: 1px dotted #ccc;
      padding-top: 4px;
    }
    @media print {
      .no-print {
        display: none !important;
      }
    }
  </style>
</head>
<body>
  <div class="header-kop">
    <img src="/official-logo.png" alt="Logo Masjid" class="kop-logo" onerror="this.style.display='none'" />
    <div class="kop-text">
      <h2>Dewan Kemakmuran Masjid Al Ikhlas</h2>
      <h1>TPQ Al Mardhotillah</h1>
      <p>Perumahan Cipta Greenville, Kelurahan Tembesi, Kecamatan Sagulung, Kota Batam, Kepulauan Riau</p>
      <p>SK DKM No. 04/DKM-AI/TPQ/2024 · Email: tpq.alikhlascgv@gmail.com · WA: +62 813-7541-0997</p>
    </div>
  </div>

  <div class="doc-title">
    <h3>Formulir Registrasi Pendaftaran Santri Baru</h3>
    <div class="reg-meta">Tahun Ajaran 2026/2027 · No. Registrasi: <strong>${regNumber}</strong></div>
  </div>

  <div class="top-meta-grid">
    <div>Tanggal Masuk Form: <strong>${submitDate}</strong></div>
    <div>Status Berkas: <strong>Menunggu Placement Test</strong></div>
  </div>

  <!-- I. Data Santri -->
  <div class="section-box">
    <div class="section-heading">I. Biodata Calon Santri</div>
    <div class="photo-and-info-wrap">
      <table class="data-table">
        <tr>
          <td class="label-col">Nama Lengkap Santri</td>
          <td class="colon-col">:</td>
          <td class="value-col">${registrationData.namaLengkap || '-'}</td>
        </tr>
        <tr>
          <td class="label-col">Nama Panggilan</td>
          <td class="colon-col">:</td>
          <td class="value-col">${registrationData.namaPanggilan || '-'}</td>
        </tr>
        <tr>
          <td class="label-col">Jenis Kelamin</td>
          <td class="colon-col">:</td>
          <td class="value-col">${registrationData.jenisKelamin === 'L' ? 'Laki-laki (Ikhwan)' : registrationData.jenisKelamin === 'P' ? 'Perempuan (Akhwat)' : (registrationData.jenisKelamin || '-')}</td>
        </tr>
        <tr>
          <td class="label-col">Tempat, Tanggal Lahir</td>
          <td class="colon-col">:</td>
          <td class="value-col">${registrationData.tempatLahir || '-'}, ${registrationData.tanggalLahir || '-'} (Usia: ${registrationData.usiaSantri ? registrationData.usiaSantri + ' Tahun' : '-'})</td>
        </tr>
        <tr>
          <td class="label-col">Anak Ke- / Jumlah Saudara</td>
          <td class="colon-col">:</td>
          <td class="value-col">Anak ke-${registrationData.anakKe || '1'} dari ${registrationData.jumlahSaudara || '1'} bersaudara</td>
        </tr>
        <tr>
          <td class="label-col">Sekolah Asal</td>
          <td class="colon-col">:</td>
          <td class="value-col">${registrationData.sekolahAsal || 'Belum / PAUD / TK / SD'}</td>
        </tr>
        <tr>
          <td class="label-col">Kemampuan Bacaan Awal</td>
          <td class="colon-col">:</td>
          <td class="value-col">${registrationData.kemampuanAwal || 'Belum Pernah Belajar'}</td>
        </tr>
      </table>
      <div class="photo-box">
        <span>Pasfoto Santri</span>
        <span>3 x 4 cm</span>
      </div>
    </div>
  </div>

  <!-- II. Data Orang Tua / Wali -->
  <div class="section-box">
    <div class="section-heading">II. Data Orang Tua / Wali Santri</div>
    <table class="data-table">
      <tr>
        <td class="label-col">Nama Ayah / Wali</td>
        <td class="colon-col">:</td>
        <td class="value-col">${registrationData.namaAyah || '-'}</td>
      </tr>
      <tr>
        <td class="label-col">Nama Ibu Kandung</td>
        <td class="colon-col">:</td>
        <td class="value-col">${registrationData.namaIbu || '-'}</td>
      </tr>
      <tr>
        <td class="label-col">Nomor WhatsApp / HP Aktif</td>
        <td class="colon-col">:</td>
        <td class="value-col">${registrationData.noWhatsApp || '-'}</td>
      </tr>
      <tr>
        <td class="label-col">Pekerjaan Orang Tua</td>
        <td class="colon-col">:</td>
        <td class="value-col">${registrationData.pekerjaanOrtu || '-'}</td>
      </tr>
      <tr>
        <td class="label-col">Alamat Domisili</td>
        <td class="colon-col">:</td>
        <td class="value-col">Blok/No: ${registrationData.alamatBlok || '-'}, ${registrationData.alamatLengkap || 'Perumahan Cipta Greenville, Tembesi, Batam'}</td>
      </tr>
    </table>
  </div>

  <!-- III. Catatan Khusus & Kesehatan -->
  <div class="section-box">
    <div class="section-heading">III. Informasi Kesehatan &amp; Catatan Khusus</div>
    <table class="data-table">
      <tr>
        <td class="label-col">Riwayat Alergi / Kesehatan</td>
        <td class="colon-col">:</td>
        <td class="value-col">${registrationData.riwayatKesehatan || 'Tidak Ada'}</td>
      </tr>
      <tr>
        <td class="label-col">Harapan / Catatan Wali</td>
        <td class="colon-col">:</td>
        <td class="value-col">${registrationData.catatanWali || 'Mengikuti pembinaan kurikulum TPQ secara tertib dan berakhlak mulia.'}</td>
      </tr>
    </table>
  </div>

  <!-- IV. Lembar Placement Test (Khusus Penguji) -->
  <div class="section-box">
    <div class="section-heading">IV. Lembar Observasi &amp; Penempatan Kelas (Diisi Oleh Asatidz Penguji)</div>
    <table class="placement-test-table">
      <thead>
        <tr>
          <th style="width: 25%;">Komponen Penilaian</th>
          <th style="width: 25%;">Hasil Observasi / Skor</th>
          <th style="width: 50%;">Rekomendasi Penempatan Kelas</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Makharijul Huruf</td>
          <td>[  ] A  [  ] B  [  ] C</td>
          <td rowspan="3" style="vertical-align: middle;">
            <div>[  ] <strong>Kelas Iqra 1 – 3</strong> (Dasar)</div>
            <div>[  ] <strong>Kelas Iqra 4 – 6</strong> (Menengah)</div>
            <div>[  ] <strong>Kelas Al-Qur'an &amp; Tajwid</strong></div>
            <div>[  ] <strong>Kelas Tahfiz Juz 30</strong></div>
            <div style="margin-top: 6px; font-size: 8.5pt;">Catatan Penguji: _________________________________</div>
          </td>
        </tr>
        <tr>
          <td>Kelancaran Membaca</td>
          <td>[  ] A  [  ] B  [  ] C</td>
        </tr>
        <tr>
          <td>Adab &amp; Kemandirian</td>
          <td>[  ] A  [  ] B  [  ] C</td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- V. Tanda Tangan -->
  <div class="sig-grid">
    <div class="sig-col">
      <div>Batam, .................................... 2026</div>
      <div>Orang Tua / Wali Santri,</div>
      <div class="sig-space"></div>
      <div class="sig-name">( ${registrationData.namaAyah || registrationData.namaIbu || 'Wali Santri'} )</div>
    </div>
    <div class="sig-col">
      <div>Mengetahui,</div>
      <div>Kepala / Penguji TPQ Al Mardhotillah,</div>
      <div class="sig-space"></div>
      <div class="sig-name">( Ustadzah Pembina TPQ )</div>
    </div>
  </div>

  <div class="print-footer">
    Dokumen Resmi Penerimaan Santri Baru TPQ Al Mardhotillah · DKM Masjid Al Ikhlas CGV Batam · Dicetak secara digital
  </div>
</body>
</html>
  `;
}

/**
 * Open Print Window to Save as PDF or Print directly
 */
export function printRegistrationPdf(registrationData) {
  const html = generateRegistrationPdfHtml(registrationData);
  const printWindow = window.open('', '_blank', 'width=850,height=950');
  if (!printWindow) {
    alert('Pop-up terblokir oleh browser. Mohon izinkan pop-up untuk mencetak / mendownload PDF formulir pendaftaran.');
    return;
  }
  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();

  // Trigger print after rendering
  printWindow.onload = () => {
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 400);
  };
}
