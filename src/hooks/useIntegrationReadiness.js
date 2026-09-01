import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { hasPermission } from '../services/accessPolicy.js';
import { formatSupabaseError, getSupabaseBrowserClient, isSupabaseConfigured } from '../services/supabaseClient.js';

const MODULES = Object.freeze([
  { id: 'identity', title: 'Login & Role', area: 'Foundation' },
  { id: 'article', title: 'Kabar Masjid', area: 'Konten' },
  { id: 'program', title: 'Program', area: 'Konten' },
  { id: 'agenda', title: 'Agenda', area: 'Konten' },
  { id: 'release', title: 'Rilis Website', area: 'Website' },
  { id: 'financeDkm', title: 'Keuangan DKM', area: 'Finance' },
  { id: 'financeTpq', title: 'Keuangan TPQ', area: 'Finance' },
  { id: 'tpq', title: 'Portal TPQ', area: 'TPQ' },
]);

function status(rank, label, detail, action = '') {
  return { rank, label, detail, action };
}

function normalizeSettled(result) {
  if (result.status !== 'fulfilled') return { data: null, error: formatSupabaseError(result.reason, 'Tidak terbaca') };
  if (result.value?.error) return { data: null, error: formatSupabaseError(result.value.error) };
  return { data: result.value?.data ?? null, error: '' };
}

function writeState(capability) {
  if (!capability) return status('unknown', 'Belum terbaca', 'Capability RPC belum tersedia.');
  if (!capability.can_write) return status('locked', 'Akses terbatas', 'Akun ini belum punya izin tulis modul.');
  if (!capability.writes_enabled || !capability.test_mode_enabled) return status('locked', 'Write terkunci', 'Kill switch test/write sedang nonaktif.');
  return status('trial', 'Siap trial', 'Input, edit, preview, dan publish uji tersedia.');
}

function financeState(importCap, manualCap, label) {
  if (!importCap && !manualCap) return status('unknown', 'Belum terbaca', `${label} belum dapat dicek.`);
  const canPrepare = Boolean(importCap?.can_prepare || manualCap?.can_prepare);
  const anyEnabled = Boolean(
    (importCap?.writes_enabled && importCap?.test_mode_enabled)
    || (manualCap?.writes_enabled && manualCap?.test_mode_enabled),
  );
  if (!canPrepare) return status('locked', 'Akses terbatas', `${label} belum punya izin input.`);
  if (!anyEnabled) return status('locked', 'Write terkunci', `${label} aman, belum membuka import/manual write.`);
  return status('trial', 'Siap trial', `${label} import/manual dapat diuji dengan audit.`);
}

function buildReadiness({ auth, rpc, counts }) {
  const article = writeState(rpc.article);
  const program = writeState(rpc.program);
  const agenda = writeState(rpc.agenda);
  const releaseEnabled = Boolean(rpc.release?.release_enabled);
  const canRelease = Boolean(rpc.release?.can_release);
  const release = !canRelease
    ? status('locked', 'Akses terbatas', 'Akun ini belum punya izin rilis website.')
    : releaseEnabled
      ? status('ready', 'Rilis aktif', 'Pusat Rilis Website dapat menyalin konten production.')
      : status('locked', 'Rilis terkunci', 'Production release sengaja dikunci saat tidak dipakai.');
  const tpq = hasPermission(auth.permissions, 'tpq:read')
    ? status('ready', 'Public-safe', `Projection TPQ agregat terbaca${counts.tpq ? ` (${counts.tpq} sumber)` : ''}.`)
    : status('locked', 'Akses terbatas', 'Data TPQ tetap tertutup dari akun ini.');

  return [
    {
      ...MODULES.find((item) => item.id === 'identity'),
      ...status(auth.isAuthenticated ? 'ready' : 'locked', auth.isAuthenticated ? 'Akun aktif' : 'Belum login', auth.profile?.email ?? auth.accessError ?? 'Supabase Auth belum aktif.'),
    },
    { ...MODULES.find((item) => item.id === 'article'), ...article },
    { ...MODULES.find((item) => item.id === 'program'), ...program },
    { ...MODULES.find((item) => item.id === 'agenda'), ...agenda },
    { ...MODULES.find((item) => item.id === 'release'), ...release },
    { ...MODULES.find((item) => item.id === 'financeDkm'), ...financeState(rpc.financeImportDkm, rpc.financeManualDkm, 'DKM') },
    { ...MODULES.find((item) => item.id === 'financeTpq'), ...financeState(rpc.financeImportTpq, rpc.financeManualTpq, 'TPQ') },
    { ...MODULES.find((item) => item.id === 'tpq'), ...tpq },
  ];
}

export default function useIntegrationReadiness() {
  const auth = useAuth();
  const [state, setState] = useState({ modules: [], loading: true, error: '', refreshedAt: null });

  const load = useCallback(async () => {
    if (!isSupabaseConfigured() || !auth.isAuthenticated) {
      setState({ modules: buildReadiness({ auth, rpc: {}, counts: {} }), loading: false, error: auth.accessError, refreshedAt: new Date() });
      return;
    }
    setState((current) => ({ ...current, loading: true, error: '' }));
    const client = getSupabaseBrowserClient();
    const results = await Promise.allSettled([
      client.rpc('content_article_capabilities'),
      client.rpc('content_program_capabilities'),
      client.rpc('content_agenda_capabilities'),
      client.rpc('content_production_release_capabilities'),
      client.rpc('finance_import_capabilities', { p_scope: 'dkm' }),
      client.rpc('finance_import_capabilities', { p_scope: 'tpq' }),
      client.rpc('finance_manual_capabilities', { p_scope: 'dkm' }),
      client.rpc('finance_manual_capabilities', { p_scope: 'tpq' }),
      client.from('tpq_public_schedule').select('id', { count: 'exact', head: true }),
      client.from('tpq_public_agenda').select('id', { count: 'exact', head: true }),
      client.from('tpq_public_learning_focus').select('id', { count: 'exact', head: true }),
    ]);
    const [article, program, agenda, release, financeImportDkm, financeImportTpq, financeManualDkm, financeManualTpq, tpqSchedule, tpqAgenda, tpqFocus] = results.map(normalizeSettled);
    const rpc = {
      article: article.data,
      program: program.data,
      agenda: agenda.data,
      release: release.data,
      financeImportDkm: financeImportDkm.data,
      financeImportTpq: financeImportTpq.data,
      financeManualDkm: financeManualDkm.data,
      financeManualTpq: financeManualTpq.data,
    };
    const counts = { tpq: [tpqSchedule, tpqAgenda, tpqFocus].filter((item) => item.error === '').length };
    const errors = results.map(normalizeSettled).map((item) => item.error).filter(Boolean);
    setState({ modules: buildReadiness({ auth, rpc, counts }), loading: false, error: errors[0] ?? '', refreshedAt: new Date() });
  }, [auth]);

  useEffect(() => { void load(); }, [load]);

  return { ...state, retry: load };
}
