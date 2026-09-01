import { useEffect, useMemo, useState } from 'react';
import KabarMasjidPreview from '../components/news/KabarMasjidPreview.jsx';
import ContactSection from '../components/website/ContactSection.jsx';
import Footer from '../components/website/Footer.jsx';
import Header from '../components/website/Header.jsx';
import Hero from '../components/website/Hero.jsx';
import JamaahGateway from '../components/website/JamaahGateway.jsx';
import MediaHubSection from '../components/website/MediaHubSection.jsx';
import ProgramKegiatan from '../components/website/ProgramKegiatan.jsx';
import TransparencyPreview from '../components/website/TransparencyPreview.jsx';
import { getNextPrayer, getTodayPrayerTimes } from '../services/prayerTimes.js';
import '../styles/home.css';

export default function Home() {
  const [prayerData, setPrayerData] = useState({ times: [], source: null });
  const [isPrayerLoading, setIsPrayerLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(() => new Date());

  useEffect(() => {
    let isMounted = true;

    getTodayPrayerTimes().then((data) => {
      if (!isMounted) {
        return;
      }

      setPrayerData(data);
      setIsPrayerLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  const nextPrayer = useMemo(
    () => getNextPrayer(prayerData.times, currentDate),
    [currentDate, prayerData.times],
  );

  return (
    <div className="home-page">
      <Header />
      <main>
        <Hero
          isPrayerLoading={isPrayerLoading}
          nextPrayer={nextPrayer}
          prayerSource={prayerData.source}
          prayerTimes={prayerData.times}
        />
        <JamaahGateway />
        {/* Render Program first, then Agenda second */}
        <ProgramKegiatan limitPrograms={3} hideAgenda={true} />
        <ProgramKegiatan limitAgenda={3} hideProgram={true} />
        <MediaHubSection />
        <KabarMasjidPreview />
        <TransparencyPreview />
        <ContactSection isHomepage={true} />
      </main>
      <Footer />
    </div>
  );
}
