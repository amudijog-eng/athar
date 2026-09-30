import React, { createContext, useContext, useState, useEffect } from 'react';
import { TRANSLATIONS } from '../data/languages';
import { detectLocationViaIp } from '../services/locationService';
import confetti from 'canvas-confetti';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Theme: 'light' | 'dark' | 'sepia'
  const [theme, setTheme] = useState(() => localStorage.getItem('athar_theme') || 'light');
  
  // Language: 'ar' | 'en' | 'ur' | 'tr' | 'fr' | 'id'
  const [language, setLanguage] = useState(() => localStorage.getItem('athar_lang') || 'ar');
  
  // Active Navigation Tab
  const [activeTab, setActiveTab] = useState('home');

  // Search Modal
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Share Card Modal
  const [shareModalItem, setShareModalItem] = useState(null);

  // Quran Last Read Bookmark
  const [lastRead, setLastRead] = useState(() => {
    try {
      const saved = localStorage.getItem('athar_last_read');
      return saved ? JSON.parse(saved) : { surahId: 1, surahName: 'الفاتحة', ayahNumber: 1, date: new Date().toLocaleDateString('ar-EG') };
    } catch {
      return { surahId: 1, surahName: 'الفاتحة', ayahNumber: 1, date: '' };
    }
  });

  // Favorites (Ayahs, Hadiths, Duas, Adhkar)
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('athar_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Istighfar Counter & Daily Goal
  const [istighfarGoal, setIstighfarGoal] = useState(() => Number(localStorage.getItem('athar_istighfar_goal')) || 100);
  const [istighfarCount, setIstighfarCount] = useState(() => {
    const today = new Date().toDateString();
    const savedDate = localStorage.getItem('athar_istighfar_date');
    if (savedDate !== today) {
      localStorage.setItem('athar_istighfar_date', today);
      localStorage.setItem('athar_istighfar_today', '0');
      return 0;
    }
    return Number(localStorage.getItem('athar_istighfar_today')) || 0;
  });
  const [istighfarLifetime, setIstighfarLifetime] = useState(() => Number(localStorage.getItem('athar_istighfar_lifetime')) || 0);

  // Daily Wird Checklist
  const [dailyWird, setDailyWird] = useState(() => {
    const today = new Date().toDateString();
    const savedDate = localStorage.getItem('athar_wird_date');
    const defaultWird = [
      { id: 'w1', title: 'أذكار الصباح كاملة', done: false, icon: 'Sun' },
      { id: 'w2', title: 'أذكار المساء كاملة', done: false, icon: 'Moon' },
      { id: 'w3', title: '١٠٠ مرة استغفار', done: false, icon: 'Sparkles' },
      { id: 'w4', title: '١٠٠ مرة صلاة على النبي ﷺ', done: false, icon: 'Heart' },
      { id: 'w5', title: 'ورد تلاوة القرآن (جزء أو حزب)', done: false, icon: 'BookOpen' },
      { id: 'w6', title: 'صلاة الضحى والسنن الرواتب', done: false, icon: 'Flame' },
      { id: 'w7', title: 'قراءة سورة الكهف (يوم الجمعة)', done: false, icon: 'ScrollText', fridayOnly: true }
    ];

    if (savedDate !== today) {
      localStorage.setItem('athar_wird_date', today);
      localStorage.setItem('athar_wird_items', JSON.stringify(defaultWird));
      return defaultWird;
    }
    try {
      const saved = localStorage.getItem('athar_wird_items');
      return saved ? JSON.parse(saved) : defaultWird;
    } catch {
      return defaultWird;
    }
  });

  // Quran Khatmah Plan
  const [khatmah, setKhatmah] = useState(() => {
    try {
      const saved = localStorage.getItem('athar_khatmah');
      return saved ? JSON.parse(saved) : {
        durationDays: 30,
        startDate: new Date().toISOString(),
        currentHizb: 1, // out of 60
        totalPages: 604,
        readPages: 0
      };
    } catch {
      return { durationDays: 30, startDate: new Date().toISOString(), currentHizb: 1, totalPages: 604, readPages: 0 };
    }
  });

  // Haptic feedback & sound effects
  const triggerHaptic = (duration = 30) => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try { navigator.vibrate(duration); } catch {}
    }
  };

  const playClickSound = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(650, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch {}
  };

  // Toggle Favorite
  const toggleFavorite = (item) => {
    setFavorites(prev => {
      const exists = prev.some(f => f.id === item.id);
      let updated;
      if (exists) {
        updated = prev.filter(f => f.id !== item.id);
      } else {
        updated = [item, ...prev];
        triggerHaptic(50);
      }
      localStorage.setItem('athar_favorites', JSON.stringify(updated));
      return updated;
    });
  };

  // Increment Istighfar
  const incrementIstighfar = () => {
    triggerHaptic(20);
    playClickSound();
    const newToday = istighfarCount + 1;
    const newLife = istighfarLifetime + 1;
    setIstighfarCount(newToday);
    setIstighfarLifetime(newLife);
    localStorage.setItem('athar_istighfar_today', String(newToday));
    localStorage.setItem('athar_istighfar_lifetime', String(newLife));

    if (newToday === istighfarGoal) {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    }
  };

  const resetIstighfarToday = () => {
    setIstighfarCount(0);
    localStorage.setItem('athar_istighfar_today', '0');
  };

  // Toggle Daily Wird Item
  const toggleWirdItem = (id) => {
    triggerHaptic(30);
    setDailyWird(prev => {
      const updated = prev.map(item => item.id === id ? { ...item, done: !item.done } : item);
      localStorage.setItem('athar_wird_items', JSON.stringify(updated));
      const allDone = updated.every(item => item.fridayOnly ? true : item.done);
      if (allDone) {
        confetti({ particleCount: 90, spread: 80, origin: { y: 0.5 } });
      }
      return updated;
    });
  };

  // Save Quran Last Read
  const saveLastRead = (surahId, surahName, ayahNumber = 1) => {
    const data = {
      surahId,
      surahName,
      ayahNumber,
      date: new Date().toLocaleDateString('ar-EG', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    };
    setLastRead(data);
    localStorage.setItem('athar_last_read', JSON.stringify(data));
  };

  // Update Theme effect on <html>
  useEffect(() => {
    localStorage.setItem('athar_theme', theme);
    const root = document.documentElement;
    root.classList.remove('dark', 'theme-sepia');
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'sepia') {
      root.classList.add('theme-sepia');
    }
  }, [theme]);

  // Update Language effect on <html>
  useEffect(() => {
    localStorage.setItem('athar_lang', language);
    const dir = (language === 'ar' || language === 'ur') ? 'rtl' : 'ltr';
    document.documentElement.setAttribute('lang', language);
    document.documentElement.setAttribute('dir', dir);
  }, [language]);

  // Target Surah to open in Quran Section
  const [targetSurahId, setTargetSurahId] = useState(null);

  const openSurahById = (surahId) => {
    setTargetSurahId(surahId);
    setActiveTab('quran');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // User Geo Location (Auto-detected via IP with fallback)
  const [userLocation, setUserLocation] = useState(() => {
    try {
      const saved = localStorage.getItem('athar_user_location');
      return saved ? JSON.parse(saved) : {
        name: 'عمّان',
        country: 'الأردن',
        flag: '🇯🇴',
        lat: 31.9539,
        lng: 35.9106,
        timezone: 3,
        method: 'MWL',
        isAutoDetected: false
      };
    } catch {
      return {
        name: 'عمّان',
        country: 'الأردن',
        flag: '🇯🇴',
        lat: 31.9539,
        lng: 35.9106,
        timezone: 3,
        method: 'MWL',
        isAutoDetected: false
      };
    }
  });

  const [calculationMethod, setCalculationMethod] = useState(() => localStorage.getItem('athar_calc_method') || 'MWL');
  const [asrSchool, setAsrSchool] = useState(() => localStorage.getItem('athar_asr_school') || 'standard');
  const [isLocating, setIsLocating] = useState(() => {
    return localStorage.getItem('athar_manual_location_override') !== 'true';
  });

  // Auto-detect IP location on startup
  useEffect(() => {
    let isMounted = true;
    detectLocationViaIp().then(detected => {
      if (isMounted && detected && detected.lat && detected.lng) {
        const hasManualSetting = localStorage.getItem('athar_manual_location_override') === 'true';
        if (!hasManualSetting) {
          setUserLocation(detected);
          localStorage.setItem('athar_user_location', JSON.stringify(detected));
          if (detected.method) {
            setCalculationMethod(detected.method);
            localStorage.setItem('athar_calc_method', detected.method);
          }
        }
        setIsLocating(false);
      }
    }).catch(() => {
      if (isMounted) setIsLocating(false);
    });
    return () => { isMounted = false; };
  }, []);

  const updateLocation = (loc, isManual = true) => {
    setUserLocation(loc);
    localStorage.setItem('athar_user_location', JSON.stringify(loc));
    if (isManual) {
      localStorage.setItem('athar_manual_location_override', 'true');
    }
  };

  const reDetectLocation = async () => {
    setIsLocating(true);
    localStorage.removeItem('athar_manual_location_override');
    localStorage.removeItem('athar_auto_location');
    const detected = await detectLocationViaIp();
    if (detected) {
      setUserLocation(detected);
      localStorage.setItem('athar_user_location', JSON.stringify(detected));
      if (detected.method) {
        setCalculationMethod(detected.method);
        localStorage.setItem('athar_calc_method', detected.method);
      }
    }
    setIsLocating(false);
    return detected;
  };

  const t = TRANSLATIONS[language] || TRANSLATIONS.ar;

  return (
    <AppContext.Provider value={{
      theme,
      setTheme,
      language,
      setLanguage,
      activeTab,
      setActiveTab,
      isSearchOpen,
      setIsSearchOpen,
      shareModalItem,
      setShareModalItem,
      lastRead,
      saveLastRead,
      targetSurahId,
      setTargetSurahId,
      openSurahById,
      favorites,
      toggleFavorite,
      istighfarGoal,
      setIstighfarGoal,
      istighfarCount,
      istighfarLifetime,
      incrementIstighfar,
      resetIstighfarToday,
      dailyWird,
      toggleWirdItem,
      khatmah,
      setKhatmah,
      triggerHaptic,
      playClickSound,
      userLocation,
      updateLocation,
      reDetectLocation,
      isLocating,
      calculationMethod,
      setCalculationMethod,
      asrSchool,
      setAsrSchool,
      t
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
