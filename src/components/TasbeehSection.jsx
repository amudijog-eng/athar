import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { playBeadSound, playChimeSound } from '../utils/soundEffects';
import {
  RotateCcw,
  Volume2,
  VolumeX,
  Smartphone,
  Plus,
  Check,
  Award,
  Sparkles,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';

const PRESET_ADHKAR = [
  { id: 't1', text: 'سُبْحَانَ اللَّهِ', target: 33 },
  { id: 't2', text: 'الْحَمْدُ لِلَّهِ', target: 33 },
  { id: 't3', text: 'اللَّهُ أَكْبَرُ', target: 34 },
  { id: 't4', text: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ', target: 100 },
  { id: 't5', text: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ ، سُبْحَانَ اللَّهِ الْعَظِيمِ', target: 100 },
  { id: 't6', text: 'أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ وَأَتُوبُ إِلَيْهِ', target: 100 },
  { id: 't7', text: 'اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّدٍ', target: 100 },
  { id: 't8', text: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ الْعَلِيِّ الْعَظِيمِ', target: 100 }
];

export const TasbeehSection = () => {
  const { triggerHaptic } = useApp();

  const [activeDhikr, setActiveDhikr] = useState(() => PRESET_ADHKAR[0]);
  const [count, setCount] = useState(0);
  const [laps, setLaps] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrateEnabled, setVibrateEnabled] = useState(true);
  const [targetCount, setTargetCount] = useState(33); // 33 | 100 | 1000 | 0 (unlimited)
  
  // Custom Dhikr modal
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customText, setCustomText] = useState('');
  const [customTarget, setCustomTarget] = useState(33);

  // Lifetime counter
  const [totalLifetimeTasbeeh, setTotalLifetimeTasbeeh] = useState(() => {
    return Number(localStorage.getItem('athar_lifetime_tasbeeh')) || 0;
  });

  const handleTasbeehClick = () => {
    if (vibrateEnabled) triggerHaptic(25);
    if (soundEnabled) playBeadSound();

    const nextCount = count + 1;
    const nextLifetime = totalLifetimeTasbeeh + 1;
    
    setTotalLifetimeTasbeeh(nextLifetime);
    localStorage.setItem('athar_lifetime_tasbeeh', String(nextLifetime));

    if (targetCount > 0 && nextCount >= targetCount) {
      setCount(0);
      setLaps(l => l + 1);
      if (vibrateEnabled) triggerHaptic([50, 50, 100]);
      if (soundEnabled) playChimeSound();
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    } else {
      setCount(nextCount);
    }
  };

  const handleReset = () => {
    setCount(0);
    setLaps(0);
    triggerHaptic(30);
  };

  const handleAddCustom = (e) => {
    e.preventDefault();
    if (!customText.trim()) return;
    const newDhikr = {
      id: `custom_${Date.now()}`,
      text: customText.trim(),
      target: Number(customTarget) || 33
    };
    setActiveDhikr(newDhikr);
    setTargetCount(newDhikr.target);
    setCount(0);
    setLaps(0);
    setShowCustomModal(false);
    setCustomText('');
  };

  const progressPercent = targetCount > 0 ? Math.min(100, Math.round((count / targetCount) * 100)) : 100;

  return (
    <section id="tasbeeh" className="py-8 sm:py-12 max-w-4xl mx-auto px-4 sm:px-6">
      
      {/* Header */}
      <div className="text-center space-y-3 mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[var(--gold-soft)] text-[var(--gold-dark)] dark:text-[var(--gold-light)] text-xs font-semibold border border-[var(--gold-border)]">
          <Sparkles className="w-3.5 h-3.5 text-[var(--gold-primary)]" />
          <span>«فَسَبِّحْ بِحَمْدِ رَبِّكَ وَاسْتَغْفِرْهُ»</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-[var(--text-primary)] font-quran">
          المسبحة الإلكترونية الذكية
        </h2>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-md mx-auto">
          مسبحة تفاعلية متطورة بصوت نقر خشب المسبحة الطبيعي، اهتزاز لمسي، وحفظ دائم لتسبيحاتك.
        </p>
      </div>

      {/* Preset Adhkar Horizontal Picker */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none mb-6">
        {PRESET_ADHKAR.map(item => {
          const isSelected = activeDhikr.id === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveDhikr(item);
                setTargetCount(item.target);
                setCount(0);
                setLaps(0);
              }}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[var(--emerald-deep)] text-[var(--gold-primary)] shadow-sm border border-[var(--gold-border)] scale-102'
                  : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:bg-[var(--emerald-soft)] border border-[var(--border-subtle)]'
              }`}
            >
              {item.text}
            </button>
          );
        })}

        <button
          onClick={() => setShowCustomModal(true)}
          className="px-4 py-2.5 rounded-2xl text-xs font-bold shrink-0 bg-[var(--gold-soft)] text-[var(--gold-dark)] dark:text-[var(--gold-light)] hover:opacity-90 border border-[var(--gold-border)] flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>ذكر مخصص</span>
        </button>
      </div>

      {/* Main Luxury Masbaha Dial */}
      <div className="relative p-6 sm:p-12 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xl text-center space-y-6">
        
        {/* Top Controls: Sound, Vibrate, Laps, Reset */}
        <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2.5 rounded-2xl border transition-colors cursor-pointer ${
                soundEnabled
                  ? 'bg-[var(--emerald-soft)] text-[var(--emerald-deep)] dark:text-[var(--gold-primary)] border-[var(--emerald-border)]'
                  : 'bg-[var(--bg-surface-elevated)] text-[var(--text-muted)] border-[var(--border-subtle)]'
              }`}
              title="صوت نقر خشب المسبحة"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setVibrateEnabled(!vibrateEnabled)}
              className={`p-2.5 rounded-2xl border transition-colors cursor-pointer ${
                vibrateEnabled
                  ? 'bg-[var(--emerald-soft)] text-[var(--emerald-deep)] dark:text-[var(--gold-primary)] border-[var(--emerald-border)]'
                  : 'bg-[var(--bg-surface-elevated)] text-[var(--text-muted)] border-[var(--border-subtle)]'
              }`}
              title="الاهتزاز اللمسي"
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>

          {/* Laps indicator */}
          <div className="flex items-center gap-2 font-bold bg-[var(--gold-soft)] px-3 py-1.5 rounded-xl border border-[var(--gold-border)]">
            <span className="text-[var(--gold-dark)] dark:text-[var(--gold-light)] text-xs">الدورات:</span>
            <span className="text-sm font-extrabold text-[var(--gold-primary)]">{laps}</span>
          </div>

          {/* Reset button */}
          <button
            onClick={handleReset}
            className="p-2.5 rounded-2xl bg-[var(--bg-surface-elevated)] hover:bg-rose-50 hover:text-rose-600 text-[var(--text-muted)] border border-[var(--border-subtle)] transition-colors cursor-pointer"
            title="تصفير عداد المسبحة"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Current Dhikr Calligraphy */}
        <div className="min-h-[80px] flex items-center justify-center px-4">
          <p className="font-quran text-2xl sm:text-4xl font-extrabold text-[var(--text-primary)] leading-relaxed select-text">
            {activeDhikr.text}
          </p>
        </div>

        {/* Target Buttons (33, 100, 1000, Open) */}
        <div className="flex items-center justify-center gap-2 text-xs">
          {[33, 100, 1000, 0].map(val => (
            <button
              key={val}
              onClick={() => {
                setTargetCount(val);
                setCount(0);
              }}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                targetCount === val
                  ? 'bg-[var(--emerald-deep)] text-[var(--gold-primary)] shadow-sm border border-[var(--gold-border)] scale-105'
                  : 'bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] hover:bg-[var(--emerald-soft)] border border-[var(--border-subtle)]'
              }`}
            >
              {val === 0 ? 'مفتوح ∞' : `${val}`}
            </button>
          ))}
        </div>

        {/* Massive Luxury Circular Tactile Bead Dial */}
        <div className="flex justify-center py-6">
          <div className="relative">
            
            {/* SVG Outer Progress Ring */}
            {targetCount > 0 && (
              <svg className="w-64 h-64 sm:w-72 sm:h-72 -rotate-90 transform" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="44"
                  className="stroke-[var(--bg-surface-elevated)]"
                  strokeWidth="5"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="44"
                  className="stroke-[var(--gold-primary)] transition-all duration-300 ease-out"
                  strokeWidth="5"
                  strokeDasharray="276.46"
                  strokeDashoffset={276.46 - (276.46 * progressPercent) / 100}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
            )}

            {/* Inner Interactive Emerald Dial */}
            <button
              onClick={handleTasbeehClick}
              className="absolute inset-4 sm:inset-5 rounded-full bg-[var(--emerald-deep)] text-white shadow-2xl hover:scale-98 active:scale-95 transition-all duration-150 flex flex-col items-center justify-center border-4 border-[var(--gold-primary)] cursor-pointer select-none group"
            >
              <span className="text-5xl sm:text-7xl font-extrabold font-cairo tracking-tight text-[var(--gold-primary)] group-hover:scale-105 transition-transform">
                {count}
              </span>
              <span className="text-xs sm:text-sm text-[var(--gold-light)] font-bold mt-1">
                {targetCount > 0 ? `الهدف: ${targetCount}` : 'تسبيح مفتوح'}
              </span>
              <span className="text-[10px] text-[var(--gold-primary)]/80 mt-1 uppercase font-bold tracking-widest">
                المس للتسبيح
              </span>
            </button>

          </div>
        </div>

        {/* Lifetime Statistics Footer */}
        <div className="pt-6 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs text-[var(--text-secondary)]">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-[var(--gold-primary)]" />
            <span>إجمالي تسبيحاتك في المنصة:</span>
          </div>
          <span className="font-extrabold text-sm sm:text-base text-[var(--emerald-medium)] dark:text-[var(--gold-primary)] font-cairo">
            {totalLifetimeTasbeeh.toLocaleString('ar-EG')} تسبيحة
          </span>
        </div>

      </div>

      {/* Custom Dhikr Modal */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[var(--bg-surface)] rounded-3xl p-6 shadow-2xl border border-[var(--border-subtle)] space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
              <h3 className="font-bold text-base text-[var(--text-primary)]">
                إضافة ذكر مخصص للمسبحة
              </h3>
              <button onClick={() => setShowCustomModal(false)} className="text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCustom} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1">
                  نص الذكر:
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: لا إله إلا أنت سبحانك إني كنت من الظالمين..."
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-sm text-[var(--text-primary)] focus:outline-hidden focus:border-[var(--gold-primary)]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1">
                  الهدف التكراري:
                </label>
                <select
                  value={customTarget}
                  onChange={(e) => setCustomTarget(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-2xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-sm text-[var(--text-primary)] focus:outline-hidden"
                >
                  <option value={33}>٣٣ مرة</option>
                  <option value={100}>١٠٠ مرة</option>
                  <option value={500}>٥٠٠ مرة</option>
                  <option value={1000}>١٠٠٠ مرة</option>
                  <option value={0}>مفتوح (بدون حد)</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCustomModal(false)}
                  className="w-1/2 py-3 rounded-2xl bg-[var(--bg-surface-elevated)] text-xs font-bold text-[var(--text-secondary)] border border-[var(--border-subtle)] hover:bg-[var(--emerald-soft)] cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-3 rounded-2xl bg-[var(--emerald-deep)] hover:bg-[var(--emerald-medium)] text-[var(--gold-primary)] text-xs font-bold shadow-md border border-[var(--gold-border)] cursor-pointer"
                >
                  حفظ والبدء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </section>
  );
};
