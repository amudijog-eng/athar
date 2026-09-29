import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LANGUAGES } from '../data/languages';
import { calculatePrayerTimes, getNextPrayer, DEFAULT_CITIES } from '../data/prayerCalculation';
import {
  BookOpen,
  Sparkles,
  Heart,
  Clock,
  CheckCircle2,
  Share2,
  Search,
  Sun,
  Moon,
  Eye,
  Menu,
  X,
  Home,
  Layers,
  ShieldCheck,
  Compass,
  Grid
} from 'lucide-react';

export const Navbar = () => {
  const {
    activeTab,
    setActiveTab,
    theme,
    setTheme,
    language,
    setLanguage,
    setIsSearchOpen,
    triggerHaptic
  } = useApp();

  const [moreSheetOpen, setMoreSheetOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  const prayerTimes = calculatePrayerTimes(DEFAULT_CITIES[0].lat, DEFAULT_CITIES[0].lng, new Date());
  const nextPrayer = getNextPrayer(prayerTimes, new Date());

  const navItems = [
    { id: 'home', label: 'الرئيسية', icon: Home },
    { id: 'quran', label: 'المصحف الشريف', icon: BookOpen },
    { id: 'tasbeeh', label: 'المسبحة', icon: Sparkles },
    { id: 'adhkar', label: 'الأذكار', icon: Sparkles },
    { id: 'prayer', label: 'مواقيت الصلاة', icon: Clock },
    { id: 'istighfar', label: 'الاستغفار', icon: Heart },
    { id: 'hadith', label: 'الأحاديث', icon: ShieldCheck },
    { id: 'duas', label: 'الأدعية', icon: Heart },
    { id: 'khatmah', label: 'الختمة والحفظ', icon: Layers }
  ];

  const moreItems = [
    { id: 'prayer', label: 'مواقيت الصلاة والقبلة', icon: Clock, desc: 'حساب فلكي وبوصلة نحو الكعبة' },
    { id: 'istighfar', label: 'محراب الاستغفار', icon: Heart, desc: 'حلقات أهداف التوبة وسيد الاستغفار' },
    { id: 'hadith', label: 'الأحاديث النبوية', icon: ShieldCheck, desc: 'أحاديث صحيحة محققة بالشرح' },
    { id: 'duas', label: 'الأدعية الجامعة', icon: Heart, desc: 'أدعية قرآنية ونبوية مأثورة' },
    { id: 'wird', label: 'وردي اليومي', icon: CheckCircle2, desc: 'جدول المحاسبة وميزان الطاعات' },
    { id: 'khatmah', label: 'خطة الختمة ومُعين الحفظ', icon: Layers, desc: 'جدول الختم واختبار التسميع' },
    { id: 'sadaqah', label: 'الصدقة الجارية ونية الوقف', icon: Share2, desc: 'دعاء الوقفية وميثاق الاستمرارية' }
  ];

  const handleNavClick = (id) => {
    triggerHaptic(15);
    setActiveTab(id);
    setMoreSheetOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cycleTheme = () => {
    triggerHaptic(15);
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('sepia');
    else setTheme('light');
  };

  return (
    <>
      {/* 1. Desktop & Mobile Top Header Bar */}
      <header className="sticky top-0 z-40 w-full athar-glass border-b border-[var(--border-subtle)] shadow-xs transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-18">
            
            {/* Logo Brand Identity */}
            <div
              className="flex items-center gap-2.5 cursor-pointer select-none group"
              onClick={() => handleNavClick('home')}
            >
              <img
                src="/athar-logo.jpg"
                alt="شعار منصة أثر - صدقة جارية عن أحمد منتصر العامودي"
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl object-contain shadow-xs border border-[var(--gold-border)] bg-[#F8F6F0] p-0.5 group-hover:scale-105 transition-transform"
              />
              <div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xl sm:text-2xl font-bold font-quran text-[var(--emerald-deep)] dark:text-[var(--gold-primary)] tracking-wide">
                    أَثَـر
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--gold-soft)] text-[var(--gold-dark)] dark:text-[var(--gold-light)] font-extrabold border border-[var(--gold-border)]">
                    صدقة جارية عن أحمد منتصر العامودي
                  </span>
                </div>
                <p className="text-[10px] text-[var(--text-muted)] font-amiri hidden sm:block">
                  منصة إسلامية ... لأثـرٍ أعمق
                </p>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden xl:flex items-center gap-1">
              {navItems.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      isActive
                        ? 'bg-[var(--emerald-deep)] text-white shadow-xs'
                        : 'text-[var(--text-secondary)] hover:bg-[var(--emerald-soft)] hover:text-[var(--emerald-deep)] dark:hover:text-[var(--emerald-accent)]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 text-[var(--gold-primary)]" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Right Tools: Prayer pill, Search, Theme, Language, Sadaqah */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              
              {/* Prayer Pill (Desktop) */}
              <button
                onClick={() => handleNavClick('prayer')}
                className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-xs hover:border-[var(--emerald-medium)] transition-colors cursor-pointer"
              >
                <Clock className="w-3.5 h-3.5 text-[var(--gold-primary)]" />
                <span className="font-semibold text-[var(--text-primary)]">
                  {nextPrayer.nextPrayerName}: <strong className="text-[var(--emerald-medium)] font-cairo">{nextPrayer.nextPrayerTime}</strong>
                </span>
                <span className="text-[10px] text-[var(--text-muted)] font-mono">({nextPrayer.remainingMinutes}د)</span>
              </button>

              {/* Global Search Button */}
              <button
                onClick={() => {
                  triggerHaptic(15);
                  setIsSearchOpen(true);
                }}
                className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-[var(--bg-surface-elevated)] hover:bg-[var(--emerald-soft)] border border-[var(--border-subtle)] text-[var(--text-secondary)] transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
                title="البحث الشامل (Ctrl+K)"
              >
                <Search className="w-3.5 h-3.5 text-[var(--gold-primary)]" />
                <span className="hidden sm:inline">بحث</span>
                <kbd className="hidden lg:inline-block text-[10px] px-1 py-0.5 rounded bg-[var(--bg-surface-sunken)] text-[var(--text-muted)] font-mono">⌘K</kbd>
              </button>

              {/* Theme Toggle (Light / Dark / Sepia) */}
              <button
                onClick={cycleTheme}
                className="p-2 rounded-xl bg-[var(--bg-surface-elevated)] hover:bg-[var(--emerald-soft)] border border-[var(--border-subtle)] transition-colors text-[var(--text-secondary)] cursor-pointer"
                title={`تبديل المظهر (${theme})`}
              >
                {theme === 'dark' ? (
                  <Moon className="w-4 h-4 text-[var(--gold-primary)]" />
                ) : theme === 'sepia' ? (
                  <Eye className="w-4 h-4 text-[var(--gold-primary)]" />
                ) : (
                  <Sun className="w-4 h-4 text-[var(--gold-primary)]" />
                )}
              </button>

              {/* Language Selector */}
              <div className="relative">
                <button
                  onClick={() => setLangMenuOpen(!langMenuOpen)}
                  className="px-2.5 py-1.5 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-xs font-bold flex items-center gap-1 cursor-pointer text-[var(--text-primary)]"
                  title="تغيير اللغة"
                >
                  <span className="text-[11px] font-mono">{LANGUAGES.find(l => l.code === language)?.label || 'AR'}</span>
                </button>

                {langMenuOpen && (
                  <div className="absolute left-0 mt-2 w-36 rounded-2xl bg-[var(--bg-surface)] shadow-xl border border-[var(--border-subtle)] py-1.5 z-50">
                    {LANGUAGES.map(lang => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code);
                          setLangMenuOpen(false);
                        }}
                        className="w-full px-3 py-1.5 text-xs text-right flex items-center justify-between hover:bg-[var(--emerald-soft)] text-[var(--text-primary)] cursor-pointer"
                      >
                        <span>{lang.name}</span>
                        <span className="text-[10px] text-[var(--text-muted)] font-mono font-bold">{lang.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Sadaqah Jariyah Button (Desktop) */}
              <button
                onClick={() => handleNavClick('sadaqah')}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[var(--gold-primary)] to-[var(--gold-dark)] text-[#0B3D2E] font-bold text-xs shadow-xs transition-all hover:scale-102 border border-[var(--gold-border)] cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5 text-[#0B3D2E]" />
                <span>الصدقة الجارية</span>
              </button>

            </div>

          </div>
        </div>
      </header>

      {/* 2. Native Mobile Bottom Tab Bar (App-Store Grade UX) */}
      <nav className="xl:hidden fixed bottom-0 inset-x-0 z-40 bg-[var(--bg-surface)]/95 backdrop-blur-xl border-t border-[var(--border-subtle)] px-2 py-1 shadow-2xl safe-area-pb">
        <div className="flex items-center justify-around max-w-lg mx-auto">
          
          {/* Tab 1: Home */}
          <button
            onClick={() => handleNavClick('home')}
            className={`flex flex-col items-center gap-0.5 py-1.5 px-3 rounded-2xl transition-all cursor-pointer ${
              activeTab === 'home'
                ? 'text-[var(--emerald-medium)] dark:text-[var(--emerald-accent)] font-extrabold'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            <div className={`p-1 rounded-xl transition-colors ${activeTab === 'home' ? 'bg-[var(--emerald-soft)]' : ''}`}>
              <Home className="w-5 h-5" />
            </div>
            <span className="text-[10px]">الرئيسية</span>
          </button>

          {/* Tab 2: Quran */}
          <button
            onClick={() => handleNavClick('quran')}
            className={`flex flex-col items-center gap-0.5 py-1.5 px-3 rounded-2xl transition-all cursor-pointer ${
              activeTab === 'quran'
                ? 'text-[var(--emerald-medium)] dark:text-[var(--emerald-accent)] font-extrabold'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            <div className={`p-1 rounded-xl transition-colors ${activeTab === 'quran' ? 'bg-[var(--emerald-soft)]' : ''}`}>
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="text-[10px]">المصحف</span>
          </button>

          {/* Tab 3: Tasbeeh */}
          <button
            onClick={() => handleNavClick('tasbeeh')}
            className={`flex flex-col items-center gap-0.5 py-1.5 px-3 rounded-2xl transition-all cursor-pointer ${
              activeTab === 'tasbeeh'
                ? 'text-[var(--gold-primary)] font-extrabold'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            <div className={`p-1 rounded-xl transition-colors ${activeTab === 'tasbeeh' ? 'bg-[var(--gold-soft)]' : ''}`}>
              <Sparkles className="w-5 h-5 text-[var(--gold-primary)]" />
            </div>
            <span className="text-[10px]">المسبحة</span>
          </button>

          {/* Tab 4: Adhkar */}
          <button
            onClick={() => handleNavClick('adhkar')}
            className={`flex flex-col items-center gap-0.5 py-1.5 px-3 rounded-2xl transition-all cursor-pointer ${
              activeTab === 'adhkar'
                ? 'text-[var(--emerald-medium)] dark:text-[var(--emerald-accent)] font-extrabold'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            <div className={`p-1 rounded-xl transition-colors ${activeTab === 'adhkar' ? 'bg-[var(--emerald-soft)]' : ''}`}>
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-[10px]">الأذكار</span>
          </button>

          {/* Tab 5: More Drawer Trigger */}
          <button
            onClick={() => {
              triggerHaptic(15);
              setMoreSheetOpen(true);
            }}
            className={`flex flex-col items-center gap-0.5 py-1.5 px-3 rounded-2xl transition-all cursor-pointer ${
              moreSheetOpen || ['prayer', 'istighfar', 'hadith', 'duas', 'wird', 'khatmah', 'sadaqah'].includes(activeTab)
                ? 'text-[var(--emerald-medium)] font-extrabold'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            <div className="p-1 rounded-xl">
              <Grid className="w-5 h-5" />
            </div>
            <span className="text-[10px]">المزيد</span>
          </button>

        </div>
      </nav>

      {/* 3. Mobile "More" Bottom Sheet Modal */}
      {moreSheetOpen && (
        <div className="xl:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end animate-in fade-in duration-200">
          <div className="w-full bg-[var(--bg-surface)] rounded-t-3xl p-5 border-t border-[var(--border-subtle)] shadow-2xl max-h-[80vh] overflow-y-auto space-y-4">
            
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
              <div className="flex items-center gap-2">
                <Grid className="w-5 h-5 text-[var(--gold-primary)]" />
                <h3 className="font-extrabold text-base text-[var(--text-primary)]">
                  كافة أقسام المنصة
                </h3>
              </div>
              <button
                onClick={() => setMoreSheetOpen(false)}
                className="p-1.5 rounded-xl bg-[var(--bg-surface-elevated)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {moreItems.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`p-3.5 rounded-2xl border text-right flex items-center justify-between gap-3 transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[var(--emerald-deep)] text-white border-transparent shadow-sm'
                        : 'bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] border-[var(--border-subtle)] hover:bg-[var(--emerald-soft)]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-xl ${isActive ? 'bg-white/20 text-white' : 'bg-[var(--bg-surface)] text-[var(--gold-primary)] border border-[var(--border-subtle)]'}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="font-bold text-xs sm:text-sm block">
                          {item.label}
                        </span>
                        <span className={`text-[11px] block ${isActive ? 'text-white/80' : 'text-[var(--text-muted)]'}`}>
                          {item.desc}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

          </div>
        </div>
      )}
    </>
  );
};
