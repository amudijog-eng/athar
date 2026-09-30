import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { calculatePrayerTimes, getNextPrayer, getHijriDate, calculateQibla, DEFAULT_CITIES } from '../data/prayerCalculation';
import { CALCULATION_METHODS } from '../services/locationService';
import {
  Clock,
  Compass,
  MapPin,
  Calendar,
  Navigation,
  Sunrise,
  Sun,
  CloudSun,
  Sunset,
  Moon,
  Volume2,
  VolumeX,
  RefreshCw,
  Sliders,
  BookOpen,
  CheckCircle2,
  Bell,
  BellOff
} from 'lucide-react';

export const PrayerTimesSection = () => {
  const {
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
    setActiveTab
  } = useApp();

  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [deviceHeading, setDeviceHeading] = useState(0);
  const [activeSubTab, setActiveSubTab] = useState('today'); // 'today' | 'monthly' | 'settings'
  const [isAzanEnabled, setIsAzanEnabled] = useState(() => localStorage.getItem('athar_azan_sound') === 'true');
  const [isPlayingAzan, setIsPlayingAzan] = useState(false);
  const audioRef = useRef(null);

  // Live Clock Tick
  useEffect(() => {
    const timer = setInterval(() => setCurrentDate(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleAzanSound = () => {
    triggerHaptic(20);
    const nextState = !isAzanEnabled;
    setIsAzanEnabled(nextState);
    localStorage.setItem('athar_azan_sound', String(nextState));

    if (isPlayingAzan && !nextState) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      setIsPlayingAzan(false);
    }
  };

  const handleTestAzan = () => {
    triggerHaptic(25);
    if (isPlayingAzan) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      setIsPlayingAzan(false);
    } else {
      setIsPlayingAzan(true);
      if (!audioRef.current) {
        audioRef.current = new Audio('https://cdn.aladhan.com/audio/adhans/1.mp3');
        audioRef.current.onended = () => setIsPlayingAzan(false);
        audioRef.current.onerror = () => {
          setIsPlayingAzan(false);
          // Fallback tone
          playClickSound();
        };
      }
      audioRef.current.play().catch(() => {
        setIsPlayingAzan(false);
        playClickSound();
      });
    }
  };

  const startCompass = () => {
    triggerHaptic(20);
    if (typeof window !== 'undefined' && 'DeviceOrientationEvent' in window) {
      const handleOrientation = (e) => {
        const compass = e.webkitCompassHeading || (360 - e.alpha);
        if (compass) setDeviceHeading(Math.round(compass));
      };
      window.addEventListener('deviceorientation', handleOrientation, true);
    }
  };

  const prayerTimes = calculatePrayerTimes(
    userLocation.lat,
    userLocation.lng,
    currentDate,
    userLocation.timezone,
    calculationMethod,
    asrSchool
  );
  const nextPrayer = getNextPrayer(prayerTimes, currentDate);
  const hijri = getHijriDate(currentDate);
  const qibla = calculateQibla(userLocation.lat, userLocation.lng);

  const prayersList = [
    { key: 'fajr', label: 'الفجر', time: prayerTimes.fajr.formatted, icon: Sunrise, raw: prayerTimes.fajr },
    { key: 'sunrise', label: 'الشروق', time: prayerTimes.sunrise.formatted, icon: Sun, raw: prayerTimes.sunrise },
    { key: 'dhuhr', label: 'الظهر', time: prayerTimes.dhuhr.formatted, icon: Sun, raw: prayerTimes.dhuhr },
    { key: 'asr', label: 'العصر', time: prayerTimes.asr.formatted, icon: CloudSun, raw: prayerTimes.asr },
    { key: 'maghrib', label: 'المغرب', time: prayerTimes.maghrib.formatted, icon: Sunset, raw: prayerTimes.maghrib },
    { key: 'isha', label: 'العشاء', time: prayerTimes.isha.formatted, icon: Moon, raw: prayerTimes.isha }
  ];

  // Generate 30 days schedule for the current month
  const generateMonthSchedule = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const schedule = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const d = new Date(year, month, day);
      const times = calculatePrayerTimes(
        userLocation.lat,
        userLocation.lng,
        d,
        userLocation.timezone,
        calculationMethod,
        asrSchool
      );
      const dayHijri = getHijriDate(d);
      const isToday = day === currentDate.getDate();

      schedule.push({
        day,
        dateFormatted: `${day}/${month + 1}`,
        hijriFormatted: `${dayHijri.day} ${dayHijri.monthName}`,
        isToday,
        times
      });
    }

    return schedule;
  };

  const monthSchedule = generateMonthSchedule();

  return (
    <section id="prayer" className="py-6 sm:py-10 max-w-5xl mx-auto px-3 sm:px-6 space-y-6">
      
      {/* 1. Header & Navigation Sub-tabs */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[var(--emerald-soft)] text-[var(--emerald-deep)] dark:text-[var(--gold-primary)] text-xs font-semibold border border-[var(--emerald-border)]">
          <Clock className="w-3.5 h-3.5 text-[var(--gold-primary)]" />
          <span>«إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَّوْقُوتًا»</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-[var(--text-primary)] font-quran">
          مواقيت الصلاة واتجاه القبلة
        </h2>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-lg mx-auto">
          حساب فلكي دقيق لمواقيت الصلوات الخمس وفق إحداثيات موقعك الجغرافي المكتشف تلقائياً مع بوصلة القبلة.
        </p>

        {/* Sub Navigation Pill Tabs */}
        <div className="flex items-center justify-center gap-2 pt-2">
          <div className="inline-flex p-1 bg-[var(--bg-surface-elevated)] rounded-2xl border border-[var(--border-subtle)] shadow-xs">
            <button
              onClick={() => { triggerHaptic(15); setActiveSubTab('today'); }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeSubTab === 'today'
                  ? 'bg-[var(--emerald-deep)] text-white shadow-xs'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              مواقيت اليوم
            </button>
            <button
              onClick={() => { triggerHaptic(15); setActiveSubTab('monthly'); }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeSubTab === 'monthly'
                  ? 'bg-[var(--emerald-deep)] text-white shadow-xs'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              إمساكية الشهر كاملة
            </button>
            <button
              onClick={() => { triggerHaptic(15); setActiveSubTab('settings'); }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeSubTab === 'settings'
                  ? 'bg-[var(--emerald-deep)] text-white shadow-xs'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>ضبط الحساب</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Automated Location Detection Strip */}
      <div className="p-4 sm:p-5 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* City Display & Select */}
        <div className="flex items-center gap-2.5 w-full md:w-auto flex-wrap">
          <div className="flex items-center gap-2 bg-[var(--bg-surface-elevated)] px-3.5 py-2.5 rounded-2xl border border-[var(--border-subtle)] w-full sm:w-auto">
            <MapPin className="w-4 h-4 text-[var(--gold-primary)] shrink-0" />
            <select
              value={userLocation.name}
              onChange={(e) => {
                const found = DEFAULT_CITIES.find(c => c.name === e.target.value);
                if (found) {
                  updateLocation(found, true);
                  if (found.method) {
                    setCalculationMethod(found.method);
                  }
                }
              }}
              className="bg-transparent text-xs sm:text-sm font-bold text-[var(--text-primary)] focus:outline-hidden cursor-pointer"
            >
              <option value={userLocation.name} className="bg-[var(--bg-surface)] text-[var(--text-primary)] font-bold">
                📍 {userLocation.name} — {userLocation.country} {userLocation.flag}
              </option>
              {DEFAULT_CITIES.filter(c => c.name !== userLocation.name).map(c => (
                <option key={c.name} value={c.name} className="bg-[var(--bg-surface)] text-[var(--text-primary)]">
                  {c.name} — {c.country} {c.flag}
                </option>
              ))}
            </select>
          </div>

          {/* Auto Re-detect button */}
          <button
            onClick={reDetectLocation}
            disabled={isLocating}
            className="p-2.5 rounded-2xl bg-[var(--emerald-soft)] text-[var(--emerald-deep)] dark:text-[var(--gold-primary)] text-xs font-bold transition-all flex items-center gap-1.5 border border-[var(--emerald-border)] hover:bg-[var(--emerald-deep)] hover:text-white cursor-pointer disabled:opacity-50"
            title="إعادة الكشف التلقائي عن موقعك عبر عنوان IP"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
            <span className="text-xs">تحديد تلقائي بالـ IP</span>
          </button>
        </div>

        {/* Hijri Date and Azan sound toggle */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
          <div className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)] bg-[var(--bg-surface-elevated)] px-3 py-2 rounded-2xl border border-[var(--border-subtle)]">
            <Calendar className="w-3.5 h-3.5 text-[var(--gold-primary)] shrink-0" />
            <span className="font-bold text-[var(--text-primary)]">{hijri.formatted}</span>
          </div>

          {/* Azan Notification Toggle */}
          <button
            onClick={toggleAzanSound}
            className={`px-3 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 border cursor-pointer ${
              isAzanEnabled
                ? 'bg-[var(--emerald-deep)] text-white border-[var(--emerald-medium)] shadow-xs'
                : 'bg-[var(--bg-surface-elevated)] text-[var(--text-muted)] border-[var(--border-subtle)] hover:text-[var(--text-primary)]'
            }`}
            title="تفعيل أو تعطيل التنبيه الصوتي لمواقيت الصلاة"
          >
            {isAzanEnabled ? <Bell className="w-3.5 h-3.5 text-[var(--gold-primary)]" /> : <BellOff className="w-3.5 h-3.5" />}
            <span>{isAzanEnabled ? 'التنبيه مفعّل' : 'تنبيه الأذان'}</span>
          </button>

          <button
            onClick={handleTestAzan}
            className={`px-3 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 border cursor-pointer ${
              isPlayingAzan
                ? 'bg-rose-600 text-white border-rose-500 animate-pulse'
                : 'bg-[var(--gold-soft)] text-[var(--gold-dark)] dark:text-[var(--gold-light)] border-[var(--gold-border)] hover:bg-[var(--gold-border)]'
            }`}
            title="تجربة الاستماع للأذان"
          >
            {isPlayingAzan ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            <span>{isPlayingAzan ? 'إيقاف الأذان' : 'صوت الأذان'}</span>
          </button>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* TAB 1: TODAY'S PRAYERS & QIBLA                                            */}
      {/* ========================================================================= */}
      {activeSubTab === 'today' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Active Next Prayer Hero Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[var(--emerald-deep)] via-[#073024] to-[#041A14] text-white shadow-xl border border-[var(--gold-border)] relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
            
            <div className="space-y-3 text-center md:text-right relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[var(--gold-light)] text-xs font-bold border border-white/10">
                <span className="w-2 h-2 rounded-full bg-[var(--gold-primary)] animate-ping" />
                <span>الصلاة القادمة: {nextPrayer.nextPrayerName}</span>
              </div>
              <div className="text-4xl sm:text-6xl font-extrabold font-cairo text-white tracking-tight">
                {nextPrayer.nextPrayerTime}
              </div>
              <div className="flex items-center justify-center md:justify-start gap-2 text-xs sm:text-sm text-white/90">
                <span>الوقت المتبقي للأذان:</span>
                <strong className="text-[var(--gold-light)] text-base font-bold bg-white/10 px-2.5 py-0.5 rounded-lg border border-white/10">
                  {nextPrayer.remainingText}
                </strong>
              </div>
            </div>

            {/* Location Specs Box */}
            <div className="text-center p-5 rounded-2xl bg-black/30 border border-[var(--gold-border)] min-w-[240px] w-full md:w-auto relative z-10 space-y-1.5">
              <span className="text-xs text-[var(--gold-light)] block">الموقع الحالي</span>
              <span className="text-lg font-bold text-white block">
                {userLocation.name}، {userLocation.country} {userLocation.flag}
              </span>
              <span className="text-[11px] text-white/70 block">
                طريقة الحساب: {CALCULATION_METHODS.find(m => m.id === calculationMethod)?.name.split('(')[0] || 'رابطة العالم الإسلامي'}
              </span>
              <span className="text-[10px] text-emerald-300 block font-bold">
                مذهب العصر: {asrSchool === 'hanafi' ? 'الحنفي (المثلين)' : 'الجمهور (المثل الأول)'}
              </span>
            </div>

          </div>

          {/* 6 Prayer Times Horizontal Grid (Solid & App-like) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3.5">
            {prayersList.map(item => {
              const isNext = nextPrayer.key === item.key;
              const IconComp = item.icon;
              return (
                <div
                  key={item.key}
                  className={`p-4 rounded-3xl text-center space-y-2 transition-all select-none ${
                    isNext
                      ? 'bg-[var(--emerald-deep)] text-white shadow-lg border-2 border-[var(--gold-primary)] ring-2 ring-[var(--gold-primary)]/20'
                      : 'bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border-subtle)] shadow-xs hover:border-[var(--emerald-border)]'
                  }`}
                >
                  <div className="flex justify-center">
                    <div className={`p-2 rounded-2xl ${isNext ? 'bg-white/15 text-[var(--gold-light)]' : 'bg-[var(--emerald-soft)] text-[var(--emerald-medium)]'}`}>
                      <IconComp className="w-5 h-5" />
                    </div>
                  </div>
                  <div className={`text-xs font-bold ${isNext ? 'text-[var(--gold-light)]' : 'text-[var(--text-muted)]'}`}>
                    {item.label}
                  </div>
                  <div className="text-base sm:text-lg font-extrabold font-cairo">
                    {item.time}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Ribbon: Post-Prayer Adhkar & Sunnah */}
          <div className="p-4 sm:p-5 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-center sm:text-right">
              <div className="p-2.5 rounded-2xl bg-[var(--gold-soft)] text-[var(--gold-dark)] dark:text-[var(--gold-light)] shrink-0">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[var(--text-primary)]">أذكار ما بعد الصلاة المكتوبة</h4>
                <p className="text-xs text-[var(--text-secondary)]">استغفار وتسبيح وأدعية السنة النبوية الثابتة بعد كل فريضة.</p>
              </div>
            </div>
            <button
              onClick={() => {
                triggerHaptic(20);
                setActiveTab('adhkar');
              }}
              className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-[var(--emerald-deep)] text-white hover:bg-[var(--emerald-medium)] text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer"
            >
              قراءة أذكار الصلاة
            </button>
          </div>

          {/* Astrolabe / Luxury Qibla Compass */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-sm">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              
              <div className="space-y-4 max-w-md text-center md:text-right">
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[var(--gold-soft)] text-[var(--gold-dark)] dark:text-[var(--gold-light)] text-xs font-semibold border border-[var(--gold-border)]">
                  <Compass className="w-3.5 h-3.5 text-[var(--gold-primary)]" />
                  <span>بوصلة القبلة نحو الكعبة المشرفة</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold font-quran text-[var(--text-primary)]">
                  اتجاه القبلة الشريفة
                </h3>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                  زاوية القبلة من موقعك في <strong className="text-[var(--emerald-medium)] dark:text-[var(--gold-primary)]">{userLocation.name}</strong> هي <strong className="text-[var(--emerald-medium)] dark:text-[var(--gold-primary)] font-cairo text-base">{qibla.bearing}°</strong> درجة من الشمال الجغرافي.
                </p>
                
                <div className="p-4 rounded-2xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[var(--text-muted)]">المسافة إلى مكة المكرمة:</span>
                    <span className="font-bold text-[var(--text-primary)] font-cairo">{qibla.distanceKm.toLocaleString('ar-EG')} كم</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-muted)]">إحداثيات موقعك:</span>
                    <span className="font-bold text-[var(--text-primary)]">{userLocation.lat.toFixed(2)}° N, {userLocation.lng.toFixed(2)}° E</span>
                  </div>
                </div>

                <button
                  onClick={startCompass}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-[var(--emerald-deep)] hover:bg-[var(--emerald-medium)] text-white text-xs font-bold transition-all shadow-md inline-flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Navigation className="w-3.5 h-3.5 text-[var(--gold-primary)]" />
                  <span>تفعيل بوصلة الهاتف المباشرة</span>
                </button>
              </div>

              {/* Luxury Compass Graphic */}
              <div className="relative w-60 h-60 sm:w-72 sm:h-72 flex items-center justify-center select-none shrink-0">
                <div className="w-full h-full rounded-full border-4 border-[var(--gold-border)] flex items-center justify-center relative bg-gradient-to-br from-[var(--gold-soft)] via-[var(--bg-surface-elevated)] to-[var(--emerald-soft)] shadow-inner">
                  <span className="absolute top-2 font-bold text-xs text-rose-500">N (شمال)</span>
                  <span className="absolute bottom-2 font-bold text-xs text-[var(--text-muted)]">S (جنوب)</span>
                  <span className="absolute right-2 font-bold text-xs text-[var(--text-muted)]">E (شرق)</span>
                  <span className="absolute left-2 font-bold text-xs text-[var(--text-muted)]">W (غرب)</span>

                  {/* Rotatable Qibla Needle */}
                  <div
                    className="w-full h-full absolute inset-0 flex items-center justify-center transition-transform duration-700 ease-out"
                    style={{ transform: `rotate(${qibla.bearing - deviceHeading}deg)` }}
                  >
                    <div className="h-32 w-1.5 bg-gradient-to-t from-transparent via-[var(--gold-primary)] to-[var(--gold-dark)] rounded-full flex flex-col items-center justify-start -translate-y-8">
                      <div className="w-8 h-8 rounded-xl bg-black border-2 border-[var(--gold-primary)] shadow-xl flex items-center justify-center -translate-y-4 text-[var(--gold-primary)]">
                        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" stroke="none">
                          <rect x="5" y="6" width="14" height="13" rx="1.5" />
                          <line x1="5" y1="10" x2="19" y2="10" stroke="var(--gold-light)" strokeWidth="1.5" />
                          <rect x="10" y="14" width="4" height="5" fill="var(--gold-light)" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="w-5 h-5 rounded-full bg-[var(--emerald-deep)] border-2 border-[var(--gold-primary)] shadow-md z-10" />
                </div>
              </div>

            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: MONTHLY SCHEDULE (إمساكية ومواقيت الشهر)                           */}
      {/* ========================================================================= */}
      {activeSubTab === 'monthly' && (
        <div className="p-4 sm:p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-sm space-y-4 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[var(--border-subtle)] pb-4">
            <div>
              <h3 className="text-lg font-bold font-quran text-[var(--text-primary)]">
                جدول مواقيت الصلاة لشهر {new Intl.DateTimeFormat('ar-EG', { month: 'long', year: 'numeric' }).format(currentDate)}
              </h3>
              <p className="text-xs text-[var(--text-secondary)]">
                مواقيت {userLocation.name}، {userLocation.country} بدقة فلكية تامة.
              </p>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--emerald-soft)] text-[var(--emerald-deep)] text-xs font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>اليوم مظلل باللون الأخضر</span>
            </div>
          </div>

          {/* Responsive Table */}
          <div className="overflow-x-auto rounded-2xl border border-[var(--border-subtle)]">
            <table className="w-full text-center text-xs sm:text-sm">
              <thead className="bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] border-b border-[var(--border-subtle)]">
                <tr>
                  <th className="py-3 px-2">اليوم</th>
                  <th className="py-3 px-2">الهجري</th>
                  <th className="py-3 px-2">الفجر</th>
                  <th className="py-3 px-2">الشروق</th>
                  <th className="py-3 px-2">الظهر</th>
                  <th className="py-3 px-2">العصر</th>
                  <th className="py-3 px-2">المغرب</th>
                  <th className="py-3 px-2">العشاء</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                {monthSchedule.map(item => (
                  <tr
                    key={item.day}
                    className={`transition-colors ${
                      item.isToday
                        ? 'bg-[var(--emerald-soft)] text-[var(--emerald-deep)] font-extrabold'
                        : 'hover:bg-[var(--bg-surface-elevated)] text-[var(--text-primary)]'
                    }`}
                  >
                    <td className="py-2.5 px-2 font-cairo whitespace-nowrap">{item.dateFormatted}</td>
                    <td className="py-2.5 px-2 text-[11px] text-[var(--text-muted)] whitespace-nowrap">{item.hijriFormatted}</td>
                    <td className="py-2.5 px-2 font-cairo whitespace-nowrap">{item.times.fajr.formatted}</td>
                    <td className="py-2.5 px-2 font-cairo whitespace-nowrap">{item.times.sunrise.formatted}</td>
                    <td className="py-2.5 px-2 font-cairo whitespace-nowrap">{item.times.dhuhr.formatted}</td>
                    <td className="py-2.5 px-2 font-cairo whitespace-nowrap">{item.times.asr.formatted}</td>
                    <td className="py-2.5 px-2 font-cairo whitespace-nowrap">{item.times.maghrib.formatted}</td>
                    <td className="py-2.5 px-2 font-cairo whitespace-nowrap">{item.times.isha.formatted}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: CALCULATION METHOD & SETTINGS                                      */}
      {/* ========================================================================= */}
      {activeSubTab === 'settings' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-sm space-y-6 animate-in fade-in duration-200">
          
          <div className="border-b border-[var(--border-subtle)] pb-4">
            <h3 className="text-xl font-bold font-quran text-[var(--text-primary)]">
              إعدادات وطرق حساب مواقيت الصلاة الفقهية
            </h3>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
              اختر الهيئة أو المذهب الفقهي المعتمد في بلدك لتعديل زوايا الفجر والعشاء وحساب صلاة العصر.
            </p>
          </div>

          {/* Method Radios */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-[var(--text-primary)] block">طريقة الحساب الفلكية:</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {CALCULATION_METHODS.map(m => (
                <button
                  key={m.id}
                  onClick={() => {
                    triggerHaptic(15);
                    setCalculationMethod(m.id);
                    localStorage.setItem('athar_calc_method', m.id);
                  }}
                  className={`p-4 rounded-2xl border text-right flex items-center justify-between gap-3 cursor-pointer transition-all ${
                    calculationMethod === m.id
                      ? 'bg-[var(--emerald-soft)] border-[var(--emerald-medium)] text-[var(--emerald-deep)] dark:text-[var(--gold-primary)] font-bold shadow-xs'
                      : 'bg-[var(--bg-surface-elevated)] border-[var(--border-subtle)] text-[var(--text-primary)] hover:border-[var(--emerald-border)]'
                  }`}
                >
                  <span className="text-xs sm:text-sm">{m.name}</span>
                  {calculationMethod === m.id && <CheckCircle2 className="w-5 h-5 text-[var(--emerald-medium)] shrink-0" />}
                </button>
              ))}
            </div>
          </div>

          {/* Asr School Selector */}
          <div className="space-y-3 pt-2">
            <label className="text-xs font-bold text-[var(--text-primary)] block">مذهب حساب صلاة العصر:</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => {
                  triggerHaptic(15);
                  setAsrSchool('standard');
                  localStorage.setItem('athar_asr_school', 'standard');
                }}
                className={`p-4 rounded-2xl border text-right flex items-center justify-between cursor-pointer transition-all ${
                  asrSchool === 'standard'
                    ? 'bg-[var(--emerald-soft)] border-[var(--emerald-medium)] text-[var(--emerald-deep)] dark:text-[var(--gold-primary)] font-bold shadow-xs'
                    : 'bg-[var(--bg-surface-elevated)] border-[var(--border-subtle)] text-[var(--text-primary)]'
                }`}
              >
                <div>
                  <span className="text-xs sm:text-sm block">الجمهور: الشافعي والمالكي والحنبلي</span>
                  <span className="text-[11px] text-[var(--text-muted)] block">عندما يصير ظل الشيء مثله</span>
                </div>
                {asrSchool === 'standard' && <CheckCircle2 className="w-5 h-5 text-[var(--emerald-medium)] shrink-0" />}
              </button>

              <button
                onClick={() => {
                  triggerHaptic(15);
                  setAsrSchool('hanafi');
                  localStorage.setItem('athar_asr_school', 'hanafi');
                }}
                className={`p-4 rounded-2xl border text-right flex items-center justify-between cursor-pointer transition-all ${
                  asrSchool === 'hanafi'
                    ? 'bg-[var(--emerald-soft)] border-[var(--emerald-medium)] text-[var(--emerald-deep)] dark:text-[var(--gold-primary)] font-bold shadow-xs'
                    : 'bg-[var(--bg-surface-elevated)] border-[var(--border-subtle)] text-[var(--text-primary)]'
                }`}
              >
                <div>
                  <span className="text-xs sm:text-sm block">المذهب الحنفي</span>
                  <span className="text-[11px] text-[var(--text-muted)] block">عندما يصير ظل الشيء مثليه</span>
                </div>
                {asrSchool === 'hanafi' && <CheckCircle2 className="w-5 h-5 text-[var(--emerald-medium)] shrink-0" />}
              </button>
            </div>
          </div>

        </div>
      )}

    </section>
  );
};
