import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Heart,
  Share2
} from 'lucide-react';
import atharLogo from '../assets/athar-logo.jpg';

const CURRENT_YEAR = new Date().getFullYear();

export const Footer = () => {
  const { setActiveTab, setShareModalItem, triggerHaptic } = useApp();

  const handleNav = (tab) => {
    triggerHaptic(15);
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[var(--bg-surface-sunken)] text-[var(--text-secondary)] border-t border-[var(--border-subtle)] pt-12 pb-24 sm:pb-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Top Info & Dua */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-10 border-b border-[var(--border-subtle)]">
          
          {/* Logo & Philosophy */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl overflow-hidden border border-[var(--gold-primary)] shadow-sm bg-black/40 shrink-0">
                <img
                  src={atharLogo}
                  alt="شعار موقع أثر"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="text-xl font-bold font-quran text-[var(--text-primary)] block">موقع أَثَـر</span>
                <span className="text-xs text-[var(--gold-dark)] dark:text-[var(--gold-light)] font-bold">صدقة جارية عن أحمد منتصر العامودي</span>
              </div>
            </div>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-amiri text-sm">
              «أثرٌ يبقى .. وأجرٌ يرقى» — منصة إسلامية شاملة لقراءة وتلاوة القرآن الكريم، الأذكار، والسنّة النبوية، خالية 100% من الإعلانات.
            </p>
          </div>

          {/* Sincere Sadaqah Prayer */}
          <div className="p-5 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-2 text-center md:text-right shadow-xs">
            <span className="text-xs font-bold text-[var(--gold-dark)] dark:text-[var(--gold-light)] flex items-center justify-center md:justify-start gap-1.5">
              <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
              <span>دعاء بالبركة والقبول</span>
            </span>
            <p className="text-xs sm:text-sm text-[var(--text-primary)] font-amiri leading-relaxed">
              «اللَّهُمَّ بَارِكْ فِي عُمْرِ عَبْدِكَ أَحْمَد مُنْتَصِر العَامُودِي وَعَمَلِهِ، وَتَقَبَّلْ مِنْهُ هَذَا العَمَلَ خَالِصًا لِوَجْهِكَ الكَرِيمِ، وَاجْعَلْهُ صَدَقَةً جَارِيَةً وَأَثَرًا صَالِحًا لَهُ فِي حَيَاتِهِ وَبَعْدَ مَمَاتِهِ، وَعَنْ وَالِدَيْهِ، وَعَنْ كُلِّ مَنْ زَارَ هَذِهِ المَنَصَّةَ وَذَكَرَ اللَّهَ فِيهَا إِلَى يَوْمِ القِيَامَةِ.»
            </p>
          </div>

          {/* Spread Reward Button */}
          <div className="flex flex-col items-center md:items-end justify-center space-y-3">
            <span className="text-xs text-[var(--text-muted)] text-center md:text-right">
              قال ﷺ: «الدَّالُّ عَلَى الخَيْرِ كَفَاعِلِهِ»
            </span>
            <button
              onClick={() => {
                setShareModalItem({
                  title: 'موقع أثر - صدقة جارية',
                  text: 'منصة إسلامية متكاملة للقرآن الكريم، الأذكار، المسبحة ومواقيت الصلاة.',
                  source: 'https://athar-app.org'
                });
              }}
              className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[var(--gold-primary)] to-[var(--gold-dark)] text-[#0B3D2E] font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-transform hover:scale-105 border border-[var(--gold-border)]"
            >
              <Share2 className="w-4 h-4 text-[#0B3D2E]" />
              <span>شارك الموقع واكسب الأجر</span>
            </button>
          </div>

        </div>

        {/* Quick Sitemap Links */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-xs">
          
          <div className="space-y-2">
            <h4 className="font-bold text-[var(--text-primary)] text-sm">القرآن الكريم</h4>
            <ul className="space-y-1.5 text-[var(--text-secondary)]">
              <li><button onClick={() => handleNav('quran')} className="hover:text-[var(--gold-primary)]">فهرس السور (١١٤ سورة)</button></li>
              <li><button onClick={() => handleNav('quran')} className="hover:text-[var(--gold-primary)]">التفسير الميسر</button></li>
              <li><button onClick={() => handleNav('khatmah')} className="hover:text-[var(--gold-primary)]">خطة ختمة القرآن</button></li>
              <li><button onClick={() => handleNav('khatmah')} className="hover:text-[var(--gold-primary)]">مُعين حفظ القرآن</button></li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-[var(--text-primary)] text-sm">الأذكار والعبادات</h4>
            <ul className="space-y-1.5 text-[var(--text-secondary)]">
              <li><button onClick={() => handleNav('adhkar')} className="hover:text-[var(--gold-primary)]">أذكار الصباح والمساء</button></li>
              <li><button onClick={() => handleNav('tasbeeh')} className="hover:text-[var(--gold-primary)]">المسبحة الإلكترونية</button></li>
              <li><button onClick={() => handleNav('istighfar')} className="hover:text-[var(--gold-primary)]">محراب الاستغفار</button></li>
              <li><button onClick={() => handleNav('wird')} className="hover:text-[var(--gold-primary)]">وردي اليومي</button></li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-[var(--text-primary)] text-sm">السنّة والأدعية</h4>
            <ul className="space-y-1.5 text-[var(--text-secondary)]">
              <li><button onClick={() => handleNav('hadith')} className="hover:text-[var(--gold-primary)]">الأحاديث النبوية الصحيحة</button></li>
              <li><button onClick={() => handleNav('duas')} className="hover:text-[var(--gold-primary)]">الأدعية القرآنية والنبوية</button></li>
              <li><button onClick={() => handleNav('duas')} className="hover:text-[var(--gold-primary)]">أدعية للمتوفين ومن سبقونا</button></li>
              <li><button onClick={() => handleNav('sadaqah')} className="hover:text-[var(--gold-primary)]">بر الوالدين</button></li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-[var(--text-primary)] text-sm">عن الصدقة الجارية</h4>
            <ul className="space-y-1.5 text-[var(--text-secondary)]">
              <li><button onClick={() => handleNav('sadaqah')} className="hover:text-[var(--gold-primary)]">عن هذه الصدقة الجارية</button></li>
              <li><button onClick={() => handleNav('sadaqah')} className="hover:text-[var(--gold-primary)]">فضل الصدقة الجارية</button></li>
              <li><button onClick={() => handleNav('prayer')} className="hover:text-[var(--gold-primary)]">مواقيت الصلاة والقبلة</button></li>
            </ul>
          </div>

        </div>

        {/* Bottom Credits & Waiver */}
        <div className="pt-8 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[var(--text-muted)]">
          <div>
            جميع الحقوق وقف لله تعالى • صدقة جارية أسسها: <strong className="text-[var(--text-primary)]">أحمد منتصر العامودي</strong> (حفظه الله وبارك في عمره وعمله).
          </div>
          <div className="flex items-center gap-3">
            <span>منصة أثر المباركة © {CURRENT_YEAR}</span>
            <span className="text-[var(--gold-dark)] dark:text-[var(--gold-light)] font-bold">صدقة جارية</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
