import { useCallback, useEffect, useMemo, useState } from 'react';
import useIntegrationReadiness from './useIntegrationReadiness.js';
import { formatSupabaseError, getSupabaseBrowserClient, isSupabaseConfigured } from '../services/supabaseClient.js';

function normalize(result) {
  if (result.status !== 'fulfilled') return { data: null, count: 0, error: formatSupabaseError(result.reason, 'Tidak terbaca') };
  if (result.value?.error) return { data: null, count: 0, error: formatSupabaseError(result.value.error) };
  return { data: result.value?.data ?? null, count: result.value?.count ?? 0, error: '' };
}

function buildChecks({ modules, releaseCandidates, productionCounts, extraError }) {
  const trialModules = modules.filter((item) => item.rank === 'trial');
  const lockedRelease = modules.find((item) => item.id === 'release')?.label === 'Rilis terkunci';
  const hasProductionContent = productionCounts.article + productionCounts.program + productionCounts.agenda > 0;
  return [
    {
      id: 'integration-map',
      pass: modules.length > 0 && !modules.some((item) => item.rank === 'unknown'),
      title: 'Peta integrasi terbaca',
      detail: modules.length ? 'Semua capability utama dapat dirangkum.' : 'Status modul belum tersedia.',
    },
    {
      id: 'trial-switches',
      pass: trialModules.length === 0,
      title: 'Mode trial tidak aktif',
      detail: trialModules.length
        ? `${trialModules.map((item) => item.title).join(', ')} masih siap trial.`
        : 'Tidak ada lini yang sedang membuka write/test mode.',
    },
    {
      id: 'release-switch',
      pass: lockedRelease,
      title: 'Rilis production terkunci saat idle',
      detail: lockedRelease ? 'Pusat Rilis Website sedang aman/tertutup.' : 'Rilis production masih aktif atau belum terbaca.',
    },
    {
      id: 'trial-candidates',
      pass: releaseCandidates.length === 0,
      title: 'Tidak ada candidate uji menggantung',
      detail: releaseCandidates.length
        ? `${releaseCandidates.length} konten uji masih menunggu keputusan rilis/arsip.`
        : 'Release Center bersih dari konten uji siap publik.',
    },
    {
      id: 'production-content',
      pass: hasProductionContent,
      title: 'Konten production terbaca',
      detail: hasProductionContent
        ? `${productionCounts.article} artikel, ${productionCounts.program} program, ${productionCounts.agenda} agenda production.`
        : 'Belum ada konten production Supabase yang terbaca.',
    },
    {
      id: 'read-errors',
      pass: !extraError,
      title: 'Tidak ada error readiness',
      detail: extraError || 'Query readiness berjalan tanpa error utama.',
    },
  ];
}

export default function useProductionReadiness() {
  const integration = useIntegrationReadiness();
  const [state, setState] = useState({ candidates: [], productionCounts: { article: 0, program: 0, agenda: 0 }, loading: true, error: '', refreshedAt: null });

  const load = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setState({ candidates: [], productionCounts: { article: 0, program: 0, agenda: 0 }, loading: false, error: 'Supabase belum dikonfigurasi.', refreshedAt: new Date() });
      return;
    }
    setState((current) => ({ ...current, loading: true, error: '' }));
    const client = getSupabaseBrowserClient();
    const results = await Promise.allSettled([
      client.rpc('list_content_production_candidates'),
      client.from('content_articles').select('id', { count: 'exact', head: true }).eq('environment', 'production').eq('workflow_status', 'Siap publik').eq('visibility', 'Publik').is('archived_at', null),
      client.from('content_programs').select('id', { count: 'exact', head: true }).eq('environment', 'production').eq('status', 'Siap publik').eq('visibility', 'Publik').is('archived_at', null),
      client.from('content_agenda').select('id', { count: 'exact', head: true }).eq('environment', 'production').eq('status', 'Siap publik').eq('visibility', 'Publik').is('archived_at', null),
    ]);
    const [candidates, article, program, agenda] = results.map(normalize);
    setState({
      candidates: candidates.data ?? [],
      productionCounts: { article: article.count, program: program.count, agenda: agenda.count },
      loading: false,
      error: [candidates, article, program, agenda].map((item) => item.error).find(Boolean) ?? '',
      refreshedAt: new Date(),
    });
  }, []);

  useEffect(() => { void load(); }, [load]);

  const checks = useMemo(() => buildChecks({
    modules: integration.modules,
    releaseCandidates: state.candidates,
    productionCounts: state.productionCounts,
    extraError: integration.error || state.error,
  }), [integration.modules, integration.error, state.candidates, state.productionCounts, state.error]);

  const passed = checks.filter((item) => item.pass).length;
  const blocked = checks.length - passed;
  const ready = blocked === 0;

  return {
    checks,
    candidates: state.candidates,
    productionCounts: state.productionCounts,
    passed,
    blocked,
    ready,
    loading: integration.loading || state.loading,
    error: integration.error || state.error,
    refreshedAt: state.refreshedAt,
    retry: async () => {
      await Promise.all([integration.retry(), load()]);
    },
  };
}
