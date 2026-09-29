import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DUA_CATEGORIES, DUAS } from '../data/duaData';
import {
  Heart,
  Search,
  Check,
  Share2,
  Copy,
  CheckCircle2
} from 'lucide-react';

export const DuaSection = () => {
  const { toggleFavorite, favorites, setShareModalItem, triggerHaptic } = useApp();

  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [readDuas, setReadDuas] = useState(() => {
    try {
      const saved = localStorage.getItem('athar_read_duas');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [copiedId, setCopiedId] = useState(null);

  const filteredDuas = DUAS.filter(d => {
    const matchesCat = activeCategory === 'all' || d.category === activeCategory;
    const matchesSearch = d.title.includes(searchTerm) || d.arabic.includes(searchTerm) || d.source.includes(searchTerm);
    return matchesCat && matchesSearch;
  });

  const markAsRead = (id) => {
    triggerHaptic(20);
    const count = (readDuas[id] || 0) + 1;
    const updated = { ...readDuas, [id]: count };
    setReadDuas(updated);
    localStorage.setItem('athar_read_duas', JSON.stringify(updated));
  };

  const handleCopy = (dua) => {
    triggerHaptic(20);
    const textToCopy = `« ${dua.arabic} »\n[${dua.source}] — تطبيق أثر (صدقة جارية)`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(dua.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section id="duas" className="py-8 sm:py-12 max-w-5xl mx-auto px-4 sm:px-6">
      
      {/* Header */}
      <div className="text-center space-y-3 mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[var(--gold-soft)] text-[var(--gold-dark)] dark:text-[var(--gold-light)] text-xs font-semibold border border-[var(--gold-border)]">
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          <span>الدعاء مخ العبادة</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-[var(--text-primary)] font-quran">
          الأدعية القرآنية والنبوية الجامعة
        </h2>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-md mx-auto">
          «وَقَالَ رَبُّكُمُ ادْعُونِي أَسْتَجِبْ لَكُمْ» — أدعية مباركة لقضاء الحوائج، بر الوالدين، والمغفرة لمن سبقونا.
        </p>
      </div>

      {/* Search & Topic Tabs */}
      <div className="space-y-4 mb-8">
        
        <div className="relative max-w-xl mx-auto">
          <Search className="w-4 h-4 text-[var(--gold-primary)] absolute right-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="ابحث في الأدعية (مثال: الوالدين، الميت، الرزق، الشفاء)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-4 pr-11 py-3 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs sm:text-sm focus:outline-hidden focus:border-[var(--gold-primary)] shadow-xs"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {DUA_CATEGORIES.map(cat => (
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

      {/* Duas List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDuas.map(dua => {
          const isFav = favorites.some(f => f.id === dua.id);
          const timesRead = readDuas[dua.id] || 0;

          return (
            <div
              key={dua.id}
              className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs flex flex-col justify-between space-y-4 hover:border-[var(--gold-primary)] transition-all"
            >
              <div>
                <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3 mb-3">
                  <h3 className="font-bold text-sm text-[var(--text-primary)]">
                    {dua.title}
                  </h3>
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[var(--bg-surface-elevated)] text-[var(--text-muted)] border border-[var(--border-subtle)]">
                    {dua.source}
                  </span>
                </div>

                <p className="font-amiri text-base sm:text-lg leading-relaxed text-[var(--text-primary)] font-medium select-text py-2">
                  « {dua.arabic} »
                </p>

                {dua.virtue && (
                  <p className="text-xs text-[var(--text-secondary)] mt-2 bg-[var(--bg-surface-elevated)] p-3 rounded-2xl border border-[var(--border-subtle)] font-amiri leading-relaxed">
                    {dua.virtue}
                  </p>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs">
                
                <button
                  onClick={() => markAsRead(dua.id)}
                  className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-colors ${
                    timesRead > 0
                      ? 'bg-[var(--emerald-soft)] text-[var(--emerald-deep)] dark:text-[var(--gold-light)] border border-[var(--emerald-border)]'
                      : 'bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] hover:bg-[var(--border-subtle)]'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-[var(--gold-primary)]" />
                  <span>{timesRead > 0 ? `قرأتُه (${timesRead})` : 'قرأتُ هذا الدعاء'}</span>
                </button>

                <div className="flex items-center gap-1.5 text-[var(--text-muted)]">
                  <button
                    onClick={() => handleCopy(dua)}
                    className="p-1.5 rounded-lg hover:bg-[var(--bg-surface-elevated)] transition-colors"
                    title="نسخ الدعاء"
                  >
                    {copiedId === dua.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => {
                      setShareModalItem({
                        title: dua.title,
                        text: dua.arabic,
                        source: `${dua.source} — ${dua.virtue || ''}`
                      });
                    }}
                    className="p-1.5 rounded-lg hover:bg-[var(--bg-surface-elevated)] transition-colors text-[var(--gold-primary)]"
                    title="مشاركة كبطاقة"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => toggleFavorite({ id: dua.id, type: 'dua', title: dua.title, text: dua.arabic })}
                    className={`p-1.5 rounded-lg hover:bg-[var(--bg-surface-elevated)] transition-colors ${
                      isFav ? 'text-rose-500' : ''
                    }`}
                    title="إضافة للمفضلة"
                  >
                    <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500' : ''}`} />
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
