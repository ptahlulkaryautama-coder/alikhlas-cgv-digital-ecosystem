import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { hasPermission } from '../../services/accessPolicy.js';
import { formatSupabaseError, getSupabaseBrowserClient } from '../../services/supabaseClient.js';

const LABEL = { article: 'Artikel', program: 'Program', agenda: 'Agenda' };
const EDIT_PATH = { article: '/app/kabar', program: '/app/program', agenda: '/app/agenda' };

function describeItem(item) {
  if (item.already_released) return 'Sudah punya salinan production. Jika konten berubah, edit data trial lalu rilis ulang sesuai keputusan pengurus.';
  if (item.media_blocked) return 'Foto artikel masih private. Saat rilis, sistem akan menyalin foto ke bucket publik terlebih dahulu.';
  return 'Siap dibuatkan salinan production. Data trial tetap tersimpan sebagai jejak kerja.';
}

export default function ContentProductionReleasePanel() {
  const { permissions } = useAuth();
  const mayManage = hasPermission(permissions, 'content:release');
  const [items, setItems] = useState([]);
  const [enabled, setEnabled] = useState(false);
  const [busy, setBusy] = useState('');
  const [message, setMessage] = useState('');

  const load = useCallback(async () => {
    if (!mayManage) return;

    const client = getSupabaseBrowserClient();
    const [capability, list] = await Promise.all([
      client.rpc('content_production_release_capabilities'),
      client.rpc('list_content_production_candidates'),
    ]);

    if (capability.error || list.error) {
      setMessage('Pusat rilis belum tersedia. Jalankan migration Production Release Center.');
      return;
    }

    setEnabled(Boolean(capability.data?.release_enabled));
    setItems(list.data ?? []);
    setMessage('');
  }, [mayManage]);

  useEffect(() => {
    void load();
  }, [load]);

  if (!mayManage) return null;

  async function promoteMedia(item) {
    if (!item.media_blocked) return;
    if (!item.media_source_path || !item.media_public_path) throw new Error('Jalur foto belum lengkap. Coba simpan ulang artikel.');

    setMessage('Menyiapkan foto artikel agar bisa tampil di website publik…');
    const client = getSupabaseBrowserClient();
    const signed = await client.storage.from('content-article-test-media').createSignedUrl(item.media_source_path, 120);
    if (signed.error) throw signed.error;

    const response = await fetch(signed.data.signedUrl);
    if (!response.ok) throw new Error('Foto private belum bisa dibaca. Coba refresh lalu ulangi rilis.');

    const blob = await response.blob();
    const uploaded = await client.storage
      .from('content-article-public-media')
      .upload(item.media_public_path, blob, { contentType: blob.type || 'image/jpeg', upsert: false });

    if (uploaded.error && !/already exists|duplicate/i.test(uploaded.error.message)) throw uploaded.error;
  }

  async function release(item) {
    if (item.already_released || !enabled) return;
    if (!window.confirm(`${LABEL[item.entity_type]} “${item.title}” akan tampil di website publik. Lanjutkan?`)) return;

    const key = `${item.entity_type}:${item.source_test_id}`;
    setBusy(key);
    setMessage('Membuat salinan production…');

    try {
      await promoteMedia(item);
      const { error } = await getSupabaseBrowserClient().rpc('release_content_to_production', {
        p_entity_type: item.entity_type,
        p_source_test_id: item.source_test_id,
        p_expected_version: item.version,
        p_idempotency_key: crypto.randomUUID(),
      });

      if (error) throw error;
      setMessage(`${LABEL[item.entity_type]} berhasil dirilis ke website publik.`);
      await load();
    } catch (error) {
      setMessage(`Rilis gagal: ${formatSupabaseError(error)}`);
    }

    setBusy('');
  }

  async function manage(item, action) {
    if (action === 'archive' && !window.confirm(`Hapus data trial “${item.title}”? Data akan diarsipkan dan hilang dari daftar rilis.`)) return;

    const key = `${action}:${item.entity_type}:${item.source_test_id}`;
    setBusy(key);
    setMessage(action === 'reopen' ? 'Membuka kembali data trial untuk diedit…' : 'Mengarsipkan data trial…');

    const { error } = await getSupabaseBrowserClient().rpc('manage_test_content', {
      p_entity_type: item.entity_type,
      p_source_test_id: item.source_test_id,
      p_expected_version: item.version,
      p_action: action,
      p_reason: action === 'archive' ? 'Data trial dihapus melalui Pusat Rilis Website' : null,
    });

    if (error) {
      setMessage(`Tindakan gagal: ${formatSupabaseError(error)}`);
    } else if (action === 'reopen') {
      window.location.assign(EDIT_PATH[item.entity_type]);
    } else {
      setMessage('Data trial berhasil diarsipkan dari daftar rilis.');
      await load();
    }

    setBusy('');
  }

  return (
    <section className="db-card production-release" aria-labelledby="production-release-title">
      <div className="production-release__head">
        <div>
          <div className="db-sec-eyebrow">Rilis Produksi</div>
          <h2 id="production-release-title">Pusat Rilis Website</h2>
          <p>Pilih konten uji yang sudah layak tampil, lalu salin ke production. Ini tidak menghapus data trial.</p>
        </div>
        <span className={`fin-pill ${enabled ? '' : 'fin-pill-red'}`}>{enabled ? 'Siap digunakan' : 'Terkunci aman'}</span>
      </div>

      <div className="production-release__steps" aria-label="Alur rilis website">
        <span><strong>1</strong> Review isi</span>
        <span><strong>2</strong> Pastikan akses Publik</span>
        <span><strong>3</strong> Klik Rilis ke website</span>
      </div>

      {!enabled && (
        <div className="production-release__notice" role="note">
          <strong>Rilis production sedang dikunci.</strong>
          <span>Aktifkan hanya saat konten benar-benar akan ditayangkan, lalu kunci kembali setelah selesai.</span>
        </div>
      )}

      {message && <p className="fin-import-message" role="status">{message}</p>}

      <div className="production-release__list">
        {items.length === 0 ? (
          <div className="production-release__empty">
            <strong>Belum ada antrean rilis.</strong>
            <span>Konten akan muncul di sini setelah statusnya “Siap publik” di Kabar, Program, atau Agenda.</span>
          </div>
        ) : items.map((item) => {
          const key = `${item.entity_type}:${item.source_test_id}`;
          const isBusy = Boolean(busy);
          return (
            <article className="production-release__item" key={key}>
              <div>
                <span className="production-release__type">{LABEL[item.entity_type]}</span>
                <h3>{item.title}</h3>
                <p>{describeItem(item)}</p>
              </div>
              <div className="production-release__actions">
                <button className="fin-btn" disabled={!enabled || item.already_released || isBusy} onClick={() => manage(item, 'reopen')}>
                  Edit trial
                </button>
                <button className="fin-btn production-release__delete" disabled={!enabled || isBusy} onClick={() => manage(item, 'archive')}>
                  Hapus trial
                </button>
                <button className="fin-btn" data-variant="primary" disabled={!enabled || item.already_released || isBusy} onClick={() => release(item)}>
                  {busy === key ? 'Merilis…' : item.already_released ? 'Sudah dirilis' : 'Rilis ke website'}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
