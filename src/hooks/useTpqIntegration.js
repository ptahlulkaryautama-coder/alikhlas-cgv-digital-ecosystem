import { useEffect, useState } from 'react';
import { tpqRepository } from '../repositories/tpqRepository.js';

const initial = tpqRepository.getAll();

export default function useTpqIntegration() {
  const [data, setData] = useState({ schedule: initial.classes, agenda: initial.agenda, learningFocus: initial.curriculum });
  const [sourceStatus, setSourceStatus] = useState(tpqRepository.getSourceStatus());
  const [capabilities, setCapabilities] = useState({ read_enabled: false, writes_enabled: false, can_private_read: false, can_private_write: false });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [actionMessage, setActionMessage] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    let mounted = true;
    setIsLoading(true);

    Promise.all([
      tpqRepository.getIntegratedProjection({ signal: controller.signal }),
      tpqRepository.getCapabilities(),
    ]).then(([next, caps]) => {
      if (!mounted) return;
      setData(next);
      setSourceStatus(tpqRepository.getSourceStatus());
      setCapabilities(caps);
      setIsLoading(false);
    });

    return () => {
      mounted = false;
      controller.abort();
    };
  }, []);

  const saveAttendance = async (sessionData) => {
    setIsSaving(true);
    setActionMessage(null);
    const result = await tpqRepository.saveAttendanceSession(sessionData);
    setIsSaving(false);
    if (!result.success) {
      setActionMessage({ type: 'error', text: `Draft presensi belum tersimpan: ${result.error}` });
      return false;
    }
    setActionMessage({ type: 'success', text: 'Catatan presensi berhasil disimpan ke vault aman.' });
    return true;
  };

  const saveProgress = async (progressData) => {
    setIsSaving(true);
    setActionMessage(null);
    const result = await tpqRepository.saveProgressNote(progressData);
    setIsSaving(false);
    if (!result.success) {
      setActionMessage({ type: 'error', text: `Draft progres belum tersimpan: ${result.error}` });
      return false;
    }
    setActionMessage({ type: 'success', text: 'Catatan progres belajar berhasil disimpan ke vault aman.' });
    return true;
  };

  const saveRaport = async (raportData) => {
    setIsSaving(true);
    setActionMessage(null);
    const result = await tpqRepository.saveRaportDraft(raportData);
    setIsSaving(false);
    if (!result.success) {
      setActionMessage({ type: 'error', text: `Draft raport belum tersimpan: ${result.error}` });
      return false;
    }
    setActionMessage({ type: 'success', text: 'Draft raport santri berhasil disimpan.' });
    return true;
  };

  return {
    ...data,
    sourceStatus,
    capabilities,
    isLoading,
    isSaving,
    actionMessage,
    saveAttendance,
    saveProgress,
    saveRaport,
  };
}
