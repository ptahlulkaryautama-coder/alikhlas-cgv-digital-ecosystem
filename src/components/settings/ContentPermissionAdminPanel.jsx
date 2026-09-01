import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { hasPermission } from '../../services/accessPolicy.js';
import { formatSupabaseError, getSupabaseBrowserClient } from '../../services/supabaseClient.js';

const OPTIONS=[{permission:'content:write',label:'Kelola Konten',help:'Buat, edit, preview, dan publikasi konten sendiri'},{permission:'content:approve',label:'Kelola Konten Lain',help:'Arsipkan atau pulihkan konten milik operator lain'}];

export default function ContentPermissionAdminPanel(){
  const {permissions}=useAuth();
  const [users,setUsers]=useState([]); const [grants,setGrants]=useState(new Set());
  const [message,setMessage]=useState(''); const [busyKey,setBusyKey]=useState('');
  const mayManage=hasPermission(permissions,'users:manage');
  const load=useCallback(async()=>{
    if(!mayManage)return;
    const client=getSupabaseBrowserClient();
    const [u,g]=await Promise.all([client.from('profiles').select('id,display_name,email,status').eq('status','active').order('display_name'),client.from('user_permission_grants').select('user_id,permission').in('permission',OPTIONS.map((item)=>item.permission))]);
    if(u.error||g.error){setMessage('Otorisasi artikel belum dapat dimuat. Jalankan migration artikel terbaru.');return;}
    setUsers(u.data??[]);setGrants(new Set((g.data??[]).map((item)=>`${item.user_id}:${item.permission}`)));setMessage('');
  },[mayManage]);
  useEffect(()=>{void load();},[load]);
  if(!mayManage)return null;
  async function toggle(userId,permission,enabled){const key=`${userId}:${permission}`;setBusyKey(key);const {error}=await getSupabaseBrowserClient().rpc('set_user_content_permission',{p_user_id:userId,p_permission:permission,p_enabled:enabled});setMessage(error?`Perubahan gagal: ${formatSupabaseError(error)}`:'Otorisasi artikel diperbarui dan dicatat pada audit trail.');if(!error)await load();setBusyKey('');}
  return <section className="db-card fin-permission-admin" aria-labelledby="content-permission-admin-title">
    <div className="fin-import-heading"><div><div className="db-sec-eyebrow">OTORITAS EDITORIAL</div><h2 id="content-permission-admin-title">Akses Kabar Masjid</h2><p>Berikan akses editorial tanpa mengganti role utama pengguna.</p></div><span className="fin-pill fin-pill-red">Super Admin</span></div>
    {message&&<p className="fin-import-message" role="status">{message}</p>}
    <div className="fin-permission-table-wrap"><table className="fin-table"><thead><tr><th>Pengguna</th>{OPTIONS.map((option)=><th key={option.permission}>{option.label}<small>{option.help}</small></th>)}</tr></thead><tbody>{users.map((user)=><tr key={user.id}><td><strong>{user.display_name||'Tanpa nama'}</strong><br/><small>{user.email}</small></td>{OPTIONS.map((option)=>{const key=`${user.id}:${option.permission}`;return <td key={option.permission}><label className="fin-permission-toggle"><input type="checkbox" checked={grants.has(key)} disabled={busyKey===key} onChange={(event)=>toggle(user.id,option.permission,event.target.checked)}/><span>{grants.has(key)?'Diberikan':'Tidak'}</span></label></td>;})}</tr>)}</tbody></table></div>
  </section>;
}
