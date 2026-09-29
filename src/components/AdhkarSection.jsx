import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { playSoftTap, playChimeSound } from '../utils/soundEffects';
import { ADHKAR_CATEGORIES, ALL_ADHKAR } from '../data/adhkarData';
import {
  Sun,
  Moon,
  Bed,
  Sunrise,
  Sparkles,
  Compass,
  Coffee,
  Home,
  HeartPulse,
  CloudRain,
  ShieldCheck,
  Check,
  RotateCcw,
  Copy,
  Share2,
  ChevronDown,
  Info,
  Heart
} from 'lucide-react';
import confetti from 'canvas-confetti';

const ICON_MAP = {
  Sun,
  Moon,
  Bed,
  Sunrise,
  Sparkles,
  Compass,
  Coffee,
  Home,
  HeartPulse,
  CloudRain,
  ShieldCheck
};

export const AdhkarSection = () => {
  const { triggerHaptic, setShareModalItem, toggleFavorite, favorites } = useApp();
  
  const [activeCategory, setActiveCategory] = useState('morning');
  const [adhkarState, setAdhkarState] = useState(() => {
    const state = {};
    ALL_ADHKAR.forEach(d => {
      state[d.id] = 0;
    });
    return state;
  });

  const [expandedVirtueId, setExpandedVirtueId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const categoryAdhkar = ALL_ADHKAR.filter(d => d.category === activeCategory);
  const completedCount = categoryAdhkar.filter(d => (adhkarState[d.id] || 0) >= d.count).length;
  const progressPercent = categoryAdhkar.length > 0 ? Math.round((completedCount / categoryAdhkar.length) * 100) : 0;

  const handleIncrement = (dhikr) => {
    const current = adhkarState[dhikr.id] || 0;
    if (current >= dhikr.count) return;

    triggerHaptic(20);
    playSoftTap();

    const next = current + 1;
    setAdhkarState(prev => ({ ...prev, [dhikr.id]: next }));

    if (next === dhikr.count) {
      triggerHaptic([40, 40, 60]);
      if (completedCount + 1 === categoryAdhkar.length) {
        playChimeSound();
        confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
      }
    }
  };

  const handleResetCategory = () => {
    triggerHaptic(30);
    setAdhkarState(prev => {
      const updated = { ...prev };
      categoryAdhkar.forEach(d => {
        updated[d.id] = 0;
      });
      return updated;
    });
  };

  const handleCopy = (dhikr) => {
    triggerHaptic(15);
    const textToCopy = `« ${dhikr.text} »\n[${dhikr.source}] — عبر تطبيق أثر`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(dhikr.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section id="adhkar" className="py-8 sm:py-12 max-w-5xl mx-auto px-4 sm:px-6">
      
      {/* Header */}
      <div className="text-center space-y-3 mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[var(--emerald-soft)] text-[var(--emerald-deep)] dark:text-[var(--gold-primary)] text-xs font-semibold border border-[var(--emerald-border)]">
          <Sparkles className="w-3.5 h-3.5 text-[var(--gold-primary)]" />
          <span>حصن المسلم والأذكار اليومية</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-[var(--text-primary)] font-quran">
          الأذكار اليومية المأثورة
        </h2>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-md mx-auto">
          «الَّذِينَ آمَنُوا وَتَطْمَئِنُّ قُلُوبُهُم بِذِكْرِ اللَّهِ ۗ أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ»
        </p>
      </div>

      {/* Categories Horizontal Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none mb-6">
        {ADHKAR_CATEGORIES.map(cat => {
          const Icon = ICON_MAP[cat.icon] || Sparkles;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold shrink-0 transition-all flex items-center gap-2 ${
                isActive
                  ? 'bg-[var(--emerald-deep)] text-[var(--gold-primary)] shadow-sm border border-[var(--gold-border)] scale-102'
                  : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:bg-[var(--emerald-soft)] border border-[var(--border-subtle)]'
              }`}
            >
              <Icon className="w-4 h-4 text-[var(--gold-primary)]" />
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* Progress & Reset Strip */}
      <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="w-full sm:w-auto">
          <div className="flex items-center justify-between sm:justify-start gap-3 mb-1.5">
            <span className="text-xs font-bold text-[var(--text-primary)]">
              نسبة إنجاز أذكار {ADHKAR_CATEGORIES.find(c => c.id === activeCategory)?.name}:
            </span>
            <span className="text-xs font-extrabold text-[var(--emerald-medium)] dark:text-[var(--emerald-accent)]">
              {completedCount} من {categoryAdhkar.length} ({progressPercent}%)
            </span>
          </div>
          <div className="w-full sm:w-72 bg-[var(--bg-surface-elevated)] h-2 rounded-full overflow-hidden">
            <div
              className="bg-[var(--emerald-medium)] dark:bg-[var(--gold-primary)] h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <button
          onClick={handleResetCategory}
          className="px-3.5 py-1.5 rounded-xl bg-[var(--bg-surface-elevated)] hover:bg-rose-50 hover:text-rose-600 text-[var(--text-muted)] text-xs font-semibold flex items-center gap-1.5 transition-colors border border-[var(--border-subtle)] self-end sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>إعادة تصفير العدادات</span>
        </button>
      </div>

      {/* Adhkar Cards List */}
      <div className="space-y-4">
        {categoryAdhkar.map((dhikr, idx) => {
          const current = adhkarState[dhikr.id] || 0;
          const isDone = current >= dhikr.count;
          const remaining = dhikr.count - current;
          const isVirtueExpanded = expandedVirtueId === dhikr.id;
          const isFav = favorites.some(f => f.id === dhikr.id);

          return (
            <div
              key={dhikr.id}
              className={`p-5 sm:p-6 rounded-3xl transition-all duration-200 border ${
                isDone
                  ? 'bg-[var(--emerald-soft)] border-[var(--emerald-border)]'
                  : 'bg-[var(--bg-surface)] border-[var(--border-subtle)] shadow-xs'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[var(--bg-surface-elevated)] text-[11px] font-bold text-[var(--text-muted)] flex items-center justify-center border border-[var(--border-subtle)]">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-semibold text-[var(--emerald-medium)] dark:text-[var(--gold-primary)]">
                      التكرار المطلوب: {dhikr.count} {dhikr.count > 1 ? 'مرات' : 'مرة'}
                    </span>
                  </div>

                  <p className="font-amiri text-base sm:text-lg leading-relaxed text-[var(--text-primary)] select-text font-medium">
                    « {dhikr.text} »
                  </p>

                  {dhikr.virtue && (
                    <div className="pt-1">
                      <button
                        onClick={() => setExpandedVirtueId(isVirtueExpanded ? null : dhikr.id)}
                        className="text-xs text-[var(--gold-dark)] dark:text-[var(--gold-light)] font-semibold flex items-center gap-1 hover:underline"
                      >
                        <Info className="w-3.5 h-3.5" />
                        <span>فضل الذكر وسنده</span>
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isVirtueExpanded ? 'rotate-180' : ''}`} />
                      </button>

                      {isVirtueExpanded && (
                        <div className="mt-2 p-3.5 rounded-2xl bg-[var(--gold-soft)] border border-[var(--gold-border)] text-xs space-y-1 animate-in fade-in duration-200">
                          <p className="text-[var(--text-secondary)] font-medium">
                            {dhikr.virtue}
                          </p>
                          <p className="text-[var(--emerald-deep)] dark:text-[var(--emerald-accent)] font-bold text-[11px]">
                            المصدر: {dhikr.source}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex items-center gap-2 pt-2 text-[var(--text-muted)] text-xs">
                    <button
                      onClick={() => handleCopy(dhikr)}
                      className="p-1.5 rounded-lg hover:bg-[var(--bg-surface-elevated)] transition-colors flex items-center gap-1"
                      title="نسخ الذكر"
                    >
                      {copiedId === dhikr.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span className="text-[11px]">{copiedId === dhikr.id ? 'تم النسخ' : 'نسخ'}</span>
                    </button>

                    <button
                      onClick={() => {
                        setShareModalItem({
                          title: `ذكر مأثور [${ADHKAR_CATEGORIES.find(c => c.id === activeCategory)?.name}]`,
                          text: dhikr.text,
                          source: `${dhikr.source} — ${dhikr.virtue || ''}`
                        });
                      }}
                      className="p-1.5 rounded-lg hover:bg-[var(--bg-surface-elevated)] transition-colors flex items-center gap-1"
                      title="مشاركة كبطاقة"
                    >
                      <Share2 className="w-3.5 h-3.5 text-[var(--gold-primary)]" />
                      <span className="text-[11px]">انشر</span>
                    </button>

                    <button
                      onClick={() => toggleFavorite({ id: dhikr.id, type: 'dhikr', title: 'ذكر مأثور', text: dhikr.text })}
                      className={`p-1.5 rounded-lg hover:bg-[var(--bg-surface-elevated)] transition-colors flex items-center gap-1 ${
                        isFav ? 'text-rose-500 font-bold' : 'text-[var(--text-muted)]'
                      }`}
                      title="إضافة للمفضلة"
                    >
                      <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-rose-500' : ''}`} />
                      <span className="text-[11px]">مفضلة</span>
                    </button>
                  </div>
                </div>

                {/* Counter Button */}
                <div className="flex md:flex-col items-center justify-between md:justify-center border-t md:border-t-0 md:border-r border-[var(--border-subtle)] pt-3 md:pt-0 md:pr-6 shrink-0">
                  <button
                    onClick={() => handleIncrement(dhikr)}
                    disabled={isDone}
                    className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl font-bold flex flex-col items-center justify-center transition-all duration-150 select-none cursor-pointer ${
                      isDone
                        ? 'bg-[var(--emerald-medium)] text-white shadow-xs'
                        : 'bg-[var(--emerald-deep)] text-[var(--gold-primary)] hover:bg-[var(--emerald-medium)] active:scale-95 shadow-sm border border-[var(--gold-border)]'
                    }`}
                  >
                    {isDone ? (
                      <>
                        <Check className="w-6 h-6 sm:w-8 sm:h-8" />
                        <span className="text-[10px] mt-0.5">اكتمل</span>
                      </>
                    ) : (
                      <>
                        <span className="text-xl sm:text-2xl font-extrabold">{current} / {dhikr.count}</span>
                        <span className="text-[10px] text-[var(--gold-light)] opacity-90">باقي: {remaining}</span>
                      </>
                    )}
                  </button>
                </div>

              </div>
            </div>
          );
        })}
      </div>

    </section>
  );
};
