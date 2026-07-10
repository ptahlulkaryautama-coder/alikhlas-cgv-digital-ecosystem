import { useEffect, useState } from 'react';
import { publicFinanceSummary } from '../data/siteContent.js';
import { getPublicFinanceSummary } from '../services/api.js';

export default function useFinanceSummary() {
  const [summary, setSummary] = useState(publicFinanceSummary);
  const [isLoading, setIsLoading] = useState(true);
  const [source, setSource] = useState('fallback');

  useEffect(() => {
    const controller = new AbortController();
    let isMounted = true;

    getPublicFinanceSummary(publicFinanceSummary, { signal: controller.signal }).then((result) => {
      if (!isMounted) {
        return;
      }

      setSummary(result.data);
      setSource(result.source);
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  return {
    summary,
    isLoading,
    source,
  };
}
