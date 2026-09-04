import React, { useState, useEffect, useRef } from 'react';
import { programs, agendaItems, pustakaIlmuItems, mediaDakwahItems } from '../../data/siteContent.js';
import '../../styles/dashboard.css';
import '../../styles/newsAdmin.css';

const LOCAL_STORAGE_KEY = 'alikhlas_dkm_content_vault_v1';

// Initial state builder
function getInitialData() {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Error loading local content:', e);
  }

  // Prepopulate categorized datasets from official siteContent.programs
  const kajianList = programs
    .filter((p) => !['bahasa arab', 'tahsin'].some((k) => (p.category || '').toLowerCase().includes(k)))
    .map((p, idx) => ({
      id: `kajian-${idx + 1}`,
      title: p.title,
      category: p.category,
      speaker: p.pemateri,
      schedule: p.schedule,
      location: p.location || 'Masjid Al Ikhlas CGV',
      description: p.description,
      image: idx % 2 === 0 ? '/src/assets/cerita-kajian-rutin.jpg' : '/src/assets/cerita-kajian-malam.jpg',
      status: 'Siap Publik',
      badgeColor: '#1A7A50',
    }));

  const kelasList = programs
    .filter((p) => ['bahasa arab', 'tahsin'].some((k) => (p.category || '').toLowerCase().includes(k)))
    .map((p, idx) => ({
      id: `kelas-${idx + 1}`,
      title: p.title,
      category: p.category,
      speaker: p.pemateri,
      schedule: p.schedule,
      location: p.location || 'Masjid Al Ikhlas CGV',
      description: p.description,
      image: '/src/assets/cerita-kajian-rutin.jpg',
      status: 'Aktif Berjalan',
      badgeColor: '#2B6CB0',
    }));

  return {
    kajian: kajianList,
    kelas: kelasList,
    pustaka: pustakaIlmuItems || [],
    media: mediaDakwahItems || [],
    arsip: agendaItems || [],
  };
}

export default function ProgramEntityManager() {
  const [data, setData] = useState(getInitialData);
  const [activeTab, setActiveTab] = useState('kajian'); // 'kajian' | 'kelas' | 'pustaka' | 'media' | 'arsip'
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal states
  const [editingItem, setEditingItem] = useState(null); // null when closed, object when open
  const [isNew, setIsNew] = useState(false);
  const [deleteConfirmItem, setDeleteConfirmItem] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  const fileInputRef = useRef(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }, [data]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const currentList = data[activeTab] || [];
  const filteredList = currentList.filter((item) => {
    const q = searchQuery.toLowerCase();
    return (
      (item.title || '').toLowerCase().includes(q) ||
      (item.category || '').toLowerCase().includes(q) ||
      (item.speaker || item.penulis || '').toLowerCase().includes(q) ||
      (item.description || '').toLowerCase().includes(q)
    );
  });

  // Open modal for Create New
  const handleAddNew = () => {
    const newItem = {
      id: `${activeTab}-${Date.now()}`,
      title: '',
      category: activeTab === 'kajian' ? 'Kajian Kitab' : activeTab === 'kelas' ? 'Kelas Belajar' : activeTab === 'pustaka' ? 'Kitab & Modul' : activeTab === 'media' ? 'Video Dakwah' : 'Kegiatan Warga',
      speaker: '',
      penulis: '',
      schedule: '',
      date: 'September 2026',
      location: 'Masjid Al Ikhlas CGV',
      description: '',
      image: '/src/assets/cerita-kajian-rutin.jpg',
      status: 'Siap Publik',
      fileUrl: '',
      videoUrl: '',
      type: '',
    };
    setIsNew(true);
    setEditingItem(newItem);
  };

  // Open modal for Edit
  const handleEdit = (item) => {
    setIsNew(false);
    setEditingItem({ ...item });
  };

  // Handle Save (Create or Update)
  const handleSave = (e) => {
    e.preventDefault();
    if (!editingItem.title.trim()) {
      alert('Judul / Nama item tidak boleh kosong.');
      return;
    }

    setData((prev) => {
      const list = prev[activeTab] || [];
      if (isNew) {
        return { ...prev, [activeTab]: [editingItem, ...list] };
      } else {
        return {
          ...prev,
          [activeTab]: list.map((item) => (item.id === editingItem.id ? editingItem : item)),
        };
      }
    });

    showToast(isNew ? `Berhasil menambahkan "${editingItem.title}"` : `Berhasil memperbarui "${editingItem.title}"`);
    setEditingItem(null);
  };

  // Handle Delete
  const handleDelete = () => {
    if (!deleteConfirmItem) return;
    setData((prev) => ({
      ...prev,
      [activeTab]: (prev[activeTab] || []).filter((item) => item.id !== deleteConfirmItem.id),
    }));
    showToast(`"${deleteConfirmItem.title}" telah dihapus.`);
    setDeleteConfirmItem(null);
  };

  // Handle Image File Upload (Instant Local Base64 preview)
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Mohon pilih berkas gambar (JPG, PNG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setEditingItem((prev) => ({
        ...prev,
        image: event.target?.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  // Reset to default
  const handleResetDefault = () => {
    if (confirm('Kembalikan semua data ke kondisi default awal? Data perubahan Anda akan direset.')) {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      setData(getInitialData());
      showToast('Data dikembalikan ke default.');
    }
  };

  return (
    <div style={{ marginBottom: '32px' }}>
      {/* Toast Alert */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            background: '#0c2b1d',
            color: '#FFFFFF',
            padding: '12px 20px',
            borderRadius: '10px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '13px',
            fontWeight: 600,
            animation: 'fadeIn 0.2s ease',
          }}
        >
          <span>✓</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header & Category Navigation Tabs */}
      <div className="db-card" style={{ padding: '20px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '16px' }}>
          <div>
            <div className="db-sec-eyebrow">PUSAT KONTEN &amp; DAKWAH DKM</div>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--db-text-1)', margin: '4px 0 2px 0' }}>
              Manajemen Konten Lengkap
            </h2>
            <p style={{ fontSize: '12.5px', color: 'var(--db-text-3)', margin: 0 }}>
              Kelola kajian, kelas belajar, arsip kegiatan warga, pustaka ilmu, serta media dakwah. Edit foto, ubah teks, atau tambahkan item baru.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              onClick={handleResetDefault}
              className="fin-btn"
              style={{ fontSize: '12px', padding: '7px 14px' }}
              title="Reset ke data awal"
            >
              🔄 Reset Default
            </button>
            <button
              type="button"
              onClick={handleAddNew}
              className="fin-btn fin-btn-primary"
              style={{ fontSize: '12px', padding: '7px 16px', fontWeight: 700 }}
            >
              + Tambah {activeTab === 'kajian' ? 'Kajian' : activeTab === 'kelas' ? 'Kelas' : activeTab === 'pustaka' ? 'Pustaka' : activeTab === 'media' ? 'Media' : 'Arsip'} Baru
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid rgba(12,24,16,.08)', paddingBottom: '12px', overflowX: 'auto' }}>
          {[
            { id: 'kajian', label: '📖 Kajian Rutin & Tematik', count: data.kajian?.length || 0 },
            { id: 'kelas', label: '🎓 Kelas Belajar & TPQ', count: data.kelas?.length || 0 },
            { id: 'pustaka', label: '📚 Pustaka Ilmu (Kitab/PDF)', count: data.pustaka?.length || 0 },
            { id: 'media', label: '🎥 Media Dakwah & Video', count: data.media?.length || 0 },
            { id: 'arsip', label: '🏛️ Arsip Kegiatan Warga', count: data.arsip?.length || 0 },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveTab(tab.id);
                setSearchQuery('');
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '8px',
                border: activeTab === tab.id ? '1px solid #0c2b1d' : '1px solid transparent',
                background: activeTab === tab.id ? '#0c2b1d' : 'rgba(12, 43, 29, 0.04)',
                color: activeTab === tab.id ? '#FFFFFF' : 'var(--db-text-2)',
                fontSize: '12.5px',
                fontWeight: activeTab === tab.id ? 700 : 500,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
              }}
            >
              <span>{tab.label}</span>
              <span
                style={{
                  fontSize: '11px',
                  padding: '1px 6px',
                  borderRadius: '12px',
                  background: activeTab === tab.id ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.06)',
                  color: activeTab === tab.id ? '#FFFFFF' : 'inherit',
                  fontWeight: 700,
                }}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Filter / Search Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '14px', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, maxWidth: '400px' }}>
            <input
              type="text"
              placeholder={`Cari dalam ${activeTab}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="article-filter-search"
              style={{ width: '100%', fontSize: '13px' }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="fin-btn"
                style={{ padding: '4px 8px', fontSize: '11px' }}
              >
                Clear
              </button>
            )}
          </div>

          <div style={{ fontSize: '12px', color: 'var(--db-text-4)' }}>
            Menampilkan <strong>{filteredList.length}</strong> dari {currentList.length} item
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      {filteredList.length === 0 ? (
        <div className="db-card" style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--db-text-4)' }}>
          <div style={{ fontSize: '32px', marginBottom: '10px' }}>🔍</div>
          <strong style={{ display: 'block', color: 'var(--db-text-2)', marginBottom: '4px' }}>Tidak ada data yang cocok</strong>
          <span style={{ fontSize: '13px' }}>Coba ubah kata kunci pencarian atau klik "+ Tambah Baru".</span>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '18px' }}>
          {filteredList.map((item) => (
            <article
              key={item.id}
              className="db-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                borderRadius: '12px',
                border: '1px solid rgba(12,24,16,.08)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              }}
            >
              {/* Card Image Banner */}
              <div
                style={{
                  position: 'relative',
                  height: '160px',
                  background: '#1a3325',
                  overflow: 'hidden',
                }}
              >
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '28px' }}>
                    🕌
                  </div>
                )}

                {/* Badge Overlay */}
                <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  <span
                    style={{
                      fontSize: '10.5px',
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: '6px',
                      background: 'rgba(12, 43, 29, 0.85)',
                      backdropFilter: 'blur(4px)',
                      color: '#F3E3B6',
                      border: '1px solid rgba(243, 227, 182, 0.2)',
                    }}
                  >
                    {item.category || item.type || 'DKM'}
                  </span>
                  {item.status && (
                    <span
                      style={{
                        fontSize: '10.5px',
                        fontWeight: 700,
                        padding: '3px 8px',
                        borderRadius: '6px',
                        background: item.status.includes('Selesai') ? 'rgba(15,97,48,0.85)' : 'rgba(3, 105, 161, 0.85)',
                        backdropFilter: 'blur(4px)',
                        color: '#FFFFFF',
                      }}
                    >
                      {item.status}
                    </span>
                  )}
                </div>
              </div>

              {/* Card Content Body */}
              <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--db-text-1)', lineHeight: 1.35, margin: '0 0 6px 0' }}>
                  {item.title}
                </h3>

                {/* Speaker / Writer info */}
                {(item.speaker || item.penulis) && (
                  <div style={{ fontSize: '12px', fontWeight: 600, color: '#8A6200', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span>👤</span>
                    <span>{item.speaker || item.penulis}</span>
                  </div>
                )}

                {/* Schedule / Date / Location */}
                <div style={{ fontSize: '11.5px', color: 'var(--db-text-3)', marginBottom: '10px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {(item.schedule || item.date) && (
                    <span>🗓️ {item.schedule || item.date}</span>
                  )}
                  {(item.location || item.duration) && (
                    <span>📍 {item.location || item.duration}</span>
                  )}
                  {item.downloads && <span>📥 {item.downloads}</span>}
                  {item.views && <span>👁️ {item.views}</span>}
                </div>

                {/* Description */}
                <p style={{ fontSize: '12px', color: 'var(--db-text-2)', lineHeight: 1.5, margin: '0 0 16px 0', flex: 1, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {item.description || 'Belum ada deskripsi rinci.'}
                </p>

                {/* Card Action Buttons: Edit, Ganti Gambar, Hapus */}
                <div style={{ display: 'flex', gap: '8px', paddingTop: '12px', borderTop: '1px solid rgba(12,24,16,.06)' }}>
                  <button
                    type="button"
                    onClick={() => handleEdit(item)}
                    className="fin-btn fin-btn-primary"
                    style={{ flex: 1, fontSize: '12px', padding: '6px 10px', justifyContent: 'center' }}
                  >
                    ✏️ Edit Data
                  </button>
                  <button
                    type="button"
                    onClick={() => handleEdit(item)}
                    className="fin-btn"
                    style={{ fontSize: '12px', padding: '6px 10px', justifyContent: 'center' }}
                    title="Ganti atau perbarui foto"
                  >
                    🖼️ Foto
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteConfirmItem(item)}
                    className="fin-btn"
                    style={{ fontSize: '12px', padding: '6px 10px', color: '#dc2626', borderColor: 'rgba(220,38,38,0.2)' }}
                    title="Hapus item"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* ── MODAL: TAMBAH / EDIT ITEM & GAMBAR ── */}
      {editingItem && (
        <div
          className="article-editor-scrim"
          style={{ zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
          onMouseDown={(e) => e.target === e.currentTarget && setEditingItem(null)}
        >
          <div
            className="db-card"
            style={{
              width: '100%',
              maxWidth: '680px',
              maxHeight: '90vh',
              overflowY: 'auto',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
              background: '#FFFFFF',
            }}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', borderBottom: '1px solid #E5E7EB', paddingBottom: '14px' }}>
              <div>
                <span className="db-sec-eyebrow">EDITOR DATA DKM</span>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0c2b1d', margin: '4px 0 0 0' }}>
                  {isNew ? 'Tambah Item Baru' : 'Edit & Perbarui Konten'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: '#6B7280' }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSave}>
              {/* Image Preview & Upload Section */}
              <div style={{ marginBottom: '18px', background: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px dashed #CBD5E1' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#0c2b1d', marginBottom: '8px' }}>
                  🖼️ FOTO / POSTER / SAMPUL
                </label>
                
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                  {/* Thumbnail */}
                  <div
                    style={{
                      width: '120px',
                      height: '80px',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      background: '#1a3325',
                      flexShrink: 0,
                      border: '1px solid #E2E8F0',
                    }}
                  >
                    {editingItem.image ? (
                      <img
                        src={editingItem.image}
                        alt="Pratinjau"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94A3B8', fontSize: '11px' }}>
                        Tanpa Foto
                      </div>
                    )}
                  </div>

                  {/* Upload button & URL input */}
                  <div style={{ flex: 1, minWidth: '220px' }}>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                      <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="fin-btn fin-btn-primary"
                        style={{ fontSize: '12px', padding: '6px 14px' }}
                      >
                        📁 Pilih Gambar dari Komputer
                      </button>
                      {editingItem.image && (
                        <button
                          type="button"
                          onClick={() => setEditingItem((p) => ({ ...p, image: '' }))}
                          className="fin-btn"
                          style={{ fontSize: '12px', padding: '6px 12px', color: '#dc2626' }}
                        >
                          Hapus Foto
                        </button>
                      )}
                    </div>
                    <input
                      type="text"
                      placeholder="Atau tempel URL gambar (https://...)"
                      value={editingItem.image || ''}
                      onChange={(e) => setEditingItem((p) => ({ ...p, image: e.target.value }))}
                      style={{
                        width: '100%',
                        fontSize: '12px',
                        padding: '6px 10px',
                        borderRadius: '6px',
                        border: '1px solid #CBD5E1',
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Title & Category */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>
                    Judul / Nama Program *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingItem.title}
                    onChange={(e) => setEditingItem((p) => ({ ...p, title: e.target.value }))}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>
                    Kategori
                  </label>
                  <input
                    type="text"
                    value={editingItem.category || ''}
                    onChange={(e) => setEditingItem((p) => ({ ...p, category: e.target.value }))}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '13px' }}
                  />
                </div>
              </div>

              {/* Speaker / Writer & Schedule */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>
                    Pemateri / Penulis / Pembina
                  </label>
                  <input
                    type="text"
                    value={editingItem.speaker || editingItem.penulis || ''}
                    onChange={(e) =>
                      setEditingItem((p) => ({
                        ...p,
                        speaker: e.target.value,
                        penulis: e.target.value,
                      }))
                    }
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>
                    Jadwal / Waktu / Tanggal
                  </label>
                  <input
                    type="text"
                    value={editingItem.schedule || editingItem.date || ''}
                    onChange={(e) =>
                      setEditingItem((p) => ({
                        ...p,
                        schedule: e.target.value,
                        date: e.target.value,
                      }))
                    }
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '13px' }}
                  />
                </div>
              </div>

              {/* Location & Status */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>
                    Lokasi / Format
                  </label>
                  <input
                    type="text"
                    value={editingItem.location || editingItem.duration || ''}
                    onChange={(e) =>
                      setEditingItem((p) => ({
                        ...p,
                        location: e.target.value,
                        duration: e.target.value,
                      }))
                    }
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>
                    Status Publikasi
                  </label>
                  <select
                    value={editingItem.status || 'Siap Publik'}
                    onChange={(e) => setEditingItem((p) => ({ ...p, status: e.target.value }))}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '13px' }}
                  >
                    <option value="Siap Publik">Siap Publik</option>
                    <option value="Aktif Berjalan">Aktif Berjalan</option>
                    <option value="Tayang Publik">Tayang Publik</option>
                    <option value="Draft">Draft</option>
                    <option value="Selesai / Arsip">Selesai / Arsip</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>
                  Deskripsi Lengkap
                </label>
                <textarea
                  rows="4"
                  value={editingItem.description || ''}
                  onChange={(e) => setEditingItem((p) => ({ ...p, description: e.target.value }))}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '13px' }}
                />
              </div>

              {/* Modal Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', borderTop: '1px solid #E5E7EB', paddingTop: '16px' }}>
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="fin-btn"
                  style={{ padding: '8px 16px', fontSize: '13px' }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="fin-btn fin-btn-primary"
                  style={{ padding: '8px 20px', fontSize: '13px', fontWeight: 700 }}
                >
                  💾 Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: KONFIRMASI HAPUS ── */}
      {deleteConfirmItem && (
        <div
          className="article-editor-scrim"
          style={{ zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
          onMouseDown={(e) => e.target === e.currentTarget && setDeleteConfirmItem(null)}
        >
          <div
            className="db-card"
            style={{
              width: '100%',
              maxWidth: '440px',
              borderRadius: '16px',
              padding: '24px',
              background: '#FFFFFF',
              boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '36px', marginBottom: '12px' }}>⚠️</div>
            <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#111827', margin: '0 0 8px 0' }}>
              Hapus Data Ini?
            </h3>
            <p style={{ fontSize: '13px', color: '#4B5563', lineHeight: 1.5, margin: '0 0 20px 0' }}>
              Apakah Anda yakin ingin menghapus <strong>"{deleteConfirmItem.title}"</strong> dari daftar {activeTab}? Tindakan ini dapat dibatalkan melalui reset default.
            </p>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={() => setDeleteConfirmItem(null)}
                className="fin-btn"
                style={{ padding: '8px 18px', fontSize: '13px' }}
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="fin-btn"
                style={{
                  padding: '8px 18px',
                  fontSize: '13px',
                  fontWeight: 700,
                  background: '#DC2626',
                  color: '#FFFFFF',
                  borderColor: '#DC2626',
                }}
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
