import React, { useState, useEffect } from 'react';
import { printRegistrationPdf } from '../../utils/tpqRegistrationPdfGenerator.js';
import '../../styles/dashboard.css';

const LOCAL_STORAGE_REG_KEY = 'alikhlas_tpq_registrations_v1';

const INITIAL_MOCK_REGISTRATIONS = [
  {
    id: 'reg-001',
    registrationNumber: 'REG-TPQ-260901',
    submittedAt: '2026-09-02T08:30:00.000Z',
    namaLengkap: 'Muhammad Fatih Al-Faruq',
    namaPanggilan: 'Fatih',
    jenisKelamin: 'L',
    tempatLahir: 'Batam',
    tanggalLahir: '2020-05-14',
    usiaSantri: '6',
    anakKe: '1',
    jumlahSaudara: '2',
    sekolahAsal: 'TK Islam Cipta Greenville',
    kemampuanAwal: 'Iqra 1',
    namaAyah: 'Ahmad Fauzi, S.T.',
    namaIbu: 'Siti Rahmah',
    noWhatsApp: '081270123456',
    pekerjaanOrtu: 'Karyawan Swasta',
    alamatBlok: 'Blok B No. 12',
    alamatLengkap: 'Perumahan Cipta Greenville, Tembesi, Batam',
    riwayatKesehatan: 'Sehat / Tidak Ada Riwayat Khusus',
    catatanWali: 'Mohon dibimbing hafalan surat-surat pendek dan adab harian santri.',
    status: 'Menunggu Verifikasi & Placement Test',
  },
  {
    id: 'reg-002',
    registrationNumber: 'REG-TPQ-260902',
    submittedAt: '2026-09-03T14:15:00.000Z',
    namaLengkap: 'Aisyah Humaira Azzahra',
    namaPanggilan: 'Aisyah',
    jenisKelamin: 'P',
    tempatLahir: 'Batam',
    tanggalLahir: '2019-11-20',
    usiaSantri: '7',
    anakKe: '2',
    jumlahSaudara: '3',
    sekolahAsal: 'SDIT Al-Ikhlas Batam',
    kemampuanAwal: 'Iqra 2 - 3',
    namaAyah: 'Hendri Pratama',
    namaIbu: 'Nurul Hidayah',
    noWhatsApp: '081364556677',
    pekerjaanOrtu: 'Wiraswasta',
    alamatBlok: 'Blok D No. 05',
    alamatLengkap: 'Perumahan Cipta Greenville, Tembesi, Batam',
    riwayatKesehatan: 'Tidak Ada Riwayat Khusus',
    catatanWali: 'Sudah mengenal huruf sambung, ingin memperlancar bacaan tartil.',
    status: 'Menunggu Verifikasi & Placement Test',
  },
];

export default function TPQRegistrationInbox() {
  const [registrations, setRegistrations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('Semua');
  const [selectedReg, setSelectedReg] = useState(null);
  const [toastMsg, setToastMsg] = useState('');

  const loadData = () => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_REG_KEY);
      if (saved) {
        setRegistrations(JSON.parse(saved));
      } else {
        localStorage.setItem(LOCAL_STORAGE_REG_KEY, JSON.stringify(INITIAL_MOCK_REGISTRATIONS));
        setRegistrations(INITIAL_MOCK_REGISTRATIONS);
      }
    } catch (e) {
      console.error('Error reading TPQ registrations:', e);
      setRegistrations(INITIAL_MOCK_REGISTRATIONS);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleUpdateStatus = (id, newStatus) => {
    const updated = registrations.map((r) => (r.id === id ? { ...r, status: newStatus } : r));
    setRegistrations(updated);
    try {
      localStorage.setItem(LOCAL_STORAGE_REG_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    if (selectedReg && selectedReg.id === id) {
      setSelectedReg({ ...selectedReg, status: newStatus });
    }
    showToast(`Status berhasil diperbarui: ${newStatus}`);
  };

  const handlePrintPdf = (reg) => {
    printRegistrationPdf(reg);
  };

  const filteredRegistrations = registrations.filter((item) => {
    const matchSearch =
      (item.namaLengkap || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.namaAyah || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.registrationNumber || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.alamatBlok || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchStatus = filterStatus === 'Semua' || item.status.toLowerCase().includes(filterStatus.toLowerCase());

    return matchSearch && matchStatus;
  });

  return (
    <div className="tpq-registration-inbox-container">
      {/* Toast */}
      {toastMsg && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: '#0c2b1d',
          color: '#f3d082',
          padding: '12px 20px',
          borderRadius: '8px',
          border: '1px solid #c9a55a',
          boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
          zIndex: 9999,
          fontWeight: 'bold',
          fontSize: '0.9rem',
        }}>
          {toastMsg}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <h2 style={{ margin: '0 0 6px 0', fontSize: '1.4rem', color: 'var(--color-slate-900, #0f172a)' }}>
            📥 Inbox Pendaftaran Santri Baru (Online)
          </h2>
          <p style={{ margin: 0, fontSize: '0.9rem', color: '#64748b' }}>
            Daftar calon santri TPQ Al-Mardhotillah yang masuk melalui formulir online website. Cetak berkas PDF untuk lembar tes penempatan.
          </p>
        </div>

        <button
          onClick={loadData}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            background: '#f1f5f9',
            border: '1px solid #cbd5e1',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          🔄 Segarkan Data
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Cari nama santri, wali, no. registrasi, blok..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            flex: 1,
            minWidth: '240px',
            padding: '10px 14px',
            borderRadius: '8px',
            border: '1px solid #cbd5e1',
            fontSize: '0.9rem',
          }}
        />

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{
            padding: '10px 14px',
            borderRadius: '8px',
            border: '1px solid #cbd5e1',
            fontSize: '0.9rem',
            background: '#fff',
            fontWeight: 600,
          }}
        >
          <option value="Semua">Semua Status Pendaftaran</option>
          <option value="Menunggu">Menunggu Verifikasi &amp; Test</option>
          <option value="Diterima">Diterima di Kelas</option>
        </select>
      </div>

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', color: '#475569' }}>
                <th style={{ padding: '12px 16px' }}>No. Registrasi &amp; Tanggal</th>
                <th style={{ padding: '12px 16px' }}>Nama Santri &amp; Usia</th>
                <th style={{ padding: '12px 16px' }}>Nama Orang Tua / Wali</th>
                <th style={{ padding: '12px 16px' }}>Kemampuan Awal</th>
                <th style={{ padding: '12px 16px' }}>Status</th>
                <th style={{ padding: '12px 16px', textAlign: 'center' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredRegistrations.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ padding: '32px 16px', textAlign: 'center', color: '#94a3b8' }}>
                    Belum ada data pendaftaran yang sesuai dengan pencarian.
                  </td>
                </tr>
              ) : (
                filteredRegistrations.map((reg) => (
                  <tr key={reg.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 16px' }}>
                      <strong style={{ color: '#0f172a', display: 'block' }}>{reg.registrationNumber}</strong>
                      <small style={{ color: '#64748b' }}>
                        {reg.submittedAt ? new Date(reg.submittedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                      </small>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ fontWeight: 700, color: '#0f172a' }}>{reg.namaLengkap}</div>
                      <small style={{ color: '#64748b' }}>
                        {reg.jenisKelamin === 'L' ? '👦 Ikhwan' : '👧 Akhwat'} · {reg.usiaSantri ? `${reg.usiaSantri} th` : '-'}
                      </small>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ fontWeight: 600 }}>{reg.namaAyah || reg.namaIbu}</div>
                      <small style={{ color: '#64748b' }}>
                        WA: <a href={`https://wa.me/${reg.noWhatsApp?.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" style={{ color: '#0284c7', textDecoration: 'none' }}>{reg.noWhatsApp}</a> · {reg.alamatBlok}
                      </small>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ background: '#f1f5f9', padding: '3px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600 }}>
                        {reg.kemampuanAwal}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '4px 10px',
                        borderRadius: '999px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        background: reg.status.includes('Diterima') ? '#dcfce7' : '#fef9c3',
                        color: reg.status.includes('Diterima') ? '#15803d' : '#854d0e',
                      }}>
                        {reg.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                        <button
                          onClick={() => handlePrintPdf(reg)}
                          title="Cetak / Unduh Formulir PDF"
                          style={{
                            background: '#0d4a2b',
                            color: '#fff',
                            border: 'none',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          📄 PDF
                        </button>
                        <button
                          onClick={() => setSelectedReg(reg)}
                          style={{
                            background: '#e2e8f0',
                            color: '#1e293b',
                            border: 'none',
                            padding: '6px 10px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                          }}
                        >
                          Detail
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Detail & Actions */}
      {selectedReg && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px',
        }}>
          <div style={{
            background: '#fff',
            borderRadius: '16px',
            maxWidth: '650px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '24px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #e2e8f0', paddingBottom: '14px', marginBottom: '16px' }}>
              <div>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0d4a2b', textTransform: 'uppercase' }}>
                  Berkas Pendaftaran TPQ
                </span>
                <h3 style={{ margin: '2px 0', fontSize: '1.25rem', color: '#0f172a' }}>{selectedReg.namaLengkap}</h3>
                <small style={{ color: '#64748b' }}>No. Registrasi: {selectedReg.registrationNumber}</small>
              </div>
              <button
                onClick={() => setSelectedReg(null)}
                style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px', fontSize: '0.9rem', marginBottom: '20px' }}>
              <div>
                <small style={{ color: '#64748b', display: 'block' }}>Nama Panggilan</small>
                <strong>{selectedReg.namaPanggilan || '-'}</strong>
              </div>
              <div>
                <small style={{ color: '#64748b', display: 'block' }}>Tempat / Tgl Lahir</small>
                <strong>{selectedReg.tempatLahir}, {selectedReg.tanggalLahir} ({selectedReg.usiaSantri} Th)</strong>
              </div>
              <div>
                <small style={{ color: '#64748b', display: 'block' }}>Orang Tua (Ayah / Ibu)</small>
                <strong>{selectedReg.namaAyah} / {selectedReg.namaIbu}</strong>
              </div>
              <div>
                <small style={{ color: '#64748b', display: 'block' }}>No. WhatsApp Wali</small>
                <strong>{selectedReg.noWhatsApp}</strong>
              </div>
              <div>
                <small style={{ color: '#64748b', display: 'block' }}>Alamat Greenville</small>
                <strong>{selectedReg.alamatBlok}</strong>
              </div>
              <div>
                <small style={{ color: '#64748b', display: 'block' }}>Kemampuan Bacaan Awal</small>
                <strong style={{ color: '#0d4a2b' }}>{selectedReg.kemampuanAwal}</strong>
              </div>
            </div>

            {selectedReg.catatanWali && (
              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.85rem' }}>
                <strong style={{ color: '#334155' }}>Catatan / Harapan Orang Tua:</strong>
                <p style={{ margin: '4px 0 0', color: '#475569' }}>{selectedReg.catatanWali}</p>
              </div>
            )}

            {/* Quick Status Update */}
            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '16px', marginBottom: '20px' }}>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '8px', color: '#334155' }}>
                Ubah Status Calon Santri:
              </label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => handleUpdateStatus(selectedReg.id, 'Jadwal Placement Test')}
                  style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#f8fafc', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
                >
                  📅 Jadwalkan Placement Test
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdateStatus(selectedReg.id, 'Diterima - Kelas Iqra 1–3')}
                  style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #16a34a', background: '#dcfce7', color: '#15803d', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700 }}
                >
                  ✓ Terima di Iqra 1–3
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdateStatus(selectedReg.id, 'Diterima - Kelas Al-Qur\'an')}
                  style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #16a34a', background: '#dcfce7', color: '#15803d', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700 }}
                >
                  ✓ Terima di Al-Qur'an
                </button>
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => handlePrintPdf(selectedReg)}
                style={{
                  background: '#0d4a2b',
                  color: '#fff',
                  border: 'none',
                  padding: '10px 18px',
                  borderRadius: '8px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                📄 Cetak / Download PDF Formulir Resmi
              </button>

              <button
                type="button"
                onClick={() => setSelectedReg(null)}
                style={{
                  background: '#f1f5f9',
                  border: '1px solid #cbd5e1',
                  padding: '10px 16px',
                  borderRadius: '8px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
