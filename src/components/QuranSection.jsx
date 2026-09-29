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
  List,
  Sparkles,
  Headphones,
  UserCheck
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
  const [fontSize, setFontSize] = useState(26);
  const [readingMode, setReadingMode] = useState('continuous'); // 'continuous' (Mushaf Page) | 'cards' (Tafsir View)
  const [copiedAyahId, setCopiedAyahId] = useState(null);
  const [activeTafsirAyah, setActiveTafsirAyah] = useState(null);
  const [showReciterPicker, setShowReciterPicker] = useState(false);

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

    const cacheKey = `surah_data_v4_${surah.id}`;
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
    <section id="quran" className="py-6 sm:py-10 max-w-5xl mx-auto px-4 sm:px-6">
      
      {activeSurah ? (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* Reader Top Action Bar */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Back Button & Title */}
            <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
              <button
                onClick={() => {
                  triggerHaptic(15);
                  setActiveSurah(null);
                }}
                className="px-3.5 py-2 rounded-xl bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-xs font-bold flex items-center gap-1.5 transition-colors border border-[var(--border-subtle)] cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
                <span>فهرس السور</span>
              </button>

              <div className="text-center md:text-right">
                <h2 className="text-xl sm:text-2xl font-bold font-quran text-[var(--emerald-deep)] dark:text-[var(--gold-primary)]">
                  سُورَةُ {activeSurah.name}
                </h2>
                <span className="text-[11px] text-[var(--text-muted)]">
                  {activeSurah.type} • {activeSurah.versesCount} آية • الجزء {activeSurah.juz} • ص {activeSurah.startPage}
                </span>
              </div>
            </div>

            {/* Controls Toolbar */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 w-full md:w-auto justify-center md:justify-end text-xs">
              
              {/* Reciter Selector Pill */}
              <div className="relative">
                <button
                  onClick={() => setShowReciterPicker(!showReciterPicker)}
                  className="px-3 py-2 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-xs font-semibold flex items-center gap-1.5 hover:border-[var(--emerald-medium)] transition-colors cursor-pointer"
                  title="تغيير القارئ"
                >
                  <Headphones className="w-3.5 h-3.5 text-[var(--gold-primary)]" />
                  <span className="max-w-[130px] truncate">{activeReciter.name}</span>
                </button>

                {showReciterPicker && (
                  <div className="absolute left-0 sm:right-0 mt-2 w-64 rounded-2xl bg-[var(--bg-surface)] shadow-2xl border border-[var(--border-subtle)] py-2 z-50 max-h-72 overflow-y-auto">
                    <div className="px-3 py-1.5 text-[11px] font-bold text-[var(--text-muted)] border-b border-[var(--border-subtle)]">
                      اختر قارئ التلاوة (أولهم ياسر الدوسري):
                    </div>
                    {RECITERS.map(rec => (
                      <button
                        key={rec.id}
                        onClick={() => {
                          changeReciter(rec);
                          setShowReciterPicker(false);
                        }}
                        className={`w-full px-3 py-2 text-xs text-right flex items-center justify-between hover:bg-[var(--emerald-soft)] cursor-pointer ${
                          activeReciter.id === rec.id
                            ? 'bg-[var(--emerald-soft)] text-[var(--emerald-deep)] dark:text-[var(--gold-primary)] font-bold'
                            : 'text-[var(--text-primary)]'
                        }`}
                      >
                        <span>{rec.name}</span>
                        {activeReciter.id === rec.id && <UserCheck className="w-3.5 h-3.5 text-[var(--emerald-medium)]" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Play Audio Button */}
              <button
                onClick={() => {
                  triggerHaptic(20);
                  playSurah(activeSurah, activeReciter);
                }}
                className="px-3.5 py-2 rounded-xl bg-[var(--emerald-deep)] hover:bg-[var(--emerald-medium)] text-white font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <Volume2 className="w-4 h-4 text-[var(--gold-primary)]" />
                <span>استماع</span>
              </button>

              {/* View Mode Toggle (Mushaf Page vs Cards) */}
              <div className="flex items-center p-1 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)]">
                <button
                  onClick={() => setReadingMode('continuous')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    readingMode === 'continuous'
                      ? 'bg-[var(--bg-surface)] text-[var(--emerald-medium)] dark:text-[var(--gold-primary)] shadow-xs'
                      : 'text-[var(--text-muted)]'
                  }`}
                  title="عرض صفحات المصحف الشريف"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">المصحف</span>
                </button>
                <button
                  onClick={() => setReadingMode('cards')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    readingMode === 'cards'
                      ? 'bg-[var(--bg-surface)] text-[var(--emerald-medium)] dark:text-[var(--gold-primary)] shadow-xs'
                      : 'text-[var(--text-muted)]'
                  }`}
                  title="عرض الآيات مع التفسير الميسر"
                >
                  <List className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">التفسير</span>
                </button>
              </div>

              {/* Font Size Adjuster */}
              <div className="flex items-center gap-1 bg-[var(--bg-surface-elevated)] p-1 rounded-xl border border-[var(--border-subtle)]">
                <button
                  onClick={() => setFontSize(Math.max(20, fontSize - 2))}
                  className="px-2 py-0.5 rounded hover:bg-[var(--bg-surface)] font-bold cursor-pointer text-xs"
                  title="تصغير الخط"
                >
                  -A
                </button>
                <span className="text-[11px] px-1 font-mono text-[var(--text-muted)]">{fontSize}</span>
                <button
                  onClick={() => setFontSize(Math.min(46, fontSize + 2))}
                  className="px-2 py-0.5 rounded hover:bg-[var(--bg-surface)] font-bold cursor-pointer text-xs"
                  title="تكبير الخط"
                >
                  +A
                </button>
              </div>

            </div>

          </div>

          {/* Authentic King Fahd Mushaf Page Frame */}
          <div className="mushaf-page-frame p-6 sm:p-12 space-y-6">
            
            {/* Top Page Margin Ribbon */}
            <div className="flex items-center justify-between border-b border-[var(--gold-border)] pb-3 text-xs text-[var(--gold-dark)] dark:text-[var(--gold-light)] font-bold select-none">
              <span>سُورَةُ {activeSurah.name}</span>
              <span className="text-[11px] text-[var(--text-muted)] font-amiri">
                الجُزْءُ {activeSurah.juz} • الحِزْبُ {Math.ceil(activeSurah.juz * 2)}
              </span>
              <span>{activeSurah.type} ({activeSurah.versesCount} آية)</span>
            </div>

            {/* Gilded Surah Title Box */}
            <div className="surah-header-box p-5 sm:p-7 text-center text-white my-4 relative">
              <span className="text-xs text-[var(--gold-light)] font-bold block mb-1">
                {activeSurah.type === 'مكية' ? 'سورة مكية نزلت بمكة المكرمة' : 'سورة مدنية نزلت بالمدينة المنورة'}
              </span>
              <h1 className="text-3xl sm:text-5xl font-extrabold font-quran text-[var(--gold-light)]">
                سُورَةُ {activeSurah.name}
              </h1>
              <span className="text-xs text-emerald-200 mt-2 block font-amiri">
                آيَاتُهَا {activeSurah.versesCount} • صَفْحَةُ {activeSurah.startPage}
              </span>
            </div>

            {/* Basmalah (except Surah At-Tawbah) */}
            {activeSurah.id !== 9 && (
              <div className="text-center py-4 border-b border-[var(--gold-border)]/60 my-6">
                <span className="font-quran text-2xl sm:text-4xl text-[var(--emerald-deep)] dark:text-[var(--gold-primary)] font-bold">
                  بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                </span>
              </div>
            )}

            {/* Loading Spinner */}
            {loadingAyahs ? (
              <div className="py-24 text-center space-y-3">
                <div className="w-10 h-10 border-4 border-[var(--gold-primary)] border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-sm text-[var(--text-muted)] font-amiri">جاري استحضار الآيات الكريمة لسورة {activeSurah.name}...</p>
              </div>
            ) : readingMode === 'continuous' ? (
              
              /* 1. Continuous Authentic Mushaf Flow */
              <div
                className="leading-loose text-justify font-quran text-[var(--text-primary)] transition-all select-text px-2 sm:px-6"
                style={{ fontSize: `${fontSize}px`, lineHeight: `${fontSize * 2.35}px` }}
              >
                {surahAyahs.map((ayah) => {
                  const isBookmarked = lastRead?.surahId === activeSurah.id && lastRead?.ayahNumber === ayah.numberInSurah;
                  return (
                    <span
                      key={ayah.numberInSurah}
                      className={`inline transition-colors hover:bg-[var(--gold-soft)] rounded-md px-1 py-0.5 cursor-pointer ${
                        isBookmarked ? 'bg-[var(--gold-soft)] border-b-2 border-[var(--gold-primary)]' : ''
                      }`}
                      onClick={() => setActiveTafsirAyah(ayah)}
                      title="انقر لعرض التفسير والنسخ والمشاركة"
                    >
                      {ayah.text}
                      {/* Authentic Gilded Ayah End Rosette */}
                      <span className="ayah-rosette">
                        {ayah.numberInSurah}
                      </span>{' '}
                    </span>
                  );
                })}
              </div>

            ) : (

              /* 2. Side-by-side Ayah Cards & Tafsir */
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

            {/* Bottom Page Ribbon (Page number in classical diamond) */}
            <div className="pt-6 border-t border-[var(--gold-border)] flex items-center justify-between text-xs text-[var(--gold-dark)] dark:text-[var(--gold-light)] font-bold select-none">
              <span>الجُزْءُ {activeSurah.juz}</span>
              <span className="px-3 py-1 rounded-full bg-[var(--gold-soft)] border border-[var(--gold-border)] text-xs font-cairo">
                — صَفْحَةُ {activeSurah.startPage} —
              </span>
              <span>سُورَةُ {activeSurah.name}</span>
            </div>

            {/* Bottom Surah Navigation Controls */}
            <div className="mt-8 pt-4 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                onClick={handlePrevSurah}
                className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-xs font-bold flex items-center justify-center gap-1.5 hover:border-[var(--emerald-medium)] transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
                <span>السورة السابقة</span>
              </button>

              <button
                onClick={() => {
                  saveLastRead(activeSurah.id, activeSurah.name, 1);
                  triggerHaptic(40);
                }}
                className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-[var(--gold-soft)] text-[var(--gold-dark)] dark:text-[var(--gold-light)] border border-[var(--gold-border)] text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-[var(--gold-border)] transition-colors cursor-pointer"
              >
                <Bookmark className="w-4 h-4" />
                <span>حفظ الموضع كعلامة قراءة</span>
              </button>

              <button
                onClick={handleNextSurah}
                className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-xs font-bold flex items-center justify-center gap-1.5 hover:border-[var(--emerald-medium)] transition-colors cursor-pointer"
              >
                <span>السورة التالية</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>

          </div>

          {/* Ayah Actions Modal (Tafsir & Share) */}
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
                    className="p-1 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
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
                    className="p-2.5 rounded-xl bg-[var(--bg-surface-elevated)] hover:bg-[var(--border-subtle)] text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
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
                    className="p-2.5 rounded-xl bg-[var(--gold-soft)] text-[var(--gold-dark)] dark:text-[var(--gold-light)] border border-[var(--gold-border)] text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
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
                    className="p-2.5 rounded-xl bg-[var(--emerald-soft)] text-[var(--emerald-deep)] dark:text-[var(--gold-primary)] border border-[var(--emerald-border)] text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
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
                      triggerHaptic(30);
                    }}
                    className="p-2.5 rounded-xl bg-[var(--bg-surface-elevated)] text-rose-500 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Heart className="w-4 h-4 fill-rose-500" />
                    <span>مفضلة</span>
                  </button>
                </div>

              </div>
            </div>
          )}

        </div>
      ) : (
        /* Surahs Index (114 Surahs Directory) */
        <div className="space-y-6">
          
          {/* Header */}
          <div className="text-center space-y-3 mb-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[var(--emerald-soft)] text-[var(--emerald-deep)] dark:text-[var(--gold-primary)] text-xs font-semibold border border-[var(--emerald-border)]">
              <BookOpen className="w-3.5 h-3.5 text-[var(--gold-primary)]" />
              <span>المصحف الشريف كاملاً (١١٤ سورة)</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[var(--text-primary)] font-quran">
              فهرس القرآن الكريم
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-md mx-auto">
              تصفح سور القرآن العظيم مع إمكانية البحث الفوري، الاستماع بصوت <strong>الشيخ ياسر الدوسري</strong> وكبار القرّاء، وقراءة صفحات المصحف المذهب.
            </p>
          </div>

          {/* Quick Resume Strip */}
          {lastRead && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-[var(--emerald-soft)] to-[var(--bg-surface)] border border-[var(--emerald-border)] flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[var(--emerald-medium)] text-white flex items-center justify-center shrink-0">
                  <Bookmark className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-[var(--text-muted)] block font-semibold">آخر موضع قراءة:</span>
                  <span className="text-sm font-bold text-[var(--text-primary)] font-quran block">
                    سورة {lastRead.surahName} (آية {lastRead.ayahNumber})
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  const s = SURAHS_LIST.find(i => i.id === lastRead.surahId);
                  if (s) openSurah(s);
                }}
                className="px-4 py-2 rounded-xl bg-[var(--emerald-deep)] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs hover:bg-[var(--emerald-medium)] transition-colors cursor-pointer"
              >
                <span>متابعة القراءة</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Search & Topic Filters */}
          <div className="space-y-4">
            
            <div className="relative max-w-xl mx-auto">
              <Search className="w-4 h-4 text-[var(--gold-primary)] absolute right-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="ابحث باسم السورة (مثال: الكهف، يس، الملك، البقرة)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-4 pr-11 py-3 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs sm:text-sm focus:outline-hidden focus:border-[var(--emerald-medium)] shadow-xs"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex items-center justify-between gap-2 flex-wrap text-xs">
              <div className="flex items-center gap-1.5">
                {[
                  { id: 'all', label: 'الكل' },
                  { id: 'مكية', label: 'مكية' },
                  { id: 'مدنية', label: 'مدنية' }
                ].map(t => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedType(t.id)}
                    className={`px-3 py-1.5 rounded-xl font-semibold transition-colors cursor-pointer ${
                      selectedType === t.id
                        ? 'bg-[var(--emerald-deep)] text-white shadow-xs'
                        : 'bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] hover:bg-[var(--emerald-soft)]'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              <select
                value={selectedJuz}
                onChange={(e) => setSelectedJuz(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-xs text-[var(--text-secondary)] font-semibold focus:outline-hidden cursor-pointer"
              >
                <option value="all">كافة الأجزاء (٣٠ جزء)</option>
                {Array.from({ length: 30 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>الجزء {i + 1}</option>
                ))}
              </select>
            </div>

          </div>

          {/* 114 Surahs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {filteredSurahs.map(surah => {
              const isLastRead = lastRead?.surahId === surah.id;
              return (
                <div
                  key={surah.id}
                  className={`group p-4 rounded-2xl bg-[var(--bg-surface)] border transition-all duration-200 hover:shadow-md hover:border-[var(--emerald-medium)] flex flex-col justify-between space-y-3 cursor-pointer ${
                    isLastRead ? 'border-[var(--gold-primary)] bg-[var(--gold-soft)]/50' : 'border-[var(--border-subtle)]'
                  }`}
                  onClick={() => openSurah(surah)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      
                      {/* Rosette Number Badge */}
                      <div className="w-10 h-10 rounded-xl bg-[var(--bg-surface-elevated)] group-hover:bg-[var(--emerald-soft)] flex items-center justify-center font-bold text-xs text-[var(--emerald-deep)] dark:text-[var(--gold-primary)] transition-colors border border-[var(--border-subtle)]">
                        {surah.id}
                      </div>

                      <div>
                        <h3 className="font-bold text-base text-[var(--text-primary)] font-quran group-hover:text-[var(--emerald-medium)] dark:group-hover:text-[var(--emerald-accent)] transition-colors">
                          سورة {surah.name}
                        </h3>
                        <span className="text-[11px] text-[var(--text-muted)] block">
                          {surah.englishName}
                        </span>
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

                  {/* Actions Strip */}
                  <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        playSurah(surah, activeReciter);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-[var(--emerald-soft)] text-[var(--emerald-deep)] dark:text-[var(--gold-primary)] hover:bg-[var(--emerald-medium)] hover:text-white transition-colors flex items-center gap-1 font-bold text-[11px]"
                      title={`استماع لسورة ${surah.name} بصوت ${activeReciter.name}`}
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>استماع</span>
                    </button>

                    <span className="text-[11px] text-[var(--emerald-medium)] font-bold group-hover:underline flex items-center gap-0.5">
                      <span>قراءة المصحف</span>
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

    </section>
  );
};
