import { useCallback, useEffect, useState } from 'react';
import { buildFinanceReadModel } from '../services/financeReadModel.js';
import { getSupabaseBrowserClient, isSupabaseConfigured } from '../services/supabaseClient.js';

const SAFE_TRANSACTION_COLUMNS = 'id,transaction_date,direction,category,subcategory,fund_purpose,public_description,payment_method,amount,record_status';

export default function useSupabaseFinanceReadModel(scope, period) {
  const [state, setState] = useState({ data: null, isLoading: false, error: '', source: 'fallback' });
  const load = useCallback(async () => {
    if (!scope || !isSupabaseConfigured()) {
      setState({ data: null, isLoading: false, error: '', source: 'fallback' });
      return;
    }
    setState((current) => ({ ...current, isLoading: true, error: '' }));
    const client = getSupabaseBrowserClient();
    let batchQuery = client.from('finance_import_batches')
      .select('id,scope,period,opening_balance,environment,workflow_status,source_kind,created_at')
      .eq('scope', scope).eq('status', 'committed').in('workflow_status', ['approved', 'published']);
    if (period) batchQuery = batchQuery.eq('period', period);
    const batchResult = await batchQuery.order('created_at', { ascending: false });
    if (batchResult.error) {
      setState({ data: null, isLoading: false, error: 'Data Supabase belum dapat dimuat.', source: 'error' });
      return;
    }
    if (!batchResult.data?.length) {
      setState({ data: null, isLoading: false, error: '', source: 'empty' });
      return;
    }
    const importBatch = batchResult.data.find((batch) => batch.source_kind !== 'manual');
    const manualBatches = batchResult.data.filter((batch) => batch.source_kind === 'manual' && batch.workflow_status === 'published');
    const includedBatches = [...(importBatch ? [importBatch] : []), ...manualBatches];
    if (!includedBatches.length) {
      setState({ data: null, isLoading: false, error: '', source: 'empty' });
      return;
    }
    const transactionResult = await client.from('finance_transactions')
      .select(SAFE_TRANSACTION_COLUMNS).in('batch_id', includedBatches.map((batch) => batch.id))
      .order('transaction_date', { ascending: true }).order('id', { ascending: true });
    if (transactionResult.error) {
      setState({ data: null, isLoading: false, error: 'Transaksi Supabase belum dapat dimuat.', source: 'error' });
      return;
    }
    const aggregateBatch = { ...(importBatch ?? includedBatches[0]), id: includedBatches.map((batch) => batch.id).join(','), opening_balance: importBatch?.opening_balance ?? 0 };
    setState({ data: buildFinanceReadModel(aggregateBatch, transactionResult.data ?? []), isLoading: false, error: '', source: 'supabase' });
  }, [scope, period]);

  useEffect(() => { void load(); }, [load]);
  useEffect(() => {
    const refresh = (event) => { if (!event.detail?.scope || event.detail.scope === scope) void load(); };
    window.addEventListener('finance-ledger-updated', refresh);
    return () => window.removeEventListener('finance-ledger-updated', refresh);
  }, [load, scope]);
  return { ...state, retry: load };
}
