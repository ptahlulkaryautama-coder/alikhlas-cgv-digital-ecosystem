import React from 'react';
import Container from '../common/Container.jsx';

export default function TransparencyTopicBar({ transactionCount = '70' }) {
  const topics = [
    { label: '✨ Ringkasan', href: '#ringkasan' },
    { label: '📈 Grafik Arus Kas', href: '#grafik-kas' },
    { label: '📊 Alokasi & Komposisi', href: '#alokasi-dana' },
    { label: `📑 Buku Kas (${transactionCount} Mutasi)`, href: '#buku-kas-terbuka' },
    { label: '📄 Laporan Bulanan', href: '#laporan' },
    { label: '💛 Donasi & QRIS', href: '#donasi-transparansi', isGold: true },
  ];

  const handleScrollTo = (e, href) => {
    e.preventDefault();
    const id = href.replace('#', '');
    const target = document.getElementById(id);
    if (target) {
      const headerOffset = 110;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="topic-quick-bar-wrapper" aria-label="Menu navigasi cepat topik transparansi">
      <Container>
        <div className="topic-quick-bar">
          {topics.map((t) => (
            <a
              key={t.href}
              href={t.href}
              className={`topic-quick-chip ${t.isGold ? 'is-gold' : ''}`}
              onClick={(e) => handleScrollTo(e, t.href)}
            >
              {t.label}
            </a>
          ))}
        </div>
      </Container>
    </div>
  );
}
