import { useEffect, useState } from 'react';
import { formatSupabaseError, getSupabaseBrowserClient } from '../../services/supabaseClient.js';

export default function ArticleWorkflowActions({ article, onEdit, onChanged }) {
  const [capability,setCapability] = useState({ writes_enabled:false,test_mode_enabled:false,can_write:false,can_approve:false });
  const [message,setMessage] = useState('');
  const [busy,setBusy] = useState(false);
  useEffect(()=>{ getSupabaseBrowserClient().rpc('content_article_capabilities').then(({data})=>data&&setCapability(data)); },[]);
  if (article.source !== 'supabase') return <p className="article-workflow-note">Artikel repository hanya dapat dipreview. Migrasikan atau buat draft Supabase untuk mengelolanya.</p>;
  async function act(action) {
    if (!capability.writes_enabled || !capability.test_mode_enabled || busy) return;
    setBusy(true); setMessage('Memproses...');
    const {error}=await getSupabaseBrowserClient().rpc('command_content_article',{p_action:action,p_idempotency_key:crypto.randomUUID(),p_article_id:article.id,p_expected_version:article.version,p_reason:null});
    if(error){setMessage(`Aksi gagal: ${formatSupabaseError(error)}`);setBusy(false);return;}
    await onChanged();
  }
  return <div className="article-workflow-actions">
    {capability.can_write&&['Draft','Ditolak','Dalam peninjauan'].includes(article.status)&&<><button className="fin-btn" onClick={onEdit}>Edit Draft</button><button className="fin-btn fin-btn-primary" disabled={!capability.writes_enabled||!capability.test_mode_enabled||busy} onClick={()=>act('approve')}>Publikasikan</button></>}
    {capability.can_write&&article.status!=='Arsip'&&<button className="fin-btn article-danger-button" disabled={!capability.writes_enabled||!capability.test_mode_enabled||busy} onClick={()=>act('archive')}>Arsipkan</button>}
    {capability.can_write&&article.status==='Arsip'&&<button className="fin-btn" disabled={!capability.writes_enabled||!capability.test_mode_enabled||busy} onClick={()=>act('restore')}>Pulihkan ke Draft</button>}
    {message&&<p role="status">{message}</p>}
    {(!capability.writes_enabled||!capability.test_mode_enabled)&&<p className="article-workflow-note">Mode aman aktif: semua perubahan terkunci.</p>}
  </div>;
}
