import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import LearningSpotControls from './LearningSpotControls.jsx';
import '../../styles/learningSpot.css';

export const learningItems = [
  {
    id: 'masjid',
    type: 'quran',
    label: "Al-Qur'an",
    category: 'Keutamaan Masjid',
    quote: 'إِنَّمَا يَعْمُرُ مَسَاجِدَ اللَّهِ مَنْ آمَنَ بِاللَّهِ وَالْيَوْمِ الْآخِرِ وَأَقَامَ الصَّلَاةَ وَآتَى الزَّكَاةَ وَلَمْ يَخْشَ إِلَّا اللَّهَ',
    arabic: 'إِنَّمَا يَعْمُرُ مَسَاجِدَ اللَّهِ مَنْ آمَنَ بِاللَّهِ وَالْيَوْمِ الْآخِرِ وَأَقَامَ الصَّلَاةَ وَآتَى الزَّكَاةَ وَلَمْ يَخْشَ إِلَّا اللَّهَ',
    translation: '"Hanyalah yang memakmurkan masjid-masjid Allah ialah orang-orang yang beriman kepada Allah dan Hari Kemudian, serta tetap mendirikan salat, menunaikan zakat, dan tidak takut selain kepada Allah."',
    source: 'QS. At-Tawbah · Ayat 18',
    reference: 'Tafsir Ibnu Katsir - Surah At-Tawbah Ayat 18',
    topic: 'Memakmurkan Rumah Allah',
    highlightedPhrase: 'Keutamaan Memakmurkan Masjid',
    status: 'Siap publik',
    isVerified: true,
    displayDuration: 14000,
    ctaLabel: 'Lihat Jadwal Salat & Kegiatan',
    ctaHref: '/agenda',
  },
  {
    id: 'ilmu',
    type: 'hadith',
    label: 'Hadits',
    category: 'Menuntut Ilmu',
    quote: 'مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ',
    arabic: 'مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ',
    translation: '"Barangsiapa menempuh suatu jalan untuk menuntut ilmu, maka Allah akan memudahkan baginya jalan menuju surga."',
    source: 'HR. Muslim · No. 2699',
    reference: 'Shahih Muslim - Kitab Az-Zikr wad-Du\'a',
    topic: 'Keutamaan Majelis Ilmu',
    highlightedPhrase: 'Jalan Kemudahan Menuju Surga',
    status: 'Siap publik',
    isVerified: true,
    displayDuration: 14000,
    ctaLabel: 'Ikuti Program Pengajian',
    ctaHref: '/program',
  },
  {
    id: 'kitab',
    type: 'book',
    label: 'Kutipan Kitab',
    category: 'Kajian Kitab',
    quote: 'تَفَقَّهُوا قَبْلَ أَنْ تُسَوَّدُوا',
    arabic: 'تَفَقَّهُوا قَبْلَ أَنْ تُسَوَّدُوا',
    translation: '"Pelajarilah ilmu agama dan fahamilah dengan mendalam sebelum kalian disibukkan oleh tanggung jawab kepemimpinan."',
    source: 'Kitab Al-Ilmu · Imam Al-Bukhari',
    reference: 'Shahih Al-Bukhari - Kitab Al-Ilmu Bab 15',
    topic: 'Semangat Belajar Agama',
    highlightedPhrase: 'Pemahaman Agama Sebelum Tanggung Jawab',
    status: 'Siap publik',
    isVerified: true,
    displayDuration: 14000,
    ctaLabel: 'Lihat Info Kajian Kitab',
    ctaHref: '/program',
  },
  {
    id: 'ulama',
    type: 'scholar_quote',
    label: 'Kalam Ulama',
    category: 'Nasihat Ulama',
    quote: 'مَنْ أَرَادَ الدُّنْيَا فَعَلَيْهِ بِالْعِلْمِ وَمَنْ أَرَادَ الْآخِرَةَ فَعَلَيْهِ بِالْعِلْمِ',
    arabic: 'مَنْ أَرَادَ الدُّنْيَا فَعَلَيْهِ بِالْعِلْمِ وَمَنْ أَرَادَ الْآخِرَةَ فَعَلَيْهِ بِالْعِلْمِ',
    translation: '"Barangsiapa yang menginginkan kebahagiaan dunia hendaklah dengan ilmu, dan barangsiapa yang menginginkan kebahagiaan akhirat hendaklah dengan ilmu."',
    source: "Nasihat Imam Asy-Syafi'i",
    reference: "Diwan Al-Imam Asy-Syafi'i",
    topic: 'Ilmu Kunci Kebahagiaan',
    highlightedPhrase: 'Ilmu Kunci Kebahagiaan Dua Negeri',
    status: 'Siap publik',
    isVerified: true,
    displayDuration: 14000,
    ctaLabel: 'Lihat Semua Program Kajian',
    ctaHref: '/program',
  },
  {
    id: 'adab',
    type: 'adab',
    label: 'Adab & Akhlak',
    category: 'Adab Penuntut Ilmu',
    quote: 'تَعَلَّمُوا الْعِلْمَ وَتَعَلَّمُوا لِلْعِلْمِ السَّكِينَةَ وَالْوَقَارَ',
    arabic: 'تَعَلَّمُوا الْعِلْمَ وَتَعَلَّمُوا لِلْعِلْمِ السَّكِينَةَ وَالْوَقَارَ',
    translation: '"Pelajarilah ilmu, dan pelajarilah sikap tenang serta penuh kehormatan untuk mendampingi ilmu tersebut."',
    source: 'Pesan Adab · Umar bin Al-Khattab r.a.',
    reference: "Jami' Bayan Al-Ilmi wa Fadhlihi",
    topic: 'Ketenangan & Kehormatan Ilmu',
    highlightedPhrase: 'Ketenangan & Kehormatan Penuntut Ilmu',
    status: 'Siap publik',
    isVerified: true,
    displayDuration: 14000,
    ctaLabel: 'Ikuti Pengajian & Program Kajian',
    ctaHref: '/program',
  },
];

export default function LearningSpot() {
  const sectionRef = useRef(null);

  // Public Filter: Only render verified entries where status is "Siap publik" (or "Diterbitkan")
  const activeItems = useMemo(() => {
    return learningItems.filter(
      (item) =>
        item.isVerified === true &&
        (item.status === 'Siap publik' || item.status === 'Diterbitkan')
    );
  }, []);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isManuallyPaused, setIsManuallyPaused] = useState(false);
  const [isIntersecting, setIsIntersecting] = useState(true);
  const [isTabHidden, setIsTabHidden] = useState(false);
  const [isFading, setIsFading] = useState(false);

  const currentItem = activeItems[activeIndex] || activeItems[0];
  const duration = Math.max(currentItem?.displayDuration || 14000, 14000);

  // Native IntersectionObserver API: Track viewport visibility
  useEffect(() => {
    if (!sectionRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      { threshold: 0.25 }
    );

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Native Page Visibility API: Track tab visibility
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsTabHidden(document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Determine effective play state (Autoplay only when in viewport AND tab visible AND user has NOT manually paused)
  const isPlaying = isIntersecting && !isTabHidden && !isManuallyPaused;

  useEffect(() => {
    if (!isPlaying || activeItems.length === 0) return;

    const timer = setInterval(() => {
      handleSwitch((prev) => (prev + 1) % activeItems.length);
    }, duration);

    return () => clearInterval(timer);
  }, [isPlaying, activeItems.length, duration]);

  const handleSwitch = (newIndexOrFn) => {
    setIsFading(true);
    setTimeout(() => {
      setActiveIndex((prev) =>
        typeof newIndexOrFn === 'function' ? newIndexOrFn(prev) : newIndexOrFn
      );
      setIsFading(false);
    }, 250);
  };

  const handlePrev = () => {
    handleSwitch((prev) => (prev - 1 + activeItems.length) % activeItems.length);
  };

  const handleNext = () => {
    handleSwitch((prev) => (prev + 1) % activeItems.length);
  };

  const handleTogglePause = () => {
    setIsManuallyPaused((prev) => !prev);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      handlePrev();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      handleNext();
    } else if (e.key === ' ') {
      e.preventDefault();
      handleTogglePause();
    }
  };

  // Split Arabic text into words for word-by-word RTL reveal animation
  const arabicWords = useMemo(() => {
    const text = currentItem?.quote || currentItem?.arabic || '';
    return text.split(' ').filter(Boolean);
  }, [currentItem]);

  if (!currentItem) return null;

  return (
    <section
      ref={sectionRef}
      className="ayat-section learning-spot-section focus-ring"
      tabIndex={0}
      aria-label="Sejenak Belajar - Ruang Tadabur &amp; Hikmah Harian"
      onKeyDown={handleKeyDown}
    >
      <div className="ayat-inner">
        {/* Category Header Row */}
        <div className="learning-spot-category-header">
          <p className="label learning-spot-eyebrow">
            Sejenak Belajar
          </p>

          <div
            className="learning-spot-tabs"
            role="tablist"
            aria-label="Pilihan topik sejenak belajar"
          >
            {activeItems.map((item, index) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={index === activeIndex}
                className={`learning-spot-tab focus-ring ${index === activeIndex ? 'is-active' : ''}`}
                onClick={() => handleSwitch(index)}
              >
                {item.category}
              </button>
            ))}
          </div>
        </div>

        {/* Subtle Gold Line Progress Bar */}
        <div className="learning-spot-progress-bar" aria-hidden="true">
          <div
            key={activeIndex}
            className="learning-spot-progress-fill"
            style={{
              animationDuration: `${duration}ms`,
              animationPlayState: isPlaying ? 'running' : 'paused',
            }}
          />
        </div>

        {/* Main Learning Content Card */}
        <div className={`learning-spot-card type-${currentItem.type}-card ${isFading ? 'is-fading' : ''}`}>
          <div className="learning-spot-badges">
            <span className={`learning-spot-type-tag type-${currentItem.type}`}>{currentItem.label}</span>
            <span className="learning-spot-topic">{currentItem.topic}</span>
            {currentItem.isVerified && (
              <span className="learning-spot-verified-badge" title="Telah diperiksa oleh pengurus DKM">
                ✓ Sumber diperiksa
              </span>
            )}
          </div>

          {currentItem.highlightedPhrase && (
            <div className="learning-spot-highlight-wrapper">
              <span className="learning-spot-highlight">
                ✦ {currentItem.highlightedPhrase}
              </span>
            </div>
          )}

          {/* Primary: Arabic Text Word-by-Word Reveal */}
          <p className="ayat-arabic" lang="ar" dir="rtl" key={activeIndex}>
            {arabicWords.map((word, idx) => (
              <span
                key={`${activeIndex}-${idx}`}
                className="arabic-word"
                style={{ animationDelay: `${idx * 130}ms` }}
              >
                {word}{' '}
              </span>
            ))}
          </p>

          {/* Secondary: Indonesian Translation Line/Sentence Reveal */}
          <p 
            className="ayat-translation"
            style={{ animationDelay: `${arabicWords.length * 130 + 150}ms` }}
          >
            {currentItem.translation}
          </p>

          {/* Supporting: Author, Source & Reference */}
          <div 
            className="learning-spot-attribution-footer"
            style={{ animationDelay: `${arabicWords.length * 130 + 380}ms` }}
          >
            <p className="ayat-source">{currentItem.source}</p>
            {currentItem.reference && (
              <span className="learning-spot-reference">{currentItem.reference}</span>
            )}
          </div>
        </div>

        {/* Quiet Screen Reader Live Region */}
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          {currentItem.label}: {currentItem.source}. {currentItem.translation}
        </div>

        {/* Tertiary Utility Bar at Bottom */}
        <div className="learning-spot-bottom-bar">
          <LearningSpotControls
            items={activeItems}
            activeIndex={activeIndex}
            onSelect={handleSwitch}
            onPrev={handlePrev}
            onNext={handleNext}
            onTogglePause={handleTogglePause}
            isPaused={!isPlaying}
            isManuallyPaused={isManuallyPaused}
          />

          <Link to={currentItem.ctaHref || '/program'} className="learning-spot-cta focus-ring">
            {currentItem.ctaLabel || 'Ikuti Pengajian & Program Kajian'} <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

