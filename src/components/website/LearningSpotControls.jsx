import React from 'react';

export default function LearningSpotControls({
  items = [],
  activeIndex = 0,
  onSelect = () => {},
  onPrev = () => {},
  onNext = () => {},
  onTogglePause = () => {},
  isPaused = false,
  isManuallyPaused = false,
}) {
  const totalCount = items.length;
  const currentNum = activeIndex + 1;

  return (
    <div className="learning-spot-toolbar" role="toolbar" aria-label="Kontrol putar dan navigasi sejenak belajar">
      <button
        type="button"
        className="learning-spot-ctrl-btn focus-ring"
        onClick={onPrev}
        aria-label="Tampilkan item sebelumnya"
        title="Sebelumnya (Panah Kiri)"
      >
        <span aria-hidden="true">←</span> Sebelumnya
      </button>

      <button
        type="button"
        className={`learning-spot-ctrl-btn learning-spot-pause-btn focus-ring ${isManuallyPaused ? 'is-paused' : ''}`}
        onClick={onTogglePause}
        aria-label={isPaused ? 'Lanjutkan rotasi otomatis' : 'Jeda rotasi otomatis'}
        title={isPaused ? 'Lanjutkan rotasi' : 'Jeda rotasi'}
      >
        {isPaused ? '▶ Lanjutkan' : '⏸ Jeda'}
      </button>

      <button
        type="button"
        className="learning-spot-ctrl-btn focus-ring"
        onClick={onNext}
        aria-label="Tampilkan item berikutnya"
        title="Berikutnya (Panah Kanan)"
      >
        Berikutnya <span aria-hidden="true">→</span>
      </button>

      <span className="learning-spot-counter" aria-label={`Item ${currentNum} dari ${totalCount}`}>
        {currentNum} / {totalCount}
      </span>
    </div>
  );
}

