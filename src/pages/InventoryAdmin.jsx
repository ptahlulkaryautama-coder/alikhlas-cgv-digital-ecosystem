/**
 * InventoryAdmin.jsx — Protected Inventaris & Manajemen Aset module page
 *
 * Route: /app/inventaris (protected by ProtectedRoute)
 *
 * Provides:
 * - Asset inventory management matching legacy DKM Al Ikhlas
 * - Sheet 06_Inventaris structure
 * - Filter & Search by category and condition
 * - Interactive modal for creating/editing assets
 * - PDF / Print export feature
 */

import React, { useState } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout.jsx';
import { mockInventoryData } from '../data/inventoryData.js';
import '../styles/dashboard.css';
import '../styles/financeAdmin.css';

const CATEGORY_ICONS = {
  'Elektronik': '💻',
  'Furnitur': '🪑',
  'Kebersihan': '🧹',
  'Sound System': '🎙️',
  'Keamanan': '🔒',
  'Lainnya': '📦',
};

const CONDITION_PILLS = {
  'Baik': 'fin-pill-green',
  'Perlu Servis': 'fin-pill-yellow',
  'Rusak': 'fin-pill-red',
};

export default function InventoryAdmin() {
  const [inventory, setInventory] = useState(mockInventoryData);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [conditionFilter, setConditionFilter] = useState('');

  // Modal states
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    nama: '',
    kategori: 'Elektronik',
    jumlah: 1,
    kondisi: 'Baik',
    lokasi: '',
    tanggal: new Date().toISOString().slice(0, 10),
    harga: 0,
    keterangan: '',
  });

  // Calculate KPI metrics
  const totalAssets = inventory.reduce((acc, curr) => acc + curr.jumlah, 0);
  const baikAssets = inventory.filter(i => i.kondisi === 'Baik').reduce((acc, curr) => acc + curr.jumlah, 0);
  const servisAssets = inventory.filter(i => i.kondisi === 'Perlu Servis').reduce((acc, curr) => acc + curr.jumlah, 0);
  const rusakAssets = inventory.filter(i => i.kondisi === 'Rusak').reduce((acc, curr) => acc + curr.jumlah, 0);

  // Filtered rows
  const filteredRows = inventory.filter(item => {
    if (categoryFilter && item.kategori !== categoryFilter) return false;
    if (conditionFilter && item.kondisi !== conditionFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      const matchName = item.nama.toLowerCase().includes(q);
      const matchLoc = item.lokasi.toLowerCase().includes(q);
      const matchKet = (item.keterangan || '').toLowerCase().includes(q);
      if (!matchName && !matchLoc && !matchKet) return false;
    }
    return true;
  });

  // Handle open modal for create / edit
  const handleOpenModal = (asset = null) => {
    if (asset) {
      setSelectedAsset(asset);
      setFormData({
        id: asset.id,
        nama: asset.nama,
        kategori: asset.kategori,
        jumlah: asset.jumlah,
        kondisi: asset.kondisi,
        lokasi: asset.lokasi,
        tanggal: asset.tanggal,
        harga: asset.harga || 0,
        keterangan: asset.keterangan || '',
      });
    } else {
      setSelectedAsset(null);
      setFormData({
        id: null,
        nama: '',
        kategori: 'Elektronik',
        jumlah: 1,
        kondisi: 'Baik',
        lokasi: '',
        tanggal: new Date().toISOString().slice(0, 10),
        harga: 0,
        keterangan: '',
      });
    }
    setIsModalOpen(true);
  };

  // Handle save asset
  const handleSaveAsset = (e) => {
    e.preventDefault();
    if (!formData.nama.trim()) return;

    if (formData.id) {
      // Edit existing
      setInventory(prev => prev.map(item => item.id === formData.id ? { ...formData } : item));
    } else {
      // Add new
      const newId = inventory.length ? Math.max(...inventory.map(i => i.id)) + 1 : 1;
      setInventory(prev => [{ ...formData, id: newId }, ...prev]);
    }
    setIsModalOpen(false);
  };

  // Handle delete asset
  const handleDeleteAsset = (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus aset ini dari daftar inventaris?')) return;
    setInventory(prev => prev.filter(i => i.id !== id));
    setIsModalOpen(false);
  };

  // Handle Print / PDF export
  const handlePrint = () => {
    window.print();
  };

  return (
    <DashboardLayout
      title="Inventaris"
      subtitle="Manajemen Aset &amp; Peralatan Masjid"
      activeId="inventaris"
      period="Juli 2026"
    >
      <div className="db-page-container">
        {/* ── Top Module Banner ────────────────────────────────────────── */}
        <div className="db-top-banner">
          <div className="db-banner-icon">📦</div>
          <div className="db-banner-content">
            <div className="db-banner-title">Manajemen Inventaris &amp; Aset DKM</div>
            <div className="db-banner-sub">Masjid Al Ikhlas Cipta Greenville · DKM Al Ikhlas CGV</div>
          </div>
        </div>

        {/* ── Page Header ────────────────────────────────────────────── */}
        <div className="db-pg-header" style={{ flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div className="db-pg-eyebrow">Pengelolaan Aset</div>
            <h1 className="db-pg-title">
              Daftar Inventaris<br />
              <em>&amp; Peralatan Masjid</em>
            </h1>
            <p className="db-pg-desc">
              Pencatatan aset, sarana ibadah, sound system, &amp; barang milik DKM Masjid Al Ikhlas
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            <button 
              className="fin-btn" 
              onClick={handlePrint}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              📥 Cetak / PDF
            </button>
            <button 
              className="fin-btn" 
              onClick={() => handleOpenModal()}
              style={{ background: 'var(--db-forest-mid)', color: '#fff', border: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              ➕ Tambah Aset
            </button>
          </div>
        </div>

        {/* ── KPI Cards ────────────────────────────────────────────────── */}
        <div className="db-kpi-4-grid">
          <div 
            style={{
              background: 'var(--db-up-bg)',
              border: '1px solid rgba(15,97,48,.12)',
              borderRadius: '12px',
              padding: '16px',
              boxShadow: 'var(--db-sh-sm)',
            }}
          >
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--db-text-3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Total Aset
            </div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--db-up-text)', margin: '6px 0 2px 0' }}>
              {totalAssets} <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--db-text-3)' }}>unit</span>
            </div>
            <div style={{ fontSize: '10.5px', color: 'var(--db-text-4)' }}>Seluruh barang terdaftar</div>
          </div>

          <div 
            style={{
              background: 'var(--db-bg-card)',
              border: '1px solid rgba(201,165,90,.25)',
              borderRadius: '12px',
              padding: '16px',
              boxShadow: 'var(--db-sh-sm)',
            }}
          >
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--db-text-3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Kondisi Baik
            </div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--db-forest-mid)', margin: '6px 0 2px 0' }}>
              {baikAssets} <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--db-text-3)' }}>unit</span>
            </div>
            <div style={{ fontSize: '10.5px', color: 'var(--db-text-4)' }}>Siap pakai &amp; beroperasi</div>
          </div>

          <div 
            style={{
              background: 'var(--db-warn-bg)',
              border: '1px solid rgba(122,75,10,.12)',
              borderRadius: '12px',
              padding: '16px',
              boxShadow: 'var(--db-sh-sm)',
            }}
          >
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--db-text-3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Perlu Servis
            </div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--db-warn-text)', margin: '6px 0 2px 0' }}>
              {servisAssets} <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--db-text-3)' }}>unit</span>
            </div>
            <div style={{ fontSize: '10.5px', color: 'var(--db-text-4)' }}>Membutuhkan pemeliharaan</div>
          </div>

          <div 
            style={{
              background: 'var(--db-down-bg)',
              border: '1px solid rgba(155,33,19,.12)',
              borderRadius: '12px',
              padding: '16px',
              boxShadow: 'var(--db-sh-sm)',
            }}
          >
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--db-text-3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Kondisi Rusak
            </div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--db-down-text)', margin: '6px 0 2px 0' }}>
              {rusakAssets} <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--db-text-3)' }}>unit</span>
            </div>
            <div style={{ fontSize: '10.5px', color: 'var(--db-text-4)' }}>Perlu perbaikan / ganti</div>
          </div>
        </div>

        {/* ── Filter & Search Bar ──────────────────────────────────────── */}
        <div 
          className="db-card"
          style={{ 
            marginTop: '20px', 
            marginBottom: '20px',
            padding: '14px 18px',
            display: 'flex', 
            gap: '12px', 
            flexWrap: 'wrap', 
            alignItems: 'center',
            background: 'var(--db-bg-card)',
            border: '1px solid rgba(12,24,16,.08)',
          }}
        >
          <input 
            type="text" 
            placeholder="Cari nama aset, lokasi, atau keterangan..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ 
              flex: 1, 
              minWidth: '220px',
              padding: '8px 14px',
              borderRadius: '8px',
              border: '1px solid rgba(12,24,16,.15)',
              fontSize: '13px',
              outline: 'none',
              fontFamily: 'inherit',
              background: 'var(--db-bg-card)',
              color: 'var(--db-text-1)',
            }}
          />

          <select 
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              border: '1px solid rgba(12,24,16,.15)',
              fontSize: '13px',
              outline: 'none',
              fontFamily: 'inherit',
              background: 'var(--db-bg-card)',
              color: 'var(--db-text-1)',
              fontWeight: 500,
            }}
          >
            <option value="">Semua Kategori</option>
            <option value="Elektronik">Elektronik</option>
            <option value="Furnitur">Furnitur</option>
            <option value="Kebersihan">Kebersihan</option>
            <option value="Sound System">Sound System</option>
            <option value="Keamanan">Keamanan</option>
            <option value="Lainnya">Lainnya</option>
          </select>

          <select 
            value={conditionFilter}
            onChange={(e) => setConditionFilter(e.target.value)}
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              border: '1px solid rgba(12,24,16,.15)',
              fontSize: '13px',
              outline: 'none',
              fontFamily: 'inherit',
              background: 'var(--db-bg-card)',
              color: 'var(--db-text-1)',
              fontWeight: 500,
            }}
          >
            <option value="">Semua Kondisi</option>
            <option value="Baik">Baik</option>
            <option value="Perlu Servis">Perlu Servis</option>
            <option value="Rusak">Rusak</option>
          </select>

          {(search || categoryFilter || conditionFilter) && (
            <button
              onClick={() => { setSearch(''); setCategoryFilter(''); setConditionFilter(''); }}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--db-text-3)',
                fontSize: '12px',
                cursor: 'pointer',
                fontWeight: 600,
                padding: '4px 8px',
              }}
            >
              Reset Filter
            </button>
          )}
        </div>

        {/* ── Inventory Table ──────────────────────────────────────────── */}
        <div className="db-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table className="fin-tx-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--db-bg-hover)', borderBottom: '1px solid rgba(12,24,16,.08)' }}>
                  <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '11.5px', color: 'var(--db-text-3)' }}>NAMA ASET</th>
                  <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '11.5px', color: 'var(--db-text-3)' }}>KATEGORI</th>
                  <th style={{ textAlign: 'center', padding: '12px 16px', fontSize: '11.5px', color: 'var(--db-text-3)' }}>JUMLAH</th>
                  <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '11.5px', color: 'var(--db-text-3)' }}>KONDISI</th>
                  <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '11.5px', color: 'var(--db-text-3)' }}>LOKASI</th>
                  <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '11.5px', color: 'var(--db-text-3)' }}>KETERANGAN</th>
                  <th style={{ textAlign: 'center', padding: '12px 16px', fontSize: '11.5px', color: 'var(--db-text-3)' }}>AKSI</th>
                </tr>
              </thead>
              <tbody>
                {filteredRows.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '40px 16px', color: 'var(--db-text-3)' }}>
                      <div style={{ fontSize: '28px', marginBottom: '8px' }}>📦</div>
                      <div style={{ fontWeight: 600, fontSize: '14px' }}>Tidak ada aset ditemukan</div>
                      <div style={{ fontSize: '12px', color: 'var(--db-text-4)' }}>Coba ubah kata kunci atau pilihan filter Anda.</div>
                    </td>
                  </tr>
                ) : (
                  filteredRows.map((item) => (
                    <tr key={item.id} style={{ borderBottom: '1px solid rgba(12,24,16,.05)' }}>
                      <td style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--db-text-1)', fontSize: '13px' }}>
                        <span style={{ marginRight: '8px' }}>{CATEGORY_ICONS[item.kategori] || '📦'}</span>
                        {item.nama}
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: '12px', color: 'var(--db-text-2)' }}>
                        <span className="fin-pill" style={{ background: 'var(--db-bg-inset)' }}>
                          {item.kategori}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 700, fontSize: '13px', color: 'var(--db-text-1)' }}>
                        {item.jumlah}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span className={`fin-pill ${CONDITION_PILLS[item.kondisi] || ''}`}>
                          {item.kondisi}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: '12.5px', color: 'var(--db-text-2)' }}>
                        {item.lokasi || '–'}
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: '12px', color: 'var(--db-text-3)', maxWidth: '240px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.keterangan || '–'}
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                        <button
                          onClick={() => handleOpenModal(item)}
                          className="fin-btn"
                          style={{ padding: '4px 10px', height: 'auto', fontSize: '11px' }}
                        >
                          ✏️ Edit
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div style={{ padding: '12px 16px', background: 'var(--db-bg-hover)', borderTop: '1px solid rgba(12,24,16,.06)', fontSize: '11.5px', color: 'var(--db-text-4)' }}>
            Menampilkan {filteredRows.length} dari {inventory.length} item inventaris terdaftar
          </div>
        </div>

        {/* ── Context Navigation / Quick Links ─────────────────────────── */}
        <div className="db-sec-eyebrow" style={{ marginTop: '32px' }}>Tautan Cepat</div>
        <div className="db-quick-link-grid">
          {[
            {
              icon: '📂',
              label: 'Laporan & Arsip',
              href: '/app/laporan',
              desc: 'Arsip laporan bulanan & pertanggungjawaban kegiatan.',
            },
            {
              icon: '💵',
              label: 'Buku Kas Keuangan',
              href: '/app/keuangan',
              desc: 'Buku kas keuangan internal DKM Al Ikhlas.',
            },
            {
              icon: '📊',
              label: 'Dashboard Utama',
              href: '/app',
              desc: 'Kembali ke ringkasan panel admin utama.',
            },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="db-quick-link-card"
            >
              <div className="card-icon-wrapper">
                {link.icon}
              </div>
              <div className="card-title">{link.label}</div>
              <div className="card-desc">{link.desc}</div>
            </a>
          ))}
        </div>
      </div>

      {/* ── Modal Add / Edit Asset ──────────────────────────────────── */}
      {isModalOpen && (
        <div
          onClick={() => setIsModalOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(8,25,18,.5)',
            backdropFilter: 'blur(4px)',
            zIndex: 999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            animation: 'dbFadeIn 0.2s ease',
          }}
        >
          <form
            onSubmit={handleSaveAsset}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#fdfcf9',
              borderRadius: '16px',
              border: '1px solid var(--db-gold-border)',
              boxShadow: 'var(--db-sh-lg)',
              maxWidth: '560px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              padding: '28px',
              gap: '16px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e5e5e5', paddingBottom: '12px' }}>
              <h3 style={{ margin: 0, fontFamily: 'DM Serif Display, Georgia, serif', fontSize: '20px', color: 'var(--color-forest)', fontWeight: 'normal' }}>
                {formData.id ? 'Edit Aset Inventaris' : 'Tambah Aset Baru'}
              </h3>
              <button 
                type="button" 
                onClick={() => setIsModalOpen(false)} 
                style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '16px', color: 'var(--db-text-3)' }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--db-text-2)', textTransform: 'uppercase', letterSpacing: '0.02em' }}>Nama Aset / Peralatan</label>
              <input 
                type="text" 
                required 
                placeholder="Contoh: Sound System Wireless..." 
                value={formData.nama}
                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(12,24,16,.15)', fontSize: '13.5px', fontFamily: 'inherit', outline: 'none', background: 'var(--db-bg-card)', color: 'var(--db-text-1)' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--db-text-2)', textTransform: 'uppercase', letterSpacing: '0.02em' }}>Kategori</label>
                <select 
                  value={formData.kategori} 
                  onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                  style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(12,24,16,.15)', fontSize: '13.5px', fontFamily: 'inherit', outline: 'none', background: 'var(--db-bg-card)', color: 'var(--db-text-1)' }}
                >
                  <option value="Elektronik">Elektronik</option>
                  <option value="Furnitur">Furnitur</option>
                  <option value="Kebersihan">Kebersihan</option>
                  <option value="Sound System">Sound System</option>
                  <option value="Keamanan">Keamanan</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--db-text-2)', textTransform: 'uppercase', letterSpacing: '0.02em' }}>Jumlah (Unit)</label>
                <input 
                  type="number" 
                  min="1" 
                  required 
                  value={formData.jumlah}
                  onChange={(e) => setFormData({ ...formData, jumlah: parseInt(e.target.value) || 1 })}
                  style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(12,24,16,.15)', fontSize: '13.5px', fontFamily: 'inherit', outline: 'none', background: 'var(--db-bg-card)', color: 'var(--db-text-1)' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--db-text-2)', textTransform: 'uppercase', letterSpacing: '0.02em' }}>Kondisi Aset</label>
                <select 
                  value={formData.kondisi} 
                  onChange={(e) => setFormData({ ...formData, kondisi: e.target.value })}
                  style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(12,24,16,.15)', fontSize: '13.5px', fontFamily: 'inherit', outline: 'none', background: 'var(--db-bg-card)', color: 'var(--db-text-1)' }}
                >
                  <option value="Baik">Baik</option>
                  <option value="Perlu Servis">Perlu Servis</option>
                  <option value="Rusak">Rusak</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--db-text-2)', textTransform: 'uppercase', letterSpacing: '0.02em' }}>Lokasi Penempatan</label>
                <input 
                  type="text" 
                  placeholder="Contoh: Ruang Utama, Gudang..." 
                  value={formData.lokasi}
                  onChange={(e) => setFormData({ ...formData, lokasi: e.target.value })}
                  style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(12,24,16,.15)', fontSize: '13.5px', fontFamily: 'inherit', outline: 'none', background: 'var(--db-bg-card)', color: 'var(--db-text-1)' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--db-text-2)', textTransform: 'uppercase', letterSpacing: '0.02em' }}>Keterangan &amp; Spesifikasi</label>
              <textarea 
                placeholder="Tulis spesifikasi atau catatan perbaikan..." 
                value={formData.keterangan}
                onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
                style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(12,24,16,.15)', fontSize: '13.5px', fontFamily: 'inherit', minHeight: '70px', outline: 'none', resize: 'vertical', background: 'var(--db-bg-card)', color: 'var(--db-text-1)' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', marginTop: '12px', borderTop: '1px solid #e5e5e5', paddingTop: '16px' }}>
              {formData.id ? (
                <button 
                  type="button" 
                  onClick={() => handleDeleteAsset(formData.id)}
                  style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #fca5a5', background: '#fee2e2', color: '#991b1b', cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit', fontSize: '12.5px' }}
                >
                  🗑️ Hapus Aset
                </button>
              ) : <div />}

              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #ccc', background: 'none', cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit', fontSize: '12.5px' }}
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  style={{ padding: '8px 20px', borderRadius: '8px', border: 'none', background: 'var(--db-forest-mid)', color: '#fff', cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit', fontSize: '12.5px' }}
                >
                  Simpan Aset
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* ── Page Footer ──────────────────────────────────────────────── */}
      <div className="db-pg-footer">
        <div className="db-pg-footer-id">
          <strong>DKM Masjid Al Ikhlas Cipta Greenville</strong> · Inventaris · Prototype v1 · Read-only
        </div>
        <div className="db-pg-footer-quote">
          "Dan apa saja yang kamu infakkan, Allah akan menggantinya dan Dialah Pemberi rezeki yang terbaik." (QS. Saba: 39)
        </div>
      </div>
    </DashboardLayout>
  );
}
