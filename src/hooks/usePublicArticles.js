import { useEffect, useState } from 'react';
import { kabarRepository } from '../repositories/kabarRepository.js';
import { tpqRepository } from '../repositories/tpqRepository.js';
import { getSupabaseBrowserClient, getSupabasePublicStorageUrl, isSupabaseConfigured } from '../services/supabaseClient.js';

const tpqSlugs = new Set(tpqRepository.getPublicNews().map((item)=>item.slug));
const fallback = kabarRepository.getPublic().filter((item)=>item.category!=='TPQ'||tpqSlugs.has(item.slug));
function resolveImage(value=''){
  const prefix='supabase-storage://content-article-public-media/';
  return value.startsWith(prefix) ? getSupabasePublicStorageUrl('content-article-public-media',value.slice(prefix.length)) : value;
}
function map(row){const image=resolveImage(row.cover_image_url);return {id:row.id,slug:row.slug,title:row.title,excerpt:row.excerpt,body:row.body,category:row.category,tags:row.tags??[],image,coverImage:image,author:row.author_label,date:row.published_at,visibility:row.visibility,status:row.workflow_status,source:'supabase'};}

export default function usePublicArticles(){
  const [state,setState]=useState({articles:fallback,source:'repository'});
  useEffect(()=>{
    if(!isSupabaseConfigured()) return;
    let active=true;
    getSupabaseBrowserClient().from('content_articles')
      .select('id,slug,title,excerpt,body,category,tags,cover_image_url,author_label,visibility,workflow_status,published_at')
      .eq('environment','production').eq('workflow_status','Siap publik').eq('visibility','Publik').is('archived_at',null)
      .order('published_at',{ascending:false}).limit(100)
      .then(({data,error})=>{if(active&&!error&&data?.length)setState({articles:data.map(map),source:'supabase'});});
    return()=>{active=false;};
  },[]);
  return state;
}
