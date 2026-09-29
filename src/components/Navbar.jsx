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
  ChevronDown
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

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  const prayerTimes = calculatePrayerTimes(DEFAULT_CITIES[0].lat, DEFAULT_CITIES[0].lng, new Date());
  const nextPrayer = getNextPrayer(prayerTimes, new Date());

  const navItems = [
    { id: 'home', label: 'الرئيسية', icon: Home },
    { id: 'quran', label: 'المصحف الشريف', icon: BookOpen },
    { id: 'adhkar', label: 'الأذكار', icon: Sparkles },
    { id: 'tasbeeh', label: 'المسبحة', icon: Sparkles },
    { id: 'istighfar', label: 'الاستغفار', icon: Heart },
    { id: 'hadith', label: 'الأحاديث', icon: BookOpen },
    { id: 'duas', label: 'الأدعية', icon: Heart },
    { id: 'prayer', label: 'مواقيت الصلاة', icon: Clock },
    { id: 'wird', label: 'وردي اليومي', icon: CheckCircle2 },
    { id: 'khatmah', label: 'الختمة والحفظ', icon: Layers }
  ];

  const handleNavClick = (id) => {
    triggerHaptic(15);
    setActiveTab(id);
    setMobileMenuOpen(false);
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
      <header className="sticky top-0 z-40 w-full athar-glass border-b border-[var(--border-subtle)] shadow-xs transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            
            {/* Logo & Brand Identity */}
            <div
              className="flex items-center gap-3 cursor-pointer select-none group"
              onClick={() => handleNavClick('home')}
            >
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-[var(--emerald-deep)] border border-[var(--gold-primary)] flex items-center justify-center text-[var(--gold-primary)] shadow-sm group-hover:scale-105 transition-transform">
                <span className="font-quran text-2xl font-bold">أثر</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl sm:text-2xl font-bold font-quran text-[var(--emerald-deep)] dark:text-[var(--gold-primary)] tracking-wide">
                    أَثَـر
                  </span>
                  <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded-full bg-[var(--gold-soft)] text-[var(--gold-dark)] dark:text-[var(--gold-light)] font-bold border border-[var(--gold-border)]">
                    صدقة جارية
                  </span>
                </div>
                <p className="text-[11px] text-[var(--text-secondary)] font-amiri hidden sm:block">
                  أثرٌ يبقى .. وأجرٌ يرقى
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
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-[var(--emerald-deep)] text-[var(--gold-primary)] shadow-xs border border-[var(--gold-border)]'
                        : 'text-[var(--text-secondary)] hover:bg-[var(--emerald-soft)] hover:text-[var(--emerald-deep)] dark:hover:text-[var(--emerald-accent)]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 text-[var(--gold-primary)]" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Right Tools: Prayer Bar, Search, Theme, Language */}
            <div className="flex items-center gap-2">
              
              {/* Quick Prayer Time Chip */}
              <button
                onClick={() => handleNavClick('prayer')}
                className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-xs hover:border-[var(--gold-primary)] transition-colors"
              >
                <Clock className="w-3.5 h-3.5 text-[var(--gold-primary)]" />
                <span className="font-semibold text-[var(--text-primary)]">
                  {nextPrayer.nextPrayerName}: <strong className="text-[var(--emerald-medium)] dark:text-[var(--emerald-accent)]">{nextPrayer.nextPrayerTime}</strong>
                </span>
                <span className="text-[10px] text-[var(--text-muted)]">({nextPrayer.remainingMinutes}د)</span>
              </button>

              {/* Global Search Button */}
              <button
                onClick={() => {
                  triggerHaptic(15);
                  setIsSearchOpen(true);
                }}
                className="p-2 sm:px-3 sm:py-2 rounded-xl bg-[var(--bg-surface-elevated)] hover:bg-[var(--emerald-soft)] border border-[var(--border-subtle)] text-[var(--text-secondary)] transition-colors flex items-center gap-1.5 text-xs font-semibold"
                title="البحث الشامل (Ctrl+K)"
              >
                <Search className="w-4 h-4 text-[var(--gold-primary)]" />
                <span className="hidden sm:inline">بحث</span>
                <kbd className="hidden lg:inline-block text-[10px] px-1 py-0.5 rounded bg-[var(--bg-surface-sunken)] text-[var(--text-muted)]">⌘K</kbd>
              </button>

              {/* Theme Toggle */}
              <button
                onClick={cycleTheme}
                className="p-2 rounded-xl bg-[var(--bg-surface-elevated)] hover:bg-[var(--emerald-soft)] border border-[var(--border-subtle)] transition-colors text-[var(--text-secondary)]"
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
                  className="p-2 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-xs flex items-center gap-1"
                >
                  <span>{LANGUAGES.find(l => l.code === language)?.flag || '🇸🇦'}</span>
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
                        className="w-full px-3 py-1.5 text-xs text-right flex items-center justify-between hover:bg-[var(--emerald-soft)] text-[var(--text-primary)]"
                      >
                        <span>{lang.name}</span>
                        <span>{lang.flag}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Sadaqah Jariyah Button */}
              <button
                onClick={() => handleNavClick('sadaqah')}
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[var(--gold-primary)] to-[var(--gold-dark)] text-[#0B3D2E] font-bold text-xs shadow-xs transition-all hover:scale-102 border border-[var(--gold-border)]"
              >
                <Share2 className="w-3.5 h-3.5 text-[#0B3D2E]" />
                <span>الصدقة الجارية</span>
              </button>

              {/* Mobile Drawer Trigger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="xl:hidden p-2 rounded-xl bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)]"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

            </div>

          </div>
        </div>

        {/* Mobile Slide-down Drawer */}
        {mobileMenuOpen && (
          <div className="xl:hidden bg-[var(--bg-surface)] border-b border-[var(--border-subtle)] p-4 space-y-3 animate-in slide-in-from-top duration-200">
            <div className="grid grid-cols-2 gap-2">
              {navItems.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                      isActive
                        ? 'bg-[var(--emerald-deep)] text-[var(--gold-primary)] border border-[var(--gold-border)]'
                        : 'bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] hover:bg-[var(--emerald-soft)]'
                    }`}
                  >
                    <Icon className="w-4 h-4 text-[var(--gold-primary)]" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => handleNavClick('sadaqah')}
              className="w-full py-2.5 rounded-xl bg-[var(--gold-primary)] text-[#0B3D2E] font-extrabold text-xs flex items-center justify-center gap-2 shadow-xs border border-[var(--gold-border)]"
            >
              <Share2 className="w-4 h-4 text-[#0B3D2E]" />
              <span>عن الصدقة الجارية واستمراريتها</span>
            </button>
          </div>
        )}
      </header>

      {/* Mobile Bottom Floating App Bar */}
      <div className="xl:hidden fixed bottom-20 left-4 right-4 z-40">
        <div className="bg-[var(--bg-surface)]/95 backdrop-blur-xl border border-[var(--gold-border)] shadow-xl rounded-2xl p-2 flex items-center justify-around">
          {[
            { id: 'home', label: 'الرئيسية', icon: Home },
            { id: 'quran', label: 'المصحف', icon: BookOpen },
            { id: 'tasbeeh', label: 'المسبحة', icon: Sparkles },
            { id: 'adhkar', label: 'الأذكار', icon: Sparkles },
            { id: 'prayer', label: 'الصلاة', icon: Clock }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleNavClick(tab.id)}
                className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
                  isActive
                    ? 'text-[var(--gold-primary)] font-bold scale-105'
                    : 'text-[var(--text-muted)]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-[10px]">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};
