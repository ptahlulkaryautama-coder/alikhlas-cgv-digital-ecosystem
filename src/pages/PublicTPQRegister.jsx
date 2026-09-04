import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/website/Header.jsx';
import Footer from '../components/website/Footer.jsx';
import Container from '../components/common/Container.jsx';
import { printRegistrationPdf } from '../utils/tpqRegistrationPdfGenerator.js';
import '../styles/tpqRegister.css';

const LOCAL_STORAGE_REG_KEY = 'alikhlas_tpq_registrations_v1';

export default function PublicTPQRegister() {
  const [formData, setFormData] = useState({
    namaLengkap: '',
    namaPanggilan: '',
    jenisKelamin: 'L',
    tempatLahir: 'Batam',
    tanggalLahir: '',
    usiaSantri: '',
    anakKe: '1',
    jumlahSaudara: '2',
    sekolahAsal: '',
    kemampuanAwal: 'Iqra 1',
    namaAyah: '',
    namaIbu: '',
    noWhatsApp: '',
    pekerjaanOrtu: '',
    alamatBlok: '',
    alamatLengkap: 'Perumahan Cipta Greenville, Kel. Tembesi, Kec. Sagulung, Batam',
    riwayatKesehatan: 'Sehat / Tidak Ada Riwayat Khusus',
    catatanWali: '',
    persetujuan: false,
  });

  const [submittedData, setSubmittedData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.namaLengkap.trim() || !formData.namaAyah.trim() || !formData.noWhatsApp.trim()) {
      alert('Mohon lengkapi Nama Santri, Nama Orang Tua/Wali, dan Nomor WhatsApp aktif.');
      return;
    }

    if (!formData.persetujuan) {
      alert('Mohon centang persetujuan tata tertib dan komitmen belajar TPQ.');
      return;
    }

    setIsSubmitting(true);

    const regNumber = `REG-TPQ-${Date.now().toString().slice(-6)}`;
    const finalRecord = {
      ...formData,
      id: `reg-${Date.now()}`,
      registrationNumber: regNumber,
      submittedAt: new Date().toISOString(),
      status: 'Menunggu Verifikasi & Placement Test',
    };

    // Save to local storage for Admin Dashboard integration
    try {
      const existing = JSON.parse(localStorage.getItem(LOCAL_STORAGE_REG_KEY) || '[]');
      localStorage.setItem(LOCAL_STORAGE_REG_KEY, JSON.stringify([finalRecord, ...existing]));
    } catch (err) {
      console.error('Error saving TPQ registration locally:', err);
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedData(finalRecord);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 600);
  };

  const handleDownloadPdf = () => {
    if (submittedData) {
      printRegistrationPdf(submittedData);
    }
  };

  const getWhatsAppConfirmationUrl = () => {
    if (!submittedData) return '#';
    const text = `Assalamu'alaikum Pengurus TPQ Al-Mardhotillah,\n\nSaya telah mendaftarkan calon santri baru secara online melalui website:\n• No. Registrasi: ${submittedData.registrationNumber}\n• Nama Santri: ${submittedData.namaLengkap} (${submittedData.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'})\n• Nama Wali: ${submittedData.namaAyah || submittedData.namaIbu}\n• No. WA: ${submittedData.noWhatsApp}\n• Pilihan Awal: ${submittedData.kemampuanAwal}\n\nMohon konfirmasi dan informasi jadwal placement test selanjutnya. Terima kasih.`;
    return `https://wa.me/6281375410997?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="tpq-register-page">
      <Header />

      <main className="tpq-register-main">
        <Container size="lg">
          <div className="tpq-reg-hero">
            <div className="tpq-reg-kicker">
              <span>Penerimaan Santri Baru</span>
              <span>·</span>
              <span>T.A. 2026/2027</span>
            </div>
            <h1 className="tpq-reg-title">Formulir Pendaftaran Santri</h1>
            <p className="tpq-reg-subtitle">
              TPQ Al-Mardhotillah — Masjid Al Ikhlas Cipta Greenville Batam. Silakan lengkapi data calon santri dan orang tua dengan benar.
            </p>
          </div>

          <div className="tpq-form-card">
            {submittedData ? (
              <div className="reg-success-card animate-fade-in">
                <div className="reg-success-icon">✓</div>
                <h2 className="reg-success-title">Pendaftaran Berhasil Dikirim!</h2>
                <div className="reg-success-number-pill">
                  No. Registrasi: {submittedData.registrationNumber}
                </div>
                <p style={{ color: 'rgba(255,255,255,0.85)', lineHeight: 1.6, maxWidth: '580px', margin: '0 auto 20px auto' }}>
                  Alhamdulillah, data calon santri <strong>{submittedData.namaLengkap}</strong> telah terdaftar di sistem DKM TPQ Al-Mardhotillah. Anda dapat mengunduh formulir bukti PDF atau langsung konfirmasi ke nomor WhatsApp pengurus.
                </p>

                <div className="reg-success-actions">
                  <button type="button" onClick={handleDownloadPdf} className="btn-pdf-action">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                      <polyline points="10 9 9 9 8 9" />
                    </svg>
                    <span>Cetak / Download PDF Bukti Pendaftaran</span>
                  </button>

                  <a
                    href={getWhatsAppConfirmationUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-wa-action"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.062-2.126-.525-1.782-.731-2.909-2.551-3.003-2.673-.088-.124-.724-.962-.724-1.836 0-.875.459-1.306.621-1.483.162-.178.353-.223.47-.223.118 0 .235.002.338.007.108.005.253-.04.396.304.148.353.504 1.233.548 1.323.045.09.074.195.015.313-.059.12-.089.195-.176.299-.089.104-.187.233-.267.313-.089.09-.182.188-.078.367.103.178.46 1.155 1.048 1.678.756.674 1.393.882 1.591.98.198.099.314.086.43-.048.118-.135.504-.585.639-.787.135-.202.27-.168.455-.101.185.067 1.173.553 1.376.654.202.101.337.151.386.236.049.085.049.495-.095.9z"/>
                    </svg>
                    <span>Konfirmasi ke WhatsApp Pengurus TPQ</span>
                  </a>

                  <Link to="/tpq" className="button button-outline" style={{ marginTop: '10px' }}>
                    ← Kembali ke Halaman Profil TPQ
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                {/* ── Fieldset 1: Data Santri ── */}
                <fieldset className="form-fieldset">
                  <legend className="fieldset-legend">
                    <span className="legend-icon" aria-hidden="true">🧒</span>
                    <span>I. Biodata Calon Santri</span>
                  </legend>

                  <div className="form-group">
                    <label htmlFor="namaLengkap">
                      Nama Lengkap Santri <span className="req">*</span>
                    </label>
                    <input
                      id="namaLengkap"
                      name="namaLengkap"
                      type="text"
                      required
                      placeholder="Contoh: Muhammad Fatih Al-Faruq"
                      value={formData.namaLengkap}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>

                  <div className="form-grid-2">
                    <div className="form-group">
                      <label htmlFor="namaPanggilan">
                        Nama Panggilan <span className="req">*</span>
                      </label>
                      <input
                        id="namaPanggilan"
                        name="namaPanggilan"
                        type="text"
                        required
                        placeholder="Contoh: Fatih"
                        value={formData.namaPanggilan}
                        onChange={handleChange}
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="jenisKelamin">
                        Jenis Kelamin <span className="req">*</span>
                      </label>
                      <select
                        id="jenisKelamin"
                        name="jenisKelamin"
                        value={formData.jenisKelamin}
                        onChange={handleChange}
                        className="form-select"
                      >
                        <option value="L">Laki-laki (Ikhwan)</option>
                        <option value="P">Perempuan (Akhwat)</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-grid-2">
                    <div className="form-group">
                      <label htmlFor="tempatLahir">Tempat Lahir</label>
                      <input
                        id="tempatLahir"
                        name="tempatLahir"
                        type="text"
                        placeholder="Kota kelahiran"
                        value={formData.tempatLahir}
                        onChange={handleChange}
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="tanggalLahir">
                        Tanggal Lahir <span className="req">*</span>
                      </label>
                      <input
                        id="tanggalLahir"
                        name="tanggalLahir"
                        type="date"
                        required
                        value={formData.tanggalLahir}
                        onChange={handleChange}
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-grid-2">
                    <div className="form-group">
                      <label htmlFor="usiaSantri">Usia Saat Ini (Tahun)</label>
                      <input
                        id="usiaSantri"
                        name="usiaSantri"
                        type="number"
                        min="4"
                        max="17"
                        placeholder="Contoh: 6"
                        value={formData.usiaSantri}
                        onChange={handleChange}
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="kemampuanAwal">
                        Kemampuan Membaca Saat Ini <span className="req">*</span>
                      </label>
                      <select
                        id="kemampuanAwal"
                        name="kemampuanAwal"
                        value={formData.kemampuanAwal}
                        onChange={handleChange}
                        className="form-select"
                      >
                        <option value="Belum Pernah Belajar">Belum Pernah Belajar (Mulai dari Nol)</option>
                        <option value="Iqra 1">Iqra 1 (Pengenalan Hijaiyah Tunggal)</option>
                        <option value="Iqra 2 - 3">Iqra 2 – 3 (Huruf Sambung & Mad Dasar)</option>
                        <option value="Iqra 4 - 6">Iqra 4 – 6 (Sukun, Tanwin, Tajwid)</option>
                        <option value="Al-Qur'an 30 Juz">Sudah Masuk Al-Qur'an (Tahsin Lanjutan)</option>
                        <option value="Program Tahfiz Juz 30">Program Khusus Tahfiz Juz 30</option>
                      </select>
                    </div>
                  </div>
                </fieldset>

                {/* ── Fieldset 2: Data Orang Tua / Wali ── */}
                <fieldset className="form-fieldset">
                  <legend className="fieldset-legend">
                    <span className="legend-icon" aria-hidden="true">👨‍👩‍👧</span>
                    <span>II. Data Orang Tua / Wali</span>
                  </legend>

                  <div className="form-grid-2">
                    <div className="form-group">
                      <label htmlFor="namaAyah">
                        Nama Ayah / Wali <span className="req">*</span>
                      </label>
                      <input
                        id="namaAyah"
                        name="namaAyah"
                        type="text"
                        required
                        placeholder="Nama lengkap ayah/wali"
                        value={formData.namaAyah}
                        onChange={handleChange}
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="namaIbu">Nama Ibu Kandung</label>
                      <input
                        id="namaIbu"
                        name="namaIbu"
                        type="text"
                        placeholder="Nama lengkap ibu"
                        value={formData.namaIbu}
                        onChange={handleChange}
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-grid-2">
                    <div className="form-group">
                      <label htmlFor="noWhatsApp">
                        Nomor WhatsApp Aktif <span className="req">*</span>
                      </label>
                      <input
                        id="noWhatsApp"
                        name="noWhatsApp"
                        type="tel"
                        required
                        placeholder="Contoh: 081234567890"
                        value={formData.noWhatsApp}
                        onChange={handleChange}
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="pekerjaanOrtu">Pekerjaan Orang Tua</label>
                      <input
                        id="pekerjaanOrtu"
                        name="pekerjaanOrtu"
                        type="text"
                        placeholder="Karyawan Swasta / Wiraswasta / PNS / dll"
                        value={formData.pekerjaanOrtu}
                        onChange={handleChange}
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="alamatBlok">
                      Alamat / Blok Rumah di Cipta Greenville <span className="req">*</span>
                    </label>
                    <input
                      id="alamatBlok"
                      name="alamatBlok"
                      type="text"
                      required
                      placeholder="Contoh: Blok B No. 12 atau Townhouse No. 05"
                      value={formData.alamatBlok}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>
                </fieldset>

                {/* ── Fieldset 3: Riwayat & Catatan Khusus ── */}
                <fieldset className="form-fieldset">
                  <legend className="fieldset-legend">
                    <span className="legend-icon" aria-hidden="true">📋</span>
                    <span>III. Catatan &amp; Harapan Wali</span>
                  </legend>

                  <div className="form-group">
                    <label htmlFor="riwayatKesehatan">Riwayat Alergi / Catatan Kesehatan Santri</label>
                    <input
                      id="riwayatKesehatan"
                      name="riwayatKesehatan"
                      type="text"
                      placeholder="Tulis jika ada alergi atau catatan medis tertentu"
                      value={formData.riwayatKesehatan}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="catatanWali">Harapan Pembinaan / Catatan Tambahan</label>
                    <textarea
                      id="catatanWali"
                      name="catatanWali"
                      placeholder="Harapan orang tua terhadap akhlak, hafalan, atau kedisiplinan santri di TPQ..."
                      value={formData.catatanWali}
                      onChange={handleChange}
                      className="form-textarea"
                    />
                  </div>
                </fieldset>

                {/* ── Persetujuan ── */}
                <div className="form-checkbox-group">
                  <input
                    type="checkbox"
                    id="persetujuan"
                    name="persetujuan"
                    checked={formData.persetujuan}
                    onChange={handleChange}
                  />
                  <label htmlFor="persetujuan">
                    Saya menyatakan data yang diisikan adalah benar, dan bersedia mematuhi tata tertib pembelajaran serta mendukung program bimbingan santri di <strong>TPQ Al-Mardhotillah Masjid Al Ikhlas CGV</strong>.
                  </label>
                </div>

                <div className="form-submit-row">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-submit-reg"
                  >
                    {isSubmitting ? (
                      <span>Memproses Pendaftaran...</span>
                    ) : (
                      <>
                        <span>Kirim Pendaftaran Santri Baru</span>
                        <span aria-hidden="true">→</span>
                      </>
                    )}
                  </button>

                  <Link to="/tpq" style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.9rem', marginTop: '10px' }}>
                    Batalkan dan kembali ke halaman profil TPQ
                  </Link>
                </div>
              </form>
            )}
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
