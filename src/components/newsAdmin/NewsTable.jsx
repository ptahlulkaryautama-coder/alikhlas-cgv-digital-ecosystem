import React, { useMemo, useState } from 'react';

const SearchIcon = () => <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m16.5 16.5 4 4"/></svg>;
const ArticleMark = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3h8l4 4v14H7z"/><path d="M15 3v5h4M10 12h6M10 16h6"/></svg>;

const statusClass = (status) => ({
  Draft: 'status-badge-draft',
  'Dalam peninjauan': 'status-badge-peninjauan',
  'Siap publik': 'status-badge-publik',
  Ditolak: 'status-badge-rejected',
  Arsip: 'status-badge-archived',
}[status] || 'status-badge-draft');

export default function NewsTable({ articles, onReviewArticle }) {
  const [searchQuery,setSearchQuery] = useState('');
  const [activeCategory,setActiveCategory] = useState('Semua');
  const categories = useMemo(() => ['Semua',...new Set(articles.map((item)=>item.category).filter(Boolean))],[articles]);
  const filtered = useMemo(() => {
    const query=searchQuery.trim().toLowerCase();
    return articles.filter((article)=>(activeCategory==='Semua'||article.category===activeCategory)&&(!query||[article.title,article.author,article.excerpt,...(article.tags??[])].some((value)=>String(value??'').toLowerCase().includes(query))));
  },[articles,activeCategory,searchQuery]);

  return <section className="editorial-library" aria-labelledby="editorial-library-title">
    <header className="editorial-library-head">
      <div><span className="editorial-kicker">PERPUSTAKAAN KONTEN</span><h2 id="editorial-library-title">Naskah & publikasi</h2><p>Kelola perjalanan artikel dari draft hingga siap dibaca jamaah.</p></div>
      <label className="editorial-search"><span className="sr-only">Cari artikel</span><SearchIcon/><input type="search" placeholder="Cari judul, penulis, atau tag" value={searchQuery} onChange={(event)=>setSearchQuery(event.target.value)}/></label>
    </header>
    <div className="editorial-filter-row" aria-label="Filter kategori">
      {categories.map((category)=><button type="button" key={category} className={activeCategory===category?'is-active':''} aria-pressed={activeCategory===category} onClick={()=>setActiveCategory(category)}>{category}</button>)}
      <span className="editorial-result-count">{filtered.length} artikel</span>
    </div>
    <div className="editorial-list">
      {filtered.map((article)=><article className="editorial-row" key={article.id}>
        <div className="editorial-cover">
          {article.image?<img src={article.image} alt="" loading="lazy" onError={(event)=>{event.currentTarget.hidden=true;event.currentTarget.nextElementSibling.hidden=false;}}/>:null}
          <span className="editorial-cover-fallback" hidden={Boolean(article.image)}><ArticleMark/></span>
        </div>
        <div className="editorial-row-main">
          <div className="editorial-row-top"><span className="editorial-category">{article.category||'Umum'}</span><span className={`status-badge ${statusClass(article.status)}`}>{article.status||'Draft'}</span></div>
          <h3>{article.title}</h3>
          <p>{article.excerpt||'Belum ada ringkasan artikel.'}</p>
          <div className="editorial-meta"><span>{article.author||'Tim Redaksi'}</span><i aria-hidden="true"/><span>{article.date||'Belum terbit'}</span><i aria-hidden="true"/><span>{article.visibility||'Pengurus'}</span></div>
        </div>
        <button className="editorial-review-button" type="button" onClick={()=>onReviewArticle(article)}><span>Kelola artikel</span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg></button>
      </article>)}
      {!filtered.length&&<div className="editorial-empty"><ArticleMark/><h3>Artikel tidak ditemukan</h3><p>{searchQuery || activeCategory !== 'Semua' ? 'Coba kata kunci atau kategori lainnya.' : 'Belum ada warta terdaftar. Klik "Tulis Artikel" di atas untuk membuat draf pertama.'}</p></div>}
    </div>
  </section>;
}
