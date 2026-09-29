import React, { useState } from 'react';
import { useAudioPlayer } from '../context/AudioPlayerContext';
import { RECITERS } from '../data/quranData';
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Repeat,
  ChevronDown,
  ChevronUp,
  SkipBack,
  SkipForward,
  Music,
  AlertCircle
} from 'lucide-react';

export const FloatingAudioPlayer = () => {
  const {
    isPlaying,
    currentSurah,
    activeReciter,
    currentTime,
    duration,
    playbackSpeed,
    isLooping,
    isLoading,
    audioError,
    togglePlay,
    seek,
    seekRelative,
    changeReciter,
    changeSpeed,
    toggleLoop,
    handleNextSurah,
    handlePrevSurah
  } = useAudioPlayer();

  const [isMinimized, setIsMinimized] = useState(false);
  const [showRecitersList, setShowRecitersList] = useState(false);

  const formatTime = (secs) => {
    if (isNaN(secs) || secs < 0) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="fixed bottom-16 lg:bottom-0 left-0 right-0 z-50 pointer-events-auto">
      
      {isMinimized ? (
        <div className="max-w-md mx-auto mb-3 px-4">
          <div className="p-2.5 rounded-2xl bg-[var(--emerald-deep)] text-white border border-[var(--gold-border)] shadow-2xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <button
                onClick={togglePlay}
                className="w-9 h-9 rounded-xl bg-gradient-to-r from-[var(--gold-primary)] to-[var(--gold-dark)] text-[#0B3D2E] flex items-center justify-center shrink-0 shadow-xs border border-[var(--gold-border)]"
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-[#0B3D2E]" /> : <Play className="w-4 h-4 fill-[#0B3D2E] ml-0.5" />}
              </button>
              <div className="truncate">
                <span className="font-bold text-xs block text-white truncate">سورة {currentSurah.name}</span>
                <span className="text-[10px] text-[var(--gold-light)] block truncate">{activeReciter.name}</span>
              </div>
            </div>

            <button
              onClick={() => setIsMinimized(false)}
              className="p-1.5 rounded-xl hover:bg-white/10 text-white/80 text-xs flex items-center gap-1 font-semibold"
            >
              <ChevronUp className="w-4 h-4" />
              <span className="hidden sm:inline">توسيع المشغل</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="athar-glass border-t border-[var(--border-subtle)] shadow-2xl px-4 py-2.5 sm:py-3 transition-all duration-300">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
            
            {/* Left Info: Surah & Reciter */}
            <div className="flex items-center justify-between w-full md:w-auto gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[var(--emerald-soft)] text-[var(--emerald-deep)] dark:text-[var(--gold-primary)] flex items-center justify-center shrink-0 border border-[var(--emerald-border)]">
                  <Music className={`w-5 h-5 ${isPlaying ? 'animate-pulse text-[var(--gold-primary)]' : ''}`} />
                </div>
                <div className="truncate">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[var(--text-primary)] font-quran">
                      سورة {currentSurah.name}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--bg-surface-elevated)] text-[var(--text-muted)] border border-[var(--border-subtle)]">
                      {currentSurah.versesCount} آية
                    </span>
                  </div>

                  {/* Reciter selector */}
                  <div className="relative">
                    <button
                      onClick={() => setShowRecitersList(!showRecitersList)}
                      className="text-xs text-[var(--gold-dark)] dark:text-[var(--gold-light)] font-semibold hover:underline flex items-center gap-1"
                    >
                      <span>القارئ: {activeReciter.name}</span>
                      <ChevronDown className="w-3 h-3" />
                    </button>

                    {showRecitersList && (
                      <div className="absolute bottom-8 right-0 w-64 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 max-h-64 overflow-y-auto">
                        <span className="text-[11px] font-bold text-[var(--text-muted)] block px-2 pb-1.5 border-b border-[var(--border-subtle)]">
                          اختر القارئ (أولهم ياسر الدوسري):
                        </span>
                        {RECITERS.map(rec => (
                          <button
                            key={rec.id}
                            onClick={() => {
                              changeReciter(rec);
                              setShowRecitersList(false);
                            }}
                            className={`w-full text-right px-2.5 py-2 rounded-xl text-xs flex items-center justify-between cursor-pointer ${
                              activeReciter.id === rec.id
                                ? 'bg-[var(--emerald-deep)] text-white font-bold'
                                : 'text-[var(--text-primary)] hover:bg-[var(--emerald-soft)]'
                            }`}
                          >
                            <span>{rec.name}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                </div>
              </div>

              {/* Minimize button */}
              <button
                onClick={() => setIsMinimized(true)}
                className="p-1.5 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)] transition-colors"
                title="تصغير المشغل"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            {/* Center Controls: Play, Pause, Timeline */}
            <div className="flex-1 w-full max-w-xl flex flex-col items-center gap-1.5">
              
              <div className="flex items-center gap-3">
                
                {/* Loop */}
                <button
                  onClick={toggleLoop}
                  className={`p-1.5 rounded-xl text-xs transition-colors ${
                    isLooping
                      ? 'text-[var(--gold-dark)] dark:text-[var(--gold-light)] bg-[var(--gold-soft)] font-bold border border-[var(--gold-border)]'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                  }`}
                  title="تكرار السورة"
                >
                  <Repeat className="w-4 h-4" />
                </button>

                {/* Prev Surah */}
                <button
                  onClick={handlePrevSurah}
                  className="p-1.5 rounded-xl text-[var(--text-secondary)] hover:bg-[var(--bg-surface-elevated)]"
                  title="السورة السابقة"
                >
                  <SkipForward className="w-4 h-4" />
                </button>

                {/* 10s Backward */}
                <button
                  onClick={() => seekRelative(-10)}
                  className="p-1.5 rounded-xl text-[var(--text-secondary)] hover:bg-[var(--bg-surface-elevated)]"
                  title="تأخير ١٠ ثوانٍ"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                {/* Play/Pause */}
                <button
                  onClick={togglePlay}
                  disabled={isLoading}
                  className="w-11 h-11 rounded-full bg-[var(--emerald-deep)] hover:bg-[var(--emerald-medium)] text-[var(--gold-primary)] shadow-md flex items-center justify-center transition-transform hover:scale-105 active:scale-95 border border-[var(--gold-border)] disabled:opacity-70"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-[var(--gold-primary)] border-t-transparent rounded-full animate-spin" />
                  ) : isPlaying ? (
                    <Pause className="w-5 h-5 fill-[var(--gold-primary)]" />
                  ) : (
                    <Play className="w-5 h-5 fill-[var(--gold-primary)] ml-0.5" />
                  )}
                </button>

                {/* 10s Forward */}
                <button
                  onClick={() => seekRelative(10)}
                  className="p-1.5 rounded-xl text-[var(--text-secondary)] hover:bg-[var(--bg-surface-elevated)]"
                  title="تقديم ١٠ ثوانٍ"
                >
                  <RotateCw className="w-4 h-4" />
                </button>

                {/* Next Surah */}
                <button
                  onClick={handleNextSurah}
                  className="p-1.5 rounded-xl text-[var(--text-secondary)] hover:bg-[var(--bg-surface-elevated)]"
                  title="السورة التالية"
                >
                  <SkipBack className="w-4 h-4" />
                </button>

                {/* Speed Toggle */}
                <button
                  onClick={() => {
                    const speeds = [1, 1.25, 1.5, 0.75];
                    const next = speeds[(speeds.indexOf(playbackSpeed) + 1) % speeds.length];
                    changeSpeed(next);
                  }}
                  className="text-[11px] px-2 py-0.5 rounded-lg bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] font-bold hover:bg-[var(--border-subtle)] border border-[var(--border-subtle)]"
                  title="سرعة التلاوة"
                >
                  {playbackSpeed}x
                </button>

              </div>

              {/* Progress Slider Bar */}
              <div className="w-full flex items-center gap-2 text-[11px] font-mono text-[var(--text-muted)]">
                <span>{formatTime(currentTime)}</span>
                <input
                  type="range"
                  min="0"
                  max={duration || 100}
                  value={currentTime || 0}
                  onChange={(e) => seek(Number(e.target.value))}
                  className="flex-1 h-1.5 bg-[var(--bg-surface-elevated)] rounded-lg appearance-none cursor-pointer accent-[var(--gold-primary)]"
                />
                <span>{formatTime(duration)}</span>
              </div>

            </div>

            {audioError && (
              <div className="text-[10px] text-rose-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                <span>{audioError}</span>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
