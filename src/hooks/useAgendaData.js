import { useCallback, useEffect, useState } from 'react';
import { agendaRepository } from '../repositories/agendaRepository.js';

/** Thin React adapter over the canonical read-only Agenda repository. */
export default function useAgendaData({ scope = 'public' } = {}) {
  const isAdmin = scope === 'admin';
  const [agenda, setAgenda] = useState(() => isAdmin
    ? agendaRepository.getInitialAll()
    : agendaRepository.getInitialPublic());
  const [sourceStatus, setSourceStatus] = useState(agendaRepository.getSourceStatus());
  const [isLoading, setIsLoading] = useState(false);

  const load = useCallback(async ({ signal } = {}) => {
    setIsLoading(true);
    const read = isAdmin ? agendaRepository.getAll : agendaRepository.getPublic;
    const data = await read({ signal });
    if (signal?.aborted) return;
    setAgenda(data);
    setSourceStatus(agendaRepository.getSourceStatus());
    setIsLoading(false);
  }, [isAdmin]);

  useEffect(() => {
    const controller = new AbortController();
    void load({ signal: controller.signal });
    return () => controller.abort();
  }, [load]);

  return {
    agenda,
    source: sourceStatus.type === 'supabase' ? 'supabase' : sourceStatus.type === 'remote-proxy' ? 'api' : 'fallback',
    sourceStatus,
    isLoading,
    retry: () => load(),
  };
}
