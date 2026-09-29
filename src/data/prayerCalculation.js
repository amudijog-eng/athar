// Precise Astronomical Prayer Times, Hijri Date, and Qibla Direction Calculations
const KAABA_LAT = 21.422487;
const KAABA_LNG = 39.826206;

export const DEFAULT_CITIES = [
  { name: 'عمّان', country: 'الأردن', flag: '🇯🇴', lat: 31.9539, lng: 35.9106, timezone: 3, method: 'MWL' },
  { name: 'الزرقاء', country: 'الأردن', flag: '🇯🇴', lat: 32.0728, lng: 36.0880, timezone: 3, method: 'MWL' },
  { name: 'إربد', country: 'الأردن', flag: '🇯🇴', lat: 32.5568, lng: 35.8469, timezone: 3, method: 'MWL' },
  { name: 'مكة المكرمة', country: 'السعودية', flag: '🇸🇦', lat: 21.4225, lng: 39.8262, timezone: 3, method: 'UmmAlQura' },
  { name: 'المدينة المنورة', country: 'السعودية', flag: '🇸🇦', lat: 24.4672, lng: 39.6024, timezone: 3, method: 'UmmAlQura' },
  { name: 'الرياض', country: 'السعودية', flag: '🇸🇦', lat: 24.7136, lng: 46.6753, timezone: 3, method: 'UmmAlQura' },
  { name: 'جدة', country: 'السعودية', flag: '🇸🇦', lat: 21.5433, lng: 39.1728, timezone: 3, method: 'UmmAlQura' },
  { name: 'القدس الشريف', country: 'فلسطين', flag: '🇵🇸', lat: 31.7683, lng: 35.2137, timezone: 3, method: 'MWL' },
  { name: 'غزة', country: 'فلسطين', flag: '🇵🇸', lat: 31.5017, lng: 34.4668, timezone: 3, method: 'MWL' },
  { name: 'القاهرة', country: 'مصر', flag: '🇪🇬', lat: 30.0444, lng: 31.2357, timezone: 2, method: 'Egypt' },
  { name: 'الإسكندرية', country: 'مصر', flag: '🇪🇬', lat: 31.2001, lng: 29.9187, timezone: 2, method: 'Egypt' },
  { name: 'دبي', country: 'الإمارات', flag: '🇦🇪', lat: 25.2048, lng: 55.2708, timezone: 4, method: 'UmmAlQura' },
  { name: 'أبوظبي', country: 'الإمارات', flag: '🇦🇪', lat: 24.4539, lng: 54.3773, timezone: 4, method: 'UmmAlQura' },
  { name: 'دمشق', country: 'سوريا', flag: '🇸🇾', lat: 33.5138, lng: 36.2765, timezone: 3, method: 'MWL' },
  { name: 'بيروت', country: 'لبنان', flag: '🇱🇧', lat: 33.8938, lng: 35.5018, timezone: 3, method: 'MWL' },
  { name: 'بغداد', country: 'العراق', flag: '🇮🇶', lat: 33.3152, lng: 44.3661, timezone: 3, method: 'MWL' },
  { name: 'الكويت', country: 'الكويت', flag: '🇰🇼', lat: 29.3759, lng: 47.9774, timezone: 3, method: 'UmmAlQura' },
  { name: 'الدوحة', country: 'قطر', flag: '🇶🇦', lat: 25.2854, lng: 51.5310, timezone: 3, method: 'UmmAlQura' },
  { name: 'مسقط', country: 'عمان', flag: '🇴🇲', lat: 23.5880, lng: 58.3829, timezone: 4, method: 'UmmAlQura' },
  { name: 'المنامة', country: 'البحرين', flag: '🇧🇭', lat: 26.2285, lng: 50.5860, timezone: 3, method: 'UmmAlQura' },
  { name: 'صنعاء', country: 'اليمن', flag: '🇾🇪', lat: 15.3694, lng: 44.1910, timezone: 3, method: 'UmmAlQura' },
  { name: 'طرابلس', country: 'ليبيا', flag: '🇱🇾', lat: 32.8872, lng: 13.1913, timezone: 2, method: 'MWL' },
  { name: 'تونس', country: 'تونس', flag: '🇹🇳', lat: 36.8065, lng: 10.1815, timezone: 1, method: 'MWL' },
  { name: 'الجزائر', country: 'الجزائر', flag: '🇩🇿', lat: 36.7538, lng: 3.0588, timezone: 1, method: 'MWL' },
  { name: 'الرباط', country: 'المغرب', flag: '🇲🇦', lat: 34.0209, lng: -6.8416, timezone: 1, method: 'MWL' },
  { name: 'الخرطوم', country: 'السودان', flag: '🇸🇩', lat: 15.5007, lng: 32.5599, timezone: 2, method: 'Egypt' },
  { name: 'إسطنبول', country: 'تركيا', flag: '🇹🇷', lat: 41.0082, lng: 28.9784, timezone: 3, method: 'Turkey' },
  { name: 'لندن', country: 'المملكة المتحدة', flag: '🇬🇧', lat: 51.5074, lng: -0.1278, timezone: 0, method: 'MWL' },
  { name: 'نيويورك', country: 'الولايات المتحدة', flag: '🇺🇸', lat: 40.7128, lng: -74.0060, timezone: -5, method: 'ISNA' }
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

const fixAngle = (a) => ((a % 360) + 360) % 360;

// Calculate Sun position and Prayer Times based on astronomical formulae
export const calculatePrayerTimes = (lat, lng, date = new Date(), customTimezone = null, method = 'MWL', asrSchool = 'standard') => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  // Julian date calculation
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  const jd = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
  const d = jd - 2451545.0;

  // Mean anomaly and solar coordinates normalized to 0-360 degrees
  const g = fixAngle(357.529 + 0.98560028 * d);
  const q = fixAngle(280.459 + 0.98564736 * d);
  const L = fixAngle(q + 1.915 * Math.sin(toRad(g)) + 0.020 * Math.sin(toRad(2 * g)));
  const e = 23.439 - 0.00000036 * d;

  let RA = toDeg(Math.atan2(Math.cos(toRad(e)) * Math.sin(toRad(L)), Math.cos(toRad(L)))) / 15;
  RA = ((RA % 24) + 24) % 24;

  const dec = toDeg(Math.asin(Math.sin(toRad(e)) * Math.sin(toRad(L))));

  let EqT = q / 15 - RA;
  if (EqT > 12) EqT -= 24;
  if (EqT < -12) EqT += 24;

  const timezoneOffset = customTimezone !== null && customTimezone !== undefined
    ? customTimezone
    : (-date.getTimezoneOffset() / 60);

  // Solar Noon (Dhuhr)
  const dhuhrTime = 12 + timezoneOffset - lng / 15 - EqT;

  // Sun hour angle helper for depressions below horizon (Fajr, Sunrise, Isha)
  const hourAngle = (angle) => {
    const cosHA = (Math.sin(toRad(-angle)) - Math.sin(toRad(lat)) * Math.sin(toRad(dec))) /
                  (Math.cos(toRad(lat)) * Math.cos(toRad(dec)));
    if (cosHA > 1) return 0;
    if (cosHA < -1) return Math.PI;
    return toDeg(Math.acos(cosHA)) / 15;
  };

  // Asr shadow factor: 1 for Shafi'i/Hanbali/Maliki, 2 for Hanafi
  const shadowFactor = asrSchool === 'hanafi' ? 2 : 1;
  const asrAltitude = toDeg(Math.atan(1 / (shadowFactor + Math.tan(toRad(Math.abs(lat - dec))))));
  const cosAsrHA = (Math.sin(toRad(asrAltitude)) - Math.sin(toRad(lat)) * Math.sin(toRad(dec))) /
                   (Math.cos(toRad(lat)) * Math.cos(toRad(dec)));
  const asrHA = (cosAsrHA >= -1 && cosAsrHA <= 1) ? toDeg(Math.acos(cosAsrHA)) / 15 : 3.5;

  let fajrAngle = 18.0;
  let ishaAngle = 17.0;
  let ishaInterval = null; // minutes after Maghrib

  if (method === 'UmmAlQura') {
    fajrAngle = 18.5;
    ishaInterval = 90;
  } else if (method === 'Egypt') {
    fajrAngle = 19.5;
    ishaAngle = 17.5;
  } else if (method === 'ISNA') {
    fajrAngle = 15.0;
    ishaAngle = 15.0;
  } else if (method === 'Karachi') {
    fajrAngle = 18.0;
    ishaAngle = 18.0;
  } else if (method === 'Turkey') {
    fajrAngle = 18.0;
    ishaAngle = 17.0;
  }

  const sunriseHA = hourAngle(0.833);
  const fajrHA = hourAngle(fajrAngle);
  const ishaHA = ishaInterval ? null : hourAngle(ishaAngle);

  const fajr = dhuhrTime - fajrHA;
  const sunrise = dhuhrTime - sunriseHA;
  const asr = dhuhrTime + asrHA;
  const maghrib = dhuhrTime + sunriseHA;
  const isha = ishaInterval ? maghrib + (ishaInterval / 60) : dhuhrTime + ishaHA;

  const formatTime = (hoursFraction) => {
    let totalMinutes = Math.round(hoursFraction * 60);
    totalMinutes = ((totalMinutes % 1440) + 1440) % 1440;
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

  const formatRemaining = (h, m) => {
    const hText = h === 1 ? 'ساعة واحدة' : h === 2 ? 'ساعتان' : (h >= 3 && h <= 10) ? `${h} ساعات` : `${h} ساعة`;
    const mText = m === 1 ? 'دقيقة واحدة' : m === 2 ? 'دقيقتان' : (m >= 3 && m <= 10) ? `${m} دقائق` : `${m} دقيقة`;
    if (h > 0 && m > 0) return `${hText} و ${mText}`;
    if (h > 0) return hText;
    return mText;
  };

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
        remainingText: formatRemaining(hours, mins)
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
    remainingText: formatRemaining(hours, mins)
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
