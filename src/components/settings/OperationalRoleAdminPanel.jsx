import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { hasPermission } from '../../services/accessPolicy.js';
import { formatSupabaseError, getSupabaseBrowserClient } from '../../services/supabaseClient.js';

const ROLES = [
  { role: 'ketua_dkm', label: 'Ketua DKM', help: 'Pengawasan, konten, rilis, dan laporan' },
  { role: 'sekretaris', label: 'Sekretaris', help: 'Program, agenda, dokumen, dan rilis' },
  { role: 'bendahara', label: 'Bendahara', help: 'Keuangan DKM dan transparansi' },
  { role: 'humas', label: 'Media & Humas', help: 'Artikel, media, publikasi, dan rilis' },
  { role: 'kepala_tpq', label: 'Kepala TPQ', help: 'Pengelolaan TPQ dan keuangan TPQ' },
  { role: 'guru_tpq', label: 'Pengampu TPQ', help: 'Kegiatan dan data operasional TPQ' },
  { role: 'viewer', label: 'Pembaca', help: 'Akses baca terbatas' },
];

export default function OperationalRoleAdminPanel() {
  const { permissions, user: currentUser } = useAuth();
  const mayManage = hasPermission(permissions, 'users:manage');
  const [users, setUsers] = useState([]);
  const [assigned, setAssigned] = useState(new Set());
  const [busy, setBusy] = useState('');
  const [message, setMessage] = useState('');

  // State untuk form Tambah Akun Pengurus Baru
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createName, setCreateName] = useState('');
  const [createEmail, setCreateEmail] = useState('');
  const [createPassword, setCreatePassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [createRoles, setCreateRoles] = useState([]);
  const [createBusy, setCreateBusy] = useState(false);
  const [createError, setCreateError] = useState('');

  const load = useCallback(async () => {
    if (!mayManage) return;

    const client = getSupabaseBrowserClient();
    const [profilesResult, rolesResult] = await Promise.all([
      client
        .from('profiles')
        .select('id,display_name,email,status')
        .in('status', ['active', 'suspended'])
        .order('status', { ascending: true })
        .order('display_name', { ascending: true }),
      client.from('user_roles').select('user_id,role'),
    ]);

    if (profilesResult.error || rolesResult.error) {
      setMessage('Daftar jabatan belum dapat dimuat. Jalankan migration jabatan operasional.');
      return;
    }

    setUsers(profilesResult.data ?? []);
    setAssigned(new Set((rolesResult.data ?? []).map((item) => `${item.user_id}:${item.role}`)));
    setMessage('');
  }, [mayManage]);

  useEffect(() => {
    void load();
  }, [load]);

  if (!mayManage) return null;

  function generateRandomPassword() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%';
    let result = 'Msd-';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCreatePassword(result);
    setShowPassword(true);
  }

  function toggleCreateRole(role) {
    setCreateRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  }

  async function handleCreateUser(e) {
    e.preventDefault();
    setCreateError('');

    if (!createEmail.trim()) {
      setCreateError('Alamat email wajib diisi.');
      return;
    }
    if (!createPassword || createPassword.length < 6) {
      setCreateError('Password minimal 6 karakter.');
      return;
    }

    setCreateBusy(true);
    const client = getSupabaseBrowserClient();
    const { data, error } = await client.rpc('admin_create_user_account', {
      p_email: createEmail.trim(),
      p_password: createPassword,
      p_display_name: createName.trim(),
      p_roles: createRoles,
    });

    if (error) {
      setCreateError(formatSupabaseError(error));
      setCreateBusy(false);
      return;
    }

    setMessage(`✅ Akun "${createName.trim() || createEmail.trim()}" berhasil dibuat dan diaktifkan.`);
    setCreateName('');
    setCreateEmail('');
    setCreatePassword('');
    setCreateRoles([]);
    setShowCreateModal(false);
    setCreateBusy(false);
    await load();
  }

  async function toggle(userId, role, enabled) {
    const key = `${userId}:${role}`;
    setBusy(key);
    setMessage('Menyimpan jabatan…');

    const { error } = await getSupabaseBrowserClient().rpc('set_user_operational_role', {
      p_user_id: userId,
      p_role: role,
      p_enabled: enabled,
    });

    setMessage(error ? `Perubahan gagal: ${formatSupabaseError(error)}` : 'Jabatan dan akses modul berhasil diperbarui.');
    if (!error) await load();
    setBusy('');
  }

  async function suspend(user) {
    if (!window.confirm(`Hapus akses akun ${user.display_name || user.email}? Akun akan dinonaktifkan dan seluruh jabatan dicabut.`)) return;

    setBusy(`suspend:${user.id}`);
    setMessage('Menonaktifkan akun…');

    const { error } = await getSupabaseBrowserClient().rpc('suspend_user_account', {
      p_user_id: user.id,
      p_reason: 'Dihapus melalui dashboard oleh Super Admin',
    });

    setMessage(error ? `Akun belum dihapus: ${formatSupabaseError(error)}` : 'Akses akun berhasil dihapus dan dicatat pada audit trail.');
    if (!error) await load();
    setBusy('');
  }

  async function restore(user) {
    if (!window.confirm(`Pulihkan akun ${user.display_name || user.email}? Akun akan aktif kembali tanpa jabatan. Pilih role lagi setelah dipulihkan.`)) return;

    setBusy(`restore:${user.id}`);
    setMessage('Memulihkan akun…');

    const { error } = await getSupabaseBrowserClient().rpc('restore_user_account', {
      p_user_id: user.id,
      p_reason: 'Dipulihkan melalui dashboard oleh Super Admin',
    });

    setMessage(error ? `Akun belum dipulihkan: ${formatSupabaseError(error)}` : 'Akun aktif kembali. Pilih jabatan yang sesuai sebelum digunakan.');
    if (!error) await load();
    setBusy('');
  }

  return (
    <section className="db-card role-admin" aria-labelledby="role-admin-title">
      <div className="role-admin__head">
        <div>
          <div className="db-sec-eyebrow">TIM PENGELOLA</div>
          <h2 id="role-admin-title">Jabatan & Akses Dashboard</h2>
          <p>Satu akun dapat memiliki lebih dari satu jabatan. Akses menu mengikuti tugasnya secara otomatis.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            className="fin-btn fin-btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', minHeight: '38px', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}
            onClick={() => {
              setShowCreateModal((prev) => !prev);
              setCreateError('');
            }}
          >
            <span>{showCreateModal ? '✕ Tutup Form' : '➕ Tambah Akun Pengurus'}</span>
          </button>
          <span className="fin-pill fin-pill-red">Super Admin</span>
        </div>
      </div>

      {showCreateModal && (
        <form
          className="role-admin__create-card"
          onSubmit={handleCreateUser}
          style={{
            marginTop: '20px',
            padding: '24px',
            border: '1px solid #cce3d5',
            borderRadius: '16px',
            background: 'linear-gradient(145deg, #f8fcf9 0%, #ffffff 100%)',
            boxShadow: '0 8px 24px rgba(12, 43, 29, 0.05)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ margin: 0, color: '#0c2b1d', fontSize: '1.15rem' }}>
              👤 Pendaftaran Akun Pengurus Baru
            </h3>
            <small style={{ color: '#557262' }}>Daftarkan akun dan tentukan jabatan awal langsung.</small>
          </div>

          {createError && (
            <div style={{ padding: '10px 14px', marginBottom: '16px', borderRadius: '8px', background: '#fdecea', color: '#9b2113', fontSize: '13px' }}>
              ⚠️ {createError}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#315443', marginBottom: '6px' }}>
                Nama Lengkap / Panggilan
              </label>
              <input
                type="text"
                placeholder="Contoh: Bambang S. (Bendahara)"
                value={createName}
                onChange={(e) => setCreateName(e.target.value)}
                style={{ width: '100%', minHeight: '42px', padding: '8px 12px', border: '1px solid #cad8d0', borderRadius: '8px', background: '#fff', fontSize: '13px', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#315443', marginBottom: '6px' }}>
                Alamat Email Pengurus *
              </label>
              <input
                type="email"
                required
                placeholder="pengurus@alikhlas.org"
                value={createEmail}
                onChange={(e) => setCreateEmail(e.target.value)}
                style={{ width: '100%', minHeight: '42px', padding: '8px 12px', border: '1px solid #cad8d0', borderRadius: '8px', background: '#fff', fontSize: '13px', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#315443' }}>
                  Password Awal *
                </label>
                <button
                  type="button"
                  onClick={generateRandomPassword}
                  style={{ background: 'none', border: 'none', color: '#126b3a', fontSize: '11px', fontWeight: '700', cursor: 'pointer', padding: 0, textDecoration: 'underline' }}
                >
                  ⚡ Buat Password Acak
                </button>
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Minimal 6 karakter"
                  value={createPassword}
                  onChange={(e) => setCreatePassword(e.target.value)}
                  style={{ flex: 1, minHeight: '42px', padding: '8px 12px', border: '1px solid #cad8d0', borderRadius: '8px', background: '#fff', fontSize: '13px', boxSizing: 'border-box' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  style={{ padding: '0 12px', border: '1px solid #cad8d0', borderRadius: '8px', background: '#f5faf6', color: '#2b503d', fontSize: '12px', cursor: 'pointer' }}
                >
                  {showPassword ? 'Sembunyikan' : 'Lihat'}
                </button>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#315443', marginBottom: '8px' }}>
              Pilih Jabatan & Akses Awal:
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '8px' }}>
              {ROLES.map((item) => (
                <label
                  key={item.role}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 12px',
                    border: '1px solid #dbe6df',
                    borderRadius: '8px',
                    background: createRoles.includes(item.role) ? '#edf8f1' : '#fff',
                    borderColor: createRoles.includes(item.role) ? '#86bd9d' : '#dbe6df',
                    fontSize: '12px',
                    cursor: 'pointer',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={createRoles.includes(item.role)}
                    onChange={() => toggleCreateRole(item.role)}
                    style={{ accentColor: '#126b3a' }}
                  />
                  <span>
                    <strong style={{ color: '#173c2b', display: 'block' }}>{item.label}</strong>
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button
              type="button"
              className="fin-btn"
              disabled={createBusy}
              onClick={() => {
                setShowCreateModal(false);
                setCreateError('');
              }}
              style={{ minHeight: '40px', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}
            >
              Batal
            </button>
            <button
              type="submit"
              className="fin-btn fin-btn-primary"
              disabled={createBusy}
              style={{ minHeight: '40px', padding: '8px 20px', borderRadius: '8px', cursor: 'pointer' }}
            >
              {createBusy ? '⏳ Mendaftarkan…' : '💾 Simpan & Aktifkan Akun'}
            </button>
          </div>
        </form>
      )}

      {message && <p className="fin-import-message" role="status" style={{ marginTop: '16px' }}>{message}</p>}

      <div className="role-admin__users">
        {users.map((user) => {
          const isSuspended = user.status === 'suspended';
          const protectedAccount = user.id === currentUser?.id || assigned.has(`${user.id}:super_admin`);
          const actionBusy = busy === `suspend:${user.id}` || busy === `restore:${user.id}`;

          return (
            <article className={`role-admin__user${isSuspended ? ' is-suspended' : ''}`} key={user.id}>
              <div className="role-admin__identity">
                <div>
                  <strong>{user.display_name || 'Tanpa nama'}</strong>
                  <span>{user.email}</span>
                  <small>{isSuspended ? 'Dinonaktifkan — tidak bisa login dashboard' : 'Aktif'}</small>
                </div>

                {isSuspended ? (
                  <button
                    className="fin-btn role-admin__restore"
                    disabled={actionBusy}
                    onClick={() => restore(user)}
                  >
                    Pulihkan akun
                  </button>
                ) : (
                  <button
                    className="fin-btn role-admin__remove"
                    disabled={protectedAccount || actionBusy}
                    onClick={() => suspend(user)}
                  >
                    {protectedAccount ? 'Akun dilindungi' : 'Hapus akses akun'}
                  </button>
                )}
              </div>

              <div className="role-admin__options" aria-disabled={isSuspended}>
                {ROLES.map((item) => {
                  const key = `${user.id}:${item.role}`;
                  return (
                    <label className="role-admin__option" key={item.role}>
                      <input
                        type="checkbox"
                        checked={assigned.has(key)}
                        disabled={isSuspended || busy === key}
                        onChange={(event) => toggle(user.id, item.role, event.target.checked)}
                      />
                      <span>
                        <strong>{item.label}</strong>
                        <small>{item.help}</small>
                      </span>
                    </label>
                  );
                })}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

