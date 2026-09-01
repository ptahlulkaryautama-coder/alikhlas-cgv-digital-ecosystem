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
        <span className="fin-pill fin-pill-red">Super Admin</span>
      </div>

      {message && <p className="fin-import-message" role="status">{message}</p>}

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
