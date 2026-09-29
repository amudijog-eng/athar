import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useAudioPlayer } from '../context/AudioPlayerContext';
import { calculatePrayerTimes, getNextPrayer, getHijriDate, DEFAULT_CITIES } from '../data/prayerCalculation';
import { HADITHS } from '../data/hadithData';
import { DUAS } from '../data/duaData';
import { AYAT_AL_KURSI, SURAHS_LIST } from '../data/quranData';
import {
  BookOpen,
  Sparkles,
  Heart,
  Clock,
  CheckCircle2,
  Share2,
  Volume2,
  MapPin,
  ChevronLeft,
  Layers,
  ShieldCheck,
  Compass,
  Bookmark,
  Check,
  ArrowRight,
  Sun,
  Sunrise,
  Sunset,
  CloudSun,
  Moon,
  ScrollText
} from 'lucide-react';

export const HeroSection = () => {
  const {
    setActiveTab,
    lastRead,
    istighfarCount,
    istighfarGoal,
    dailyWird,
    toggleWirdItem,
    setShareModalItem,
    triggerHaptic
  } = useApp();

  const { playSurah } = useAudioPlayer();

  const [selectedCity] = useState(DEFAULT_CITIES[0]); // Mecca
  const [now, setNow] = useState(new Date());
  const [activeInspirationTab, setActiveInspirationTab] = useState('ayah'); // 'ayah' | 'hadith' | 'dua'

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  const prayerTimes = calculatePrayerTimes(selectedCity.lat, selectedCity.lng, now, selectedCity.timezone);
  const nextPrayer = getNextPrayer(prayerTimes, now);
  const hijri = getHijriDate(now);

  const completedWird = dailyWird.filter(w => w.done).length;
  const wirdPercent = Math.round((completedWird / dailyWird.length) * 100);

  const prayersTimeline = [
    { key: 'fajr', name: 'الفجر', time: prayerTimes.fajr.formatted, icon: Sunrise },
    { key: 'sunrise', name: 'الشروق', time: prayerTimes.sunrise.formatted, icon: Sun },
    { key: 'dhuhr', name: 'الظهر', time: prayerTimes.dhuhr.formatted, icon: Sun },
    { key: 'asr', name: 'العصر', time: prayerTimes.asr.formatted, icon: CloudSun },
    { key: 'maghrib', name: 'المغرب', time: prayerTimes.maghrib.formatted, icon: Sunset },
    { key: 'isha', name: 'العشاء', time: prayerTimes.isha.formatted, icon: Moon }
  ];

  // 8 Main App Portals (Designed like premium mobile app launchers)
  const appModules = [
    {
      id: 'quran',
      title: 'المصحف الشريف',
      subtitle: '١١٤ سورة وتفسير',
      icon: BookOpen,
      color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
    },
    {
      id: 'tasbeeh',
      title: 'المسبحة الذكية',
      subtitle: 'تسبيح باللمس والصوت',
      icon: Sparkles,
      color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
    },
    {
      id: 'adhkar',
      title: 'الأذكار اليومية',
      subtitle: 'حصن المسلم والتحصين',
      icon: Sparkles,
      color: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20'
    },
    {
      id: 'prayer',
      title: 'مواقيت الصلاة',
      subtitle: 'اتجاه القبلة والآذان',
      icon: Clock,
      color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
    },
    {
      id: 'istighfar',
      title: 'محراب الاستغفار',
      subtitle: 'أهداف التوبة والاستغفار',
      icon: Heart,
      color: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
    },
    {
      id: 'hadith',
      title: 'الأحاديث النبوية',
      subtitle: 'صحيحة ومحققة بالشرح',
      icon: ShieldCheck,
      color: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20'
    },
    {
      id: 'duas',
      title: 'الأدعية المأثورة',
      subtitle: 'أدعية قرآنية ونبوية',
      icon: Heart,
      color: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20'
    },
    {
      id: 'khatmah',
      title: 'خطة الختمة',
      subtitle: 'جدول الختم ومُعين الحفظ',
      icon: Layers,
      color: 'bg-emerald-600/10 text-emerald-700 dark:text-emerald-300 border-emerald-600/20'
    }
  ];

  const featuredHadith = HADITHS[0]; // Sadaqah Jariyah
  const featuredDua = DUAS[0];

  const handleOpenModule = (id) => {
    triggerHaptic(20);
    setActiveTab(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-6xl mx-auto px-4 sm:px-6 pt-4 sm:pt-6">
      
      {/* 1. Sanctuary Hero & Prayer Status Card */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[var(--emerald-deep)] via-[#073024] to-[#041A14] text-white p-6 sm:p-8 shadow-xl border border-[var(--gold-border)]">
        
        {/* Subtle Decorative Arabic Calligraphy Watermark */}
        <div className="absolute -top-6 left-6 text-7xl sm:text-9xl font-quran text-white/5 select-none pointer-events-none">
          أثر
        </div>

        <div className="relative z-10 space-y-6">
          
          {/* Top Row: Greeting & Hijri Date */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div className="space-y-1">
              <span className="text-xs text-[var(--gold-light)] font-bold tracking-wide">
                «السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ»
              </span>
              <h1 className="text-2xl sm:text-4xl font-extrabold font-quran tracking-tight text-white">
                أَثَـرٌ يَبْقَى .. وَأَجْـرٌ يَرْقَى
              </h1>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-[var(--gold-light)] bg-white/10 px-3 py-1.5 rounded-full border border-white/10">
                {hijri.formatted}
              </span>
              <button
                onClick={() => handleOpenModule('prayer')}
                className="flex items-center gap-1.5 text-xs text-white/80 bg-white/10 px-3 py-1.5 rounded-full border border-white/10 hover:bg-white/15 transition-colors cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5 text-[var(--gold-primary)]" />
                <span>{selectedCity.name}</span>
              </button>
            </div>
          </div>

          {/* Next Prayer Feature Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-black/25 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/10">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[var(--gold-primary)]/20 border border-[var(--gold-primary)]/30 flex items-center justify-center text-[var(--gold-primary)] shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-white/70 block">الصلاة القادمة</span>
                <div className="flex items-center gap-2">
                  <span className="text-xl sm:text-2xl font-extrabold text-white font-cairo">
                    صلاة {nextPrayer.nextPrayerName}
                  </span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-[var(--gold-primary)] text-[#0B3D2E]">
                    {nextPrayer.nextPrayerTime}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start md:self-auto">
              <span className="text-xs text-white/80 font-medium">الوقت المتبقي للأذان:</span>
              <span className="text-sm font-extrabold text-[var(--gold-light)] font-cairo bg-white/10 px-3 py-1 rounded-xl border border-white/10">
                {nextPrayer.remainingText}
              </span>
            </div>
          </div>

          {/* 6-Prayer Timeline Strip */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3">
            {prayersTimeline.map(p => {
              const isNext = nextPrayer.key === p.key;
              const IconComp = p.icon;
              return (
                <div
                  key={p.key}
                  className={`p-2.5 sm:p-3 rounded-2xl text-center space-y-1 transition-all ${
                    isNext
                      ? 'bg-[var(--gold-primary)] text-[#0B3D2E] font-bold shadow-md scale-102 border border-[var(--gold-light)]'
                      : 'bg-white/5 hover:bg-white/10 text-white/90 border border-white/5'
                  }`}
                >
                  <div className="flex justify-center py-0.5">
                    <IconComp className={`w-4 h-4 sm:w-5 sm:h-5 ${isNext ? 'text-[#0B3D2E]' : 'text-[var(--gold-light)]'}`} />
                  </div>
                  <span className={`text-[11px] block font-semibold ${isNext ? 'text-[#0B3D2E]' : 'text-white/70'}`}>
                    {p.name}
                  </span>
                  <span className="text-xs font-bold block font-cairo">
                    {p.time}
                  </span>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 2. Mobile App Launcher (8 Iconic Portals) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--emerald-medium)]" />
            <h2 className="text-sm sm:text-base font-extrabold text-[var(--text-primary)]">
              بوابة الطاعات والأقسام
            </h2>
          </div>
          <span className="text-xs text-[var(--text-muted)] font-medium">اختر القسم للبدء</span>
        </div>

        {/* 4 columns on mobile, 8 on desktop - true mobile app experience */}
        <div className="grid grid-cols-4 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 sm:gap-3">
          {appModules.map(mod => {
            const Icon = mod.icon;
            return (
              <button
                key={mod.id}
                onClick={() => handleOpenModule(mod.id)}
                className="group p-3 sm:p-4 rounded-2xl app-card text-center flex flex-col items-center justify-center gap-2 cursor-pointer select-none active:scale-95 transition-all"
              >
                <div className={`w-11 h-11 sm:w-13 sm:h-13 rounded-2xl border flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform ${mod.color}`}>
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-[var(--text-primary)] block leading-tight truncate max-w-[70px] sm:max-w-none">
                    {mod.title}
                  </span>
                  <span className="text-[10px] text-[var(--text-muted)] hidden sm:block truncate">
                    {mod.subtitle}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. Resume Last Read Quran Bookmark (Quick Jump) */}
      {lastRead && (
        <section className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[var(--emerald-soft)] to-[var(--bg-surface)] border border-[var(--emerald-border)] shadow-xs flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--emerald-medium)] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Bookmark className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-[var(--text-muted)] block font-semibold">
                تابِع قراءتك من حيث توقفت:
              </span>
              <span className="text-sm font-bold text-[var(--text-primary)] font-quran block">
                سورة {lastRead.surahName} — آية ({lastRead.ayahNumber})
              </span>
            </div>
          </div>

          <button
            onClick={() => handleOpenModule('quran')}
            className="px-4 py-2 rounded-xl bg-[var(--emerald-deep)] hover:bg-[var(--emerald-medium)] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors shrink-0 cursor-pointer"
          >
            <span>استكمال القراءة</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        </section>
      )}

      {/* 4. Daily Inspiration Card (Ayah / Hadith / Dua Tabs) */}
      <section className="app-card p-5 sm:p-7 space-y-5">
        
        {/* Header with Switcher Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-subtle)] pb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[var(--gold-primary)]" />
            <h3 className="font-extrabold text-sm sm:text-base text-[var(--text-primary)]">
              نفحات اليوم الإيمانية
            </h3>
          </div>

          <div className="flex items-center gap-1.5 bg-[var(--bg-surface-elevated)] p-1 rounded-xl border border-[var(--border-subtle)] self-start sm:self-auto text-xs font-bold">
            <button
              onClick={() => setActiveInspirationTab('ayah')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeInspirationTab === 'ayah'
                  ? 'bg-[var(--emerald-deep)] text-white shadow-xs'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>آية اليوم</span>
            </button>
            <button
              onClick={() => setActiveInspirationTab('hadith')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeInspirationTab === 'hadith'
                  ? 'bg-[var(--emerald-deep)] text-white shadow-xs'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <ScrollText className="w-3.5 h-3.5" />
              <span>حديث اليوم</span>
            </button>
            <button
              onClick={() => setActiveInspirationTab('dua')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeInspirationTab === 'dua'
                  ? 'bg-[var(--emerald-deep)] text-white shadow-xs'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Heart className="w-3.5 h-3.5" />
              <span>دعاء اليوم</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Ayah of the Day */}
        {activeInspirationTab === 'ayah' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between text-xs text-[var(--text-muted)] font-medium">
              <span>سورة {AYAT_AL_KURSI.surahName} [آية {AYAT_AL_KURSI.ayahNumber}]</span>
              <span className="text-[var(--gold-dark)] dark:text-[var(--gold-light)] font-bold">أعظم آية في كتاب الله</span>
            </div>

            <p className="font-quran text-lg sm:text-2xl text-[var(--text-primary)] text-center leading-loose py-2 select-text font-medium">
              ﴿ {AYAT_AL_KURSI.text} ﴾
            </p>

            <div className="p-3 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-xs text-[var(--text-secondary)]">
              <strong className="text-[var(--emerald-medium)]">فضيلتها:</strong> {AYAT_AL_KURSI.virtue}
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 text-xs">
              <button
                onClick={() => {
                  const s = SURAHS_LIST.find(i => i.id === AYAT_AL_KURSI.surahNumber);
                  if (s) playSurah(s);
                }}
                className="px-3.5 py-2 rounded-xl bg-[var(--emerald-soft)] text-[var(--emerald-deep)] dark:text-[var(--gold-primary)] font-bold flex items-center gap-1.5 border border-[var(--emerald-border)] hover:bg-[var(--emerald-medium)] hover:text-white transition-colors cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>استماع للتلاوة</span>
              </button>

              <button
                onClick={() => {
                  setShareModalItem({
                    title: `آية الكرسي - سورة ${AYAT_AL_KURSI.surahName}`,
                    text: AYAT_AL_KURSI.text,
                    source: AYAT_AL_KURSI.virtue
                  });
                }}
                className="px-3.5 py-2 rounded-xl bg-[var(--gold-soft)] text-[var(--gold-dark)] dark:text-[var(--gold-light)] font-bold flex items-center gap-1.5 border border-[var(--gold-border)] hover:opacity-90 transition-opacity cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>مشاركة كبطاقة</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Hadith of the Day */}
        {activeInspirationTab === 'hadith' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between text-xs text-[var(--text-muted)] font-medium">
              <span>رواه: {featuredHadith.narrator}</span>
              <span className="px-2 py-0.5 rounded-full bg-[var(--emerald-soft)] text-[var(--emerald-deep)] dark:text-[var(--emerald-accent)] font-bold">
                {featuredHadith.grade} — {featuredHadith.source}
              </span>
            </div>

            <blockquote className="font-amiri text-base sm:text-xl text-[var(--text-primary)] text-center leading-relaxed py-2 select-text font-medium">
              « {featuredHadith.text} »
            </blockquote>

            <p className="text-xs text-[var(--text-secondary)] font-amiri p-3 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)]">
              {featuredHadith.explanation}
            </p>

            <div className="pt-2 flex items-center justify-end gap-2 text-xs">
              <button
                onClick={() => handleOpenModule('hadith')}
                className="px-3.5 py-2 rounded-xl bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] font-bold flex items-center gap-1 border border-[var(--border-subtle)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
              >
                <span>تصفح كافة الأحاديث</span>
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => {
                  setShareModalItem({
                    title: 'حديث نبوي شريف',
                    text: featuredHadith.text,
                    source: `${featuredHadith.narrator} — ${featuredHadith.source}`
                  });
                }}
                className="px-3.5 py-2 rounded-xl bg-[var(--gold-soft)] text-[var(--gold-dark)] dark:text-[var(--gold-light)] font-bold flex items-center gap-1.5 border border-[var(--gold-border)] hover:opacity-90 transition-opacity cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>مشاركة الحديث</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: Dua of the Day */}
        {activeInspirationTab === 'dua' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between text-xs text-[var(--text-muted)] font-medium">
              <span>{featuredDua.title}</span>
              <span className="font-bold text-[var(--emerald-medium)]">{featuredDua.source}</span>
            </div>

            <p className="font-amiri text-base sm:text-xl text-[var(--text-primary)] text-center leading-relaxed py-2 select-text font-medium">
              « {featuredDua.arabic} »
            </p>

            <div className="pt-2 flex items-center justify-end gap-2 text-xs">
              <button
                onClick={() => handleOpenModule('duas')}
                className="px-3.5 py-2 rounded-xl bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] font-bold flex items-center gap-1 border border-[var(--border-subtle)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
              >
                <span>تصفح كافة الأدعية</span>
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => {
                  setShareModalItem({
                    title: featuredDua.title,
                    text: featuredDua.arabic,
                    source: featuredDua.source
                  });
                }}
                className="px-3.5 py-2 rounded-xl bg-[var(--gold-soft)] text-[var(--gold-dark)] dark:text-[var(--gold-light)] font-bold flex items-center gap-1.5 border border-[var(--gold-border)] hover:opacity-90 transition-opacity cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>مشاركة الدعاء</span>
              </button>
            </div>
          </div>
        )}

      </section>

      {/* 5. Daily Wird & Goals Tracker Widget */}
      <section className="app-card p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[var(--emerald-medium)]" />
            <h3 className="font-bold text-sm sm:text-base text-[var(--text-primary)]">
              وردي اليومي وميزان الطاعات
            </h3>
          </div>
          <span className="text-xs font-bold text-[var(--emerald-medium)]">
            {completedWird} من {dailyWird.length} مهام ({wirdPercent}%)
          </span>
        </div>

        {/* Quick Checkbox List (4 top daily tasks) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {dailyWird.slice(0, 4).map(wird => (
            <button
              key={wird.id}
              onClick={() => {
                triggerHaptic(15);
                toggleWirdItem(wird.id);
              }}
              className={`p-3 rounded-xl border text-right flex items-center justify-between gap-3 transition-colors cursor-pointer ${
                wird.done
                  ? 'bg-[var(--emerald-soft)] border-[var(--emerald-border)] text-[var(--emerald-deep)] dark:text-[var(--emerald-accent)]'
                  : 'bg-[var(--bg-surface-elevated)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--emerald-border)]'
              }`}
            >
              <div className="space-y-0.5">
                <span className={`text-xs font-bold block ${wird.done ? 'line-through opacity-70' : ''}`}>
                  {wird.title}
                </span>
                <span className="text-[10px] text-[var(--text-muted)] block">
                  {wird.category}
                </span>
              </div>

              <div className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 ${
                wird.done
                  ? 'bg-[var(--emerald-medium)] border-transparent text-white'
                  : 'border-[var(--border-subtle)] bg-[var(--bg-surface)]'
              }`}>
                {wird.done && <Check className="w-3.5 h-3.5" />}
              </div>
            </button>
          ))}
        </div>

        <div className="pt-2 text-center">
          <button
            onClick={() => handleOpenModule('wird')}
            className="text-xs font-bold text-[var(--emerald-medium)] dark:text-[var(--emerald-accent)] hover:underline inline-flex items-center gap-1 cursor-pointer"
          >
            <span>عرض وإدارة جدول الورد اليومي كاملاً</span>
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* 6. Perpetual Charity Sincere Dedication (Sadaqah Jariyah for Ahmed Montaser Al-Amoudi) */}
      <section className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[var(--emerald-deep)] via-[#073024] to-[#041A14] text-white shadow-xl border border-[var(--gold-border)] relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-6">
        
        {/* Logo and Dedication Info */}
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-right relative z-10">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-[var(--gold-primary)] shadow-lg bg-black/40 shrink-0">
            <img
              src="/athar-logo.jpg"
              alt="شعار موقع أثر"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[var(--gold-light)] text-xs font-bold border border-white/10">
              <ShieldCheck className="w-3.5 h-3.5 text-[var(--gold-primary)]" />
              <span>صدقة جارية لوجه الله تعالى</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold font-quran text-white">
              صدقة جارية عن روح الفقيد: <span className="text-[var(--gold-light)]">أحمد منتصر العامودي</span>
            </h3>
            <p className="text-xs sm:text-sm text-white/85 font-amiri leading-relaxed">
              «اللَّهُمَّ اغْفِرْ لَهُ وَارْحَمْهُ، وَعَافِهِ وَاعْفُ عَنْهُ، وَأَكْرِمْ نُزُلَهُ، وَوَسِّعْ مُدْخَلَهُ، وَاجْعَلْ قَبْرَهُ رَوْضَةً مِنْ رِيَاضِ الجَنَّةِ، وَاجْعَلْ ثَوَابَ هَذِهِ المَنَصَّةِ وَكُلِّ حَرْفٍ يُتْلَى فِيهَا فِي مِيزَانِ حَسَنَاتِهِ وَحَسَنَاتِ وَالِدَيْهِ إِلَى يَوْمِ الدِّينِ».
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 relative z-10 w-full lg:w-auto">
          <button
            onClick={() => {
              triggerHaptic(20);
              setActiveTab('sadaqah');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center justify-center gap-2 border border-white/20 transition-all cursor-pointer"
          >
            <Heart className="w-4 h-4 text-rose-400" />
            <span>دعاء للمتوفى</span>
          </button>

          <button
            onClick={() => {
              setShareModalItem({
                title: 'موقع أثر | صدقة جارية عن أحمد منتصر العامودي',
                text: 'منصة إسلامية متكاملة للقرآن الكريم والأذكار والمسبحة ومواقيت الصلاة خالية تماماً من الإعلانات صدقة جارية عن روح أحمد منتصر العامودي.',
                source: 'https://athar-app.org'
              });
            }}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-[var(--gold-primary)] to-[var(--gold-dark)] text-[#0B3D2E] font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md hover:opacity-95 transition-all shrink-0 border border-[var(--gold-border)] cursor-pointer"
          >
            <Share2 className="w-4 h-4 text-[#0B3D2E]" />
            <span>انشر واكسب الأجر</span>
          </button>
        </div>
      </section>

    </div>
  );
};
