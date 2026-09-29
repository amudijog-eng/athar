import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAudioPlayer } from '../context/AudioPlayerContext';
import { SURAHS_LIST, RECITERS, BUNDLED_SURAHS } from '../data/quranData';
import {
  Search,
  BookOpen,
  Volume2,
  Bookmark,
  Share2,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  Heart,
  Info,
  X,
  List
} from 'lucide-react';

export const QuranSection = () => {
  const {
    lastRead,
    saveLastRead,
    toggleFavorite,
    favorites,
    setShareModalItem,
    triggerHaptic
  } = useApp();

  const { playSurah, activeReciter, changeReciter } = useAudioPlayer();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedJuz, setSelectedJuz] = useState('all');

  const [activeSurah, setActiveSurah] = useState(null);
  const [surahAyahs, setSurahAyahs] = useState([]);
  const [loadingAyahs, setLoadingAyahs] = useState(false);
  const [fontSize, setFontSize] = useState(25);
  const [readingMode, setReadingMode] = useState('continuous');
  const [copiedAyahId, setCopiedAyahId] = useState(null);
  const [activeTafsirAyah, setActiveTafsirAyah] = useState(null);

  const normalizeArabic = (text) => {
    return text
      .replace(/[\u064B-\u065F\u0670]/g, '')
      .replace(/[إأآا]/g, 'ا')
      .replace(/ة/g, 'ه')
      .replace(/ى/g, 'ي')
      .toLowerCase();
  };

  const filteredSurahs = SURAHS_LIST.filter(s => {
    const normSearch = normalizeArabic(searchTerm);
    const matchesSearch = normalizeArabic(s.name).includes(normSearch) || s.englishName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || s.type === selectedType;
    const matchesJuz = selectedJuz === 'all' || String(s.juz) === String(selectedJuz);
    return matchesSearch && matchesType && matchesJuz;
  });

  const openSurah = async (surah) => {
    triggerHaptic(20);
    setActiveSurah(surah);
    saveLastRead(surah.id, surah.name, 1);
    setLoadingAyahs(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (BUNDLED_SURAHS[surah.id]) {
      setSurahAyahs(BUNDLED_SURAHS[surah.id].ayahs);
      setLoadingAyahs(false);
      return;
    }

    const cacheKey = `surah_data_v3_${surah.id}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      try {
        setSurahAyahs(JSON.parse(cached));
        setLoadingAyahs(false);
        return;
      } catch {}
    }

    try {
      const res = await fetch(`https://api.alquran.cloud/v1/surah/${surah.id}/editions/quran-uthmani,ar.muyassar`);
      const data = await res.json();
      if (data.code === 200 && data.data) {
        const uthmani = data.data[0].ayahs;
        const tafsir = data.data[1]?.ayahs || [];
        const combined = uthmani.map((a, idx) => ({
          number: a.number,
          numberInSurah: a.numberInSurah,
          text: a.text,
          tafsir: tafsir[idx]?.text || 'التفسير متاح عبر التفاسير المعتمدة.'
        }));
        setSurahAyahs(combined);
        try { localStorage.setItem(cacheKey, JSON.stringify(combined)); } catch {}
      } else {
        throw new Error('API error');
      }
    } catch {
      const placeholders = Array.from({ length: Math.min(surah.versesCount, 15) }, (_, i) => ({
        number: i + 1,
        numberInSurah: i + 1,
        text: `آية كريمة من سورة ${surah.name} رقم (${i + 1}) - يرجى الاتصال بالإنترنت لتحميل السورة كاملة.`,
        tafsir: `تفسير ميسر للآية الكريمة ${i + 1} من سورة ${surah.name}.`
      }));
      setSurahAyahs(placeholders);
    } finally {
      setLoadingAyahs(false);
    }
  };

  const copyAyah = (ayah) => {
    triggerHaptic(20);
    const textToCopy = `﴿ ${ayah.text} ﴾ [سورة ${activeSurah.name}: ${ayah.numberInSurah}] — عبر تطبيق أثر`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedAyahId(ayah.numberInSurah);
    setTimeout(() => setCopiedAyahId(null), 2000);
  };

  const handleNextSurah = () => {
    if (!activeSurah) return;
    const nextId = (activeSurah.id % 114) + 1;
    const next = SURAHS_LIST.find(s => s.id === nextId);
    if (next) openSurah(next);
  };

  const handlePrevSurah = () => {
    if (!activeSurah) return;
    const prevId = activeSurah.id === 1 ? 114 : activeSurah.id - 1;
    const prev = SURAHS_LIST.find(s => s.id === prevId);
    if (prev) openSurah(prev);
  };

  return (
    <section id="quran" className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {activeSurah ? (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* Reader Control Header */}
          <div className="p-4 sm:p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
            
            <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
              <button
                onClick={() => {
                  triggerHaptic(15);
                  setActiveSurah(null);
                }}
                className="px-3.5 py-2 rounded-2xl bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-xs font-bold flex items-center gap-1.5 transition-colors border border-[var(--border-subtle)]"
              >
                <ChevronRight className="w-4 h-4" />
                <span>فهرس السور</span>
              </button>

              <div className="text-center md:text-right">
                <h2 className="text-xl sm:text-2xl font-bold font-quran text-[var(--emerald-deep)] dark:text-[var(--gold-primary)]">
                  سورة {activeSurah.name}
                </h2>
                <span className="text-[11px] text-[var(--text-muted)]">
                  {activeSurah.type} • {activeSurah.versesCount} آية • الجزء {activeSurah.juz} • ص {activeSurah.startPage}
                </span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full md:w-auto justify-center md:justify-end text-xs">
              
              <button
                onClick={() => {
                  triggerHaptic(20);
                  playSurah(activeSurah, activeReciter);
                }}
                className="px-4 py-2 rounded-2xl bg-[var(--emerald-deep)] hover:bg-[var(--emerald-medium)] text-[var(--gold-primary)] font-bold flex items-center gap-2 shadow-xs transition-colors border border-[var(--gold-border)]"
              >
                <Volume2 className="w-4 h-4" />
                <span>استماع للسورة</span>
              </button>

              {/* View Switcher */}
              <div className="flex items-center p-1 rounded-2xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)]">
                <button
                  onClick={() => setReadingMode('continuous')}
                  className={`px-3 py-1 rounded-xl font-bold transition-all ${
                    readingMode === 'continuous'
                      ? 'bg-[var(--bg-surface)] text-[var(--emerald-medium)] dark:text-[var(--gold-primary)] shadow-xs'
                      : 'text-[var(--text-muted)]'
                  }`}
                  title="قراءة المصحف المتصلة"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setReadingMode('cards')}
                  className={`px-3 py-1 rounded-xl font-bold transition-all ${
                    readingMode === 'cards'
                      ? 'bg-[var(--bg-surface)] text-[var(--emerald-medium)] dark:text-[var(--gold-primary)] shadow-xs'
                      : 'text-[var(--text-muted)]'
                  }`}
                  title="عرض الآيات مع التفسير"
                >
                  <List className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Font Size Adjuster */}
              <div className="flex items-center gap-1 bg-[var(--bg-surface-elevated)] p-1 rounded-2xl border border-[var(--border-subtle)]">
                <button
                  onClick={() => setFontSize(Math.max(18, fontSize - 2))}
                  className="px-2 py-1 rounded-lg hover:bg-[var(--bg-surface)] font-bold"
                  title="تصغير الخط"
                >
                  A-
                </button>
                <span className="text-[11px] px-1 font-mono text-[var(--text-muted)]">{fontSize}</span>
                <button
                  onClick={() => setFontSize(Math.min(44, fontSize + 2))}
                  className="px-2 py-1 rounded-lg hover:bg-[var(--bg-surface)] font-bold"
                  title="تكبير الخط"
                >
                  A+
                </button>
              </div>

            </div>

          </div>

          {/* Surah Illuminated Ornate Header Frame */}
          <div className="surah-header-box p-6 sm:p-8 text-center text-white my-6">
            <span className="text-xs text-[var(--gold-light)] font-bold block mb-1">
              {activeSurah.type === 'مكية' ? '🕋 مكية نزلت بمكة المكرمة' : '🕌 مدنية نزلت بالمدينة المنورة'}
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold font-quran text-[var(--gold-light)]">
              سُورَةُ {activeSurah.name}
            </h1>
            <span className="text-xs text-emerald-200 mt-2 block font-amiri">
              آيَاتُهَا {activeSurah.versesCount} • نُزُولُهَا قَبْلَ الْهِجْرَةِ أَوْ بَعْدَهَا
            </span>
          </div>

          {/* Mushaf Page */}
          <div className="mushaf-frame p-6 sm:p-14">
            
            {activeSurah.id !== 9 && (
              <div className="text-center py-6 border-b border-[var(--border-subtle)] mb-8">
                <span className="font-quran text-2xl sm:text-4xl text-[var(--emerald-deep)] dark:text-[var(--gold-primary)] font-bold">
                  بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                </span>
              </div>
            )}

            {loadingAyahs ? (
              <div className="py-24 text-center space-y-3">
                <div className="w-10 h-10 border-4 border-[var(--gold-primary)] border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-sm text-[var(--text-muted)] font-amiri">جاري استحضار الآيات الكريمة لسورة {activeSurah.name}...</p>
              </div>
            ) : readingMode === 'continuous' ? (
              
              /* Continuous Mushaf Reading */
              <div
                className="leading-loose text-justify font-quran text-[var(--text-primary)] transition-all select-text"
                style={{ fontSize: `${fontSize}px`, lineHeight: `${fontSize * 2.3}px` }}
              >
                {surahAyahs.map((ayah) => {
                  const isBookmarked = lastRead?.surahId === activeSurah.id && lastRead?.ayahNumber === ayah.numberInSurah;
                  return (
                    <span
                      key={ayah.numberInSurah}
                      className={`inline transition-colors hover:bg-[var(--gold-soft)] rounded-lg p-1 cursor-pointer ${
                        isBookmarked ? 'bg-[var(--gold-soft)] border-b-2 border-[var(--gold-primary)]' : ''
                      }`}
                      onClick={() => setActiveTafsirAyah(ayah)}
                      title="انقر لعرض التفسير، النسخ، والمشاركة"
                    >
                      {ayah.text}{' '}
                      <span className="inline-flex items-center justify-center font-cairo text-xs sm:text-sm font-bold text-[var(--gold-dark)] dark:text-[var(--gold-light)] mx-1 px-1.5 py-0.5 rounded-full bg-[var(--gold-soft)] border border-[var(--gold-border)] select-none">
                        ﴿{ayah.numberInSurah}﴾
                      </span>{' '}
                    </span>
                  );
                })}
              </div>

            ) : (

              /* Cards View */
              <div className="space-y-4">
                {surahAyahs.map(ayah => (
                  <div
                    key={ayah.numberInSurah}
                    className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-3 shadow-xs hover:border-[var(--gold-primary)] transition-colors"
                  >
                    <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2">
                      <span className="text-xs font-bold text-[var(--gold-dark)] dark:text-[var(--gold-light)]">
                        الآية {ayah.numberInSurah}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => copyAyah(ayah)}
                          className="p-1.5 rounded-lg hover:bg-[var(--bg-surface-elevated)] text-[var(--text-muted)] text-xs flex items-center gap-1"
                        >
                          {copiedAyahId === ayah.numberInSurah ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={() => {
                            setShareModalItem({
                              title: `سورة ${activeSurah.name} [آية ${ayah.numberInSurah}]`,
                              text: ayah.text,
                              source: ayah.tafsir
                            });
                          }}
                          className="p-1.5 rounded-lg hover:bg-[var(--bg-surface-elevated)] text-[var(--gold-primary)] text-xs flex items-center gap-1"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <p className="font-quran text-lg sm:text-2xl text-[var(--text-primary)] leading-loose text-center py-2 select-text">
                      ﴿ {ayah.text} ﴾
                    </p>

                    <div className="p-3.5 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-xs sm:text-sm text-[var(--text-secondary)] font-amiri leading-relaxed">
                      <strong className="text-[var(--gold-dark)] dark:text-[var(--gold-light)] block mb-1">التفسير الميسر:</strong>
                      {ayah.tafsir}
                    </div>
                  </div>
                ))}
              </div>

            )}

            {/* Bottom Surah Navigation */}
            <div className="mt-12 pt-6 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                onClick={handlePrevSurah}
                className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-xs font-bold flex items-center justify-center gap-1.5 hover:border-[var(--gold-primary)] transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
                <span>السورة السابقة</span>
              </button>

              <button
                onClick={() => {
                  saveLastRead(activeSurah.id, activeSurah.name, 1);
                  triggerHaptic(40);
                }}
                className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-[var(--gold-soft)] text-[var(--gold-dark)] dark:text-[var(--gold-light)] border border-[var(--gold-border)] text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-[var(--gold-border)] transition-colors"
              >
                <Bookmark className="w-4 h-4" />
                <span>حفظ الموضع كعلامة قراءة</span>
              </button>

              <button
                onClick={handleNextSurah}
                className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-xs font-bold flex items-center justify-center gap-1.5 hover:border-[var(--gold-primary)] transition-colors"
              >
                <span>السورة التالية</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>

          </div>

          {/* Ayah Actions Modal */}
          {activeTafsirAyah && (
            <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="w-full max-w-2xl bg-[var(--bg-surface)] rounded-3xl p-6 shadow-2xl border border-[var(--border-subtle)] space-y-4 animate-in zoom-in-95">
                
                <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[var(--gold-primary)]" />
                    <h3 className="font-bold text-sm sm:text-base text-[var(--text-primary)]">
                      سورة {activeSurah.name} — الآية {activeTafsirAyah.numberInSurah}
                    </h3>
                  </div>
                  <button
                    onClick={() => setActiveTafsirAyah(null)}
                    className="p-1 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-5 rounded-2xl bg-[var(--gold-soft)] border border-[var(--gold-border)] text-center">
                  <p className="font-quran text-lg sm:text-2xl text-[var(--text-primary)] leading-loose">
                    ﴿ {activeTafsirAyah.text} ﴾
                  </p>
                </div>

                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold text-[var(--gold-dark)] dark:text-[var(--gold-light)] flex items-center gap-1">
                    <Info className="w-3.5 h-3.5" />
                    <span>التفسير الميسر</span>
                  </h4>
                  <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed font-amiri p-3.5 rounded-2xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)]">
                    {activeTafsirAyah.tafsir}
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                  <button
                    onClick={() => copyAyah(activeTafsirAyah)}
                    className="p-2.5 rounded-xl bg-[var(--bg-surface-elevated)] hover:bg-[var(--border-subtle)] text-xs font-semibold flex items-center justify-center gap-1.5"
                  >
                    {copiedAyahId === activeTafsirAyah.numberInSurah ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4 text-[var(--text-muted)]" />
                    )}
                    <span>نسخ الآية</span>
                  </button>

                  <button
                    onClick={() => {
                      setShareModalItem({
                        title: `سورة ${activeSurah.name} - الآية ${activeTafsirAyah.numberInSurah}`,
                        text: activeTafsirAyah.text,
                        source: activeTafsirAyah.tafsir
                      });
                      setActiveTafsirAyah(null);
                    }}
                    className="p-2.5 rounded-xl bg-[var(--gold-soft)] text-[var(--gold-dark)] dark:text-[var(--gold-light)] border border-[var(--gold-border)] text-xs font-bold flex items-center justify-center gap-1.5"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>بطاقة مشاركة</span>
                  </button>

                  <button
                    onClick={() => {
                      saveLastRead(activeSurah.id, activeSurah.name, activeTafsirAyah.numberInSurah);
                      triggerHaptic(40);
                      setActiveTafsirAyah(null);
                    }}
                    className="p-2.5 rounded-xl bg-[var(--emerald-soft)] text-[var(--emerald-deep)] dark:text-[var(--gold-primary)] border border-[var(--emerald-border)] text-xs font-bold flex items-center justify-center gap-1.5"
                  >
                    <Bookmark className="w-4 h-4" />
                    <span>علامة قراءة</span>
                  </button>

                  <button
                    onClick={() => {
                      toggleFavorite({
                        id: `ayah_${activeSurah.id}_${activeTafsirAyah.numberInSurah}`,
                        type: 'ayah',
                        title: `سورة ${activeSurah.name} (آية ${activeTafsirAyah.numberInSurah})`,
                        text: activeTafsirAyah.text
                      });
                      setActiveTafsirAyah(null);
                    }}
                    className="p-2.5 rounded-xl bg-[var(--bg-surface-elevated)] hover:bg-rose-50 hover:text-rose-600 text-xs font-semibold flex items-center justify-center gap-1.5"
                  >
                    <Heart className="w-4 h-4 text-rose-500" />
                    <span>المفضلة</span>
                  </button>
                </div>

              </div>
            </div>
          )}

        </div>
      ) : (
        /* Full 114 Surahs Directory */
        <div className="space-y-6">
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--emerald-soft)] text-[var(--emerald-deep)] dark:text-[var(--gold-primary)] text-xs font-semibold mb-2 border border-[var(--emerald-border)]">
                <BookOpen className="w-3.5 h-3.5" />
                <span>المصحف الشريف كاملاً</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-[var(--text-primary)] font-quran">
                فهرس سور القرآن الكريم
              </h2>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
                تصفح سور القرآن العظيم مع إمكانية البحث الفوري، الاستماع لكبار القرّاء، وقراءة التفسير الميسر.
              </p>
            </div>

            {lastRead && (
              <button
                onClick={() => {
                  const s = SURAHS_LIST.find(i => i.id === lastRead.surahId);
                  if (s) openSurah(s);
                }}
                className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[var(--gold-primary)] to-[var(--gold-dark)] text-[#0B3D2E] text-xs sm:text-sm font-bold flex items-center gap-2 shadow-xs transition-all hover:scale-102 border border-[var(--gold-border)]"
              >
                <Bookmark className="w-4 h-4 text-[#0B3D2E]" />
                <span>متابعة القراءة: سورة {lastRead.surahName} (آية {lastRead.ayahNumber})</span>
              </button>
            )}
          </div>

          {/* Quick Surahs Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs">
            <span className="text-[var(--text-muted)] shrink-0 font-medium">سور شائعة:</span>
            {[1, 18, 36, 55, 56, 67, 112, 113, 114].map(id => {
              const surah = SURAHS_LIST.find(s => s.id === id);
              if (!surah) return null;
              return (
                <button
                  key={id}
                  onClick={() => openSurah(surah)}
                  className="px-3.5 py-1.5 rounded-xl bg-[var(--bg-surface)] hover:bg-[var(--emerald-soft)] text-[var(--text-secondary)] hover:text-[var(--emerald-deep)] font-semibold shrink-0 transition-colors border border-[var(--border-subtle)]"
                >
                  سورة {surah.name}
                </button>
              );
            })}
          </div>

          {/* Search & Filter Bar */}
          <div className="p-4 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs flex flex-col sm:flex-row items-center gap-3">
            
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-[var(--gold-primary)] absolute right-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="ابحث باسم السورة (مثال: الكهف، يس، البقرة)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-4 pr-10 py-2.5 rounded-2xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-xs sm:text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-hidden focus:border-[var(--gold-primary)]"
              />
            </div>

            <div className="flex items-center gap-1.5 w-full sm:w-auto">
              {[
                { id: 'all', label: 'الكل' },
                { id: 'مكية', label: 'مكية 🕋' },
                { id: 'مدنية', label: 'مدنية 🕌' }
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setSelectedType(t.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex-1 sm:flex-initial ${
                    selectedType === t.id
                      ? 'bg-[var(--emerald-deep)] text-[var(--gold-primary)] border border-[var(--gold-border)]'
                      : 'bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] hover:bg-[var(--border-subtle)]'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <select
              value={selectedJuz}
              onChange={(e) => setSelectedJuz(e.target.value)}
              className="px-3 py-2 rounded-2xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-xs text-[var(--text-secondary)] font-semibold focus:outline-hidden w-full sm:w-auto cursor-pointer"
            >
              <option value="all">كافة الأجزاء (٣٠ جزء)</option>
              {Array.from({ length: 30 }, (_, i) => (
                <option key={i + 1} value={i + 1}>الجزء {i + 1}</option>
              ))}
            </select>

          </div>

          {/* Surahs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {filteredSurahs.map(surah => {
              const isLastRead = lastRead?.surahId === surah.id;
              return (
                <div
                  key={surah.id}
                  onClick={() => openSurah(surah)}
                  className={`group cursor-pointer p-4 rounded-3xl bg-[var(--bg-surface)] border transition-all duration-200 hover:shadow-lg hover:border-[var(--gold-primary)] hover:-translate-y-1 relative overflow-hidden ${
                    isLastRead
                      ? 'border-[var(--gold-primary)] bg-[var(--gold-soft)]'
                      : 'border-[var(--border-subtle)]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      
                      {/* Badge */}
                      <div className="w-11 h-11 rounded-2xl bg-[var(--bg-surface-elevated)] group-hover:bg-[var(--emerald-soft)] flex items-center justify-center font-bold text-xs text-[var(--text-secondary)] group-hover:text-[var(--emerald-deep)] transition-colors border border-[var(--border-subtle)]">
                        {surah.id}
                      </div>

                      <div>
                        <h3 className="font-bold text-base text-[var(--text-primary)] font-quran group-hover:text-[var(--emerald-medium)] dark:group-hover:text-[var(--emerald-accent)] transition-colors">
                          سورة {surah.name}
                        </h3>
                        <p className="text-[11px] text-[var(--text-muted)]">
                          {surah.englishName}
                        </p>
                      </div>
                    </div>

                    <div className="text-left text-xs">
                      <span className="font-bold text-[var(--text-secondary)] block">
                        {surah.versesCount} آية
                      </span>
                      <span className="text-[10px] text-[var(--text-muted)] block">
                        {surah.type} • ج{surah.juz}
                      </span>
                    </div>
                  </div>

                  {isLastRead && (
                    <div className="mt-2 pt-2 border-t border-[var(--gold-border)] text-[10px] text-[var(--gold-dark)] dark:text-[var(--gold-light)] font-bold flex items-center gap-1">
                      <Bookmark className="w-3 h-3" />
                      <span>آخر موضع قرأته</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      )}

    </section>
  );
};
