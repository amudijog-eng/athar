import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { playSoftTap } from '../utils/soundEffects';
import {
  Heart,
  Share2,
  Users,
  Sparkles,
  Lock,
  Globe,
  Archive,
  FileText
} from 'lucide-react';

export const SadaqahJariyahSection = () => {
  const { setShareModalItem, triggerHaptic } = useApp();
  
  const [activeSubTab, setActiveSubTab] = useState('dedication');
  const [duaCount, setDuaCount] = useState(() => Number(localStorage.getItem('athar_deceased_duas')) || 0);

  const incrementDeceasedDua = () => {
    triggerHaptic(25);
    playSoftTap();
    const next = duaCount + 1;
    setDuaCount(next);
    localStorage.setItem('athar_deceased_duas', String(next));
  };

  const shareProject = () => {
    setShareModalItem({
      title: 'موقع أثر | صدقة جارية مباركة',
      text: 'منصة إسلامية شاملة ومجانية للقرآن الكريم، الأذكار، المسبحة ومواقيت الصلاة صدقة جارية لوجه الله تعالى.',
      source: 'https://athar-app.org'
    });
  };

  return (
    <section id="sadaqah" className="py-8 sm:py-12 max-w-5xl mx-auto px-4 sm:px-6">
      
      {/* Header */}
      <div className="text-center space-y-3 mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[var(--gold-soft)] text-[var(--gold-dark)] dark:text-[var(--gold-light)] text-xs font-semibold border border-[var(--gold-border)]">
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          <span>«إِذَا مَاتَ الإِنْسَانُ انْقَطَعَ عَنْهُ عَمَلُهُ إِلاَّ مِنْ ثَلاَثَةٍ: إِلاَّ مِنْ صَدَقَةٍ جَارِيَةٍ»</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-[var(--text-primary)] font-quran">
          الصدقة الجارية ولمن سبقونا
        </h2>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-md mx-auto">
          أثرٌ طيب يبقى أجره متصلاً في الحياة وبعد الممات عن صاحب المنصة ووالديه ولكل من شارك وانتفع بها.
        </p>

        {/* Sub-tabs pills */}
        <div className="flex items-center justify-center gap-2 flex-wrap pt-4">
          {[
            { id: 'dedication', label: 'عن هذه الصدقة الجارية' },
            { id: 'passed', label: 'لمن سبقونا (الدعاء للأموات)' },
            { id: 'parents', label: 'بر الوالدين' },
            { id: 'continuity', label: 'دليل استمرارية الوقف للأبد' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                triggerHaptic(15);
                setActiveSubTab(tab.id);
              }}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
                activeSubTab === tab.id
                  ? 'bg-[var(--emerald-deep)] text-[var(--gold-primary)] shadow-xs border border-[var(--gold-border)] scale-102'
                  : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:bg-[var(--emerald-soft)] border border-[var(--border-subtle)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Subtab 1: Dedication */}
      {activeSubTab === 'dedication' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          <div className="p-8 sm:p-12 rounded-3xl bg-[var(--emerald-deep)] text-white shadow-xl border border-[var(--gold-border)] text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-white/10 text-[var(--gold-light)] border border-[var(--gold-primary)]/40 flex items-center justify-center mx-auto">
              <Sparkles className="w-8 h-8" />
            </div>

            <div className="space-y-3 max-w-2xl mx-auto">
              <h3 className="text-2xl sm:text-3xl font-extrabold font-quran text-[var(--gold-light)]">
                نية هذا العمل المبارك
              </h3>
              <p className="font-amiri text-lg sm:text-2xl leading-relaxed text-white">
                «اللَّهُمَّ اجْعَلْ أَجْرَ هَذَا العَمَلِ وَمَا يُنْتَفَعُ بِهِ مِنْهُ صَدَقَةً جَارِيَةً عَنِّي وَعَنْ وَالِدَيَّ، وَعَنْ أَهْلِي وَذُرِّيَّتِي، وَعَنْ كُلِّ مَنْ سَاهَمَ فِي نَشْرِهِ أَوْ قَرَأَ فِيهِ حَرْفًا أَوْ ذَكَرَ اللَّهَ فِيهِ إِلَى يَوْمِ الدِّينِ.»
              </p>
            </div>

            <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={shareProject}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-[var(--gold-primary)] to-[var(--gold-dark)] text-[#0B3D2E] font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-105 border border-[var(--gold-border)]"
              >
                <Share2 className="w-4 h-4 text-[#0B3D2E]" />
                <span>انشر رابط المنصة واكسب الأجر</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-center space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-[var(--emerald-soft)] text-[var(--emerald-deep)] dark:text-[var(--gold-primary)] flex items-center justify-center mx-auto font-bold border border-[var(--emerald-border)]">
                ✓
              </div>
              <h4 className="font-bold text-sm text-[var(--text-primary)]">بدون إعلانات تماماً</h4>
              <p className="text-xs text-[var(--text-secondary)]">
                منصة خالية 100% من الإعلانات التجارية أو النوافذ المنبثقة، احتراماً لقدسية كلام الله.
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-center space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-[var(--gold-soft)] text-[var(--gold-dark)] dark:text-[var(--gold-light)] flex items-center justify-center mx-auto font-bold border border-[var(--gold-border)]">
                ✓
              </div>
              <h4 className="font-bold text-sm text-[var(--text-primary)]">استخدام مجاني ومفتوح</h4>
              <p className="text-xs text-[var(--text-secondary)]">
                لا يتطلب تسجيلاً إجبارياً ولا جمع بيانات خاصة، متاح للجميع في أي وقت ومن أي جهاز.
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-center space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-[var(--emerald-soft)] text-[var(--emerald-deep)] dark:text-[var(--gold-primary)] flex items-center justify-center mx-auto font-bold border border-[var(--emerald-border)]">
                ✓
              </div>
              <h4 className="font-bold text-sm text-[var(--text-primary)]">محتوى موثق ومعتمد</h4>
              <p className="text-xs text-[var(--text-secondary)]">
                القرآن برسم المصحف العثماني، والأحاديث الصحيحة من البخاري ومسلم ورياض الصالحين.
              </p>
            </div>
          </div>

        </div>
      )}

      {/* Subtab 2: For Those Passed */}
      {activeSubTab === 'passed' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          <div className="p-6 sm:p-10 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs space-y-6">
            <div className="text-center space-y-2">
              <span className="text-xs text-[var(--gold-dark)] dark:text-[var(--gold-light)] uppercase font-bold">إهداء وثواب مستمر</span>
              <h3 className="text-2xl sm:text-3xl font-bold font-quran text-[var(--text-primary)]">
                دعاء لمن انقطعت أعمالهم وهم تحت الثرى
              </h3>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-lg mx-auto">
                قال رسول الله ﷺ: «مَنِ اسْتَغْفَرَ لِلْمُؤْمِنِينَ وَالْمُؤْمِنَاتِ كَتَبَ اللَّهُ لَهُ بِكُلِّ مُؤْمِنٍ وَمُؤْمِنَةٍ حَسَنَةً».
              </p>
            </div>

            <div className="mushaf-frame p-6 sm:p-8 text-center space-y-3">
              <p className="font-amiri text-lg sm:text-2xl leading-relaxed text-[var(--text-primary)] font-medium">
                « اللَّهُمَّ اغْفِرْ لِلْمُؤْمِنِينَ وَالْمُؤْمِنَاتِ، وَالْمُسْلِمِينَ وَالْمُسْلِمَاتِ، الأَحْيَاءِ مِنْهُمْ وَالأَمْوَاتِ، اللَّهُمَّ نَوِّرْ مَرَاقِدَهُمْ، وَعَطِّرْ مَشَاهِدَهُمْ، وَارْحَمْ غُرْبَتَهُمْ، وَاجْعَلْ قُبُورَهُمْ رِيَاضًا مِنْ رِيَاضِ الجَنَّةِ. »
              </p>
            </div>

            <div className="text-center space-y-3">
              <button
                onClick={incrementDeceasedDua}
                className="px-6 py-3.5 rounded-2xl bg-[var(--emerald-deep)] hover:bg-[var(--emerald-medium)] active:scale-95 text-[var(--gold-primary)] font-bold text-sm shadow-md transition-all inline-flex items-center gap-2 border border-[var(--gold-border)]"
              >
                <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
                <span>دعوتُ لهم بالرحمة والمغفرة ({duaCount})</span>
              </button>
              <p className="text-[11px] text-[var(--text-muted)]">
                كل دعوة تنير قبراً وتكتب لك بها مليارات الحسنات بإذن الله تعالى.
              </p>
            </div>
          </div>

        </div>
      )}

      {/* Subtab 3: Parents */}
      {activeSubTab === 'parents' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          <div className="p-6 sm:p-10 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-2xl sm:text-3xl font-bold font-quran text-[var(--text-primary)]">
                بر الوالدين: أوسط أبواب الجنة
              </h3>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-lg mx-auto">
                «وَقَضَىٰ رَبُّكَ أَلَّا تَعْبُدُوا إِلَّا إِيَّاهُ وَبِالْوَالِدَيْنِ إِحْسَانًا»
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div className="p-5 rounded-2xl bg-[var(--gold-soft)] border border-[var(--gold-border)] space-y-2">
                <span className="text-xs font-bold text-[var(--gold-dark)] dark:text-[var(--gold-light)]">من وصايا القرآن الكريم:</span>
                <p className="font-quran text-base sm:text-lg text-[var(--text-primary)] leading-relaxed">
                  ﴿ وَاخْفِضْ لَهُمَا جَنَاحَ الذُّلِّ مِنَ الرَّحْمَةِ وَقُل رَّبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا ﴾
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[var(--emerald-soft)] border border-[var(--emerald-border)] space-y-2">
                <span className="text-xs font-bold text-[var(--emerald-deep)] dark:text-[var(--gold-primary)]">رفع درجات الوالدين في الجنة:</span>
                <p className="font-amiri text-sm sm:text-base text-[var(--text-primary)] leading-relaxed">
                  «إنَّ الرَّجُلَ لَتُرْفَعُ دَرَجَتُهُ في الجَنَّةِ، فيَقولُ: أَنَّى هذا؟ فيُقالُ: باسْتِغْفارِ وَلَدِكَ لَكَ.»
                </p>
                <span className="text-[11px] text-[var(--text-muted)] block">— سنن ابن ماجه وحسنه الألباني</span>
              </div>

            </div>

            <div className="p-6 rounded-2xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-center space-y-3">
              <span className="text-xs font-bold text-[var(--text-muted)] block">دعاء مبارك للوالدين</span>
              <p className="font-amiri text-lg sm:text-xl text-[var(--emerald-deep)] dark:text-[var(--gold-primary)] leading-relaxed font-bold">
                «اللَّهُمَّ ارْزُقْ أُمِّي وَأَبِي صِحَّةَ الجَسَدِ، وَطُولَ العُمُرِ فِي طَاعَتِكَ، وَاحْشُرْهُمَا مَعَ النَّبِيِّينَ وَالصِّدِّيقِينَ، وَاغْفِرْ لَهُمَا حَتَّى لَا تَبْقَى ذَنْبًا.»
              </p>
            </div>
          </div>

        </div>
      )}

      {/* Subtab 4: Perpetuity Guide */}
      {activeSubTab === 'continuity' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          <div className="p-6 sm:p-10 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[var(--emerald-soft)] text-[var(--emerald-deep)] dark:text-[var(--gold-primary)] text-xs font-semibold border border-[var(--emerald-border)]">
                <Lock className="w-3.5 h-3.5" />
                <span>ضمان بقاء الأثر والأجر للأبد</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold font-quran text-[var(--text-primary)]">
                دليل استمرارية منصة «أثر» بعد وفاتك
              </h3>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-xl mx-auto">
                خطة عملية ومحكمة تضمن ألا يتوقف الموقع بمجرد توقف بطاقتك أو حسابك، ليستمر نفعها للمسلمين لعقود قادمة.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="p-5 rounded-2xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] space-y-2">
                <div className="flex items-center gap-2 text-[var(--emerald-medium)] dark:text-[var(--gold-primary)] font-bold text-sm">
                  <Globe className="w-4 h-4" />
                  <span>١. الاستضافة المجانية الدائمة (Serverless)</span>
                </div>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  تم بناء كود المنصة كـ Static SPA بالكامل دون الحاجة لخادم شهري مدفوع. يمكن رفعها مجاناً للأبد على <strong className="text-[var(--emerald-medium)] dark:text-[var(--gold-light)]">GitHub Pages</strong> أو <strong className="text-[var(--emerald-medium)] dark:text-[var(--gold-light)]">Cloudflare Pages</strong> والتي لا تتطلب بطاقات ائتمان ولا تنتهي صلاحيتها أبداً.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] space-y-2">
                <div className="flex items-center gap-2 text-[var(--emerald-medium)] dark:text-[var(--gold-primary)] font-bold text-sm">
                  <Archive className="w-4 h-4" />
                  <span>٢. الدومين وحجز أطول مدة ممكنة</span>
                </div>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  احجز اسم النطاق (الدومين) لمدة ٥ إلى ١٠ سنوات مقدماً، واضبط خيار التجديد التلقائي (Auto-Renew). كما سيعمل الموقع دائماً حتى بدون دومين مدفوع عبر الرابط المجاني الدائم.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] space-y-2">
                <div className="flex items-center gap-2 text-[var(--emerald-medium)] dark:text-[var(--gold-primary)] font-bold text-sm">
                  <Users className="w-4 h-4" />
                  <span>٣. أمناء الوقف (Collaborators)</span>
                </div>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  أضف شخصاً أو شخصين من الثقات (أخ، ابن بار، صديق صالح) كمسؤولين (Admin Collaborator) على مستودع الكود والدومين، ليتولوا المتابعة عند اللزوم.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] space-y-2">
                <div className="flex items-center gap-2 text-[var(--emerald-medium)] dark:text-[var(--gold-primary)] font-bold text-sm">
                  <FileText className="w-4 h-4" />
                  <span>٤. وثيقة الوقف والوصية</span>
                </div>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  اكتب في وصيتك الشرعية أن هذا الموقع وقف إسلامي غير ربحي لوجه الله تعالى، ولا يجوز بيعه أو وضع إعلانات تجارية فيه، وتخصيص مبلغ رمزي من تركتك لتجديد الدومين مستقبلاً.
                </p>
              </div>

            </div>
          </div>

        </div>
      )}

    </section>
  );
};
