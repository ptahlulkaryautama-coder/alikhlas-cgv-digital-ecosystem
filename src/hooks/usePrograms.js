import { useEffect, useState } from 'react';
import { programs as fallbackPrograms } from '../data/siteContent.js';
import { getPublicPrograms, normalizeProgram } from '../services/api.js';

const normalizedFallbackPrograms = fallbackPrograms.map(normalizeProgram);

export default function usePrograms() {
  const [programs, setPrograms] = useState(normalizedFallbackPrograms);
  const [isLoading, setIsLoading] = useState(true);
  const [source, setSource] = useState('fallback');

  useEffect(() => {
    const controller = new AbortController();
    let isMounted = true;

    getPublicPrograms(fallbackPrograms, { signal: controller.signal }).then((result) => {
      if (!isMounted) {
        return;
      }

      setPrograms(result.data);
      setSource(result.source);
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  return {
    programs,
    isLoading,
    source,
  };
}
