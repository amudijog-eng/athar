import React from 'react';
import { useApp } from '../context/AppContext';
import { playBeadSound, playChimeSound } from '../utils/soundEffects';
import {
  Heart,
  RotateCcw,
  Sparkles,
  Award,
  Share2
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const IstighfarSection = () => {
  const {
    istighfarCount,
    istighfarGoal,
    setIstighfarGoal,
    istighfarLifetime,
    incrementIstighfar,
    resetIstighfarToday,
    setShareModalItem,
    triggerHaptic
  } = useApp();

  const goals = [100, 500, 1000, 10000];
  const progressPercent = Math.min(100, Math.round((istighfarCount / istighfarGoal) * 100));

  const handleClick = () => {
    incrementIstighfar();
    playBeadSound();
    if (istighfarCount + 1 === istighfarGoal) {
      playChimeSound();
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    }
  };

  const sayyidAlIstighfar = {
    title: 'سيد الاستغفار',
    text: 'اللَّهُمَّ أَنْتَ رَبِّي لا إِلَهَ إِلا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لا يَغْفِرُ الذُّنُوبَ إِلا أَنْتَ.',
    source: 'صحيح البخاري (6306)',
    virtue: 'من قالها موقناً بها حين يمسي فمات من ليلته دخل الجنة، وكذلك إذا أصبح.'
  };

  return (
    <section id="istighfar" className="py-8 sm:py-12 max-w-4xl mx-auto px-4 sm:px-6">
      
      {/* Header */}
      <div className="text-center space-y-3 mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[var(--gold-soft)] text-[var(--gold-dark)] dark:text-[var(--gold-light)] text-xs font-semibold border border-[var(--gold-border)]">
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          <span>ميدان التوبة ومغفرة الذنوب</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-[var(--text-primary)] font-quran">
          محراب الاستغفار
        </h2>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-md mx-auto">
          «فَقُلْتُ اسْتَغْفِرُوا رَبَّكُمْ إِنَّهُ كَانَ غَفَّارًا • يُرْسِلِ السَّمَاءَ عَلَيْكُم مِّدْرَارًا»
        </p>
      </div>

      {/* Main Counter Card */}
      <div className="p-6 sm:p-12 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xl text-center space-y-6">
        
        {/* Goal Selector */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[var(--text-secondary)]">
          <span className="font-bold">حدد هدفك اليومي من الاستغفار:</span>
          <div className="flex items-center gap-2">
            {goals.map(g => (
              <button
                key={g}
                onClick={() => {
                  triggerHaptic(15);
                  setIstighfarGoal(g);
                }}
                className={`px-3.5 py-1.5 rounded-xl font-bold transition-all ${
                  istighfarGoal === g
                    ? 'bg-[var(--emerald-deep)] text-[var(--gold-primary)] shadow-xs scale-105 border border-[var(--gold-border)]'
                    : 'bg-[var(--bg-surface-elevated)] hover:bg-[var(--border-subtle)] text-[var(--text-secondary)]'
                }`}
              >
                {g.toLocaleString('ar-EG')}
              </button>
            ))}
          </div>
        </div>

        {/* Central Istighfar Phrase */}
        <div className="py-2">
          <p className="font-quran text-2xl sm:text-4xl font-extrabold text-[var(--emerald-deep)] dark:text-[var(--gold-primary)]">
            أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ وَأَتُوبُ إِلَيْهِ
          </p>
        </div>

        {/* Big Counter Button */}
        <div className="flex justify-center py-4">
          <div className="relative">
            
            <svg className="w-60 h-60 sm:w-68 sm:h-68 -rotate-90 transform" viewBox="0 0 100 100">
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

            <button
              onClick={handleClick}
              className="absolute inset-4 sm:inset-5 rounded-full bg-gradient-to-br from-[#063b2f] via-[#04281f] to-[#021813] text-white shadow-2xl hover:scale-98 active:scale-95 transition-all duration-150 flex flex-col items-center justify-center border-4 border-[var(--gold-primary)]/40 cursor-pointer select-none group"
            >
              <span className="text-4xl sm:text-6xl font-extrabold font-cairo text-[var(--gold-light)] group-hover:scale-105 transition-transform">
                {istighfarCount.toLocaleString('ar-EG')}
              </span>
              <span className="text-xs text-white/80 mt-1 font-semibold">
                من أصل {istighfarGoal.toLocaleString('ar-EG')}
              </span>
              <span className="text-[10px] text-[var(--gold-light)] mt-1 font-bold">
                {progressPercent}% مكتمل
              </span>
            </button>
          </div>
        </div>

        {/* Bottom controls & stats */}
        <div className="flex items-center justify-between pt-4 border-t border-[var(--border-subtle)] text-xs">
          <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
            <Award className="w-4 h-4 text-[var(--gold-primary)]" />
            <span>إجمالي استغفارك الدائم:</span>
            <span className="font-extrabold text-[var(--emerald-medium)] dark:text-[var(--emerald-accent)] text-sm">
              {istighfarLifetime.toLocaleString('ar-EG')}
            </span>
          </div>

          <button
            onClick={() => {
              triggerHaptic(20);
              resetIstighfarToday();
            }}
            className="flex items-center gap-1 text-[var(--text-muted)] hover:text-rose-600 transition-colors"
            title="تصفير عداد اليوم فقط"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>تصفير اليوم</span>
          </button>
        </div>

      </div>

      {/* Sayyid Al-Istighfar Spotlight Card */}
      <div className="mt-8 p-6 sm:p-8 rounded-3xl bg-[var(--gold-soft)] border border-[var(--gold-border)] shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[var(--gold-border)] pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[var(--gold-dark)] dark:text-[var(--gold-light)]" />
            <h3 className="font-bold text-base text-[var(--gold-dark)] dark:text-[var(--gold-light)] font-quran">
              {sayyidAlIstighfar.title}
            </h3>
          </div>
          <button
            onClick={() => {
              setShareModalItem({
                title: sayyidAlIstighfar.title,
                text: sayyidAlIstighfar.text,
                source: `${sayyidAlIstighfar.source} — ${sayyidAlIstighfar.virtue}`
              });
            }}
            className="p-1.5 rounded-xl bg-[var(--bg-surface)] text-[var(--gold-dark)] dark:text-[var(--gold-light)] hover:bg-[var(--border-subtle)] text-xs font-semibold flex items-center gap-1 border border-[var(--gold-border)]"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>انشر الذكر</span>
          </button>
        </div>

        <p className="font-quran text-base sm:text-xl text-[var(--text-primary)] text-center leading-loose py-2 select-text">
          « {sayyidAlIstighfar.text} »
        </p>

        <div className="pt-2 text-xs text-[var(--text-secondary)] flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-[var(--gold-border)]">
          <span>{sayyidAlIstighfar.virtue}</span>
          <span className="font-bold text-[var(--emerald-medium)] dark:text-[var(--emerald-accent)]">{sayyidAlIstighfar.source}</span>
        </div>
      </div>

    </section>
  );
};
