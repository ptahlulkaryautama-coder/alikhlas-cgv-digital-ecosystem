import { useEffect, useMemo, useState } from 'react';
import { formatSupabaseError, getSupabaseBrowserClient } from '../../services/supabaseClient.js';

const EMPTY = { title:'',slug:'',category:'Kegiatan',excerpt:'',body:'',authorLabel:'',visibility:'Pengurus',coverImageUrl:'',tags:'' };
const slugify = (value) => value.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,160);
const editSlug = (value) => value.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,'').replace(/-{2,}/g,'-').slice(0,160);
function validate(form) {
  const errors = {};
  if (form.title.trim().length < 5) errors.title = 'Judul minimal 5 karakter.';
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(form.slug)) errors.slug = 'Slug hanya huruf kecil, angka, dan tanda hubung.';
  if (!form.category.trim()) errors.category = 'Kategori wajib diisi.';
  if (form.coverImageUrl && !/^https:\/\//i.test(form.coverImageUrl)) errors.coverImageUrl = 'Gunakan URL gambar HTTPS.';
  return errors;
}

export default function ArticleEditor({ article = null, onClose, onSaved }) {
  const [form,setForm] = useState(article ? { title:article.title,slug:article.slug,category:article.category,excerpt:article.excerpt??'',body:article.content??'',authorLabel:article.author??'',visibility:article.visibility??'Pengurus',coverImageUrl:article.imagePath?'':article.image??'',tags:(article.tags??[]).join(', ') } : EMPTY);
  const [capability,setCapability] = useState({ writes_enabled:false,test_mode_enabled:false,media_test_enabled:false,can_write:false });
  const [message,setMessage] = useState('');
  const [saving,setSaving] = useState(false);
  const [coverFile,setCoverFile] = useState(null);
  const [localPreview,setLocalPreview] = useState('');
  const errors = useMemo(() => validate(form),[form]);
  const canSave = capability.writes_enabled && capability.test_mode_enabled && capability.can_write && !saving && Object.keys(errors).length === 0;
  useEffect(() => { getSupabaseBrowserClient().rpc('content_article_capabilities').then(({data}) => data && setCapability(data)); },[]);
  useEffect(() => () => { if (localPreview) URL.revokeObjectURL(localPreview); },[localPreview]);
  const update = (field,value) => setForm((current) => ({...current,[field]:value,...(field==='title'&&!current.slug?{slug:slugify(value)}:{})}));

  function chooseCover(event) {
    const file=event.target.files?.[0]??null;
    if(!file){setCoverFile(null);setLocalPreview('');return;}
    if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>5*1024*1024){
      setMessage('Foto harus JPG, PNG, atau WebP dengan ukuran maksimal 5 MB.');event.target.value='';return;
    }
    setCoverFile(file);setLocalPreview(URL.createObjectURL(file));setMessage('Foto siap diunggah bersama draft.');
  }

  async function save() {
    if (!canSave) return;
    setSaving(true); setMessage('Menyimpan draft...');
    const client=getSupabaseBrowserClient();
    const { data:saveResult,error } = await client.rpc('command_content_article', { p_action:article?'update':'create',p_idempotency_key:crypto.randomUUID(),p_article_id:article?.id??null,p_expected_version:article?.version??null,p_payload:{
      slug:form.slug,title:form.title,excerpt:form.excerpt,body:form.body,category:form.category,
      tags:form.tags.split(',').map((tag)=>tag.trim()).filter(Boolean).slice(0,12),cover_image_url:form.coverImageUrl,
      author_label:form.authorLabel,visibility:form.visibility,
    }});
    if (error) { setMessage(`Draft belum tersimpan: ${formatSupabaseError(error)}`); setSaving(false); return; }
    if(coverFile){
      if(!capability.media_test_enabled){setMessage('Draft tersimpan, tetapi upload foto masih terkunci.');setSaving(false);return;}
      const {data:userData}=await client.auth.getUser();
      if(!userData.user){setMessage('Draft tersimpan, tetapi sesi upload tidak ditemukan. Silakan login ulang.');setSaving(false);return;}
      const extension=coverFile.type==='image/jpeg'?'jpg':coverFile.type.split('/')[1];
      const objectPath=`${userData.user.id}/${crypto.randomUUID()}.${extension}`;
      const uploaded=await client.storage.from('content-article-test-media').upload(objectPath,coverFile,{contentType:coverFile.type,upsert:false});
      if(uploaded.error){setMessage(`Draft tersimpan, tetapi foto gagal diunggah: ${formatSupabaseError(uploaded.error)}`);setSaving(false);return;}
      const attached=await client.rpc('attach_content_article_test_media',{p_article_id:saveResult.id,p_expected_version:saveResult.version,p_object_path:objectPath,p_idempotency_key:crypto.randomUUID()});
      if(attached.error){await client.storage.from('content-article-test-media').remove([objectPath]);setMessage(`Draft tersimpan, tetapi foto gagal ditautkan: ${formatSupabaseError(attached.error)}`);setSaving(false);return;}
    }
    await onSaved(); onClose();
  }

  const previewImage=localPreview||article?.image||form.coverImageUrl;
  return <div className="article-editor-scrim" onMouseDown={(event)=>event.target===event.currentTarget&&onClose()}>
    <section className="article-editor" role="dialog" aria-modal="true" aria-labelledby="article-editor-title">
      <header className="article-editor-header"><div><span className="db-sec-eyebrow">EDITORIAL WORKSPACE</span><h2 id="article-editor-title">{article?'Edit Draft Artikel':'Tulis Artikel Baru'}</h2><p>Draft tidak langsung tampil di website.</p></div><button className="article-editor-close" type="button" onClick={onClose} aria-label="Tutup editor">×</button></header>
      <div className="article-editor-grid"><form className="article-editor-form" onSubmit={(event)=>{event.preventDefault();void save();}}>
        <div className="article-form-row"><label>Judul artikel *<input value={form.title} onChange={(e)=>update('title',e.target.value)} maxLength="180" />{errors.title&&<small role="alert">{errors.title}</small>}</label><label>Slug URL *<input value={form.slug} onChange={(e)=>update('slug',editSlug(e.target.value))} onBlur={(e)=>update('slug',slugify(e.target.value))} maxLength="160" />{errors.slug&&<small role="alert">{errors.slug}</small>}</label></div>
        <div className="article-form-row"><label>Kategori *<input value={form.category} onChange={(e)=>update('category',e.target.value)} maxLength="80" />{errors.category&&<small role="alert">{errors.category}</small>}</label><label>Akses<select value={form.visibility} onChange={(e)=>update('visibility',e.target.value)}><option>Pengurus</option><option>Publik</option></select></label></div>
        <label>Ringkasan <span>{form.excerpt.length}/500</span><textarea value={form.excerpt} onChange={(e)=>update('excerpt',e.target.value)} maxLength="500" rows="3" /></label>
        <label>Isi artikel <span>{form.body.length}/30.000</span><textarea className="article-body-input" value={form.body} onChange={(e)=>update('body',e.target.value)} maxLength="30000" rows="12" /></label>
        <div className="article-form-row"><label>Nama penulis<input value={form.authorLabel} onChange={(e)=>update('authorLabel',e.target.value)} maxLength="120" /></label><label>Tags dipisahkan koma<input value={form.tags} onChange={(e)=>update('tags',e.target.value)} /></label></div>
        <label>Upload foto sampul (JPG, PNG, atau WebP · maks. 5 MB)<input className="article-media-input" type="file" accept="image/jpeg,image/png,image/webp" disabled={!capability.media_test_enabled} onChange={chooseCover}/>{localPreview&&<img className="article-media-inline-preview" src={localPreview} alt="Foto sampul yang siap diunggah" />}{article?.imagePath&&!coverFile&&<small>Foto privat yang tersimpan tetap digunakan.</small>}</label>
        <label>Atau URL gambar sampul HTTPS<input type="url" value={form.coverImageUrl} disabled={Boolean(coverFile)} onChange={(e)=>update('coverImageUrl',e.target.value)} />{errors.coverImageUrl&&<small role="alert">{errors.coverImageUrl}</small>}</label>
        {message&&<p className="article-editor-message" role="status">{message}</p>}
        <div className="article-editor-actions"><button className="fin-btn" type="button" onClick={onClose}>Batal</button><button className="fin-btn fin-btn-primary" type="submit" disabled={!canSave}>{saving?'Menyimpan...':'Simpan Draft'}</button></div>
        {(!capability.writes_enabled||!capability.test_mode_enabled)&&<p className="article-editor-lock">Mode aman aktif. Penyimpanan tersedia setelah kedua kill switch artikel uji diaktifkan.</p>}
      </form><aside className="article-live-preview" aria-label="Pratinjau artikel"><span className="db-sec-eyebrow">PREVIEW WEBSITE</span>{previewImage&&<img src={previewImage} alt="Pratinjau sampul artikel" />}<div className="article-preview-meta">{form.category||'Kategori'} · {form.authorLabel||'Nama penulis'}</div><h3>{form.title||'Judul artikel akan tampil di sini'}</h3><p className="article-preview-excerpt">{form.excerpt||'Ringkasan artikel akan tampil di sini.'}</p><div className="article-preview-body">{form.body||'Mulai tulis isi artikel untuk melihat preview.'}</div><span className="fin-pill fin-status-draft">Draft · {form.visibility}</span></aside></div>
    </section>
  </div>;
}
