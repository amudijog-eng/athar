import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LANGUAGES } from '../data/languages';
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
  X,
  Home,
  Layers,
  ShieldCheck,
  Grid,
  ChevronDown
} from 'lucide-react';
import atharLogo from '../assets/athar-logo.jpg';

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

  const [desktopMenuOpen, setDesktopMenuOpen] = useState(false);
  const [moreSheetOpen, setMoreSheetOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  const primaryNavItems = [
    { id: 'home', label: 'الرئيسية', icon: Home },
    { id: 'quran', label: 'المصحف الشريف', icon: BookOpen },
    { id: 'adhkar', label: 'الأذكار', icon: Sparkles },
    { id: 'tasbeeh', label: 'المسبحة', icon: Sparkles },
    { id: 'prayer', label: 'مواقيت الصلاة', icon: Clock }
  ];

  const moreNavItems = [
    { id: 'istighfar', label: 'محراب الاستغفار', icon: Heart, desc: 'حلقات الاستغفار وسيد الاستغفار' },
    { id: 'hadith', label: 'الأحاديث النبوية', icon: ShieldCheck, desc: 'صحيحة ومحققة بالشرح والفوائد' },
    { id: 'duas', label: 'الأدعية المأثورة', icon: Heart, desc: 'أدعية قرآنية ونبوية جامعة' },
    { id: 'khatmah', label: 'خطة الختمة ومُعين الحفظ', icon: Layers, desc: 'جدول الختم واختبار التسميع' },
    { id: 'wird', label: 'وردي اليومي', icon: CheckCircle2, desc: 'جدول المحاسبة وميزان الطاعات' },
    { id: 'sadaqah', label: 'الصدقة الجارية', icon: Heart, desc: 'وقفية عن أحمد منتصر العامودي' }
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
    setDesktopMenuOpen(false);
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
          <div className="flex items-center justify-between h-16 sm:h-18 gap-3 sm:gap-4">
            
            {/* Logo Brand Identity (Never Overlaps) */}
            <div
              className="flex items-center gap-2.5 sm:gap-3 cursor-pointer select-none group shrink-0"
              onClick={() => handleNavClick('home')}
            >
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl overflow-hidden border border-[var(--gold-border)] shadow-xs bg-[#F8F6F0] shrink-0 p-0.5 group-hover:scale-105 transition-transform flex items-center justify-center">
                <img
                  src={atharLogo}
                  alt="شعار منصة أثر - صدقة جارية عن أحمد منتصر العامودي"
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
              <div className="flex flex-col justify-center">
                <div className="flex items-center gap-2">
                  <span className="text-xl sm:text-2xl font-bold font-quran text-[var(--emerald-deep)] dark:text-[var(--gold-primary)] tracking-wide leading-none">
                    أَثَـر
                  </span>
                  <span className="hidden sm:inline-block text-[10px] px-2.5 py-0.5 rounded-full bg-[var(--gold-soft)] text-[var(--gold-dark)] dark:text-[var(--gold-light)] font-bold border border-[var(--gold-border)] whitespace-nowrap">
                    صدقة جارية عن أحمد منتصر العامودي
                  </span>
                  <span className="sm:hidden text-[9px] px-2 py-0.5 rounded-full bg-[var(--gold-soft)] text-[var(--gold-dark)] dark:text-[var(--gold-light)] font-bold border border-[var(--gold-border)] whitespace-nowrap">
                    صدقة جارية
                  </span>
                </div>
              </div>
            </div>

            {/* Desktop Navigation Links (Clean, Compact & Balanced) */}
            <nav className="hidden lg:flex items-center gap-1">
              {primaryNavItems.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`h-9 px-3 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
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

              {/* Luxury Services Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setDesktopMenuOpen(!desktopMenuOpen)}
                  className={`h-9 px-3 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    moreNavItems.some(i => i.id === activeTab) || desktopMenuOpen
                      ? 'bg-[var(--emerald-deep)] text-white shadow-xs'
                      : 'text-[var(--text-secondary)] hover:bg-[var(--emerald-soft)] hover:text-[var(--emerald-deep)] dark:hover:text-[var(--emerald-accent)]'
                  }`}
                >
                  <Grid className="w-3.5 h-3.5 text-[var(--gold-primary)]" />
                  <span>الأقسام</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${desktopMenuOpen ? 'rotate-180 text-[var(--gold-light)]' : 'text-[var(--gold-primary)]'}`} />
                </button>

                {desktopMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setDesktopMenuOpen(false)} />
                    <div className="absolute left-0 sm:right-0 mt-2 w-72 rounded-2xl bg-[var(--bg-surface)] shadow-2xl border border-[var(--border-subtle)] p-2 z-50 animate-in fade-in duration-150">
                      <div className="px-3 py-2 border-b border-[var(--border-subtle)] mb-1 flex items-center justify-between">
                        <span className="text-[11px] font-bold text-[var(--text-muted)]">كافة أقسام المنصة</span>
                        <span className="text-[10px] text-[var(--gold-dark)] dark:text-[var(--gold-light)] font-bold">صدقة جارية</span>
                      </div>
                      <div className="grid grid-cols-1 gap-1">
                        {moreNavItems.map(item => {
                          const Icon = item.icon;
                          const isActive = activeTab === item.id;
                          return (
                            <button
                              key={item.id}
                              onClick={() => {
                                handleNavClick(item.id);
                                setDesktopMenuOpen(false);
                              }}
                              className={`w-full px-3 py-2 rounded-xl text-right flex items-center gap-3 transition-colors cursor-pointer ${
                                isActive
                                  ? 'bg-[var(--emerald-soft)] text-[var(--emerald-deep)] dark:text-[var(--gold-primary)] font-bold'
                                  : 'text-[var(--text-primary)] hover:bg-[var(--emerald-soft)]/60'
                              }`}
                            >
                              <div className={`p-1.5 rounded-lg shrink-0 ${isActive ? 'bg-[var(--emerald-medium)] text-white' : 'bg-[var(--bg-surface-elevated)] text-[var(--gold-primary)]'}`}>
                                <Icon className="w-4 h-4" />
                              </div>
                              <div className="overflow-hidden">
                                <span className="text-xs font-bold block truncate">{item.label}</span>
                                <span className="text-[10px] text-[var(--text-muted)] block truncate">{item.desc}</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </nav>

            {/* Left Actions: Search, Theme, Language, Sadaqah Shortcut */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              
              {/* Global Search Button */}
              <button
                onClick={() => {
                  triggerHaptic(15);
                  setIsSearchOpen(true);
                }}
                className="h-9 px-3 rounded-xl bg-[var(--bg-surface-elevated)] hover:bg-[var(--emerald-soft)] border border-[var(--border-subtle)] text-[var(--text-secondary)] transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
                title="البحث الشامل (Ctrl+K)"
              >
                <Search className="w-3.5 h-3.5 text-[var(--gold-primary)]" />
                <span className="hidden md:inline">بحث</span>
                <kbd className="hidden lg:inline-block text-[10px] px-1 py-0.5 rounded bg-[var(--bg-surface-sunken)] text-[var(--text-muted)] font-mono">⌘K</kbd>
              </button>

              {/* Theme Toggle (Light / Dark / Sepia) */}
              <button
                onClick={cycleTheme}
                className="w-9 h-9 rounded-xl bg-[var(--bg-surface-elevated)] hover:bg-[var(--emerald-soft)] border border-[var(--border-subtle)] transition-colors text-[var(--text-secondary)] flex items-center justify-center cursor-pointer shrink-0"
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
                  className="h-9 px-2.5 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-xs font-bold flex items-center gap-1 cursor-pointer text-[var(--text-primary)]"
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
                className="hidden sm:flex items-center gap-1.5 h-9 px-3.5 rounded-xl bg-gradient-to-r from-[var(--gold-primary)] to-[var(--gold-dark)] text-[#0B3D2E] font-bold text-xs shadow-xs transition-all hover:scale-102 border border-[var(--gold-border)] cursor-pointer shrink-0"
              >
                <Heart className="w-3.5 h-3.5 fill-[#0B3D2E]" />
                <span>الصدقة الجارية</span>
              </button>

            </div>

          </div>
        </div>
      </header>

      {/* 2. Native Mobile Bottom Tab Bar (App-Store Grade UX) */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-[var(--bg-surface)]/95 backdrop-blur-xl border-t border-[var(--border-subtle)] px-2 py-1 shadow-2xl safe-area-pb">
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
        <div className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end animate-in fade-in duration-200">
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
