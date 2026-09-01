import { useCallback, useEffect, useState } from 'react';
import { kabarRepository } from '../repositories/kabarRepository.js';
import { getSupabaseBrowserClient } from '../services/supabaseClient.js';

function mapArticle(row, signedImage = '') {
  return {
    id: row.id, slug: row.slug, title: row.title, excerpt: row.excerpt, content: row.body, body: row.body,
    category: row.category, tags: row.tags ?? [], image: signedImage || row.cover_image_url, imagePath: row.cover_image_path,
    author: row.author_label, visibility: row.visibility, status: row.workflow_status,
    version: row.version, createdBy: row.created_by, rejectionReason: row.rejection_reason, environment: row.environment,
    date: row.published_at ? new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' }).format(new Date(row.published_at)) : 'Belum terbit', source: 'supabase',
  };
}

export default function useArticlesAdmin() {
  const fallback = kabarRepository.getAll();
  const [state, setState] = useState({ articles: fallback, source: 'repository', loading: true, error: '' });
  const load = useCallback(async () => {
    setState((current) => ({ ...current, loading: true, error: '' }));
    const client = getSupabaseBrowserClient();
    const { data, error } = await client.from('content_articles')
      .select('id,slug,title,excerpt,body,category,tags,cover_image_url,cover_image_path,author_label,visibility,workflow_status,version,created_by,rejection_reason,published_at,updated_at,environment')
      .order('updated_at', { ascending: false }).limit(100);
    const rows = data ?? [];
    const paths = rows.map((row) => row.cover_image_path).filter(Boolean);
    const signed = paths.length ? await client.storage.from('content-article-test-media').createSignedUrls(paths, 3600) : { data: [] };
    const signedByPath = new Map((signed.data ?? []).map((item) => [item.path, item.signedUrl]));
    setState(error
      ? { articles: fallback, source: 'repository', loading: false, error: 'Artikel Supabase belum tersedia; menampilkan repository lokal.' }
      : { articles: rows.map((row) => mapArticle(row, signedByPath.get(row.cover_image_path))), source: 'supabase', loading: false, error: '' });
  }, []);
  useEffect(() => { void load(); }, [load]);
  return { ...state, retry: load };
}
