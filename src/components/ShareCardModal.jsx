import React, { useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import { toPng } from 'html-to-image';
import {
  X,
  Download,
  Share2,
  Copy,
  Check,
  Sparkles
} from 'lucide-react';

export const ShareCardModal = () => {
  const { shareModalItem, setShareModalItem, triggerHaptic } = useApp();
  const cardRef = useRef(null);

  const [selectedTheme, setSelectedTheme] = useState('emerald'); // 'emerald' | 'gold' | 'parchment' | 'sapphire'
  const [isDownloading, setIsDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!shareModalItem) return null;

  const themes = {
    emerald: {
      bg: 'bg-gradient-to-br from-[#062319] via-[#0B3D2E] to-[#041610]',
      text: 'text-[#FBF9F4]',
      accent: 'text-[#E8C872]',
      border: 'border-[#C59B35]/50',
      subtext: 'text-[#A3C2B6]',
      ring: 'ring-[#0B3D2E]'
    },
    gold: {
      bg: 'bg-gradient-to-br from-[#12100C] via-[#1E1911] to-[#0A0907]',
      text: 'text-[#FFF9EB]',
      accent: 'text-[#E8C872]',
      border: 'border-[#C59B35]/70',
      subtext: 'text-[#C4B79A]',
      ring: 'ring-[#C59B35]'
    },
    parchment: {
      bg: 'bg-gradient-to-br from-[#FAF7F0] via-[#F2ECE0] to-[#E5DAC8]',
      text: 'text-[#0B3D2E]',
      accent: 'text-[#8A6715]',
      border: 'border-[#C59B35]/50',
      subtext: 'text-[#5D5344]',
      ring: 'ring-[#E5DAC8]'
    },
    sapphire: {
      bg: 'bg-gradient-to-br from-[#071526] via-[#0C223E] to-[#040C16]',
      text: 'text-[#F0F4F8]',
      accent: 'text-[#E8C872]',
      border: 'border-[#2D5B88]/50',
      subtext: 'text-[#9BB4D0]',
      ring: 'ring-[#0C223E]'
    }
  };

  const currentTheme = themes[selectedTheme];

  const handleDownloadImage = async () => {
    if (!cardRef.current) return;
    try {
      setIsDownloading(true);
      triggerHaptic(30);
      const dataUrl = await toPng(cardRef.current, { quality: 0.95, pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = `athar-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Error generating card image:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopyText = () => {
    triggerHaptic(20);
    const content = `${shareModalItem.title ? `[${shareModalItem.title}]\n` : ''}« ${shareModalItem.text} »\n${shareModalItem.source ? `المصدر: ${shareModalItem.source}\n` : ''}— منصة أثر (صدقة جارية)`;
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWebShare = async () => {
    triggerHaptic(25);
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareModalItem.title || 'موقع أثر',
          text: `« ${shareModalItem.text} »\n${shareModalItem.source || ''}`,
          url: window.location.origin
        });
      } catch {}
    } else {
      handleCopyText();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[var(--bg-surface)] rounded-3xl p-6 shadow-2xl border border-[var(--border-subtle)] space-y-4 max-h-[90vh] overflow-y-auto">
        
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[var(--gold-primary)]" />
            <h3 className="font-bold text-sm sm:text-base text-[var(--text-primary)]">
              مولد بطاقات مشاركة الأجر
            </h3>
          </div>
          <button
            onClick={() => setShareModalItem(null)}
            className="p-1.5 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Theme Color Picker */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-[var(--text-secondary)] font-medium">طراز البطاقة المعمارية:</span>
          <div className="flex items-center gap-2">
            {[
              { id: 'emerald', label: 'الروضة الزمردية', color: 'bg-[#0B3D2E]' },
              { id: 'gold', label: 'كسوة الذهب والحرير', color: 'bg-[#1E1911]' },
              { id: 'parchment', label: 'مخطوط أندلسي عتيق', color: 'bg-[#F2ECE0]' },
              { id: 'sapphire', label: 'سماء التهجد الليلية', color: 'bg-[#0C223E]' }
            ].map(thm => (
              <button
                key={thm.id}
                onClick={() => setSelectedTheme(thm.id)}
                className={`w-6 h-6 rounded-full ${thm.color} border-2 transition-transform cursor-pointer ${
                  selectedTheme === thm.id ? 'scale-125 border-[var(--gold-primary)] shadow-xs' : 'border-black/20'
                }`}
                title={thm.label}
              />
            ))}
          </div>
        </div>

        {/* Visual Card Preview to be Downloaded */}
        <div
          ref={cardRef}
          className={`p-8 rounded-3xl ${currentTheme.bg} ${currentTheme.text} border ${currentTheme.border} shadow-xl flex flex-col justify-between space-y-6 text-center select-none relative overflow-hidden`}
        >
          {/* Subtle Islamic Calligraphy watermark */}
          <div className="absolute top-2 right-4 text-3xl opacity-15 font-quran select-none pointer-events-none">أثر</div>
          <div className="absolute bottom-2 left-4 text-[11px] opacity-25 font-bold select-none pointer-events-none">صدقة جارية</div>

          {/* Title */}
          {shareModalItem.title && (
            <div className="flex items-center justify-center gap-2">
              <span className={`text-xs font-bold ${currentTheme.accent} border-b border-current/20 pb-0.5`}>
                {shareModalItem.title}
              </span>
            </div>
          )}

          {/* Main Text */}
          <p className="font-quran text-lg sm:text-2xl leading-loose font-bold py-2 select-text">
            « {shareModalItem.text} »
          </p>

          {/* Source & Logo Footer inside the Card */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs">
            <span className={`text-[11px] ${currentTheme.subtext} font-medium line-clamp-1 max-w-[200px]`}>
              {shareModalItem.source || 'منصة أثر الإسلامية'}
            </span>

            <div className="flex items-center gap-1.5 font-bold">
              <span className="font-quran text-base">أَثَـر</span>
              <span className="text-[10px] opacity-75">athar-platform</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="grid grid-cols-3 gap-2 pt-2">
          
          <button
            onClick={handleDownloadImage}
            disabled={isDownloading}
            className="py-2.5 px-3 rounded-2xl bg-[var(--emerald-deep)] hover:bg-[var(--emerald-medium)] text-[var(--gold-primary)] text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm border border-[var(--gold-border)] transition-all disabled:opacity-50 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{isDownloading ? 'جاري الحفظ...' : 'حفظ كصورة'}</span>
          </button>

          <button
            onClick={handleWebShare}
            className="py-2.5 px-3 rounded-2xl bg-[var(--gold-primary)] hover:bg-[var(--gold-dark)] text-[#0B3D2E] text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            <span>مشاركة الرابط</span>
          </button>

          <button
            onClick={handleCopyText}
            className="py-2.5 px-3 rounded-2xl bg-[var(--bg-surface-elevated)] hover:bg-[var(--emerald-soft)] text-[var(--text-primary)] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-[var(--border-subtle)] cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'تم النسخ' : 'نسخ النص'}</span>
          </button>

        </div>

      </div>
    </div>
  );
};
