import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useAudioPlayer } from '../context/AudioPlayerContext';
import { calculatePrayerTimes, getNextPrayer, getHijriDate, DEFAULT_CITIES } from '../data/prayerCalculation';
import { HADITHS } from '../data/hadithData';
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
  ShieldCheck
} from 'lucide-react';

export const HeroSection = () => {
  const {
    setActiveTab,
    lastRead,
    istighfarCount,
    istighfarGoal,
    dailyWird,
    setShareModalItem,
    triggerHaptic
  } = useApp();

  const { playSurah } = useAudioPlayer();

  const [selectedCity, setSelectedCity] = useState(DEFAULT_CITIES[0]); // Mecca
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  const prayerTimes = calculatePrayerTimes(selectedCity.lat, selectedCity.lng, now);
  const nextPrayer = getNextPrayer(prayerTimes, now);
  const hijri = getHijriDate(now);

  const completedWird = dailyWird.filter(w => w.done).length;
  const wirdPercent = Math.round((completedWird / dailyWird.length) * 100);

  const featuredHadith = HADITHS[0]; // Sadaqah Jariyah

  const portalModules = [
    {
      id: 'quran',
      title: 'المصحف الشريف',
      desc: '١١٤ سورة بالرسم العثماني مع التفسير الميسر والاستماع لكبار القرّاء',
      icon: BookOpen,
      badge: 'القرآن كاملاً'
    },
    {
      id: 'tasbeeh',
      title: 'المسبحة الإلكترونية',
      desc: 'عداد رقمي ذكي مع صوت خشب واقعي واهتزاز وحفظ الأرقام',
      icon: Sparkles,
      badge: 'تسبيح تفاعلي'
    },
    {
      id: 'istighfar',
      title: 'محراب الاستغفار',
      desc: 'تحديد أهداف يومية، سيد الاستغفار، وفضائل التوبة ومغفرة الذنوب',
      icon: Heart,
      badge: `${istighfarCount} / ${istighfarGoal}`
    },
    {
      id: 'adhkar',
      title: 'حصن المسلم والأذكار',
      desc: 'أذكار الصباح والمساء، النوم، الصلاة، مع بيان الفضل والمصدر',
      icon: Sparkles,
      badge: '١١ قسماً موثقاً'
    },
    {
      id: 'hadith',
      title: 'الأحاديث النبوية الصحيحة',
      desc: 'أحاديث محققة من البخاري ومسلم في الصدقة، بر الوالدين، وتفريج الكرب',
      icon: BookOpen,
      badge: 'صحيحة وموثقة'
    },
    {
      id: 'duas',
      title: 'الأدعية القرآنية والنبوية',
      desc: 'أدعية تفريج الكرب، الرزق، الشفاء، وأدعية خاصة للوالدين والأموات',
      icon: Heart,
      badge: 'مستجابة ومأثورة'
    },
    {
      id: 'prayer',
      title: 'مواقيت الصلاة والقبلة',
      desc: 'حساب فلكي دقيق حسب مدينتك، عد تنازلي، وبوصلة القبلة نحو مكة',
      icon: Clock,
      badge: `${nextPrayer.nextPrayerName} (${nextPrayer.nextPrayerTime})`
    },
    {
      id: 'khatmah',
      title: 'خطة الختمة وحفظ القرآن',
      desc: 'خطط لختم القرآن في ٧ أو ١٥ أو ٣٠ يوماً، مع أداة اختبار الحفظ الذاتي',
      icon: Layers,
      badge: 'جدول الختمة'
    }
  ];

  return (
    <div className="space-y-10 pb-16">
      
      {/* Hero Islamic Sanctuary Header */}
      <section className="relative overflow-hidden pt-8 pb-12 sm:pt-14 sm:pb-16 bg-[var(--emerald-deep)] text-white border-b border-[var(--gold-border)]">
        
        {/* Subtle Ambient Gold Aura */}
        <div className="absolute top-0 right-1/2 translate-x-1/2 w-[700px] h-[300px] bg-gradient-to-b from-[var(--gold-primary)]/10 to-transparent blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
          
          {/* Top Greeting & Hijri Date Strip */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/10 pb-5">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-[var(--gold-light)] font-amiri text-base font-bold">
              «السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ»
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-[var(--gold-light)] font-bold bg-white/5 border border-[var(--gold-primary)]/30 px-3.5 py-1.5 rounded-full">
                {hijri.formatted}
              </span>
              <div className="flex items-center gap-1.5 text-xs text-white/80 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                <MapPin className="w-3.5 h-3.5 text-[var(--gold-primary)]" />
                <span>{selectedCity.name}</span>
              </div>
            </div>
          </div>

          {/* Main Title & Intention */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold font-quran tracking-tight text-white leading-tight">
              أَثَـرٌ يَبْقَى .. وَأَجْـرٌ يَرْقَى
            </h1>

            <p className="text-sm sm:text-base text-white/90 font-amiri max-w-2xl mx-auto leading-relaxed">
              منصة إسلامية شاملة خالية من الإعلانات تماماً، أُنشئت بنية خالصة لتكون <strong>صدقة جارية</strong> لوجه الله تعالى عن صاحب الموقع ووالديه وأهله وكل من ساهم في نشره.
            </p>

            {/* Sincere Dedication Box */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-[var(--gold-primary)]/40 text-xs sm:text-sm text-[var(--gold-light)] font-amiri text-center leading-relaxed max-w-2xl mx-auto shadow-sm">
              ✨ «اللَّهُمَّ اجْعَلْ أَجْرَ هَذَا العَمَلِ وَمَا يُنْتَفَعُ بِهِ مِنْهُ صَدَقَةً جَارِيَةً عَنِّي وَعَنْ وَالِدَيَّ وَمَنْ أَحَبَّ وَلِمَنْ عَمِلَ فِيهِ وَنَشَرَهُ إِلَى يَوْمِ القِيَامَةِ»
            </div>
          </div>

          {/* Live Prayer & Quick Dashboard Bar */}
          <div className="p-5 sm:p-6 rounded-3xl bg-black/25 backdrop-blur-md border border-[var(--gold-primary)]/30 shadow-xl">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              
              {/* Next Prayer Countdown Widget */}
              <div className="flex items-center gap-4 w-full lg:w-auto justify-between lg:justify-start">
                <div className="p-3.5 rounded-2xl bg-[var(--gold-primary)]/15 border border-[var(--gold-primary)]/40 text-[var(--gold-light)]">
                  <Clock className="w-7 h-7" />
                </div>
                <div>
                  <div className="text-xs text-white/75">الصلاة القادمة:</div>
                  <div className="text-xl sm:text-2xl font-extrabold text-white">
                    {nextPrayer.nextPrayerName} ({nextPrayer.nextPrayerTime})
                  </div>
                  <div className="text-xs text-[var(--gold-light)] font-semibold mt-0.5">
                    بقي على رفع الأذان: {nextPrayer.remainingText}
                  </div>
                </div>
              </div>

              {/* Quick Jump Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full lg:w-auto">
                
                {/* Last Read Bookmark */}
                <button
                  onClick={() => {
                    triggerHaptic(20);
                    setActiveTab('quran');
                  }}
                  className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-right flex items-center justify-between gap-3 transition-colors"
                >
                  <div className="truncate">
                    <span className="text-[10px] text-white/70 block">آخر موضع قراءة</span>
                    <span className="text-xs font-bold text-white block truncate">
                      سورة {lastRead?.surahName || 'الفاتحة'} (آية {lastRead?.ayahNumber || 1})
                    </span>
                  </div>
                  <ChevronLeft className="w-4 h-4 text-[var(--gold-primary)] shrink-0" />
                </button>

                {/* Istighfar Tracker */}
                <button
                  onClick={() => {
                    triggerHaptic(20);
                    setActiveTab('istighfar');
                  }}
                  className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-right flex items-center justify-between gap-3 transition-colors"
                >
                  <div>
                    <span className="text-[10px] text-white/70 block">استغفار اليوم</span>
                    <span className="text-xs font-bold text-[var(--gold-light)] block">
                      {istighfarCount} من {istighfarGoal}
                    </span>
                  </div>
                  <Heart className="w-4 h-4 text-rose-300 shrink-0" />
                </button>

                {/* Wird Percent */}
                <button
                  onClick={() => {
                    triggerHaptic(20);
                    setActiveTab('wird');
                  }}
                  className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-right flex items-center justify-between gap-3 transition-colors"
                >
                  <div>
                    <span className="text-[10px] text-white/70 block">إنجاز الورد اليومي</span>
                    <span className="text-xs font-bold text-[var(--gold-light)] block">
                      {wirdPercent}% مكتمل
                    </span>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-[var(--gold-primary)] shrink-0" />
                </button>

              </div>

            </div>
          </div>

        </div>
      </section>

      {/* Featured Pair: "آية اليوم" & "حديث اليوم" */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Ayah of the Day */}
          <div className="mushaf-frame p-6 sm:p-8 flex flex-col justify-between space-y-4 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[var(--gold-primary)]" />
                <span className="text-xs font-bold text-[var(--gold-dark)] dark:text-[var(--gold-light)] uppercase tracking-wider">
                  آية اليوم المباركة
                </span>
              </div>
              <span className="text-xs font-bold text-[var(--text-muted)]">
                سورة {AYAT_AL_KURSI.surahName} [آية {AYAT_AL_KURSI.ayahNumber}]
              </span>
            </div>

            <p className="font-quran text-lg sm:text-2xl text-[var(--text-primary)] text-center leading-loose py-2 select-text">
              ﴿ {AYAT_AL_KURSI.text} ﴾
            </p>

            <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs">
              <span className="text-[var(--text-muted)] text-[11px] line-clamp-1 max-w-[220px]">
                {AYAT_AL_KURSI.virtue}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const s = SURAHS_LIST.find(i => i.id === AYAT_AL_KURSI.surahNumber);
                    if (s) playSurah(s);
                  }}
                  className="p-2 rounded-xl bg-[var(--emerald-soft)] text-[var(--emerald-deep)] dark:text-[var(--gold-light)] font-bold hover:bg-[var(--emerald-border)] transition-colors flex items-center gap-1"
                  title="استماع لتلاوة السورة"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline text-[11px]">استماع</span>
                </button>

                <button
                  onClick={() => {
                    setShareModalItem({
                      title: `آية الكرسي - سورة ${AYAT_AL_KURSI.surahName}`,
                      text: AYAT_AL_KURSI.text,
                      source: AYAT_AL_KURSI.virtue
                    });
                  }}
                  className="p-2 rounded-xl bg-[var(--gold-soft)] text-[var(--gold-dark)] dark:text-[var(--gold-light)] border border-[var(--gold-border)] font-bold transition-colors flex items-center gap-1 hover:bg-[var(--gold-border)]"
                  title="توليد بطاقة مشاركة للآية"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span className="text-[11px]">انشر الآية</span>
                </button>
              </div>
            </div>
          </div>

          {/* Hadith of the Day */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3 mb-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[var(--emerald-medium)]" />
                  <span className="text-xs font-bold text-[var(--emerald-deep)] dark:text-[var(--emerald-accent)] uppercase">
                    حديث اليوم النبوي
                  </span>
                </div>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-[var(--emerald-soft)] text-[var(--emerald-deep)] dark:text-[var(--emerald-accent)] font-bold border border-[var(--emerald-border)]">
                  {featuredHadith.grade}
                </span>
              </div>

              <blockquote className="font-amiri text-base sm:text-lg leading-relaxed text-[var(--text-primary)] select-text py-2">
                « {featuredHadith.text} »
              </blockquote>

              <p className="text-xs text-[var(--text-secondary)] mt-2 font-medium">
                رواه: {featuredHadith.narrator} — <strong className="text-[var(--emerald-medium)] dark:text-[var(--emerald-accent)]">{featuredHadith.source}</strong>
              </p>
            </div>

            <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs">
              <button
                onClick={() => setActiveTab('hadith')}
                className="text-[var(--emerald-medium)] dark:text-[var(--emerald-accent)] font-bold flex items-center gap-1 hover:underline"
              >
                <span>تصفح كافة الأحاديث</span>
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => {
                  setShareModalItem({
                    title: 'حديث نبوي شريف',
                    text: featuredHadith.text,
                    source: `${featuredHadith.narrator} - ${featuredHadith.source}`
                  });
                }}
                className="p-2 rounded-xl bg-[var(--bg-surface-elevated)] hover:bg-[var(--emerald-soft)] text-[var(--text-secondary)] font-bold transition-colors flex items-center gap-1 border border-[var(--border-subtle)]"
              >
                <Share2 className="w-3.5 h-3.5 text-[var(--gold-primary)]" />
                <span className="text-[11px]">مشاركة الحديث</span>
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 8 Sanctuary Portals */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 border-b border-[var(--border-subtle)] pb-4">
          <div>
            <span className="text-xs font-bold text-[var(--gold-dark)] dark:text-[var(--gold-light)] uppercase tracking-wider block">
              أقسام المنصة الشاملة
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] font-quran">
              بوابة الطاعات والعلم النافع
            </h2>
          </div>
          <p className="text-xs text-[var(--text-secondary)] max-w-sm text-center sm:text-right">
            اختر القسم الذي تريد التعبد به الآن، وكل نقرة صدقة جارية لك ولأهلك.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {portalModules.map(mod => {
            const Icon = mod.icon;
            return (
              <div
                key={mod.id}
                onClick={() => {
                  triggerHaptic(20);
                  setActiveTab(mod.id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="group cursor-pointer p-5 sm:p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs hover:shadow-xl hover:border-[var(--gold-primary)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-2xl bg-[var(--emerald-soft)] text-[var(--emerald-deep)] dark:text-[var(--gold-primary)] group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] border border-[var(--border-subtle)]">
                      {mod.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-[var(--text-primary)] font-quran group-hover:text-[var(--emerald-medium)] dark:group-hover:text-[var(--emerald-accent)] transition-colors">
                    {mod.title}
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] mt-1.5 leading-relaxed">
                    {mod.desc}
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs text-[var(--emerald-medium)] dark:text-[var(--emerald-accent)] font-bold border-t border-[var(--border-subtle)]">
                  <span>فتح القسم</span>
                  <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Sadaqah Jariyah Call-to-action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-[var(--emerald-deep)] text-white border border-[var(--gold-border)] shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 text-center md:text-right max-w-xl">
            <span className="text-xs font-bold text-[var(--gold-light)] uppercase tracking-wider block">
              «أَثَرٌ يَبْقَى»
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold font-quran text-white">
              ساهم في نشر الخير واكسب مثل أجورهم
            </h3>
            <p className="text-xs sm:text-sm text-white/90 font-amiri leading-relaxed">
              قال النبي ﷺ: «مَن دَعَا إلى هُدًى، كانَ له مِنَ الأجْرِ مِثْلُ أُجُورِ مَن تَبِعَهُ، لا يَنْقُصُ ذلكَ مِن أُجُورِهِمْ شيئًا». شارك رابط المنصة مع أهلك وأصدقائك واجعله صدقة جارية عنك وعن والديك.
            </p>
          </div>

          <button
            onClick={() => {
              setShareModalItem({
                title: 'موقع أثر - صدقة جارية لوجه الله',
                text: 'منصة إسلامية متكاملة للقرآن الكريم، الأذكار، المسبحة، ومواقيت الصلاة خالية تماماً من الإعلانات.',
                source: 'https://athar-app.org'
              });
            }}
            className="w-full md:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-[var(--gold-primary)] to-[var(--gold-dark)] text-[#0B3D2E] font-extrabold text-sm flex items-center justify-center gap-2.5 shadow-lg transition-transform hover:scale-105 shrink-0 border border-[var(--gold-border)]"
          >
            <Share2 className="w-4 h-4 text-[#0B3D2E]" />
            <span>انشر رابط المنصة واكسب الأجر</span>
          </button>
        </div>
      </section>

    </div>
  );
};
