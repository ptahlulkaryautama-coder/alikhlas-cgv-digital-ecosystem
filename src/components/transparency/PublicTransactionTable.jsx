import React, { useState, useMemo } from 'react';
import { mockTransactionsSeptember, mockTransactionsSeptemberJPU, mockTransactionsSeptemberCombined } from '../../data/dashboardMockData.js';
import Container from '../common/Container.jsx';

function getCategoryBadge(kategori) {
  const cat = (kategori || '').toLowerCase();
  if (cat.includes('saldo awal')) {
    return { bg: 'rgba(12, 43, 29, 0.08)', color: '#0c2b1d', border: '1px solid rgba(12, 43, 29, 0.2)', label: 'Saldo Awal' };
  }
  if (cat.includes('infaq jumat')) {
    return { bg: 'rgba(15, 97, 48, 0.12)', color: '#0f6130', border: '1px solid rgba(15, 97, 48, 0.3)', label: 'Infaq Jumat' };
  }
  if (cat.includes('jumat berkah')) {
    return { bg: 'rgba(2, 132, 199, 0.12)', color: '#0369a1', border: '1px solid rgba(2, 132, 199, 0.3)', label: 'Jumat Berkah' };
  }
  if (cat.includes('santunan')) {
    return { bg: 'rgba(147, 51, 234, 0.12)', color: '#7e22ce', border: '1px solid rgba(147, 51, 234, 0.3)', label: 'Santunan Umat' };
  }
  if (cat.includes('donasi warga')) {
    return { bg: 'rgba(13, 148, 136, 0.12)', color: '#0f766e', border: '1px solid rgba(13, 148, 136, 0.3)', label: 'Donasi Cluster' };
  }
  if (cat.includes('donasi') || cat.includes('tanggap') || cat.includes('bantuan')) {
    return { bg: 'rgba(147, 51, 234, 0.12)', color: '#7e22ce', border: '1px solid rgba(147, 51, 234, 0.3)', label: 'Bantuan Sosial' };
  }
  if (cat.includes('renovasi')) {
    return { bg: 'rgba(180, 83, 9, 0.12)', color: '#b45309', border: '1px solid rgba(180, 83, 9, 0.3)', label: 'Renovasi Fasilitas' };
  }
  if (cat.includes('kajian') || cat.includes('penerimaan')) {
    return { bg: 'rgba(201, 165, 90, 0.15)', color: '#8a6200', border: '1px solid rgba(201, 165, 90, 0.35)', label: 'Kajian Warga' };
  }
  if (cat.includes('infaq donatur') || cat.includes('infaq operasional') || cat.includes('infaq jamaah') || cat.includes('pendapatan')) {
    return { bg: 'rgba(15, 97, 48, 0.08)', color: '#0f6130', border: '1px solid rgba(15, 97, 48, 0.2)', label: 'Infaq & Donatur' };
  }
  if (cat.includes('bisyaroh')) {
    return { bg: 'rgba(155, 33, 19, 0.08)', color: '#9b2113', border: '1px solid rgba(155, 33, 19, 0.2)', label: 'Bisyaroh' };
  }
  if (cat.includes('utilitas') || cat.includes('operasional')) {
    return { bg: 'rgba(217, 119, 6, 0.08)', color: '#b45309', border: '1px solid rgba(217, 119, 6, 0.2)', label: 'Operasional' };
  }
  return { bg: 'rgba(0,0,0,0.05)', color: '#333', border: '1px solid rgba(0,0,0,0.1)', label: kategori };
}

export default function PublicTransactionTable() {
  const [accountFilter, setAccountFilter] = useState('all'); // 'all' | 'kas_masjid' | 'jpu'
  const [filterType, setFilterType] = useState('all'); // 'all' | 'in' | 'out'
  const [searchQuery, setSearchQuery] = useState('');

  // Base list based on selected account
  const baseList = useMemo(() => {
    if (accountFilter === 'kas_masjid') return mockTransactionsSeptember;
    if (accountFilter === 'jpu') return mockTransactionsSeptemberJPU;
    return mockTransactionsSeptemberCombined;
  }, [accountFilter]);

  const filteredTransactions = useMemo(() => {
    return baseList.filter((trx) => {
      const matchSearch = trx.keterangan.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          trx.kategori.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          trx.accountLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          trx.tanggal.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchSearch) return false;
      if (filterType === 'in') return trx.masuk !== '-';
      if (filterType === 'out') return trx.keluar !== '-';
      return true;
    });
  }, [baseList, filterType, searchQuery]);

  return (
    <section className="public-tx-section" id="buku-kas-terbuka" aria-labelledby="public-tx-title">
      <Container>
        <div className="public-tx-header">
          <div>
            <div className="transparency-hero-label" style={{ color: '#0c2b1d', marginBottom: '8px' }}>
              <span className="fin-line" style={{ background: '#0c2b1d' }}></span> BUKU KAS TRANSPARAN &amp; DANA SOSIAL
            </div>
            <h2 id="public-tx-title" className="public-tx-heading">
              Rincian Mutasi Kas Terverifikasi (September 2026)
            </h2>
            <p className="public-tx-sub">
              Catatan mutasi Kas Operasional Masjid (46 entri) dan Dana Sosial Jumat Peduli Umat (34 entri) periode 1–30 September 2026 yang telah disahkan oleh Ketua DKM, Sekretaris, dan Bendahara.
            </p>
          </div>

          <div className="public-tx-endorse-pill">
            <div className="endorse-icon">🏛️</div>
            <div>
              <div className="endorse-title">Pengesahan DKM Resmi</div>
              <div className="endorse-meta">Disahkan: 30 September 2026 · Rek. BSI 1500600069</div>
            </div>
          </div>
        </div>

        {/* Account Level Selector Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' }}>
          <button
            type="button"
            className={`public-tx-tab ${accountFilter === 'all' ? 'is-active' : ''}`}
            onClick={() => setAccountFilter('all')}
            style={{ fontWeight: 700 }}
          >
            Semua Akun ({mockTransactionsSeptemberCombined.length} Entri)
          </button>
          <button
            type="button"
            className={`public-tx-tab ${accountFilter === 'kas_masjid' ? 'is-active' : ''}`}
            onClick={() => setAccountFilter('kas_masjid')}
            style={{ fontWeight: 700 }}
          >
            🏛️ Kas Masjid ({mockTransactionsSeptember.length} Baris)
          </button>
          <button
            type="button"
            className={`public-tx-tab ${accountFilter === 'jpu' ? 'is-active' : ''}`}
            onClick={() => setAccountFilter('jpu')}
            style={{ fontWeight: 700 }}
          >
            🤝 Jumat Peduli Umat / JPU ({mockTransactionsSeptemberJPU.length} Baris)
          </button>
        </div>

        {/* Filter and Search Bar */}
        <div className="public-tx-controls">
          <div className="public-tx-tabs" role="tablist" aria-label="Filter jenis transaksi">
            <button
              type="button"
              role="tab"
              aria-selected={filterType === 'all'}
              className={`public-tx-tab ${filterType === 'all' ? 'is-active' : ''}`}
              onClick={() => setFilterType('all')}
            >
              Semua Mutasi ({baseList.length})
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={filterType === 'in'}
              className={`public-tx-tab ${filterType === 'in' ? 'is-active' : ''}`}
              onClick={() => setFilterType('in')}
            >
              Kas Masuk
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={filterType === 'out'}
              className={`public-tx-tab ${filterType === 'out' ? 'is-active' : ''}`}
              onClick={() => setFilterType('out')}
            >
              Kas Keluar
            </button>
          </div>

          <div className="public-tx-search-wrap">
            <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              className="public-tx-search"
              placeholder="Cari transaksi (cth: Jumat, Bisyaroh, Canyon, Santunan)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Cari transaksi"
            />
            {searchQuery && (
              <button className="search-clear-btn" onClick={() => setSearchQuery('')} aria-label="Hapus pencarian">
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Ledger Table Container */}
        <div className="public-ledger-card">
          <div className="public-ledger-table-wrap">
            <table className="public-ledger-table" aria-label="Tabel rincian mutasi kas masjid">
              <thead>
                <tr>
                  <th scope="col" style={{ width: '80px' }}>TANGGAL</th>
                  <th scope="col" style={{ width: '110px' }}>AKUN</th>
                  <th scope="col">KETERANGAN TRANSAKSI</th>
                  <th scope="col" style={{ width: '130px' }}>KATEGORI</th>
                  <th scope="col" className="tx-align-right" style={{ width: '120px' }}>KAS MASUK</th>
                  <th scope="col" className="tx-align-right" style={{ width: '120px' }}>KAS KELUAR</th>
                  <th scope="col" className="tx-align-right" style={{ width: '130px' }}>SALDO AKHIR</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((trx) => {
                  const badge = getCategoryBadge(trx.kategori);
                  const isIncome = trx.masuk !== '-';
                  const isExpense = trx.keluar !== '-';
                  const isJpu = trx.account === 'jpu';
                  return (
                    <tr key={trx.id} className="public-ledger-row">
                      <td className="tx-date-cell">
                        <span className="tx-date-badge">{trx.tanggal}</span>
                      </td>
                      <td>
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            padding: '3px 8px',
                            borderRadius: '12px',
                            background: isJpu ? 'rgba(6, 182, 212, 0.12)' : 'rgba(12, 43, 29, 0.08)',
                            color: isJpu ? '#0284c7' : '#0c2b1d',
                            border: isJpu ? '1px solid rgba(6, 182, 212, 0.3)' : '1px solid rgba(12, 43, 29, 0.2)',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {trx.accountLabel}
                        </span>
                      </td>
                      <td className="tx-desc-cell">
                        <span className="tx-desc-text">{trx.keterangan}</span>
                      </td>
                      <td>
                        <span
                          className="tx-cat-badge"
                          style={{
                            background: badge.bg,
                            color: badge.color,
                            border: badge.border,
                          }}
                        >
                          {badge.label}
                        </span>
                      </td>
                      <td className="tx-align-right tx-amount-in">
                        {isIncome ? (
                          <span className="tx-val-plus">+{trx.masuk}</span>
                        ) : (
                          <span className="tx-val-dash">—</span>
                        )}
                      </td>
                      <td className="tx-align-right tx-amount-out">
                        {isExpense ? (
                          <span className="tx-val-minus">-{trx.keluar}</span>
                        ) : (
                          <span className="tx-val-dash">—</span>
                        )}
                      </td>
                      <td className="tx-align-right tx-amount-balance">
                        <strong>{trx.saldo}</strong>
                      </td>
                    </tr>
                  );
                })}
                {filteredTransactions.length === 0 && (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '36px', color: '#6b7f74' }}>
                      Tidak ditemukan transaksi yang cocok dengan filter atau pencarian <em>"{searchQuery}"</em>.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Ledger Footer Summary */}
          <div className="public-ledger-footer">
            <div className="ledger-footer-left">
              <span className="footer-meta-pill">September 2026</span>
              <span className="footer-meta-text">Menampilkan {filteredTransactions.length} dari {baseList.length} mutasi tercatat</span>
            </div>
            <div className="ledger-footer-right">
              {accountFilter === 'kas_masjid' ? (
                <>
                  <div className="footer-stat-unit">
                    <span>Kas Masuk:</span>
                    <strong className="text-forest">+Rp 15.646.541</strong>
                  </div>
                  <div className="footer-stat-divider">·</div>
                  <div className="footer-stat-unit">
                    <span>Kas Keluar:</span>
                    <strong className="text-crimson">-Rp 17.110.000</strong>
                  </div>
                  <div className="footer-stat-divider">·</div>
                  <div className="footer-stat-unit">
                    <span>Saldo Akhir Kas Masjid:</span>
                    <strong className="text-gold">Rp 14.850.208</strong>
                  </div>
                </>
              ) : accountFilter === 'jpu' ? (
                <>
                  <div className="footer-stat-unit">
                    <span>Donasi JPU Masuk:</span>
                    <strong className="text-forest">+Rp 6.400.000</strong>
                  </div>
                  <div className="footer-stat-divider">·</div>
                  <div className="footer-stat-unit">
                    <span>Penyaluran Santunan:</span>
                    <strong className="text-crimson">-Rp 6.600.000</strong>
                  </div>
                  <div className="footer-stat-divider">·</div>
                  <div className="footer-stat-unit">
                    <span>Saldo Akhir JPU:</span>
                    <strong style={{ color: '#0284c7' }}>Rp 4.500.000</strong>
                  </div>
                </>
              ) : (
                <>
                  <div className="footer-stat-unit">
                    <span>Kas Masjid:</span>
                    <strong className="text-gold">Rp 14.850.208</strong>
                  </div>
                  <div className="footer-stat-divider">·</div>
                  <div className="footer-stat-unit">
                    <span>Dana Sosial JPU:</span>
                    <strong style={{ color: '#0284c7' }}>Rp 4.500.000</strong>
                  </div>
                  <div className="footer-stat-divider">·</div>
                  <div className="footer-stat-unit">
                    <span>Total Likuiditas:</span>
                    <strong className="text-forest">Rp 19.350.208</strong>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Verification Signatures Card */}
        <div className="public-signatories-card">
          <div className="signatories-head">
            <div className="sign-badge">PENGESAHAN DOKUMEN RESMI</div>
            <h3 className="sign-title">Dewan Kemakmuran Masjid Al Ikhlas CGV</h3>
            <p className="sign-sub">
              Laporan Keuangan Kas Masjid &amp; Dana Sosial JPU Periode September 2026 telah diteliti dan disetujui bersama oleh pimpinan DKM:
            </p>
          </div>

          <div className="signatories-grid">
            <div className="signatory-box">
              <div className="sign-role">Ketua DKM</div>
              <div className="sign-name">Karya HP</div>
              <div className="sign-seal-check">✓ Ditandatangani</div>
            </div>
            <div className="signatory-box">
              <div className="sign-role">Sekretaris DKM</div>
              <div className="sign-name">Zulhendy M.</div>
              <div className="sign-seal-check">✓ Ditandatangani</div>
            </div>
            <div className="signatory-box is-featured-sign">
              <div className="sign-role">Bendahara DKM</div>
              <div className="sign-name">Bambang S.</div>
              <div className="sign-seal-check">✓ Ditandatangani &amp; BKU Terverifikasi</div>
            </div>
          </div>

          <div className="sign-footer-note">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
            <span>
              Pencatatan perbankan resmi melalui <strong>Bank Syariah Indonesia (BSI Kode 451) No. Rek 1500600069</strong> a.n. Masjid Al Ikhlas Cipta Green Ville.
            </span>
          </div>
        </div>
      </Container>
    </section>
  );
}

