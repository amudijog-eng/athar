import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { calculatePrayerTimes, getNextPrayer, getHijriDate, calculateQibla, DEFAULT_CITIES } from '../data/prayerCalculation';
import {
  Clock,
  Compass,
  MapPin,
  Calendar,
  Navigation,
  Sparkles
} from 'lucide-react';

export const PrayerTimesSection = () => {
  const { triggerHaptic } = useApp();

  const [selectedCity, setSelectedCity] = useState(DEFAULT_CITIES[0]); // Mecca
  const [currentDate, setCurrentDate] = useState(new Date());
  const [deviceHeading, setDeviceHeading] = useState(0);
  const [customLocationName, setCustomLocationName] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentDate(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const detectUserLocation = () => {
    if ('geolocation' in navigator) {
      triggerHaptic(20);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setSelectedCity({
            name: 'موقعي الحالي',
            country: 'تحديد دقيق عبر GPS',
            lat,
            lng,
            timezone: -currentDate.getTimezoneOffset() / 60
          });
          setCustomLocationName('موقعك الجغرافي الدقيق');
        },
        () => {
          alert('يرجى السماح بصلاحية الموقع الجغرافي لحساب المواقيت بدقة.');
        }
      );
    }
  };

  const startCompass = () => {
    if (typeof window !== 'undefined' && 'DeviceOrientationEvent' in window) {
      const handleOrientation = (e) => {
        let compass = e.webkitCompassHeading || (360 - e.alpha);
        if (compass) setDeviceHeading(Math.round(compass));
      };
      window.addEventListener('deviceorientation', handleOrientation, true);
    }
  };

  const prayerTimes = calculatePrayerTimes(selectedCity.lat, selectedCity.lng, currentDate);
  const nextPrayer = getNextPrayer(prayerTimes, currentDate);
  const hijri = getHijriDate(currentDate);
  const qibla = calculateQibla(selectedCity.lat, selectedCity.lng);

  const prayersList = [
    { key: 'fajr', label: 'الفجر', time: prayerTimes.fajr.formatted, icon: '🌅' },
    { key: 'sunrise', label: 'الشروق', time: prayerTimes.sunrise.formatted, icon: '☀️' },
    { key: 'dhuhr', label: 'الظهر', time: prayerTimes.dhuhr.formatted, icon: '☀️' },
    { key: 'asr', label: 'العصر', time: prayerTimes.asr.formatted, icon: '🌤️' },
    { key: 'maghrib', label: 'المغرب', time: prayerTimes.maghrib.formatted, icon: '🌇' },
    { key: 'isha', label: 'العشاء', time: prayerTimes.isha.formatted, icon: '🌙' }
  ];

  return (
    <section id="prayer" className="py-8 sm:py-12 max-w-5xl mx-auto px-4 sm:px-6">
      
      {/* Header */}
      <div className="text-center space-y-3 mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[var(--emerald-soft)] text-[var(--emerald-deep)] dark:text-[var(--gold-primary)] text-xs font-semibold border border-[var(--emerald-border)]">
          <Clock className="w-3.5 h-3.5 text-[var(--gold-primary)]" />
          <span>«حَافِظُوا عَلَى الصَّلَوَاتِ وَالصَّلَاةِ الْوُسْطَىٰ»</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-[var(--text-primary)] font-quran">
          مواقيت الصلاة واتجاه القبلة
        </h2>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-md mx-auto">
          حساب فلكي دقيق لمواقيت الصلوات الخمس مع عداد تنازلي وبوصلة القبلة نحو الكعبة المشرفة.
        </p>
      </div>

      {/* City & Hijri Top Strip */}
      <div className="p-4 sm:p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-2 bg-[var(--bg-surface-elevated)] px-3.5 py-2.5 rounded-2xl border border-[var(--border-subtle)] w-full sm:w-auto">
            <MapPin className="w-4 h-4 text-[var(--gold-primary)]" />
            <select
              value={selectedCity.name}
              onChange={(e) => {
                const found = DEFAULT_CITIES.find(c => c.name === e.target.value);
                if (found) {
                  setSelectedCity(found);
                  setCustomLocationName(null);
                }
              }}
              className="bg-transparent text-xs sm:text-sm font-bold text-[var(--text-primary)] focus:outline-hidden cursor-pointer"
            >
              {DEFAULT_CITIES.map(c => (
                <option key={c.name} value={c.name} className="bg-[var(--bg-surface)] text-[var(--text-primary)]">
                  {c.name} — {c.country}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={detectUserLocation}
            className="p-2.5 rounded-2xl bg-[var(--emerald-soft)] text-[var(--emerald-deep)] dark:text-[var(--gold-primary)] text-xs font-bold transition-colors flex items-center gap-1.5 shrink-0 border border-[var(--emerald-border)] hover:bg-[var(--emerald-deep)] hover:text-white"
            title="تحديد الموقع الجغرافي تلقائياً"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">موقعي</span>
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs sm:text-sm text-[var(--text-secondary)] bg-[var(--bg-surface-elevated)] px-4 py-2.5 rounded-2xl border border-[var(--border-subtle)]">
          <Calendar className="w-4 h-4 text-[var(--gold-primary)]" />
          <span className="font-bold text-[var(--text-primary)]">{hijri.formatted}</span>
        </div>

      </div>

      {/* Active Prayer Card with Countdown Ring */}
      <div className="p-6 sm:p-10 rounded-3xl bg-[var(--emerald-deep)] text-white shadow-xl border border-[var(--gold-border)] mb-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        {/* Subtle Watermark */}
        <div className="absolute top-0 right-0 p-8 text-8xl font-quran text-[var(--gold-primary)] opacity-5 select-none pointer-events-none">
          الصلاة
        </div>

        <div className="space-y-2 text-center md:text-right relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/10 text-[var(--gold-primary)] text-xs font-bold border border-[var(--gold-border)]">
            <span className="w-2 h-2 rounded-full bg-[var(--gold-primary)] animate-ping" />
            <span>الصلاة القادمة: {nextPrayer.nextPrayerName}</span>
          </div>
          <div className="text-4xl sm:text-6xl font-extrabold font-cairo text-white">
            {nextPrayer.nextPrayerTime}
          </div>
          <p className="text-xs sm:text-sm text-[var(--gold-light)]">
            الوقت المتبقي للأذان: <strong className="text-[var(--gold-primary)] text-base">{nextPrayer.remainingText}</strong>
          </p>
        </div>

        <div className="text-center p-5 rounded-2xl bg-black/20 border border-[var(--gold-border)] min-w-[220px] relative z-10">
          <span className="text-xs text-[var(--gold-light)] block mb-1">المدينة المحددة</span>
          <span className="text-lg font-bold text-white block">{customLocationName || `${selectedCity.name} (${selectedCity.country})`}</span>
          <span className="text-[11px] text-[var(--gold-primary)]/80 font-medium block mt-1">طريقة الحساب: رابطة العالم الإسلامي</span>
        </div>
      </div>

      {/* 6 Prayer Times Horizontal Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-10">
        {prayersList.map(item => {
          const isNext = nextPrayer.key === item.key;
          return (
            <div
              key={item.key}
              className={`p-4 rounded-3xl text-center space-y-2 transition-all ${
                isNext
                  ? 'bg-[var(--emerald-deep)] text-[var(--gold-primary)] font-bold shadow-md scale-105 border-2 border-[var(--gold-primary)]'
                  : 'bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border-subtle)] shadow-xs hover:border-[var(--emerald-border)]'
              }`}
            >
              <div className="text-2xl">{item.icon}</div>
              <div className={`text-xs ${isNext ? 'text-[var(--gold-light)] font-extrabold' : 'text-[var(--text-muted)]'}`}>
                {item.label}
              </div>
              <div className="text-base sm:text-lg font-extrabold font-cairo">
                {item.time}
              </div>
            </div>
          );
        })}
      </div>

      {/* Astrolabe / Luxury Qibla Compass */}
      <div className="p-6 sm:p-10 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-sm">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          
          <div className="space-y-4 max-w-md text-center md:text-right">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[var(--gold-soft)] text-[var(--gold-dark)] dark:text-[var(--gold-light)] text-xs font-semibold border border-[var(--gold-border)]">
              <Compass className="w-3.5 h-3.5 text-[var(--gold-primary)]" />
              <span>بوصلة القبلة نحو الكعبة المشرفة</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold font-quran text-[var(--text-primary)]">
              اتجاه القبلة الشريفة
            </h3>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
              زاوية القبلة من موقعك الحالي هي: <strong className="text-[var(--emerald-medium)] dark:text-[var(--gold-primary)] font-cairo text-base">{qibla.bearing}° درجة</strong> بالنسبة للشمال الجغرافي.
            </p>
            
            <div className="p-4 rounded-2xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">المسافة إلى مكة المكرمة:</span>
                <span className="font-bold text-[var(--text-primary)] font-cairo">{qibla.distanceKm.toLocaleString('ar-EG')} كم</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">إحداثيات الكعبة:</span>
                <span className="font-bold text-[var(--text-primary)]">21.42° N, 39.82° E</span>
              </div>
            </div>

            <button
              onClick={startCompass}
              className="px-5 py-2.5 rounded-2xl bg-[var(--emerald-deep)] hover:bg-[var(--emerald-medium)] text-[var(--gold-primary)] text-xs font-bold transition-all shadow-md inline-flex items-center gap-2 border border-[var(--gold-border)] cursor-pointer"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>معايرة البوصلة بالهاتف</span>
            </button>
          </div>

          {/* Luxury Astrolabe Compass Graphic */}
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center select-none">
            
            {/* Outer Brass Ring */}
            <div className="w-full h-full rounded-full border-4 border-[var(--gold-border)] flex items-center justify-center relative bg-gradient-to-br from-[var(--gold-soft)] via-[var(--bg-surface-elevated)] to-[var(--emerald-soft)] shadow-inner">
              
              {/* Compass Ticks & Labels */}
              <span className="absolute top-2 font-bold text-xs text-rose-500">N (شمال)</span>
              <span className="absolute bottom-2 font-bold text-xs text-[var(--text-muted)]">S (جنوب)</span>
              <span className="absolute right-2 font-bold text-xs text-[var(--text-muted)]">E (شرق)</span>
              <span className="absolute left-2 font-bold text-xs text-[var(--text-muted)]">W (غرب)</span>

              {/* Rotatable Qibla Needle */}
              <div
                className="w-full h-full absolute inset-0 flex items-center justify-center transition-transform duration-700 ease-out"
                style={{ transform: `rotate(${qibla.bearing - deviceHeading}deg)` }}
              >
                <div className="h-32 w-1.5 bg-gradient-to-t from-transparent via-[var(--gold-primary)] to-[var(--gold-dark)] rounded-full flex flex-col items-center justify-start -translate-y-8">
                  {/* Kaaba Badge */}
                  <div className="w-8 h-8 rounded-xl bg-[var(--emerald-deep)] border-2 border-[var(--gold-primary)] shadow-xl flex items-center justify-center text-xs -translate-y-4 font-bold text-[var(--gold-primary)]">
                    🕋
                  </div>
                </div>
              </div>

              {/* Central Pivot Jewel */}
              <div className="w-5 h-5 rounded-full bg-[var(--emerald-deep)] border-2 border-[var(--gold-primary)] shadow-md z-10" />

            </div>

          </div>

        </div>
      </div>

    </section>
  );
};
