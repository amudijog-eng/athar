import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { SURAHS_LIST } from '../data/quranData';
import { ALL_ADHKAR, ADHKAR_CATEGORIES } from '../data/adhkarData';
import { HADITHS } from '../data/hadithData';
import { DUAS } from '../data/duaData';
import {
  Search,
  X,
  BookOpen,
  Sparkles,
  Heart,
  ChevronLeft
} from 'lucide-react';

export const GlobalSearchModal = () => {
  const { isSearchOpen, setIsSearchOpen, setActiveTab, openSurahById } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all' | 'quran' | 'hadith' | 'adhkar' | 'dua'

  // Keyboard shortcut listener (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  if (!isSearchOpen) return null;

  const query = searchTerm.trim().toLowerCase();

  // Search Results
  const results = [];

  if (query.length > 1) {
    // 1. Quran
    if (filterType === 'all' || filterType === 'quran') {
      SURAHS_LIST.forEach(s => {
        if (s.name.includes(query) || s.englishName.toLowerCase().includes(query)) {
          results.push({
            id: `quran_${s.id}`,
            category: 'قرآن كريم',
            icon: BookOpen,
            title: `سورة ${s.name} (${s.englishName})`,
            snippet: `${s.type} • ${s.versesCount} آية • الجزء ${s.juz}`,
            action: () => {
              openSurahById(s.id);
              setIsSearchOpen(false);
            }
          });
        }
      });
    }

    // 2. Hadiths
    if (filterType === 'all' || filterType === 'hadith') {
      HADITHS.forEach(h => {
        if (h.text.includes(query) || h.narrator.includes(query) || h.explanation.includes(query)) {
          results.push({
            id: h.id,
            category: 'حديث نبوي',
            icon: BookOpen,
            title: `رواه: ${h.narrator}`,
            snippet: h.text,
            action: () => {
              setActiveTab('hadith');
              setIsSearchOpen(false);
            }
          });
        }
      });
    }

    // 3. Adhkar
    if (filterType === 'all' || filterType === 'adhkar') {
      ALL_ADHKAR.forEach(d => {
        if (d.text.includes(query) || d.virtue.includes(query)) {
          results.push({
            id: d.id,
            category: 'أذكار',
            icon: Sparkles,
            title: ADHKAR_CATEGORIES.find(c => c.id === d.category)?.name || 'ذكر مأثور',
            snippet: d.text,
            action: () => {
              setActiveTab('adhkar');
              setIsSearchOpen(false);
            }
          });
        }
      });
    }

    // 4. Duas
    if (filterType === 'all' || filterType === 'dua') {
      DUAS.forEach(dua => {
        if (dua.title.includes(query) || dua.arabic.includes(query)) {
          results.push({
            id: dua.id,
            category: 'دعاء',
            icon: Heart,
            title: dua.title,
            snippet: dua.arabic,
            action: () => {
              setActiveTab('duas');
              setIsSearchOpen(false);
            }
          });
        }
      });
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-start justify-center pt-16 sm:pt-24 p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-[var(--bg-surface)] rounded-3xl shadow-2xl border border-[var(--border-subtle)] overflow-hidden flex flex-col max-h-[80vh]">
        
        {/* Search Input Bar */}
        <div className="p-4 border-b border-[var(--border-subtle)] flex items-center gap-3">
          <Search className="w-5 h-5 text-[var(--gold-primary)] shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="ابحث في القرآن، الأحاديث، الأذكار والأدعية..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-transparent text-sm sm:text-base text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-hidden"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="p-1 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)] border border-transparent hover:border-[var(--border-subtle)] transition-colors"
          >
            <span className="text-xs font-semibold">إغلاق</span>
          </button>
        </div>

        {/* Filter Badges */}
        <div className="px-4 py-2 border-b border-[var(--border-subtle)] flex items-center gap-1.5 overflow-x-auto text-xs scrollbar-none">
          {[
            { id: 'all', label: 'الكل' },
            { id: 'quran', label: 'القرآن الكريم' },
            { id: 'hadith', label: 'الأحاديث' },
            { id: 'adhkar', label: 'الأذكار' },
            { id: 'dua', label: 'الأدعية' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilterType(f.id)}
              className={`px-3 py-1 rounded-xl font-semibold transition-colors shrink-0 ${
                filterType === f.id
                  ? 'bg-[var(--emerald-deep)] text-[var(--gold-primary)] border border-[var(--gold-border)]'
                  : 'bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] hover:bg-[var(--emerald-soft)] border border-[var(--border-subtle)]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-4 space-y-2.5 flex-1">
          {query.length <= 1 ? (
            <div className="py-12 text-center text-[var(--text-muted)] space-y-2">
              <Search className="w-8 h-8 mx-auto opacity-40 text-[var(--gold-primary)]" />
              <p className="text-xs sm:text-sm">اكتب كلمتين أو أكثر لبدء البحث الشامل في المنصة...</p>
            </div>
          ) : results.length === 0 ? (
            <div className="py-12 text-center text-[var(--text-muted)] space-y-1">
              <p className="text-sm text-[var(--text-primary)] font-bold">لم يتم العثور على نتائج تطابق: "{searchTerm}"</p>
              <p className="text-xs">جرّب البحث بكلمة مرادفة كـ (صبر، رزق، والدين، مغفرة)...</p>
            </div>
          ) : (
            results.slice(0, 30).map(item => {
              return (
                <div
                  key={item.id}
                  onClick={item.action}
                  className="p-3.5 rounded-2xl bg-[var(--bg-surface-elevated)] hover:bg-[var(--emerald-soft)] border border-[var(--border-subtle)] hover:border-[var(--emerald-border)] cursor-pointer transition-all flex items-start justify-between gap-3 group"
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--emerald-soft)] text-[var(--emerald-deep)] dark:text-[var(--gold-primary)] border border-[var(--emerald-border)]">
                        {item.category}
                      </span>
                      <h4 className="font-bold text-xs sm:text-sm text-[var(--text-primary)] group-hover:text-[var(--gold-primary)] transition-colors">
                        {item.title}
                      </h4>
                    </div>
                    <p className="text-xs text-[var(--text-secondary)] line-clamp-2 font-amiri leading-relaxed">
                      {item.snippet}
                    </p>
                  </div>

                  <ChevronLeft className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--gold-primary)] group-hover:-translate-x-1 transition-all shrink-0 mt-1" />
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-[var(--bg-surface-elevated)] border-t border-[var(--border-subtle)] flex items-center justify-between text-[11px] text-[var(--text-muted)]">
          <span>{results.length} نتيجة بحث متطابقة</span>
          <div className="flex items-center gap-2">
            <span>استخدم الأسهم للتنقل</span>
            <kbd className="px-1.5 py-0.5 rounded bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border-subtle)] font-mono text-[10px]">ESC للإغلاق</kbd>
          </div>
        </div>

      </div>
    </div>
  );
};
