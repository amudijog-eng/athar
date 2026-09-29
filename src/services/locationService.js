// Automated IP Geolocation, Reverse-Geocoding, and Multi-Country Prayer Time Method Routing

const COUNTRY_MAP_AR = {
  'Jordan': { name: 'الأردن', flag: '🇯🇴', defaultMethod: 'MWL' },
  'Saudi Arabia': { name: 'السعودية', flag: '🇸🇦', defaultMethod: 'UmmAlQura' },
  'Egypt': { name: 'مصر', flag: '🇪🇬', defaultMethod: 'Egypt' },
  'Palestine': { name: 'فلسطين', flag: '🇵🇸', defaultMethod: 'MWL' },
  'United Arab Emirates': { name: 'الإمارات', flag: '🇦🇪', defaultMethod: 'UmmAlQura' },
  'Kuwait': { name: 'الكويت', flag: '🇰🇼', defaultMethod: 'UmmAlQura' },
  'Qatar': { name: 'قطر', flag: '🇶🇦', defaultMethod: 'UmmAlQura' },
  'Oman': { name: 'عُمان', flag: '🇴🇲', defaultMethod: 'UmmAlQura' },
  'Bahrain': { name: 'البحرين', flag: '🇧🇭', defaultMethod: 'UmmAlQura' },
  'Iraq': { name: 'العراق', flag: '🇮🇶', defaultMethod: 'MWL' },
  'Syria': { name: 'سوريا', flag: '🇸🇾', defaultMethod: 'MWL' },
  'Lebanon': { name: 'لبنان', flag: '🇱🇧', defaultMethod: 'MWL' },
  'Morocco': { name: 'المغرب', flag: '🇲🇦', defaultMethod: 'MWL' },
  'Algeria': { name: 'الجزائر', flag: '🇩🇿', defaultMethod: 'MWL' },
  'Tunisia': { name: 'تونس', flag: '🇹🇳', defaultMethod: 'MWL' },
  'Libya': { name: 'ليبيا', flag: '🇱🇾', defaultMethod: 'MWL' },
  'Sudan': { name: 'السودان', flag: '🇸🇩', defaultMethod: 'Egypt' },
  'Yemen': { name: 'اليمن', flag: '🇾🇪', defaultMethod: 'UmmAlQura' },
  'Turkey': { name: 'تركيا', flag: '🇹🇷', defaultMethod: 'Turkey' },
  'United Kingdom': { name: 'المملكة المتحدة', flag: '🇬🇧', defaultMethod: 'MWL' },
  'United States': { name: 'الولايات المتحدة', flag: '🇺🇸', defaultMethod: 'ISNA' },
  'Canada': { name: 'كندا', flag: '🇨🇦', defaultMethod: 'ISNA' },
  'Germany': { name: 'ألمانيا', flag: '🇩🇪', defaultMethod: 'MWL' },
  'France': { name: 'فرنسا', flag: '🇫🇷', defaultMethod: 'France' },
  'Indonesia': { name: 'إندونيسيا', flag: '🇮🇩', defaultMethod: 'MWL' },
  'Malaysia': { name: 'ماليزيا', flag: '🇲🇾', defaultMethod: 'MWL' },
  'Pakistan': { name: 'باكستان', flag: '🇵🇰', defaultMethod: 'Karachi' }
};

const CITY_MAP_AR = {
  'Zarqa': 'الزرقاء',
  'Amman': 'عمّان',
  'Irbid': 'إربد',
  'Aqaba': 'العقبة',
  'Riyadh': 'الرياض',
  'Jeddah': 'جدة',
  'Mecca': 'مكة المكرمة',
  'Makkah': 'مكة المكرمة',
  'Medina': 'المدينة المنورة',
  'Madinah': 'المدينة المنورة',
  'Dammam': 'الدمام',
  'Cairo': 'القاهرة',
  'Alexandria': 'الإسكندرية',
  'Giza': 'الجيزة',
  'Jerusalem': 'القدس الشريف',
  'Gaza': 'غزة',
  'Ramallah': 'رام الله',
  'Nablus': 'نابلس',
  'Dubai': 'دبي',
  'Abu Dhabi': 'أبوظبي',
  'Sharjah': 'الشارقة',
  'Kuwait City': 'الكويت',
  'Doha': 'الدوحة',
  'Muscat': 'مسقط',
  'Manama': 'المنامة',
  'Baghdad': 'بغداد',
  'Erbil': 'أربيل',
  'Basra': 'البصرة',
  'Damascus': 'دمشق',
  'Aleppo': 'حلب',
  'Beirut': 'بيروت',
  'Tripoli': 'طرابلس',
  'Rabat': 'الرباط',
  'Casablanca': 'الدار البيضاء',
  'Algiers': 'الجزائر',
  'Tunis': 'تونس',
  'Khartoum': 'الخرطوم',
  'Sanaa': 'صنعاء',
  'Istanbul': 'إسطنبول',
  'Ankara': 'أنقرة',
  'London': 'لندن',
  'Paris': 'باريس',
  'Berlin': 'برلين',
  'New York': 'نيويورك',
  'Toronto': 'تورونتو'
};

export const CALCULATION_METHODS = [
  { id: 'MWL', name: 'رابطة العالم الإسلامي (الأردن وبلاد الشام وأوروبا)', fajrAngle: 18, ishaAngle: 17 },
  { id: 'UmmAlQura', name: 'أم القرى (المملكة العربية السعودية والخليج)', fajrAngle: 18.5, ishaInterval: 90 },
  { id: 'Egypt', name: 'الهيئة المصرية العامة للمساحة (مصر والسودان)', fajrAngle: 19.5, ishaAngle: 17.5 },
  { id: 'ISNA', name: 'الجمعية الإسلامية لأمريكا الشمالية (ISNA)', fajrAngle: 15, ishaAngle: 15 },
  { id: 'Karachi', name: 'جامعة العلوم الإسلامية بكراتشي (باكستان)', fajrAngle: 18, ishaAngle: 18 },
  { id: 'Turkey', name: 'رئاسة الشؤون الدينية التركية (Diyanet)', fajrAngle: 18, ishaAngle: 17 }
];

export const detectLocationViaIp = async () => {
  // Check LocalStorage cache first
  try {
    const cached = localStorage.getItem('athar_auto_location');
    if (cached) {
      const parsed = JSON.parse(cached);
      const isRecent = (Date.now() - (parsed._timestamp || 0)) < 12 * 60 * 60 * 1000; // 12 hours valid
      if (isRecent && parsed.lat && parsed.lng) {
        return parsed;
      }
    }
  } catch {}

  // Primary: ipwho.is (CORS enabled, highly accurate, fast)
  try {
    const res = await fetch('https://ipwho.is/', { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (data && data.success !== false && data.latitude && data.longitude) {
        const countryInfo = COUNTRY_MAP_AR[data.country] || {
          name: data.country || 'موقعك الجغرافي',
          flag: data.flag?.emoji || '📍',
          defaultMethod: 'MWL'
        };
        const arCity = CITY_MAP_AR[data.city] || data.city || 'المدينة المحلية';
        const tzOffset = data.timezone?.offset ? data.timezone.offset / 3600 : -new Date().getTimezoneOffset() / 60;

        const locationObj = {
          name: arCity,
          englishCity: data.city,
          country: countryInfo.name,
          englishCountry: data.country,
          flag: countryInfo.flag,
          lat: data.latitude,
          lng: data.longitude,
          timezone: tzOffset,
          method: countryInfo.defaultMethod,
          isAutoDetected: true,
          _timestamp: Date.now()
        };

        localStorage.setItem('athar_auto_location', JSON.stringify(locationObj));
        return locationObj;
      }
    }
  } catch (e) {
    console.warn('ipwho.is failed, trying fallback:', e);
  }

  // Fallback: freeipapi.com
  try {
    const res = await fetch('https://freeipapi.com/api/json', { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (data && data.latitude && data.longitude) {
        const countryInfo = COUNTRY_MAP_AR[data.countryName] || {
          name: data.countryName || 'موقعك الجغرافي',
          flag: '📍',
          defaultMethod: 'MWL'
        };
        const arCity = CITY_MAP_AR[data.cityName] || data.cityName || 'المدينة المحلية';
        const tzOffset = -new Date().getTimezoneOffset() / 60;

        const locationObj = {
          name: arCity,
          englishCity: data.cityName,
          country: countryInfo.name,
          englishCountry: data.countryName,
          flag: countryInfo.flag,
          lat: data.latitude,
          lng: data.longitude,
          timezone: tzOffset,
          method: countryInfo.defaultMethod,
          isAutoDetected: true,
          _timestamp: Date.now()
        };

        localStorage.setItem('athar_auto_location', JSON.stringify(locationObj));
        return locationObj;
      }
    }
  } catch (e) {
    console.warn('freeipapi failed:', e);
  }

  // Default fallback: Jordan (Zarqa / Amman) since default user locale
  return {
    name: 'عمّان',
    englishCity: 'Amman',
    country: 'الأردن',
    englishCountry: 'Jordan',
    flag: '🇯🇴',
    lat: 31.9539,
    lng: 35.9106,
    timezone: 3,
    method: 'MWL',
    isAutoDetected: false,
    _timestamp: Date.now()
  };
};
