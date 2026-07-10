/**
 * useFinanceData.js — Hook for the Keuangan module
 *
 * Fetches 02_Keuangan ringkasan from GAS using getPublicFinanceSummary.
 * Falls back to publicFinanceSummary from siteContent.js silently.
 *
 * Safety guarantees:
 *   - GET only. No POST calls.
 *   - Only ringkasan aggregate is surfaced — no individual transaction rows.
 *   - No donor names, private notes, or raw sheet columns.
 *   - console.warn only in DEV (via api.js logApiFallback).
 *   - AbortController cleans up on unmount.
 */

import { useEffect, useState } from 'react';
import { getPublicFinanceSummary } from '../services/api.js';
import { publicFinanceSummary } from '../data/siteContent.js';

export default function useFinanceData() {
  const [data, setData]       = useState(publicFinanceSummary);
  const [source, setSource]   = useState('fallback');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    let isMounted = true;

    getPublicFinanceSummary(publicFinanceSummary, { signal: controller.signal })
      .then((result) => {
        if (!isMounted) return;
        setData(result.data);
        setSource(result.source);
        setIsLoading(false);
      });

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  return { data, source, isLoading };
}
