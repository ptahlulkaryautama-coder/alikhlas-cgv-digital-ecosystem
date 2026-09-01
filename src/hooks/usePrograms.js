import { useCallback, useEffect, useState } from 'react';
import { programRepository } from '../repositories/programRepository.js';

export default function usePrograms({ scope = 'public' } = {}) {
  const isAdmin = scope === 'admin';
  const [programs, setPrograms] = useState(() => isAdmin ? programRepository.getInitialAll() : programRepository.getInitialPublic());
  const [isLoading, setIsLoading] = useState(false);
  const [sourceStatus, setSourceStatus] = useState(programRepository.getSourceStatus());

  const load = useCallback(async ({ signal } = {}) => {
    setIsLoading(true);
    const read = isAdmin ? programRepository.getAll : programRepository.getPublic;
    const data = await read({ signal });
    if (signal?.aborted) return;
    setPrograms(data);
    setSourceStatus(programRepository.getSourceStatus());
    setIsLoading(false);
  }, [isAdmin]);

  useEffect(() => {
    const controller = new AbortController();
    void load({ signal: controller.signal });
    return () => controller.abort();
  }, [load]);

  return {
    programs,
    isLoading,
    source: sourceStatus.type === 'supabase' ? 'supabase' : sourceStatus.type === 'remote-proxy' ? 'api' : 'fallback',
    sourceStatus,
    retry: () => load(),
  };
}
