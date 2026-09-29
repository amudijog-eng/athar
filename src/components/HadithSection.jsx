import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { HADITH_CATEGORIES, HADITHS } from '../data/hadithData';
import {
  BookOpen,
  Search,
  Share2,
  Copy,
  Check,
  Heart,
  ChevronDown,
  Info,
  ShieldCheck
} from 'lucide-react';

export const HadithSection = () => {
  const { toggleFavorite, favorites, setShareModalItem, triggerHaptic } = useApp();

  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [expandedExplanationId, setExpandedExplanationId] = useState(null);

  const filteredHadiths = HADITHS.filter(h => {
    const matchesCat = activeCategory === 'all' || h.category === activeCategory;
    const matchesSearch = h.text.includes(searchTerm) || h.narrator.includes(searchTerm) || h.source.includes(searchTerm);
    return matchesCat && matchesSearch;
  });

  const handleCopy = (hadith) => {
    triggerHaptic(20);
    const textToCopy = `« ${hadith.text} »\n[رواه: ${hadith.narrator} — ${hadith.source}] — تطبيق أثر (صدقة جارية)`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(hadith.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section id="hadith" className="py-8 sm:py-12 max-w-5xl mx-auto px-4 sm:px-6">
      
      {/* Header */}
      <div className="text-center space-y-3 mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[var(--emerald-soft)] text-[var(--emerald-deep)] dark:text-[var(--gold-primary)] text-xs font-semibold border border-[var(--emerald-border)]">
          <BookOpen className="w-3.5 h-3.5" />
          <span>السنّة النبوية المطهرة</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-[var(--text-primary)] font-quran">
          الأحاديث النبوية الصحيحة
        </h2>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-md mx-auto">
          أحاديث صحيحة موثقة مع ذكر الراوي والدرجة والشرح الميسر لبيان معاني كلام النبي ﷺ.
        </p>
      </div>

      {/* Search & Topic Filters */}
      <div className="space-y-4 mb-8">
        
        <div className="relative max-w-xl mx-auto">
          <Search className="w-4 h-4 text-[var(--gold-primary)] absolute right-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="ابحث بكلمة من الحديث (مثال: صدقة، بر الوالدين، الصبر)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-4 pr-11 py-3 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs sm:text-sm focus:outline-hidden focus:border-[var(--gold-primary)] shadow-xs"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {HADITH_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => {
                triggerHaptic(15);
                setActiveCategory(cat.id);
              }}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
                activeCategory === cat.id
                  ? 'bg-[var(--emerald-deep)] text-[var(--gold-primary)] shadow-xs border border-[var(--gold-border)] scale-102'
                  : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:bg-[var(--emerald-soft)] border border-[var(--border-subtle)]'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

      </div>

      {/* Hadiths Cards */}
      <div className="space-y-4">
        {filteredHadiths.map(hadith => {
          const isFav = favorites.some(f => f.id === hadith.id);
          const isExplanationOpen = expandedExplanationId === hadith.id;

          return (
            <div
              key={hadith.id}
              className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs hover:border-[var(--gold-primary)] transition-all space-y-4"
            >
              <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[var(--emerald-medium)]" />
                  <span className="text-xs font-bold text-[var(--text-primary)]">
                    رواه: {hadith.narrator}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[var(--emerald-soft)] text-[var(--emerald-deep)] dark:text-[var(--gold-light)] font-bold border border-[var(--emerald-border)]">
                    {hadith.grade}
                  </span>
                  <span className="text-xs text-[var(--text-muted)] font-medium">
                    {hadith.source}
                  </span>
                </div>
              </div>

              <blockquote className="font-amiri text-base sm:text-lg leading-relaxed text-[var(--text-primary)] select-text py-1">
                « {hadith.text} »
              </blockquote>

              {hadith.explanation && (
                <div>
                  <button
                    onClick={() => setExpandedExplanationId(isExplanationOpen ? null : hadith.id)}
                    className="text-xs text-[var(--gold-dark)] dark:text-[var(--gold-light)] font-bold flex items-center gap-1 hover:underline"
                  >
                    <Info className="w-3.5 h-3.5" />
                    <span>شرح الحديث الميسر</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isExplanationOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isExplanationOpen && (
                    <div className="mt-2 p-3.5 rounded-2xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-xs sm:text-sm text-[var(--text-secondary)] font-amiri leading-relaxed animate-in fade-in duration-200">
                      {hadith.explanation}
                    </div>
                  )}
                </div>
              )}

              <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs text-[var(--text-muted)]">
                <span className="text-[11px]">
                  {HADITH_CATEGORIES.find(c => c.id === hadith.category)?.name}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(hadith)}
                    className="p-1.5 rounded-xl hover:bg-[var(--bg-surface-elevated)] transition-colors flex items-center gap-1"
                    title="نسخ الحديث"
                  >
                    {copiedId === hadith.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedId === hadith.id ? 'تم النسخ' : 'نسخ'}</span>
                  </button>

                  <button
                    onClick={() => {
                      setShareModalItem({
                        title: `حديث شريف عن ${hadith.narrator}`,
                        text: hadith.text,
                        source: `${hadith.source} (${hadith.grade})`
                      });
                    }}
                    className="p-1.5 rounded-xl bg-[var(--gold-soft)] text-[var(--gold-dark)] dark:text-[var(--gold-light)] border border-[var(--gold-border)] font-bold transition-colors flex items-center gap-1"
                    title="مشاركة كبطاقة"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>بطاقة مشاركة</span>
                  </button>

                  <button
                    onClick={() => toggleFavorite({ id: hadith.id, type: 'hadith', title: `حديث: ${hadith.narrator}`, text: hadith.text })}
                    className={`p-1.5 rounded-xl hover:bg-[var(--bg-surface-elevated)] transition-colors flex items-center gap-1 ${
                      isFav ? 'text-rose-500 font-bold' : 'text-[var(--text-muted)]'
                    }`}
                    title="إضافة للمفضلة"
                  >
                    <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500' : ''}`} />
                    <span>مفضلة</span>
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
