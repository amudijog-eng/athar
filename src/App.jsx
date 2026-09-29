import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AudioPlayerProvider } from './context/AudioPlayerContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { QuranSection } from './components/QuranSection';
import { AdhkarSection } from './components/AdhkarSection';
import { TasbeehSection } from './components/TasbeehSection';
import { IstighfarSection } from './components/IstighfarSection';
import { HadithSection } from './components/HadithSection';
import { DuaSection } from './components/DuaSection';
import { PrayerTimesSection } from './components/PrayerTimesSection';
import { DailyWirdSection } from './components/DailyWirdSection';
import { KhatmahPlanner } from './components/KhatmahPlanner';
import { SadaqahJariyahSection } from './components/SadaqahJariyahSection';
import { FloatingAudioPlayer } from './components/FloatingAudioPlayer';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { ShareCardModal } from './components/ShareCardModal';
import { Footer } from './components/Footer';

const MainContent = () => {
  const { activeTab, setActiveTab } = useApp();

  // Scroll to top when active tab changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-emerald-600 selection:text-white">
      
      {/* Navbar Header */}
      <Navbar />

      {/* Main Body Routing */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <div className="space-y-6">
            <HeroSection />
            <QuranSection />
            <TasbeehSection />
            <AdhkarSection />
            <PrayerTimesSection />
            <SadaqahJariyahSection />
          </div>
        )}

        {activeTab === 'quran' && <QuranSection />}
        {activeTab === 'adhkar' && <AdhkarSection />}
        {activeTab === 'tasbeeh' && <TasbeehSection />}
        {activeTab === 'istighfar' && <IstighfarSection />}
        {activeTab === 'hadith' && <HadithSection />}
        {activeTab === 'duas' && <DuaSection />}
        {activeTab === 'prayer' && <PrayerTimesSection />}
        {activeTab === 'wird' && <DailyWirdSection />}
        {activeTab === 'khatmah' && <KhatmahPlanner />}
        {activeTab === 'sadaqah' && <SadaqahJariyahSection />}
      </main>

      {/* Persistent Global Components */}
      <FloatingAudioPlayer />
      <GlobalSearchModal />
      <ShareCardModal />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AudioPlayerProvider>
        <MainContent />
      </AudioPlayerProvider>
    </AppProvider>
  );
}
