// Precise Astronomical Prayer Times, Hijri Date, and Qibla Direction Calculations
const KAABA_LAT = 21.422487;
const KAABA_LNG = 39.826206;

export const DEFAULT_CITIES = [
  { name: 'مكة المكرمة', country: 'السعودية', lat: 21.4225, lng: 39.8262, timezone: 3 },
  { name: 'المدينة المنورة', country: 'السعودية', lat: 24.4672, lng: 39.6024, timezone: 3 },
  { name: 'القدس الشريف', country: 'فلسطين', lat: 31.7683, lng: 35.2137, timezone: 3 },
  { name: 'القاهرة', country: 'مصر', lat: 30.0444, lng: 31.2357, timezone: 2 },
  { name: 'عمّان', country: 'الأردن', lat: 31.9539, lng: 35.9106, timezone: 3 },
  { name: 'الرياض', country: 'السعودية', lat: 24.7136, lng: 46.6753, timezone: 3 },
  { name: 'دبي', country: 'الإمارات', lat: 25.2048, lng: 55.2708, timezone: 4 },
  { name: 'دمشق', country: 'سوريا', lat: 33.5138, lng: 36.2765, timezone: 3 },
  { name: 'بغداد', country: 'العراق', lat: 33.3152, lng: 44.3661, timezone: 3 },
  { name: 'الكويت', country: 'الكويت', lat: 29.3759, lng: 47.9774, timezone: 3 },
  { name: 'الدوحة', country: 'قطر', lat: 25.2854, lng: 51.5310, timezone: 3 },
  { name: 'مسقط', country: 'عمان', lat: 23.5880, lng: 58.3829, timezone: 4 },
  { name: 'الرباط', country: 'المغرب', lat: 34.0209, lng: -6.8416, timezone: 1 },
  { name: 'تونس', country: 'تونس', lat: 36.8065, lng: 10.1815, timezone: 1 },
  { name: 'الجزائر', country: 'الجزائر', lat: 36.7538, lng: 3.0588, timezone: 1 },
  { name: 'إسطنبول', country: 'تركيا', lat: 41.0082, lng: 28.9784, timezone: 3 },
  { name: 'لندن', country: 'المملكة المتحدة', lat: 51.5074, lng: -0.1278, timezone: 0 }
];

// Helper to convert degrees to radians and vice versa
const toRad = (deg) => (deg * Math.PI) / 180;
const toDeg = (rad) => (rad * 180) / Math.PI;

// Calculate Qibla angle from user latitude and longitude
export const calculateQibla = (lat, lng) => {
  const phi1 = toRad(lat);
  const phi2 = toRad(KAABA_LAT);
  const deltaLambda = toRad(KAABA_LNG - lng);

  const y = Math.sin(deltaLambda);
  const x = Math.cos(phi1) * Math.tan(phi2) - Math.sin(phi1) * Math.cos(deltaLambda);
  let qibla = toDeg(Math.atan2(y, x));
  qibla = (qibla + 360) % 360;

  // Calculate Distance in kilometers using Haversine formula
  const R = 6371; // Earth radius in km
  const dLat = toRad(KAABA_LAT - lat);
  const dLon = toRad(KAABA_LNG - lng);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = Math.round(R * c);

  return {
    bearing: Math.round(qibla),
    distanceKm: distance
  };
};

// Calculate Sun position and Prayer Times based on astronomical formulae
export const calculatePrayerTimes = (lat, lng, date = new Date()) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  // Julian date calculation
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  const jd = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
  const d = jd - 2451545.0;

  // Mean anomaly and solar coordinates
  const g = 357.529 + 0.98560028 * d;
  const q = 280.459 + 0.98564736 * d;
  const L = q + 1.915 * Math.sin(toRad(g)) + 0.020 * Math.sin(toRad(2 * g));
  const e = 23.439 - 0.00000036 * d;
  const RA = toDeg(Math.atan2(Math.cos(toRad(e)) * Math.sin(toRad(L)), Math.cos(toRad(L)))) / 15;
  const dec = toDeg(Math.asin(Math.sin(toRad(e)) * Math.sin(toRad(L))));

  // Equation of time in hours
  const EqT = q / 15 - (RA < 0 ? RA + 24 : RA);

  // Timezone offset in hours
  const timezoneOffset = -date.getTimezoneOffset() / 60;

  // Solar Noon (Dhuhr)
  const dhuhrTime = 12 + timezoneOffset - lng / 15 - EqT;

  // Sun hour angle helper
  const hourAngle = (angle) => {
    const cosHA = (Math.sin(toRad(-angle)) - Math.sin(toRad(lat)) * Math.sin(toRad(dec))) /
                  (Math.cos(toRad(lat)) * Math.cos(toRad(dec)));
    if (cosHA > 1) return 0;
    if (cosHA < -1) return Math.PI;
    return toDeg(Math.acos(cosHA)) / 15;
  };

  // Asr shadow angle (Standard Shafi/Hanbali: shadow = object length + noon shadow)
  const noonSunAltitude = 90 - Math.abs(lat - dec);
  const asrAltitude = toDeg(Math.atan(1 + Math.tan(toRad(Math.abs(lat - dec)))));
  const asrHA = hourAngle(90 - asrAltitude);

  const fajrAngle = 18.0; // Muslim World League standard
  const ishaAngle = 17.0;

  const sunriseHA = hourAngle(0.833);
  const fajrHA = hourAngle(fajrAngle);
  const ishaHA = hourAngle(ishaAngle);

  const fajr = dhuhrTime - fajrHA;
  const sunrise = dhuhrTime - sunriseHA;
  const asr = dhuhrTime + asrHA;
  const maghrib = dhuhrTime + sunriseHA;
  const isha = dhuhrTime + ishaHA;

  const formatTime = (hoursFraction) => {
    let totalMinutes = Math.round(hoursFraction * 60);
    totalMinutes = (totalMinutes + 1440) % 1440;
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    const period = h >= 12 ? 'م' : 'ص';
    const displayH = h % 12 === 0 ? 12 : h % 12;
    return {
      formatted: `${displayH}:${m < 10 ? '0' : ''}${m} ${period}`,
      rawHours: h,
      rawMinutes: m,
      totalMinutes
    };
  };

  return {
    fajr: formatTime(fajr),
    sunrise: formatTime(sunrise),
    dhuhr: formatTime(dhuhrTime),
    asr: formatTime(asr),
    maghrib: formatTime(maghrib),
    isha: formatTime(isha)
  };
};

// Next prayer detector & countdown
export const getNextPrayer = (prayerTimes, now = new Date()) => {
  const currentTotalMin = now.getHours() * 60 + now.getMinutes();

  const prayers = [
    { name: 'الفجر', key: 'fajr', time: prayerTimes.fajr },
    { name: 'الشروق', key: 'sunrise', time: prayerTimes.sunrise },
    { name: 'الظهر', key: 'dhuhr', time: prayerTimes.dhuhr },
    { name: 'العصر', key: 'asr', time: prayerTimes.asr },
    { name: 'المغرب', key: 'maghrib', time: prayerTimes.maghrib },
    { name: 'العشاء', key: 'isha', time: prayerTimes.isha }
  ];

  for (const p of prayers) {
    if (p.time.totalMinutes > currentTotalMin) {
      const diff = p.time.totalMinutes - currentTotalMin;
      const hours = Math.floor(diff / 60);
      const mins = diff % 60;
      return {
        nextPrayerName: p.name,
        nextPrayerTime: p.time.formatted,
        key: p.key,
        remainingHours: hours,
        remainingMinutes: mins,
        remainingText: hours > 0 ? `${hours} ساعة و ${mins} دقيقة` : `${mins} دقيقة`
      };
    }
  }

  // If all prayers passed today, next is Fajr tomorrow
  const diffTomorrow = 1440 - currentTotalMin + prayerTimes.fajr.totalMinutes;
  const hours = Math.floor(diffTomorrow / 60);
  const mins = diffTomorrow % 60;
  return {
    nextPrayerName: 'الفجر (غداً)',
    nextPrayerTime: prayerTimes.fajr.formatted,
    key: 'fajr',
    remainingHours: hours,
    remainingMinutes: mins,
    remainingText: `${hours} ساعة و ${mins} دقيقة`
  };
};

// Approximate astronomical Hijri date calculation
export const getHijriDate = (date = new Date()) => {
  const hijriMonths = [
    'محرم', 'صفر', 'ربيع الأول', 'ربيع الآخر',
    'جمادى الأولى', 'جمادى الآخرة', 'رجب', 'شعبان',
    'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة'
  ];

  const daysOfWeek = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  const dayName = daysOfWeek[date.getDay()];

  // Standard algorithmic Umm al-Qura approximation
  let m = date.getMonth() + 1;
  let y = date.getFullYear();
  let d = date.getDate();

  if (m < 3) {
    y -= 1;
    m += 12;
  }

  let a = Math.floor(y / 100);
  let b = 2 - a + Math.floor(a / 4);
  if (y < 1583) b = 0;
  if (y === 1582) {
    if (m > 10) b = -10;
    if (m === 10) {
      b = 0;
      if (d > 4) b = -10;
    }
  }

  const jd = Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + b - 1524;
  let l = jd - 1948440 + 10632;
  let n = Math.floor((l - 1) / 10631);
  l = l - 10631 * n + 354;
  let j = (Math.floor((10985 - l) / 5316)) * (Math.floor((50 * l) / 17719)) + (Math.floor(l / 5670)) * (Math.floor((43 * l) / 15238));
  l = l - (Math.floor((30 - j) / 15)) * (Math.floor((17719 * j) / 50)) - (Math.floor(j / 16)) * (Math.floor((15238 * j) / 43)) + 29;
  
  let hijriMonth = Math.floor((24 * l) / 709);
  let hijriDay = l - Math.floor((709 * hijriMonth) / 24);
  let hijriYear = 30 * n + j - 30;

  return {
    dayName,
    day: hijriDay,
    monthName: hijriMonths[(hijriMonth - 1 + 12) % 12] || 'رمضان',
    year: hijriYear,
    formatted: `${dayName}، ${hijriDay} ${hijriMonths[(hijriMonth - 1 + 12) % 12] || ''} ${hijriYear} هـ`
  };
};
