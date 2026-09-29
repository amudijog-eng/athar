import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { playSoftTap, playChimeSound } from '../utils/soundEffects';
import {
  CheckCircle2,
  Sun,
  Moon,
  Sparkles,
  Heart,
  BookOpen,
  Flame,
  ScrollText,
  Calendar
} from 'lucide-react';
import confetti from 'canvas-confetti';

const ICON_MAP = {
  Sun,
  Moon,
  Sparkles,
  Heart,
  BookOpen,
  Flame,
  ScrollText
};

export const DailyWirdSection = () => {
  const { dailyWird, toggleWirdItem, triggerHaptic } = useApp();

  const isFriday = new Date().getDay() === 5;
  const totalItems = dailyWird.length;
  const completedItems = dailyWird.filter(w => w.done).length;
  const percent = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  const handleToggle = (id) => {
    triggerHaptic(20);
    playSoftTap();
    toggleWirdItem(id);
    if (completedItems + 1 === totalItems) {
      playChimeSound();
      confetti({ particleCount: 90, spread: 80, origin: { y: 0.5 } });
    }
  };

  return (
    <section id="wird" className="py-8 sm:py-12 max-w-4xl mx-auto px-4 sm:px-6">
      
      {/* Header */}
      <div className="text-center space-y-3 mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[var(--emerald-soft)] text-[var(--emerald-deep)] dark:text-[var(--gold-primary)] text-xs font-semibold border border-[var(--emerald-border)]">
          <CheckCircle2 className="w-3.5 h-3.5 text-[var(--gold-primary)]" />
          <span>المحافظة على الطاعات اليومية</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-[var(--text-primary)] font-quran">
          وردي اليومي
        </h2>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-md mx-auto">
          «أَحَبُّ الْأَعْمَالِ إِلَى اللَّهِ أَدْوَمُهَا وَإِنْ قَلَّ» — جدول يومي لمتابعة وردك من القرآن والذكر والصلاة.
        </p>
      </div>

      {/* Progress Summary Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[var(--emerald-deep)] text-white shadow-xl border border-[var(--gold-border)] mb-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-right">
          <div className="flex items-center justify-center sm:justify-start gap-2 text-xs text-[var(--gold-light)] font-bold">
            <Calendar className="w-4 h-4 text-[var(--gold-primary)]" />
            <span>ورد اليوم: {new Date().toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold font-cairo">
            أنجزت {completedItems} من {totalItems} مهام
          </h3>
          <p className="text-xs text-white/85">
            {percent === 100 ? 'تقبل الله طاعاتكم وأثابكم خيراً ونوراً وسعادة.' : 'واصل طاعاتك وأكمل ما تبقى من وردك اليومي.'}
          </p>
        </div>

        {/* Circular Percentage */}
        <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              className="stroke-black/30"
              strokeWidth="7"
              fill="transparent"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              className="stroke-[var(--gold-primary)] transition-all duration-500 ease-out"
              strokeWidth="7"
              strokeDasharray="251.32"
              strokeDashoffset={251.32 - (251.32 * percent) / 100}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-2xl font-extrabold font-cairo text-[var(--gold-light)]">{percent}%</span>
            <span className="text-[9px] text-white/70 uppercase font-bold">الإنجاز</span>
          </div>
        </div>
      </div>

      {/* Friday Highlight Banner */}
      {isFriday && (
        <div className="mb-6 p-4 rounded-2xl bg-[var(--gold-soft)] border border-[var(--gold-border)] text-[var(--gold-dark)] dark:text-[var(--gold-light)] flex items-center gap-3 text-xs sm:text-sm font-semibold">
          <Sparkles className="w-5 h-5 text-[var(--gold-primary)] shrink-0" />
          <span>اليوم الجمعة المباركة! تذكير بسنة قراءة سورة الكهف وكثرة الصلاة على النبي ﷺ.</span>
        </div>
      )}

      {/* Wird Items Checklist */}
      <div className="space-y-3">
        {dailyWird.map(item => {
          const Icon = ICON_MAP[item.icon] || Sparkles;
          return (
            <div
              key={item.id}
              onClick={() => handleToggle(item.id)}
              className={`cursor-pointer p-4 sm:p-5 rounded-2xl border transition-all duration-200 flex items-center justify-between select-none ${
                item.done
                  ? 'bg-[var(--emerald-soft)] border-[var(--emerald-border)] text-[var(--emerald-deep)] dark:text-[var(--gold-primary)]'
                  : 'bg-[var(--bg-surface)] border-[var(--border-subtle)] text-[var(--text-primary)] hover:border-[var(--gold-primary)] shadow-xs'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className={`p-2.5 rounded-xl ${
                  item.done
                    ? 'bg-[var(--emerald-medium)] text-white'
                    : 'bg-[var(--bg-surface-elevated)] text-[var(--text-muted)]'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <span className={`text-sm sm:text-base font-bold ${item.done ? 'line-through opacity-70' : ''}`}>
                    {item.title}
                  </span>
                  {item.fridayOnly && (
                    <span className="block text-[11px] text-[var(--gold-dark)] dark:text-[var(--gold-light)] font-semibold">
                      خاص بيوم الجمعة
                    </span>
                  )}
                </div>
              </div>

              <div className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all ${
                item.done
                  ? 'bg-[var(--emerald-medium)] border-[var(--emerald-medium)] text-white shadow-xs'
                  : 'border-[var(--border-subtle)] text-transparent hover:border-[var(--gold-primary)]'
              }`}>
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
          );
        })}
      </div>

    </section>
  );
};
