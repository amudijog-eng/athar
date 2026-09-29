import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { playSoftTap, playChimeSound } from '../utils/soundEffects';
import {
  BookOpen,
  Calendar,
  CheckCircle,
  Eye,
  EyeOff,
  RotateCcw
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const KhatmahPlanner = () => {
  const { khatmah, setKhatmah, triggerHaptic } = useApp();

  const [activeTab, setActiveTab] = useState('khatmah'); // 'khatmah' | 'hifz'

  const totalQuranPages = 604;
  const days = khatmah.durationDays || 30;
  const pagesPerDay = Math.ceil(totalQuranPages / days);
  const pagesPerPrayer = Math.ceil(pagesPerDay / 5);
  const readPages = khatmah.readPages || 0;
  const progressPercent = Math.min(100, Math.round((readPages / totalQuranPages) * 100));

  const handleSelectDays = (target) => {
    triggerHaptic(20);
    playSoftTap();
    const updated = { ...khatmah, durationDays: target };
    setKhatmah(updated);
    localStorage.setItem('athar_khatmah', JSON.stringify(updated));
  };

  const handleAddPages = (amount) => {
    triggerHaptic(25);
    playSoftTap();
    const newPages = Math.min(totalQuranPages, Math.max(0, readPages + amount));
    const updated = { ...khatmah, readPages: newPages };
    setKhatmah(updated);
    localStorage.setItem('athar_khatmah', JSON.stringify(updated));

    if (newPages >= totalQuranPages) {
      playChimeSound();
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
    }
  };

  const handleResetKhatmah = () => {
    triggerHaptic(30);
    const updated = { ...khatmah, readPages: 0 };
    setKhatmah(updated);
    localStorage.setItem('athar_khatmah', JSON.stringify(updated));
  };

  // Memorization Helper State
  const HIFZ_PRESETS = [
    { surah: 'الملك', ayah: 1, text: 'تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ' },
    { surah: 'البقرة (آية الكرسي)', ayah: 255, text: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ' },
    { surah: 'الإخلاص', ayah: 1, text: 'قُلْ هُوَ اللَّهُ أَحَدٌ ۞ اللَّهُ الصَّمَدُ ۞ لَمْ يَلِدْ وَلَمْ يُولَدْ ۞ وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ' },
    { surah: 'الفلق', ayah: 1, text: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ۞ مِن شَرِّ مَا خَلَقَ ۞ وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ ۞ وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ ۞ وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ' },
    { surah: 'الناس', ayah: 1, text: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ ۞ مَلِكِ النَّاسِ ۞ إِلَٰهِ النَّاسِ ۞ مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ ۞ الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ ۞ مِنَ الْجِنَّةِ وَالنَّاسِ' },
    { surah: 'العصر', ayah: 1, text: 'وَالْعَصْرِ ۞ إِنَّ الْإِنسَانَ لَفِي خُسْرٍ ۞ إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ' },
    { surah: 'الكوثر', ayah: 1, text: 'إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ ۞ فَصَلِّ لِرَبِّكَ وَانْحَرْ ۞ إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ' },
    { surah: 'الشرح', ayah: 1, text: 'أَلَمْ نَشْرَحْ لَكَ صَدْرَكَ ۞ وَوَضَعْنَا عَنكَ وِزْرَكَ ۞ الَّذِي أَنقَضَ ظَهْرَكَ ۞ وَرَفَعْنَا لَكَ ذِكْرَكَ ۞ فَإِنَّ مَعَ الْعُسْرِ يُسْرًا ۞ إِنَّ مَعَ الْعُسْرِ يُسْرًا' }
  ];

  const [hifzVerse, setHifzVerse] = useState(() => HIFZ_PRESETS[0]);
  const [isVerseHidden, setIsVerseHidden] = useState(false);
  const [repeatCount, setRepeatCount] = useState(0);

  return (
    <section id="khatmah" className="py-8 sm:py-12 max-w-4xl mx-auto px-4 sm:px-6">
      
      {/* Header */}
      <div className="text-center space-y-3 mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[var(--emerald-soft)] text-[var(--emerald-deep)] dark:text-[var(--gold-primary)] text-xs font-semibold border border-[var(--emerald-border)]">
          <BookOpen className="w-3.5 h-3.5 text-[var(--gold-primary)]" />
          <span>المصحف الشريف</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-[var(--text-primary)] font-quran">
          خطة الختمة ومُعين الحفظ
        </h2>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-md mx-auto">
          خطط لختم القرآن الكريم في المدة التي تناسبك، مع أداة تفاعلية للمساعدة على حفظ ومراجعة الآيات.
        </p>

        {/* Tab Switcher */}
        <div className="inline-flex items-center p-1 rounded-2xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] mt-4">
          <button
            onClick={() => {
              triggerHaptic(15);
              setActiveTab('khatmah');
            }}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'khatmah'
                ? 'bg-[var(--emerald-deep)] text-[var(--gold-primary)] shadow-xs border border-[var(--gold-border)]'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            خطة ختمة القرآن
          </button>
          <button
            onClick={() => {
              triggerHaptic(15);
              setActiveTab('hifz');
            }}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'hifz'
                ? 'bg-[var(--emerald-deep)] text-[var(--gold-primary)] shadow-xs border border-[var(--gold-border)]'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            مُعين حفظ القرآن
          </button>
        </div>
      </div>

      {activeTab === 'khatmah' ? (
        <div className="space-y-6">
          
          <div className="p-6 sm:p-10 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs space-y-6">
            
            {/* Target Duration Selector */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-[var(--text-secondary)] block">
                اختر خطة الختمة المستهدفة:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { days: 7, label: 'ختمة في ٧ أيام' },
                  { days: 15, label: 'ختمة في ١٥ يوم' },
                  { days: 30, label: 'ختمة في شهر (٣٠ يوم)' },
                  { days: 60, label: 'ختمة في شهرين (٦٠ يوم)' }
                ].map(opt => (
                  <button
                    key={opt.days}
                    onClick={() => handleSelectDays(opt.days)}
                    className={`p-3 rounded-2xl text-xs font-bold transition-all ${
                      days === opt.days
                        ? 'bg-[var(--emerald-deep)] text-[var(--gold-primary)] shadow-xs border border-[var(--gold-border)]'
                        : 'bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] hover:bg-[var(--border-subtle)]'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quota Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-center">
              <div className="p-2">
                <span className="text-[var(--text-muted)] text-xs block">معدل القراءة اليومي</span>
                <span className="text-xl sm:text-2xl font-extrabold text-[var(--emerald-medium)] dark:text-[var(--gold-primary)] block font-cairo">
                  {pagesPerDay} صفحة
                </span>
                <span className="text-[10px] text-[var(--text-muted)]">حوالي {(pagesPerDay / 20).toFixed(1)} جزء يومياً</span>
              </div>

              <div className="p-2 border-y sm:border-y-0 sm:border-x border-[var(--border-subtle)]">
                <span className="text-[var(--text-muted)] text-xs block">دبر كل صلاة مكتوبة</span>
                <span className="text-xl sm:text-2xl font-extrabold text-[var(--gold-dark)] dark:text-[var(--gold-light)] block font-cairo">
                  {pagesPerPrayer} صفحات
                </span>
                <span className="text-[10px] text-[var(--text-muted)]">فجر، ظهر، عصر، مغرب، عشاء</span>
              </div>

              <div className="p-2">
                <span className="text-[var(--text-muted)] text-xs block">الصفحات المتبقية للختم</span>
                <span className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)] block font-cairo">
                  {totalQuranPages - readPages} صفحة
                </span>
                <span className="text-[10px] text-[var(--emerald-medium)] dark:text-[var(--emerald-accent)]">من أصل ٦٠٤ صفحة</span>
              </div>
            </div>

            {/* Progress Bar & Buttons */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-[var(--text-secondary)]">التقدم الإجمالي في الختمة:</span>
                <span className="text-[var(--emerald-medium)] dark:text-[var(--gold-primary)]">{readPages} / {totalQuranPages} صفحة ({progressPercent}%)</span>
              </div>

              <div className="w-full bg-[var(--bg-surface-elevated)] h-3 rounded-full overflow-hidden">
                <div
                  className="bg-[var(--gold-primary)] h-full rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleAddPages(1)}
                    className="px-3 py-1.5 rounded-xl bg-[var(--bg-surface-elevated)] hover:bg-[var(--border-subtle)] text-xs font-bold text-[var(--text-primary)]"
                  >
                    + صفحة
                  </button>
                  <button
                    onClick={() => handleAddPages(4)}
                    className="px-3 py-1.5 rounded-xl bg-[var(--bg-surface-elevated)] hover:bg-[var(--border-subtle)] text-xs font-bold text-[var(--text-primary)]"
                  >
                    + ٤ صفحات (صلاة)
                  </button>
                  <button
                    onClick={() => handleAddPages(20)}
                    className="px-3.5 py-1.5 rounded-xl bg-[var(--emerald-deep)] hover:bg-[var(--emerald-medium)] text-[var(--gold-primary)] text-xs font-bold border border-[var(--gold-border)]"
                  >
                    + جزء كامل (٢٠ صفحة)
                  </button>
                </div>

                <button
                  onClick={handleResetKhatmah}
                  className="text-[var(--text-muted)] hover:text-rose-600 text-xs flex items-center gap-1"
                  title="تصفير الختمة"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>تصفير الختمة</span>
                </button>
              </div>

            </div>

          </div>

        </div>
      ) : (
        /* Memorization Helper */
        <div className="p-6 sm:p-10 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
            <div>
              <h3 className="font-bold text-base text-[var(--text-primary)]">
                أداة اختبار وحفظ الآيات
              </h3>
              <p className="text-xs text-[var(--text-muted)]">
                كرر قراءة الآية ثم قم بإخفائها لاختبار قوة حفظك واسترجاعها من الذاكرة.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={hifzVerse.surah}
                onChange={(e) => {
                  const found = HIFZ_PRESETS.find(p => p.surah === e.target.value);
                  if (found) {
                    setHifzVerse(found);
                    setIsVerseHidden(false);
                    setRepeatCount(0);
                  }
                }}
                className="text-xs px-3 py-1.5 rounded-xl bg-[var(--bg-surface-elevated)] text-[var(--emerald-deep)] dark:text-[var(--gold-primary)] font-bold border border-[var(--border-subtle)] focus:outline-hidden cursor-pointer"
              >
                {HIFZ_PRESETS.map(p => (
                  <option key={p.surah} value={p.surah} className="bg-[var(--bg-surface)] text-[var(--text-primary)]">
                    سورة {p.surah}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mushaf-frame p-8 text-center min-h-[160px] flex items-center justify-center">
            {isVerseHidden ? (
              <div className="space-y-3">
                <span className="text-xs text-[var(--text-muted)] block">الآية مخفية الآن للتسميع الذاتي</span>
                <p className="font-quran text-2xl text-[var(--text-muted)] filter blur-md select-none">
                  {hifzVerse.text}
                </p>
                <button
                  onClick={() => setIsVerseHidden(false)}
                  className="px-4 py-2 rounded-xl bg-[var(--gold-primary)] text-[#0B3D2E] text-xs font-bold inline-flex items-center gap-1.5 shadow-xs border border-[var(--gold-border)]"
                >
                  <Eye className="w-4 h-4" />
                  <span>إظهار الآية للمراجعة</span>
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="font-quran text-2xl sm:text-3xl text-[var(--text-primary)] leading-loose">
                  ﴿ {hifzVerse.text} ﴾
                </p>
                <button
                  onClick={() => setIsVerseHidden(true)}
                  className="px-4 py-2 rounded-xl bg-[var(--emerald-deep)] text-[var(--gold-primary)] text-xs font-bold inline-flex items-center gap-1.5 border border-[var(--gold-border)]"
                >
                  <EyeOff className="w-4 h-4" />
                  <span>إخفاء الآية واختبر حفظك</span>
                </button>
              </div>
            )}
          </div>

          {/* Repetition counter */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-xs">
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-[var(--gold-primary)]" />
              <span className="font-semibold text-[var(--text-secondary)]">مرات التكرار التثبيتي:</span>
              <span className="px-2 py-0.5 rounded-lg bg-[var(--gold-soft)] text-[var(--gold-dark)] dark:text-[var(--gold-light)] font-bold border border-[var(--gold-border)]">
                {repeatCount} مرات
              </span>
            </div>

            <button
              onClick={() => {
                triggerHaptic(20);
                playSoftTap();
                setRepeatCount(c => c + 1);
              }}
              className="px-3.5 py-1.5 rounded-xl bg-[var(--emerald-deep)] hover:bg-[var(--emerald-medium)] text-[var(--gold-primary)] font-bold transition-colors border border-[var(--gold-border)]"
            >
              + كرّرتُ مرة
            </button>
          </div>

        </div>
      )}

    </section>
  );
};
