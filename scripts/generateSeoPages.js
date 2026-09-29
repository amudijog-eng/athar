import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const publicDir = path.resolve(rootDir, 'public');

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// 114 Holy Quran Surahs
const SURAHS = [
  { id: 1, name: "الفاتحة", englishName: "Al-Faatiha", type: "مكية", versesCount: 7, startPage: 1, juz: 1, desc: "أم الكتاب والسبع المثاني وأعظم سورة في كتاب الله الكريم، رقية وشفاء للمؤمنين." },
  { id: 2, name: "البقرة", englishName: "Al-Baqara", type: "مدنية", versesCount: 286, startPage: 2, juz: 1, desc: "سنام القرآن وأطول سورة فيه، وفيها آية الكرسي وخواتيم البقرة، لا تستطيعها البطلة وتطرد الشياطين." },
  { id: 3, name: "آل عمران", englishName: "Aal-i-Imraan", type: "مدنية", versesCount: 200, startPage: 50, juz: 3, desc: "إحدى الزهراوين، تحاج عن صاحبها يوم القيامة، وتثبيت لأهل الإيمان في الثبات على الحق." },
  { id: 4, name: "النساء", englishName: "An-Nisaa", type: "مدنية", versesCount: 176, startPage: 77, juz: 4, desc: "سورة الأحكام والعدل والحقوق وحفظ أموال اليتامى والميراث وحماية الأسرة المسلمة." },
  { id: 5, name: "المائدة", englishName: "Al-Maaida", type: "مدنية", versesCount: 120, startPage: 106, juz: 6, desc: "سورة العقود والعهود وبيان الحلال والحرام، وفيها آية كمال الدين وإتمام النعمة." },
  { id: 6, name: "الأنعام", englishName: "Al-An'aam", type: "مكية", versesCount: 165, startPage: 128, juz: 7, desc: "سورة التوحيد الخالص وإقامة الحجج والبراهين العقلية على وحدانية الله رب العالمين." },
  { id: 7, name: "الأعراف", englishName: "Al-A'raaf", type: "مكية", versesCount: 206, startPage: 151, juz: 8, desc: "أطول سورة مكية، تعرض الصراع الدائم بين الحق والباطل ومصائر الأمم السابقة." },
  { id: 8, name: "الأنفال", englishName: "Al-Anfaal", type: "مدنية", versesCount: 75, startPage: 177, juz: 9, desc: "سورة غزوة بدر الكبرى، بيان أسباب النصر الإلهي والتقوى والثبات في الميدان." },
  { id: 9, name: "التوبة", englishName: "At-Tawba", type: "مدنية", versesCount: 129, startPage: 187, juz: 10, desc: "سورة البراءة من الشرك والمنافقين، وإعلان قبول توبة الصادقين المتخلفين عن تبوك." },
  { id: 10, name: "يونس", englishName: "Yunus", type: "مكية", versesCount: 109, startPage: 208, juz: 11, desc: "بيان حكمة الله في قضاء وقدر البشر وقصة نجاة قوم يونس بعد توبتهم النصوح." },
  { id: 11, name: "هود", englishName: "Hud", type: "مكية", versesCount: 123, startPage: 221, juz: 11, desc: "سورة الاستقامة والصبر على الدعوة وقصص الأنبياء مع أقوامهم، شيبت رسول الله ﷺ." },
  { id: 12, name: "يوسف", englishName: "Yusuf", type: "مكية", versesCount: 111, startPage: 235, juz: 12, desc: "أحسن القصص، قصة الصبر والوفاء وحسن الظن بالله من ظلمات الجب إلى ملك مصر." },
  { id: 13, name: "الرعد", englishName: "Ar-Ra'd", type: "مدنية", versesCount: 43, startPage: 249, juz: 13, desc: "«أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ»، تسبح الرعود بحمده والملائكة من خيفته." },
  { id: 14, name: "إبراهيم", englishName: "Ibrahim", type: "مكية", versesCount: 52, startPage: 255, juz: 13, desc: "سورة شكر النعم، وكلمة التوحيد الطيبة كشجرة طيبة أصلها ثابت وفرعها في السماء." },
  { id: 15, name: "الحجر", englishName: "Al-Hijr", type: "مكية", versesCount: 99, startPage: 262, juz: 14, desc: "«إِنَّا نَحْنُ نَزَّلْنَا الذِّكْرَ وَإِنَّا لَهُ لَحَافِظُونَ»، حفظ القرآن الرباني عبر الأجيال." },
  { id: 16, name: "النحل", englishName: "An-Nahl", type: "مكية", versesCount: 128, startPage: 267, juz: 14, desc: "سورة النعم الكبرى، من خلق السماوات إلى دبيب النحل والعسل فيه شفاء للناس." },
  { id: 17, name: "الإسراء", englishName: "Al-Israa", type: "مكية", versesCount: 111, startPage: 282, juz: 15, desc: "سورة بني إسرائيل ومعجزة الإسراء والمعراج من المسجد الحرام إلى المسجد الأقصى." },
  { id: 18, name: "الكهف", englishName: "Al-Kahf", type: "مكية", versesCount: 110, startPage: 293, juz: 15, desc: "نور ما بين الجمعتين وعصمة من فتنة المسيح الدجال، فيها فتن الدين والمال والعلم والسلطة." },
  { id: 19, name: "مريم", englishName: "Maryam", type: "مكية", versesCount: 98, startPage: 305, juz: 16, desc: "سورة الرحمة الإلهية بمعجزات ولادة يحيى وعيسى عليهما السلام ونقاء السيدة مريم البتول." },
  { id: 20, name: "طه", englishName: "Taa-Haa", type: "مكية", versesCount: 135, startPage: 312, juz: 16, desc: "«مَا أَنزَلْنَا عَلَيْكَ الْقُرْآنَ لِتَشْقَىٰ»، قصة كليم الله موسى ونداء الوادي المقدس طوى." },
  { id: 21, name: "الأنبياء", englishName: "Al-Anbiyaa", type: "مكية", versesCount: 112, startPage: 322, juz: 17, desc: "سورة التضرع والدعاء المستجاب، نداء يونس وأيوب وزكريا وإبراهيم عليهم السلام." },
  { id: 22, name: "الحج", englishName: "Al-Hajj", type: "مدنية", versesCount: 78, startPage: 332, juz: 17, desc: "سورة المشاعر المقدسة وشعائر الحج وتعظيم حرمات الله وتذكر زلزلة يوم القيامة." },
  { id: 23, name: "المؤمنون", englishName: "Al-Muminoon", type: "مكية", versesCount: 118, startPage: 342, juz: 18, desc: "صفات أهل الفلاح والفردوس الأعلى: الخشوع في الصلاة، الإعراض عن اللغو، وأداء الزكاة." },
  { id: 24, name: "النور", englishName: "An-Noor", type: "مدنية", versesCount: 64, startPage: 350, juz: 18, desc: "سورة الآداب والأخلاق وحفظ الأعراض، وفيها مثل نور الله العظيم في السماوات والأرض." },
  { id: 25, name: "الفرقان", englishName: "Al-Furqaan", type: "مكية", versesCount: 77, startPage: 359, juz: 18, desc: "صفات عباد الرحمن الذين يمشون على الأرض هوناً وإذا خاطبهم الجاهلون قالوا سلاماً." },
  { id: 26, name: "الشعراء", englishName: "Ash-Shu'araa", type: "مكية", versesCount: 227, startPage: 367, juz: 19, desc: "«وَإِنَّهُ لَتَنزِيلُ رَبِّ الْعَالَمِينَ نَزَلَ بِهِ الرُّوحُ الْأَمِينُ عَلَىٰ قَلْبِكَ لِتَكُونَ مِنَ الْمُنذِرِينَ»." },
  { id: 27, name: "النمل", englishName: "An-Naml", type: "مكية", versesCount: 93, startPage: 377, juz: 19, desc: "معجزات سليمان وداود وفهم منطق الطير والنمل وقصة إسلام ملكة سبأ بلقيس." },
  { id: 28, name: "القصص", englishName: "Al-Qasas", type: "مكية", versesCount: 88, startPage: 385, juz: 20, desc: "قصة نشأة موسى في قصر فرعون وعاقبة قارون الذي خسف الله به وبداره الأرض." },
  { id: 29, name: "العنكبوت", englishName: "Al-Ankaboot", type: "مكية", versesCount: 69, startPage: 396, juz: 20, desc: "سورة الابتلاء والثبات على الإيمان، ومثل الذين اتخذوا من دون الله أولياء كمثل العنكبوت." },
  { id: 30, name: "الروم", englishName: "Ar-Room", type: "مكية", versesCount: 60, startPage: 404, juz: 21, desc: "آيات الله في الآفاق والمودة والرحمة بين الزوجين وتحقق نبوءة غلبة الروم في بضع سنين." },
  { id: 31, name: "لقمان", englishName: "Luqman", type: "مكية", versesCount: 34, startPage: 411, juz: 21, desc: "وصايا لقمان الحكيم لابنه في التوحيد وبر الوالدين وإقامة الصلاة وخفض الصوت." },
  { id: 32, name: "السجدة", englishName: "As-Sajda", type: "مكية", versesCount: 30, startPage: 415, juz: 21, desc: "سورة كان يقرأها النبي ﷺ كل ليلة، فيها خضوع الجوارح لله وجزاء قيام الليل." },
  { id: 33, name: "الأحزاب", englishName: "Al-Ahzaab", type: "مدنية", versesCount: 73, startPage: 418, juz: 21, desc: "غزوة الخندق وتكالب الأعداء ونصر الله، وبيان فضل النبي ﷺ والصلاة عليه." },
  { id: 34, name: "سبأ", englishName: "Saba", type: "مكية", versesCount: 54, startPage: 428, juz: 22, desc: "قصة داود وسليمان وسيل العرم، وجزاء جحود نعم الله على قرى سبأ." },
  { id: 35, name: "فاطر", englishName: "Faatir", type: "مكية", versesCount: 45, startPage: 434, juz: 22, desc: "«يَا أَيُّهَا النَّاسُ أَنتُمُ الْفُقَرَاءُ إِلَى اللَّهِ ۖ وَاللَّهُ هُوَ الْغَنِيُّ الْحَمِيدُ»." },
  { id: 36, name: "يس", englishName: "Yaseen", type: "مكية", versesCount: 83, startPage: 440, juz: 22, desc: "قلب القرآن الكريم، تثبيت البعث والنشور وضرب الأمثال بأصحاب القرية." },
  { id: 37, name: "الصافات", englishName: "As-Saaffaat", type: "مكية", versesCount: 182, startPage: 446, juz: 23, desc: "تسبيح صفوف الملائكة وقصة فداء إسماعيل بذبح عظيم ورؤيا إبراهيم الخليل." },
  { id: 38, name: "ص", englishName: "Saad", type: "مكية", versesCount: 88, startPage: 453, juz: 23, desc: "سورة التوبة والإنابة، وتوبة داود وسليمان وصبر أيوب على البلاء." },
  { id: 39, name: "الزمر", englishName: "Az-Zumar", type: "مكية", versesCount: 75, startPage: 458, juz: 23, desc: "«قُلْ يَا عِبَادِيَ الَّذِينَ أَسْرَفُوا عَلَىٰ أَنفُسِهِمْ لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ»." },
  { id: 40, name: "غافر", englishName: "Ghafir", type: "مكية", versesCount: 85, startPage: 467, juz: 24, desc: "مفتتح الحواميم، غافر الذنب وقابل التوب شديد العقاب ذي الطول." },
  { id: 41, name: "فصلت", englishName: "Fussilat", type: "مكية", versesCount: 54, startPage: 477, juz: 24, desc: "كتاب فصلت آياته قرآناً عربياً لقوم يعلمون، وسجود الجوارح والشهادة على الإنسان." },
  { id: 42, name: "الشورى", englishName: "Ash-Shura", type: "مكية", versesCount: 53, startPage: 483, juz: 25, desc: "«وَأَمْرُهُمْ شُورَىٰ بَيْنَهُمْ»، ووحدة رسالات الأنبياء ودعوتهم إلى التوحيد." },
  { id: 43, name: "الزخرف", englishName: "Az-Zukhruf", type: "مكية", versesCount: 89, startPage: 489, juz: 25, desc: "بيان حقارة زينة الدنيا الفانية مقارنة بنعيم الجنة المقيم للأتقياء." },
  { id: 44, name: "الدخان", englishName: "Ad-Dukhaan", type: "مكية", versesCount: 59, startPage: 496, juz: 25, desc: "نزول القرآن في ليلة مباركة (ليلة القدر) وإنذار الكافرين بيوم تأتي السماء بدخان مبين." },
  { id: 45, name: "الجاثية", englishName: "Al-Jaathiya", type: "مكية", versesCount: 37, startPage: 499, juz: 25, desc: "مشهد جثوّ الأمم خاضعة بين يدي الله يوم الحساب لقراءة صحائف أعمالهم." },
  { id: 46, name: "الأحقاف", englishName: "Al-Ahqaaf", type: "مكية", versesCount: 35, startPage: 502, juz: 26, desc: "قصة هود مع قوم عاد بالأحقاف، وإسلام نفر من الجن عند سماعهم القرآن." },
  { id: 47, name: "محمد", englishName: "Muhammad", type: "مدنية", versesCount: 38, startPage: 507, juz: 26, desc: "سورة القتال وتكريم من آمنوا بما نُزّل على محمد ﷺ وهو الحق من ربهم." },
  { id: 48, name: "الفتح", englishName: "Al-Fath", type: "مدنية", versesCount: 29, startPage: 511, juz: 26, desc: "«إِنَّا فَتَحْنَا لَكَ فَتْحًا مُّبِينًا»، بشارة صلح الحديبية وفتح مكة ونصرة الإسلام." },
  { id: 49, name: "الحجرات", englishName: "Al-Hujuraat", type: "مدنية", versesCount: 18, startPage: 515, juz: 26, desc: "سورة الأخلاق الكبرى، النهي عن الغيبة والنميمة والظن والسخرية، ومقياس التقوى." },
  { id: 50, name: "ق", englishName: "Qaaf", type: "مكية", versesCount: 45, startPage: 518, juz: 26, desc: "تذكير بالبعث وقرب الله من حبل الوريد وسكرة الموت بالحق." },
  { id: 51, name: "الذاريات", englishName: "Adh-Dhaariyaat", type: "مكية", versesCount: 60, startPage: 520, juz: 26, desc: "«وَمَا خَلَقْتُ الْجِنَّ وَالْإِنسَ إِلَّا لِيَعْبُدُونِ»، وسعة الرزق المكفول من الله." },
  { id: 52, name: "الطور", englishName: "At-Toor", type: "مكية", versesCount: 49, startPage: 523, juz: 27, desc: "قسم بالطور وكتاب مسطور، ونعيم المتقين واجتماعهم مع ذرياتهم في الجنة." },
  { id: 53, name: "النجم", englishName: "An-Najm", type: "مكية", versesCount: 62, startPage: 526, juz: 27, desc: "«وَمَا يَنطِقُ عَنِ الْهَوَىٰ»، معراج النبي ﷺ ورؤيته لسدرة المنتهى وجنة المأوى." },
  { id: 54, name: "القمر", englishName: "Al-Qamar", type: "مكية", versesCount: 55, startPage: 528, juz: 27, desc: "«اقْتَرَبَتِ السَّاعَةُ وَانشَقَّ الْقَمَرُ»، «وَلَقَدْ يَسَّرْنَا الْقُرْآنَ لِلذِّكْرِ فَهَلْ مِن مُّدَّكِرٍ»." },
  { id: 55, name: "الرحمن", englishName: "Ar-Rahmaan", type: "مدنية", versesCount: 78, startPage: 531, juz: 27, desc: "عروس القرآن، تعداد آلاء الله ونعمه: «فَبِأَيِّ آلَاءِ رَبِّكُمَا تُكَذِّبَانِ»." },
  { id: 56, name: "الواقعة", englishName: "Al-Waaqia", type: "مكية", versesCount: 96, startPage: 534, juz: 27, desc: "سورة الغنى، تمنع الفقر عند قراءتها كل ليلة، وبيان مراتب الناس يوم القيامة." },
  { id: 57, name: "الحديد", englishName: "Al-Hadid", type: "مدنية", versesCount: 29, startPage: 537, juz: 27, desc: "تسبيح الكائنات، والإنفاق في سبيل الله ومقارنة نور المؤمنين بظلمة المنافقين." },
  { id: 58, name: "المجادلة", englishName: "Al-Mujaadila", type: "مدنية", versesCount: 22, startPage: 542, juz: 28, desc: "سورة كل آية فيها تذكر اسم الجلالة «الله»، وسماع الله شكوى خولة بنت ثعلبة." },
  { id: 59, name: "الحشر", englishName: "Al-Hashr", type: "مدنية", versesCount: 24, startPage: 545, juz: 28, desc: "إجلاء بني النضير، وخواتيم سورة الحشر المتضمنة لأعظم أسماء الله الحسنى." },
  { id: 60, name: "الممتحنة", englishName: "Al-Mumtahana", type: "مدنية", versesCount: 13, startPage: 549, juz: 28, desc: "أحكام الولاء والبراء، ومبايعة النساء المهاجرات لرسول الله ﷺ." },
  { id: 61, name: "الصف", englishName: "As-Saff", type: "مدنية", versesCount: 14, startPage: 551, juz: 28, desc: "وحدة الصف في الجهاد، وبشارة عيسى بنبي يأتي من بعده اسمه أحمد." },
  { id: 62, name: "الجمعة", englishName: "Al-Jumu'a", type: "مدنية", versesCount: 11, startPage: 553, juz: 28, desc: "فضل يوم الجمعة والأمر بالسعي للصلاة وترك البيع والتجارة عند النداء." },
  { id: 63, name: "المنافقون", englishName: "Al-Munaafiqoon", type: "مدنية", versesCount: 11, startPage: 554, juz: 28, desc: "فضح ألاعيب المنافقين والتحذير من إلهاء الأموال والأولاد عن ذكر الله." },
  { id: 64, name: "التغابن", englishName: "At-Taghaabun", type: "مدنية", versesCount: 18, startPage: 556, juz: 28, desc: "يوم الجمع والحساب الأعظم حيث يظهر غبن الكافرين وفوز المؤمنين." },
  { id: 65, name: "الطلاق", englishName: "At-Talaaq", type: "مدنية", versesCount: 12, startPage: 558, juz: 28, desc: "«وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا وَيَرْزُقْهُ مِنْ حَيْثُ لَا يَحْتَسِبُ»." },
  { id: 66, name: "التحريم", englishName: "At-Tahrim", type: "مدنية", versesCount: 12, startPage: 560, juz: 28, desc: "وقاية الأهل من نار وقودها الناس والحجارة، وضرب المثل بآسية امرأة فرعون ومريم." },
  { id: 67, name: "الملك", englishName: "Al-Mulk", type: "مكية", versesCount: 30, startPage: 562, juz: 29, desc: "المنجية والمانعة من عذاب القبر، تشفع لقارئها حتى يغفر له، سنة قراءتها قبل النوم." },
  { id: 68, name: "القلم", englishName: "Al-Qalam", type: "مكية", versesCount: 52, startPage: 564, juz: 29, desc: "«وَإِنَّكَ لَعَلَىٰ خُلُقٍ عَظِيمٍ»، قسم بالقلم وما يسطرون وقصة أصحاب الجنة." },
  { id: 69, name: "الحاقة", englishName: "Al-Haaqqa", type: "مكية", versesCount: 52, startPage: 566, juz: 29, desc: "أهوال القيامة الصادقة، وأخذ الكتاب باليمين للفائزين وبالشمال للخاسرين." },
  { id: 70, name: "المعارج", englishName: "Al-Ma'aarij", type: "مكية", versesCount: 44, startPage: 568, juz: 29, desc: "الصبر الجميل، وصفات المصلين الدائمين على صلاتهم المؤدين لحق السائل والمحروم." },
  { id: 71, name: "نوح", englishName: "Nooh", type: "مكية", versesCount: 28, startPage: 570, juz: 29, desc: "جهود نوح في الدعوة ألف سنة إلا خمسين عاماً، وفضل الاستغفار في نزول المطر والرزق." },
  { id: 72, name: "الجن", englishName: "Al-Jinn", type: "مكية", versesCount: 28, startPage: 572, juz: 29, desc: "«إِنَّا سَمِعْنَا قُرْآنًا عَجَبًا يَهْدِي إِلَى الرُّشْدِ»، إيمان الجن وخضوعهم لكلام الله." },
  { id: 73, name: "المزمل", englishName: "Al-Muzzammil", type: "مكية", versesCount: 20, startPage: 574, juz: 29, desc: "«قُمِ اللَّيْلَ إِلَّا قَلِيلًا»، أمر النبي بالتهجد وترتيل القرآن ترتيلاً." },
  { id: 74, name: "المدثر", englishName: "Al-Muddathir", type: "مكية", versesCount: 56, startPage: 575, juz: 29, desc: "«قُمْ فَأَنذِرْ وَرَبَّكَ فَكَبِّرْ»، بداية إعلان الدعوة والجهر بإنذار الخلق." },
  { id: 75, name: "القيامة", englishName: "Al-Qiyaama", type: "مكية", versesCount: 40, startPage: 577, juz: 29, desc: "«لَا أُقْسِمُ بِيَوْمِ الْقِيَامَةِ»، مشهد خروج الروح والتفاف الساق بالساق." },
  { id: 76, name: "الإنسان", englishName: "Al-Insaan", type: "مدنية", versesCount: 31, startPage: 578, juz: 29, desc: "خلق الإنسان وهدايته السبيل، ونعيم الأبرار وشراب الكافور والزنجبيل وسندس الجنة." },
  { id: 77, name: "المرسلات", englishName: "Al-Mursalaat", type: "مكية", versesCount: 50, startPage: 580, juz: 29, desc: "أقسام برياح الرحمة وعذاب المكذبين: «وَيْلٌ يَوْمَئِذٍ لِّلْمُكَذِّبِينَ»." },
  { id: 78, name: "النبأ", englishName: "An-Naba", type: "مكية", versesCount: 40, startPage: 582, juz: 30, desc: "مفتتح جزء عم، النبأ العظيم عن البعث والنشور وجزاء المتقين مفازاً." },
  { id: 79, name: "النازعات", englishName: "An-Naazi'aat", type: "مكية", versesCount: 46, startPage: 583, juz: 30, desc: "نزع أرواح الكفار بشدة وقبض أرواح المؤمنين بنشاط ورفق وموعد الطامة الكبرى." },
  { id: 80, name: "عبس", englishName: "Abasa", type: "مكية", versesCount: 42, startPage: 585, juz: 30, desc: "عتاب الله لنبيه في ابن أم مكتوم، وتذكير بالصاخة وفرار المرء من أخيه وأمه وأبيه." },
  { id: 81, name: "التكوير", englishName: "At-Takwir", type: "مكية", versesCount: 29, startPage: 586, juz: 30, desc: "«إِذَا الشَّمْسُ كُوِّرَتْ»، تصوير مهيب لعلامات الساعة الكبرى كأنك تراها رأي عين." },
  { id: 82, name: "الانفطار", englishName: "Al-Infitaar", type: "مكية", versesCount: 19, startPage: 587, juz: 30, desc: "«يَا أَيُّهَا الْإِنسَانُ مَا غَرَّكَ بِرَبِّكَ الْكَرِيمِ»، كراماً كاتبين يعلمون ما تفعلون." },
  { id: 83, name: "المطففين", englishName: "Al-Mutaffifin", type: "مكية", versesCount: 36, startPage: 587, juz: 30, desc: "ويل للذين يبخسون المكيال والميزان، وكتاب الأبرار في عليين مسك ورحيق مختوم." },
  { id: 84, name: "الانشقاق", englishName: "Al-Inshiqaaq", type: "مكية", versesCount: 25, startPage: 589, juz: 30, desc: "انشقاق السماء وكدح الإنسان إلى ربه كدحاً فملاقيه، والحساب اليسير." },
  { id: 85, name: "البروج", englishName: "Al-Burooj", type: "مكية", versesCount: 22, startPage: 590, juz: 30, desc: "قصة أصحاب الأخدود والصمود العظيم على التوحيد: «وَهُوَ الْغَفُورُ الْوَدُودُ»." },
  { id: 86, name: "الطارق", englishName: "At-Taariq", type: "مكية", versesCount: 17, startPage: 591, juz: 30, desc: "النجم الثاقب، وخلق الإنسان من ماء دافق، وقدرة الله على رجعه وسرائر الصدور." },
  { id: 87, name: "الأعلى", englishName: "Al-A'laa", type: "مكية", versesCount: 19, startPage: 591, juz: 30, desc: "«سَبِّحِ اسْمَ رَبِّكَ الْأَعْلَى»، سنقرئك فلا تنسى إلا ما شاء الله، صحف إبراهيم وموسى." },
  { id: 88, name: "الغاشية", englishName: "Al-Ghaashiya", type: "مكية", versesCount: 26, startPage: 592, juz: 30, desc: "وجوه يومئذ خاشعة ووجوه يومئذ ناعمة في جنة عالية لا تسمع فيها لاغية." },
  { id: 89, name: "الفجر", englishName: "Al-Fajr", type: "مكية", versesCount: 30, startPage: 593, juz: 30, desc: "قسم بالليالي العشر من ذي الحجة، «يَا أَيَّتُهَا النَّفْسُ الْمُطْمَئِنَّةُ ارْجِعِي إِلَىٰ رَبِّكِ»." },
  { id: 90, name: "البلد", englishName: "Al-Balad", type: "مكية", versesCount: 20, startPage: 594, juz: 30, desc: "قسم بمكة المكرمة، واقتحام العقبة بفك الرقاب وإطعام ذي مسغبة والتواصي بالصبر." },
  { id: 91, name: "الشمس", englishName: "Ash-Shams", type: "مكية", versesCount: 15, startPage: 595, juz: 30, desc: "أطول قسم في القرآن، «قَدْ أَفْلَحَ مَن زَكَّاهَا وَقَدْ خَابَ مَن دَسَّاهَا»." },
  { id: 92, name: "الليل", englishName: "Al-Layl", type: "مكية", versesCount: 21, startPage: 595, juz: 30, desc: "التيسير لليسرى لمن أعطى واتقى وصدق بالحسنى، والتحذير من البخل والاستغناء." },
  { id: 93, name: "الضحى", englishName: "Ad-Dhuhaa", type: "مكية", versesCount: 11, startPage: 596, juz: 30, desc: "«مَا وَدَّعَكَ رَبُّكَ وَمَا قَلَىٰ»، تسلية قلب الحبيب المصطفى وبشارة العطاء العظيم." },
  { id: 94, name: "الشرح", englishName: "Ash-Sharh", type: "مكية", versesCount: 8, startPage: 596, juz: 30, desc: "«أَلَمْ نَشْرَحْ لَكَ صَدْرَكَ»، «فَإِنَّ مَعَ الْعُسْرِ يُسْرًا إِنَّ مَعَ الْعُسْرِ يُسْرًا»." },
  { id: 95, name: "التين", englishName: "At-Tin", type: "مكية", versesCount: 8, startPage: 597, juz: 30, desc: "قسم بالتين والزيتون وطور سنين، وخلق الإنسان في أحسن تقويم." },
  { id: 96, name: "العلق", englishName: "Al-Alaq", type: "مكية", versesCount: 19, startPage: 597, juz: 30, desc: "أول ما نزل من القرآن الكريم في غار حراء: «اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ»." },
  { id: 97, name: "القدر", englishName: "Al-Qadr", type: "مكية", versesCount: 5, startPage: 598, juz: 30, desc: "فضل ليلة القدر المباركة خير من ألف شهر، سلام هي حتى مطلع الفجر." },
  { id: 98, name: "البينة", englishName: "Al-Bayyina", type: "مدنية", versesCount: 8, startPage: 598, juz: 30, desc: "«وَمَا أُمِرُوا إِلَّا لِيَعْبُدُوا اللَّهَ مُخْلِصِينَ لَهُ الدِّينَ»، جزاء خير البرية." },
  { id: 99, name: "الزلزلة", englishName: "Az-Zalzala", type: "مدنية", versesCount: 8, startPage: 599, juz: 30, desc: "«إِذَا زُلْزِلَتِ الْأَرْضُ زِلْزَالَهَا»، وزن مثقال الذرة من خير أو شر في الميزان." },
  { id: 100, name: "العاديات", englishName: "Al-Aadiyaat", type: "مكية", versesCount: 11, startPage: 599, juz: 30, desc: "قسم بخيل الجهاد تعدو ضبحاً، وتحذير الإنسان من كنود نعم ربه وشدة حب المال." },
  { id: 101, name: "القارعة", englishName: "Al-Qaari'a", type: "مكية", versesCount: 11, startPage: 600, juz: 30, desc: "«مَا الْقَارِعَةُ»، ثقل الموازين بالحسنات عيشة راضية وخفتها هاوية ونار حامية." },
  { id: 102, name: "التكاثر", englishName: "At-Takaathur", type: "مكية", versesCount: 8, startPage: 600, juz: 30, desc: "«أَلْهَاكُمُ التَّكَاثُرُ حَتَّىٰ زُرْتُمُ الْمَقَابِرَ»، والسؤال الحتمي عن النعيم." },
  { id: 103, name: "العصر", englishName: "Al-Asr", type: "مكية", versesCount: 3, startPage: 601, juz: 30, desc: "دستور النجاة الرباني: الإيمان، والعمل الصالح، والتواصي بالحق، والتواصي بالصبر." },
  { id: 104, name: "الهمزة", englishName: "Al-Humaza", type: "مكية", versesCount: 9, startPage: 601, juz: 30, desc: "ويل لكل همزة لمزة الذي جمع مالاً وعدده، والحطمة الموقدة التي تطلع على الأفئدة." },
  { id: 105, name: "الفيل", englishName: "Al-Feel", type: "مكية", versesCount: 5, startPage: 601, juz: 30, desc: "حماية بيت الله الحرام من كيد أبرهة الحبشي وجيش الفيل بطير أبابيل." },
  { id: 106, name: "قريش", englishName: "Quraish", type: "مكية", versesCount: 4, startPage: 602, juz: 30, desc: "«فَلْيَعْبُدُوا رَبَّ هَٰذَا الْبَيْتِ الَّذِي أَطْعَمَهُم مِّن جُوعٍ وَآمَنَهُم مِّنْ خَوْفٍ»." },
  { id: 107, name: "الماعون", englishName: "Al-Maa'oon", type: "مكية", versesCount: 7, startPage: 602, juz: 30, desc: "التحذير من إيذاء اليتيم، وسهو المصلين المرائين الذين يمنعون الماعون." },
  { id: 108, name: "الكوثر", englishName: "Al-Kawthar", type: "مكية", versesCount: 3, startPage: 602, juz: 30, desc: "أقصر سورة في القرآن، بشارة نهر الكوثر للنبي ﷺ والأمر بالصلاة والنحر." },
  { id: 109, name: "الكافرون", englishName: "Al-Kaafiroon", type: "مكية", versesCount: 6, startPage: 603, juz: 30, desc: "براءة تامة من الشرك وأهله: «لَكُمْ دِينُكُمْ وَلِيَ دِينِ»." },
  { id: 110, name: "النصر", englishName: "An-Nasr", type: "مدنية", versesCount: 3, startPage: 603, juz: 30, desc: "إذا جاء نصر الله والفتح، ونعي رسول الله ﷺ والأمر بالتسبيح والاستغفار." },
  { id: 111, name: "المسد", englishName: "Al-Masad", type: "مكية", versesCount: 5, startPage: 603, juz: 30, desc: "تبت يدا أبي لهب وتب، وهلاك الكافرين وجزاء أعداء الإسلام." },
  { id: 112, name: "الإخلاص", englishName: "Al-Ikhlaas", type: "مكية", versesCount: 4, startPage: 604, juz: 30, desc: "تعدل ثلث القرآن الكريم، صفة الرحمن الأحد الصمد لم يلد ولم يولد." },
  { id: 113, name: "الفلق", englishName: "Al-Falaq", type: "مكية", versesCount: 5, startPage: 604, juz: 30, desc: "الاستعاذة برب الفلق من شر ما خلق ومن شر غاسق إذا وقب ومن شر النفاثات في العقد والحاسدين." },
  { id: 114, name: "الناس", englishName: "An-Naas", type: "مكية", versesCount: 6, startPage: 604, juz: 30, desc: "خاتمة المصحف الشريف، الاستعاذة برب الناس ملك الناس إله الناس من شر الوسواس الخناس." }
];

// Major Arab & Islamic Cities for Prayer Times SEO
const CITIES = [
  { slug: "makkah", name: "مكة المكرمة", country: "السعودية" },
  { slug: "madinah", name: "المدينة المنورة", country: "السعودية" },
  { slug: "jerusalem", name: "القدس الشريف", country: "فلسطين" },
  { slug: "riyadh", name: "الرياض", country: "السعودية" },
  { slug: "cairo", name: "القاهرة", country: "مصر" },
  { slug: "dubai", name: "دبي", country: "الإمارات" },
  { slug: "amman", name: "عمّان", country: "الأردن" },
  { slug: "kuwait", name: "الكويت", country: "الكويت" },
  { slug: "doha", name: "الدوحة", country: "قطر" },
  { slug: "muscat", name: "مسقط", country: "عمان" },
  { slug: "damascus", name: "دمشق", country: "سوريا" },
  { slug: "baghdad", name: "بغداد", country: "العراق" },
  { slug: "beirut", name: "بيروت", country: "لبنان" },
  { slug: "tripoli", name: "طرابلس", country: "ليبيا" },
  { slug: "tunis", name: "تونس", country: "تونس" },
  { slug: "algiers", name: "الجزائر", country: "الجزائر" },
  { slug: "rabat", name: "الرباط", country: "المغرب" },
  { slug: "khartoum", name: "الخرطوم", country: "السودان" },
  { slug: "sanaa", name: "صنعاء", country: "اليمن" },
  { slug: "istanbul", name: "إسطنبول", country: "تركيا" },
  { slug: "manama", name: "المنامة", country: "البحرين" },
  { slug: "alexandria", name: "الإسكندرية", country: "مصر" },
  { slug: "jeddah", name: "جدة", country: "السعودية" },
  { slug: "dammam", name: "الدمام", country: "السعودية" },
  { slug: "gaza", name: "غزة العزة", country: "فلسطين" },
  { slug: "hebron", name: "الخليل", country: "فلسطين" },
  { slug: "nablus", name: "نابلس", country: "فلسطين" },
  { slug: "casablanca", name: "الدار البيضاء", country: "المغرب" },
  { slug: "london", name: "لندن", country: "المملكة المتحدة" },
  { slug: "paris", name: "باريس", country: "فرنسا" }
];

// Core Adhkar & Duas Pages
const ADHKAR_DUAS = [
  { slug: "adhkar-sabah", title: "أذكار الصباح كاملة مكتوبة ومسموعة بالترتيب الصحيح", category: "أذكار", desc: "أذكار الصباح الصحيحة من حصن المسلم مع فضل كل ذكر وعداد التسبيح، قراءة واستماع." },
  { slug: "adhkar-masaa", title: "أذكار المساء الصحيحة مكتوبة حصن المسلم كاملة", category: "أذكار", desc: "أذكار المساء الصحيحة الثابتة عن النبي ﷺ مع فضائلها وأوقاتها لتحصين النفس والبيت." },
  { slug: "adhkar-nawm", title: "أذكار النوم وسورة الملك كاملة مكتوبة قبل النوم", category: "أذكار", desc: "أذكار النوم الصحيحة وسورة تبارك المانعة من عذاب القبر وآية الكرسي والمعوذات." },
  { slug: "adhkar-salah", title: "الأذكار بعد الصلاة المفروضة الصحيحة مكتوبة", category: "أذكار", desc: "الأذكار والأدعية الثابتة بعد السلام من الصلاة المكتوبة، الاستغفار والتسبيح والتهليل." },
  { slug: "adhkar-istiyqadh", title: "أذكار الاستيقاظ من النوم وفضل الحمد والشكر", category: "أذكار", desc: "أذكار الاستيقاظ: الحمد لله الذي أحيانا بعد ما أماتنا وإليه النشور، ودعاء الفجر." },
  { slug: "dua-mayyit", title: "دعاء للميت مكتوب ومستجاب بالرحمة والمغفرة ونور القبر", category: "أدعية", desc: "أفضل أدعية للميت والمغفور لهم بإذن الله، دعاء جامع للأموات ينور قبورهم ويرفع درجاتهم." },
  { slug: "dua-ahmed-al-amoudi", title: "دعاء لفقيدنا أحمد منتصر العامودي - صدقة جارية ونور بالجنة", category: "أدعية", desc: "دعاء مستجاب ومبارك للمتوفى أحمد منتصر العامودي رحمه الله، صدقة جارية وإهداء ثواب القرآن." },
  { slug: "dua-walidayn", title: "دعاء للوالدين بالصحة والعافية والمغفرة وبرهم أحياء وأمواتاً", category: "أدعية", desc: "أدعية مباركة لبر الوالدين ورفع درجاتهم في الجنة، ربي ارحمهما كما ربياني صغيراً." },
  { slug: "dua-istikharah", title: "دعاء الاستخارة الصحيح وكيفية صلاة الاستخارة خطوة بخطوة", category: "أدعية", desc: "نص دعاء صلاة الاستخارة مكتوب كاملاً مع شرح كيفية أدائها وأوقاتها وحكمها." },
  { slug: "sayyid-istighfar", title: "سيد الاستغفار مكتوب وفضله العظيم لمغفرة الذنوب", category: "استغفار", desc: "صيغة سيد الاستغفار وفضله: من قاله حين يمسي فمات دخل الجنة، ومن قاله حين يصبح." },
  { slug: "dua-khatm-quran", title: "دعاء ختم القرآن الكريم كاملاً مكتوب ومؤثر", category: "أدعية", desc: "دعاء ختم القرآن الكريم كما ورد عن أئمة الحرم المكي الشريف مكتوب كامل لختمة مباركة." },
  { slug: "dua-rizq", title: "دعاء الرزق وتيسير الأمور وقضاء الديون والبركة بالمال", category: "أدعية", desc: "أدعية جلب الرزق الحلال وتفريج الكروب وسداد الدين مجربة ومأثورة عن السلف الصالح." },
  { slug: "dua-shifa", title: "دعاء الشفاء من المرض ورفع البلاء والرقية الشرعية", category: "أدعية", desc: "دعاء للمريض بالشفاء العاجل وآيات الشفاء الست والرقية الشرعية من الكتاب والسنة." },
  { slug: "dua-faraj", title: "دعاء تفريج الهم والكرب والحزن والضيق مستجاب فوراً", category: "أدعية", desc: "دعاء ذي النون: لا إله إلا أنت سبحانك إني كنت من الظالمين، ودعاء إزالة الهم والحزن." },
  { slug: "dua-jumaa", title: "أدعية يوم الجمعة المستجابة وساعة الاستجابة وسورة الكهف", category: "أدعية", desc: "أفضل أدعية عصر يوم الجمعة والصلاة على النبي ﷺ وقراءة سورة الكهف لنيل النور والرحمة." },
  { slug: "duas-quran", title: "أدعية القرآن الكريم كاملة مرتبة حسب السور", category: "أدعية", desc: "جميع الأدعية التي وردت في القرآن الكريم على لسان الأنبياء والصالحين مكتوبة." },
  { slug: "duas-nabawiyya", title: "أدعية نبوية صحيحة جامعة من صحيح البخاري ومسلم", category: "أدعية", desc: "جوامع كلم النبي ﷺ من الأدعية الصحيحة الجامعة لخيري الدنيا والآخرة." },
  { slug: "hisn-almuslim", title: "حصن المسلم كاملاً من أذكار الكتاب والسنة", category: "أذكار", desc: "كتاب حصن المسلم الميسر كاملاً بكافة أبوابه وفصوله للقراءة والاستماع اليومي." },
  { slug: "tasbeeh-online", title: "المسبحة الإلكترونية الذكية والتسبيح اليومي مع عداد اللمس", category: "تسبيح", desc: "مسبحة إلكترونية متطورة تدعم اللمس والصوت لذكر الله وحفظ عدد التسبيحات والاستغفار." },
  { slug: "istighfar-online", title: "محراب الاستغفار اليومي ومحاسبة النفس والتوبة النصوح", category: "استغفار", desc: "محراب الاستغفار الإلكتروني لتحديد أهداف الاستغفار اليومية ونيل مغفرة الله وفضله." },
  { slug: "khatmah-plan", title: "خطة ختم القرآن الكريم في شهر أو أسبوعين وجدول الحفظ", category: "قرآن", desc: "جدول يومي لتنظيم ورد قراءة القرآن وختمه بانتظام مع اختبار التسميع ومُعين الحفظ." },
  { slug: "sadaqah-jariyah", title: "مشروع أثر | صدقة جارية عن أحمد منتصر العامودي لوجه الله", category: "صدقة", desc: "منصة إسلامية متكاملة خالية 100% من الإعلانات صدقة جارية عن روح أحمد منتصر العامودي." },
  { slug: "ayat-al-kursi", title: "آية الكرسي كاملة مكتوبة ومسموعة مكررة وفضلها العظيم", category: "قرآن", desc: "أعظم آية في كتاب الله الكريم، قراءتها دبر كل صلاة تحفظ المسلم وتدخله الجنة." },
  { slug: "surah-al-kahf-jumaa", title: "سورة الكهف مكتوبة كاملة بالرسم العثماني ليوم الجمعة", category: "قرآن", desc: "قراءة سورة الكهف يوم الجمعة مكتوبة بخط المصحف الشريف واستماع تلاوة ياسر الدوسري." },
  { slug: "surah-al-mulk-nawm", title: "سورة الملك مكتوبة كاملة واستماع قبل النوم للمنجية", category: "قرآن", desc: "سورة الملك تبارك الذي بيده الملك، المنجية من عذاب القبر مكتوبة ومسموعة للنوم." }
];

const pad = (num, size = 3) => {
  let s = String(num);
  while (s.length < size) s = "0" + s;
  return s;
};

// Base Page HTML Template Generator
function renderSeoHtml({
  title,
  description,
  keywords,
  canonicalUrl,
  ogType = "website",
  audioUrl = null,
  h1,
  badge,
  contentHtml,
  breadcrumbs = [],
  schemaJson = {}
}) {
  return `<!doctype html>
<html lang="ar" dir="rtl" class="scroll-smooth">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <meta name="title" content="${title}" />
  <meta name="description" content="${description}" />
  <meta name="keywords" content="${keywords}" />
  <meta name="author" content="منصة أثر - صدقة جارية عن أحمد منتصر العامودي" />
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
  <link rel="canonical" href="${canonicalUrl}" />

  <!-- Open Graph / Social Sharing -->
  <meta property="og:type" content="${ogType}" />
  <meta property="og:url" content="${canonicalUrl}" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:image" content="https://athar-app.org/athar-logo.jpg" />
  <meta property="og:locale" content="ar_AR" />
  <meta property="og:site_name" content="موقع أثر" />
  ${audioUrl ? `<meta property="og:audio" content="${audioUrl}" />` : ''}

  <!-- Favicon & PWA -->
  <link rel="icon" type="image/jpeg" href="/athar-logo.jpg" />
  <link rel="apple-touch-icon" href="/athar-logo.jpg" />
  <meta name="theme-color" content="#0B3D2E" />

  <!-- Google Fonts: Amiri for Quran calligraphy, Cairo for modern Arabic UI -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Amiri+Quran&family=Amiri:wght@400;700&family=Cairo:wght@400;600;700;800;900&display=swap" rel="stylesheet" />

  <!-- Schema.org Structured Data -->
  <script type="application/ld+json">
  ${JSON.stringify(schemaJson, null, 2)}
  </script>

  <style>
    :root {
      --emerald-deep: #0B3D2E;
      --emerald-medium: #135D46;
      --emerald-soft: rgba(19, 93, 70, 0.08);
      --emerald-border: rgba(19, 93, 70, 0.2);
      --gold-primary: #D4AF37;
      --gold-light: #F9E79F;
      --gold-dark: #9A7B1C;
      --gold-soft: rgba(212, 175, 55, 0.12);
      --gold-border: rgba(212, 175, 55, 0.3);
      --bg-cream: #FAF8F5;
      --text-main: #1C2826;
      --text-muted: #5A6B66;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Cairo', sans-serif;
      background-color: var(--bg-cream);
      color: var(--text-main);
      line-height: 1.8;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .font-quran { font-family: 'Amiri Quran', 'Amiri', serif; }
    .font-amiri { font-family: 'Amiri', serif; }
    .container { max-width: 900px; margin: 0 auto; padding: 24px 16px; width: 100%; }
    .header-bar {
      background: rgba(255, 255, 255, 0.92);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--emerald-border);
      position: sticky;
      top: 0;
      z-index: 50;
      padding: 12px 20px;
    }
    .header-inner {
      max-width: 1100px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
    }
    .brand-link {
      display: flex;
      align-items: center;
      gap: 12px;
      text-decoration: none;
      color: inherit;
    }
    .brand-img {
      width: 44px;
      height: 44px;
      border-radius: 14px;
      border: 1px solid var(--gold-border);
      object-fit: cover;
    }
    .brand-title {
      font-size: 22px;
      font-weight: 800;
      color: var(--emerald-deep);
    }
    .brand-badge {
      font-size: 11px;
      background: var(--gold-soft);
      color: var(--gold-dark);
      padding: 2px 10px;
      border-radius: 999px;
      border: 1px solid var(--gold-border);
      font-weight: 700;
    }
    .nav-btn {
      background: var(--emerald-deep);
      color: #fff;
      padding: 8px 18px;
      border-radius: 12px;
      text-decoration: none;
      font-size: 13px;
      font-weight: 700;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      transition: all 0.2s;
    }
    .nav-btn:hover { background: var(--emerald-medium); }
    .hero-card {
      background: linear-gradient(135deg, var(--emerald-deep), #06231A);
      color: #fff;
      border-radius: 24px;
      padding: 32px 24px;
      border: 1px solid var(--gold-border);
      box-shadow: 0 10px 25px rgba(11, 61, 46, 0.15);
      margin-bottom: 24px;
      text-align: center;
    }
    .badge-pill {
      display: inline-block;
      background: rgba(255, 255, 255, 0.12);
      color: var(--gold-light);
      padding: 4px 14px;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 700;
      margin-bottom: 12px;
      border: 1px solid var(--gold-border);
    }
    .content-card {
      background: #fff;
      border-radius: 20px;
      padding: 28px;
      border: 1px solid rgba(0, 0, 0, 0.06);
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);
      margin-bottom: 24px;
    }
    .audio-player-box {
      background: var(--gold-soft);
      border: 1px solid var(--gold-border);
      border-radius: 16px;
      padding: 16px;
      margin: 20px 0;
      text-align: center;
    }
    audio { width: 100%; outline: none; margin-top: 10px; }
    .btn-gold {
      background: linear-gradient(135deg, var(--gold-primary), var(--gold-dark));
      color: #0B3D2E;
      padding: 10px 22px;
      border-radius: 14px;
      font-weight: 800;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      transition: all 0.2s;
      border: 1px solid var(--gold-border);
    }
    .btn-outline {
      background: var(--emerald-soft);
      color: var(--emerald-deep);
      border: 1px solid var(--emerald-border);
      padding: 10px 20px;
      border-radius: 14px;
      font-weight: 700;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
    }
    .breadcrumbs {
      font-size: 12px;
      color: var(--text-muted);
      margin-bottom: 16px;
      display: flex;
      gap: 8px;
      align-items: center;
      flex-wrap: wrap;
    }
    .breadcrumbs a { color: var(--emerald-deep); text-decoration: none; font-weight: 600; }
    .dedication-footer {
      background: #fff;
      border-top: 1px solid var(--emerald-border);
      padding: 32px 20px;
      text-align: center;
      margin-top: 40px;
    }
    .dedication-box {
      max-width: 700px;
      margin: 0 auto;
      background: var(--emerald-soft);
      border: 1px solid var(--emerald-border);
      border-radius: 18px;
      padding: 20px;
      font-size: 13px;
    }
    .surah-text-box {
      background: #FDFCF7;
      border: 2px solid #EAE3D2;
      border-radius: 16px;
      padding: 24px;
      font-size: 22px;
      line-height: 2.3;
      text-align: justify;
      color: #1a2a22;
    }
    @media (max-width: 640px) {
      .brand-badge { display: none; }
      .hero-card { padding: 24px 16px; }
      .content-card { padding: 20px 16px; }
    }
  </style>
</head>
<body>

  <!-- Top Header Navigation -->
  <header class="header-bar">
    <div class="header-inner">
      <a href="/" class="brand-link">
        <img src="/athar-logo.jpg" alt="شعار منصة أثر - صدقة جارية عن أحمد منتصر العامودي" class="brand-img" />
        <div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <span class="brand-title font-quran">أَثَـر</span>
            <span class="brand-badge">صدقة جارية عن أحمد منتصر العامودي</span>
          </div>
        </div>
      </a>

      <div style="display: flex; align-items: center; gap: 10px;">
        <a href="/" class="nav-btn">
          <span>دخول المنصة الشاملة</span>
        </a>
      </div>
    </div>
  </header>

  <main class="container">

    <!-- Breadcrumb Navigation for SEO -->
    <nav class="breadcrumbs" aria-label="مسار التنقل">
      <a href="/">الرئيسية</a>
      <span>/</span>
      ${breadcrumbs.map((b, i) => (i === breadcrumbs.length - 1 ? `<span>${b.label}</span>` : `<a href="${b.url}">${b.label}</a><span>/</span>`)).join('')}
    </nav>

    <!-- Main Hero Banner -->
    <section class="hero-card">
      <span class="badge-pill">${badge}</span>
      <h1 style="font-size: 26px; font-weight: 900; margin-bottom: 12px; color: #fff;">${h1}</h1>
      <p style="font-size: 14px; color: rgba(255, 255, 255, 0.85); max-width: 650px; margin: 0 auto 18px;" class="font-amiri">
        «أَثَـرٌ يَبْقَى .. وَأَجْـرٌ يَرْقَى» — استمع واقرأ وانشر لتنال الأجر الجاري بإذن الله تعالى.
      </p>

      <div style="display: flex; justify-content: center; gap: 12px; flex-wrap: wrap;">
        <a href="/" class="btn-gold">
          <span>تصفح المصحف كاملاً</span>
        </a>
      </div>
    </section>

    <!-- Dynamic Content Body -->
    ${contentHtml}

  </main>

  <!-- Perpetual Charity Dedication Footer -->
  <footer class="dedication-footer">
    <div class="dedication-box">
      <p style="font-weight: 800; color: var(--emerald-deep); margin-bottom: 6px;" class="font-quran">
        «صدقة جارية عن روح الفقيد: أحمد منتصر العامودي (رحمه الله وغفر له)»
      </p>
      <p style="color: var(--text-muted); font-size: 12px;" class="font-amiri">
        اللَّهُمَّ اغْفِرْ لَهُ وَارْحَمْهُ وَعَافِهِ وَاعْفُ عَنْهُ، وَاجْعَلْ قَبْرَهُ رَوْضَةً مِنْ رِيَاضِ الجَنَّةِ، وَاجْعَلْ ثَوَابَ هَذَا القُرْآنِ نُورًا وَأُنْسًا لَهُ فِي بَرْزَخِهِ إِلَى يَوْمِ القِيَامَةِ.
      </p>
    </div>
    <p style="font-size: 11px; color: #8C9B96; margin-top: 16px;">
      منصة أثر القرآنية © ${new Date().getFullYear()} • خالية 100% من الإعلانات التجارية لوجه الله تعالى.
    </p>
  </footer>

</body>
</html>`;
}

// Store all generated page URLs for sitemap.xml
const sitemapUrls = [
  { loc: "https://athar-app.org/", priority: "1.0", changefreq: "daily" }
];

console.log("Generating 400+ SEO Pages for Athar Platform...");

// -------------------------------------------------------------
// 1. GENERATE 114 SURAH MP3 AUDIO PAGES
// -------------------------------------------------------------
for (const surah of SURAHS) {
  const fileName = `mp3-surah-${surah.id}.html`;
  const canonicalUrl = `https://athar-app.org/${fileName}`;
  const audioUrl = `https://server11.mp3quran.net/yasser/${pad(surah.id, 3)}.mp3`;
  const alafasyUrl = `https://server8.mp3quran.net/afs/${pad(surah.id, 3)}.mp3`;

  const schemaJson = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "AudioObject",
        "@id": `${canonicalUrl}#audio`,
        "name": `تلاوة سورة ${surah.name} mp3 - الشيخ ياسر الدوسري`,
        "description": `استماع وتحميل تلاوة سورة ${surah.name} بصوت الشيخ ياسر الدوسري mp3 بجودة عالية بدون إعلانات.`,
        "contentUrl": audioUrl,
        "encodingFormat": "audio/mpeg",
        "inLanguage": "ar",
        "author": {
          "@type": "Person",
          "name": "الشيخ ياسر الدوسري"
        }
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "الرئيسية", "item": "https://athar-app.org/" },
          { "@type": "ListItem", "position": 2, "name": "المصحف المرتل mp3", "item": "https://athar-app.org/?tab=quran" },
          { "@type": "ListItem", "position": 3, "name": `سورة ${surah.name} mp3`, "item": canonicalUrl }
        ]
      }
    ]
  };

  const contentHtml = `
    <article class="content-card">
      <h2 style="font-size: 20px; font-weight: 800; color: var(--emerald-deep); margin-bottom: 8px;">
        استمع الآن إلى سورة ${surah.name} بصوت الشيخ ياسر الدوسري
      </h2>
      <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 16px;">
        رواية حفص عن عاصم • جودة صوت عالية واستماع مباشر أو تحميل مجاني.
      </p>

      <div class="audio-player-box">
        <span style="font-size: 13px; font-weight: 700; color: var(--gold-dark); display: block; margin-bottom: 4px;">
          المشغل المباشر (تلاوة الشيخ ياسر الدوسري):
        </span>
        <audio controls preload="none">
          <source src="${audioUrl}" type="audio/mpeg" />
          متصفحك لا يدعم تشغيل الصوت المباشر.
        </audio>
      </div>

      <div style="display: flex; gap: 10px; flex-wrap: wrap; margin-top: 18px;">
        <a href="${audioUrl}" download="Surah-${surah.name}-Yasser-Dossari.mp3" class="btn-gold" target="_blank" rel="noopener">
          <span>تحميل سورة ${surah.name} mp3</span>
        </a>
        <a href="/surah-${surah.id}.html" class="btn-outline">
          <span>قراءة سورة ${surah.name} مكتوبة</span>
        </a>
        <a href="/tafsir-surah-${surah.id}.html" class="btn-outline">
          <span>تفسير سورة ${surah.name}</span>
        </a>
        <a href="/?tab=quran&surah=${surah.id}&play=true" class="btn-outline" style="background: var(--emerald-deep); color: #fff;">
          <span>تشغيل في التطبيق التفاعلي</span>
        </a>
      </div>
    </article>

    <section class="content-card">
      <h3 style="font-size: 18px; font-weight: 800; color: var(--emerald-deep); margin-bottom: 12px;">
        نبذة ومعلومات عن سورة ${surah.name}
      </h3>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 12px; margin-bottom: 18px;">
        <div style="background: var(--bg-cream); padding: 12px; border-radius: 12px; border: 1px solid #eee;">
          <span style="font-size: 11px; color: var(--text-muted); display: block;">رقم السورة</span>
          <strong style="font-size: 16px; color: var(--emerald-deep);">${surah.id}</strong>
        </div>
        <div style="background: var(--bg-cream); padding: 12px; border-radius: 12px; border: 1px solid #eee;">
          <span style="font-size: 11px; color: var(--text-muted); display: block;">النوع</span>
          <strong style="font-size: 16px; color: var(--emerald-deep);">${surah.type}</strong>
        </div>
        <div style="background: var(--bg-cream); padding: 12px; border-radius: 12px; border: 1px solid #eee;">
          <span style="font-size: 11px; color: var(--text-muted); display: block;">عدد الآيات</span>
          <strong style="font-size: 16px; color: var(--emerald-deep);">${surah.versesCount} آية</strong>
        </div>
        <div style="background: var(--bg-cream); padding: 12px; border-radius: 12px; border: 1px solid #eee;">
          <span style="font-size: 11px; color: var(--text-muted); display: block;">الجزء</span>
          <strong style="font-size: 16px; color: var(--emerald-deep);">الجزء ${surah.juz}</strong>
        </div>
      </div>
      <p style="font-size: 14px; color: var(--text-main); leading-relaxed;" class="font-amiri">
        ${surah.desc}
      </p>
    </section>

    <section class="content-card">
      <h3 style="font-size: 17px; font-weight: 800; color: var(--emerald-deep); margin-bottom: 12px;">
        تلاوات وقراء آخرون لسورة ${surah.name}
      </h3>
      <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 14px;">
        يمكنك أيضاً الاستماع لسورة ${surah.name} بأصوات كبار قراء العالم الإسلامي:
      </p>
      <div style="display: flex; gap: 8px; flex-wrap: wrap;">
        <span class="btn-outline" style="font-size: 12px;">الشيخ ياسر الدوسري</span>
        <span class="btn-outline" style="font-size: 12px;">الشيخ مشاري راشد العفاسي</span>
        <span class="btn-outline" style="font-size: 12px;">الشيخ عبد الباسط عبد الصمد</span>
        <span class="btn-outline" style="font-size: 12px;">الشيخ ماهر المعيقلي</span>
        <span class="btn-outline" style="font-size: 12px;">الشيخ سعد الغامدي</span>
        <span class="btn-outline" style="font-size: 12px;">الشيخ محمد صديق المنشاوي</span>
      </div>
    </section>
  `;

  const html = renderSeoHtml({
    title: `سورة ${surah.name} mp3 تلاوة الشيخ ياسر الدوسري | استماع وتحميل مباشر - موقع أثر`,
    description: `استمع وحمّل سورة ${surah.name} mp3 كاملة بصوت الشيخ ياسر الدوسري بجودة عالية بدون إعلانات. القرآن الكريم كاملاً برواية حفص عن عاصم - موقع أثر صدقة جارية عن أحمد منتصر العامودي.`,
    keywords: `سورة ${surah.name} mp3, تحميل سورة ${surah.name}, استماع سورة ${surah.name} ياسر الدوسري, سورة ${surah.name} كاملة, تلاوة خاشعة سورة ${surah.name}, موقع أثر, صدقة جارية عن أحمد منتصر العامودي`,
    canonicalUrl,
    ogType: "music.song",
    audioUrl,
    h1: `سورة ${surah.name} mp3 بصوت الشيخ ياسر الدوسري`,
    badge: `المصحف المرتل • سورة ${surah.type}`,
    contentHtml,
    breadcrumbs: [
      { label: "المصحف المرتل", url: "/?tab=quran" },
      { label: `سورة ${surah.name} mp3`, url: canonicalUrl }
    ],
    schemaJson
  });

  fs.writeFileSync(path.join(publicDir, fileName), html, 'utf-8');
  sitemapUrls.push({ loc: canonicalUrl, priority: "0.9", changefreq: "weekly" });
}

// -------------------------------------------------------------
// 2. GENERATE 114 SURAH READING / TEXT PAGES
// -------------------------------------------------------------
for (const surah of SURAHS) {
  const fileName = `surah-${surah.id}.html`;
  const canonicalUrl = `https://athar-app.org/${fileName}`;

  const schemaJson = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${canonicalUrl}#article`,
        "headline": `قراءة سورة ${surah.name} مكتوبة بالرسم العثماني كاملة`,
        "description": `اقرأ سورة ${surah.name} كاملة مكتوبة بالخط العثماني برواية حفص عن عاصم، عدد آياتها ${surah.versesCount}، سورة ${surah.type}.`,
        "inLanguage": "ar",
        "publisher": {
          "@type": "Organization",
          "name": "منصة أثر",
          "logo": { "@type": "ImageObject", "url": "https://athar-app.org/athar-logo.jpg" }
        }
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "الرئيسية", "item": "https://athar-app.org/" },
          { "@type": "ListItem", "position": 2, "name": "المصحف الشريف", "item": "https://athar-app.org/?tab=quran" },
          { "@type": "ListItem", "position": 3, "name": `سورة ${surah.name}`, "item": canonicalUrl }
        ]
      }
    ]
  };

  const contentHtml = `
    <article class="content-card">
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #eee; padding-bottom: 12px; margin-bottom: 16px;">
        <div>
          <h2 style="font-size: 22px; font-weight: 800; color: var(--emerald-deep);">
            سورة ${surah.name} بالرسم العثماني
          </h2>
          <span style="font-size: 12px; color: var(--text-muted);">
            سورة ${surah.type} • آياتها ${surah.versesCount} • صفحة ${surah.startPage} • الجزء ${surah.juz}
          </span>
        </div>
        <a href="/mp3-surah-${surah.id}.html" class="btn-gold" style="font-size: 12px; padding: 8px 14px;">
          <span>استماع mp3</span>
        </a>
      </div>

      <!-- Basmalah -->
      ${surah.id !== 9 ? `
        <div style="text-align: center; margin: 20px 0; color: var(--emerald-deep); font-size: 24px;" class="font-quran">
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </div>
      ` : ''}

      <div class="surah-text-box font-quran">
        <p>
          اقرأ سورة ${surah.name} كاملة بترتيل وتدبر عبر منصة أثر المباركة بخط مصحف مجمع الملك فهد لطباعة المصحف الشريف.
          تتضمن هذه السورة العظيمة ${surah.versesCount} آية من كلام الله العظيم المحفوظ، وهي سورة ${surah.type} تبدأ من الصفحة رقم ${surah.startPage}.
        </p>
      </div>

      <div style="display: flex; gap: 10px; flex-wrap: wrap; margin-top: 20px;">
        <a href="/?tab=quran&surah=${surah.id}" class="btn-gold">
          <span>فتح المصحف التفاعلي الإلكتروني</span>
        </a>
        <a href="/mp3-surah-${surah.id}.html" class="btn-outline">
          <span>استماع وتحميل mp3 بصوت ياسر الدوسري</span>
        </a>
        <a href="/tafsir-surah-${surah.id}.html" class="btn-outline">
          <span>التفسير الميسر لسورة ${surah.name}</span>
        </a>
      </div>
    </article>

    <section class="content-card">
      <h3 style="font-size: 18px; font-weight: 800; color: var(--emerald-deep); margin-bottom: 10px;">
        فضائل ومقاصد سورة ${surah.name}
      </h3>
      <p style="font-size: 14px; color: var(--text-main); leading-relaxed;" class="font-amiri">
        ${surah.desc}
      </p>
    </section>
  `;

  const html = renderSeoHtml({
    title: `سورة ${surah.name} مكتوبة كاملة بالرسم العثماني | قراءة وتفسير - موقع أثر`,
    description: `اقرأ سورة ${surah.name} مكتوبة كاملة بالخط العثماني كما في مصحف المدينة المنورة برواية حفص عن عاصم، مع التفسير الميسر والاستماع بصوت ياسر الدوسري - موقع أثر صدقة جارية عن أحمد منتصر العامودي.`,
    keywords: `سورة ${surah.name} مكتوبة, قراءة سورة ${surah.name}, سورة ${surah.name} كاملة, سورة ${surah.name} بالتشكيل, مصحف المدينة سورة ${surah.name}, موقع أثر, صدقة جارية عن أحمد منتصر العامودي`,
    canonicalUrl,
    ogType: "article",
    h1: `سورة ${surah.name} مكتوبة بالرسم العثماني`,
    badge: `المصحف الشريف • سورة ${surah.type}`,
    contentHtml,
    breadcrumbs: [
      { label: "المصحف الشريف", url: "/?tab=quran" },
      { label: `سورة ${surah.name}`, url: canonicalUrl }
    ],
    schemaJson
  });

  fs.writeFileSync(path.join(publicDir, fileName), html, 'utf-8');
  sitemapUrls.push({ loc: canonicalUrl, priority: "0.9", changefreq: "weekly" });
}

// -------------------------------------------------------------
// 3. GENERATE 114 SURAH TAFSIR PAGES
// -------------------------------------------------------------
for (const surah of SURAHS) {
  const fileName = `tafsir-surah-${surah.id}.html`;
  const canonicalUrl = `https://athar-app.org/${fileName}`;

  const schemaJson = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${canonicalUrl}#article`,
        "headline": `تفسير سورة ${surah.name} الميسر ومعاني كلماتها`,
        "description": `تفسير سورة ${surah.name} الميسر والمختصر وبيان مقاصد آياتها وأسباب نزولها وفضلها.`,
        "inLanguage": "ar"
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "الرئيسية", "item": "https://athar-app.org/" },
          { "@type": "ListItem", "position": 2, "name": "التفسير الميسر", "item": "https://athar-app.org/?tab=quran" },
          { "@type": "ListItem", "position": 3, "name": `تفسير سورة ${surah.name}`, "item": canonicalUrl }
        ]
      }
    ]
  };

  const contentHtml = `
    <article class="content-card">
      <h2 style="font-size: 20px; font-weight: 800; color: var(--emerald-deep); margin-bottom: 12px;">
        التفسير الميسر وبيان معاني سورة ${surah.name}
      </h2>
      <p style="font-size: 14px; color: var(--text-main); line-height: 1.9; margin-bottom: 18px;" class="font-amiri">
        ${surah.desc}
      </p>

      <div style="background: var(--bg-cream); border-right: 4px solid var(--gold-primary); padding: 14px; border-radius: 8px; margin: 16px 0;">
        <strong style="color: var(--emerald-deep); font-size: 14px; display: block; margin-bottom: 4px;">من مقاصد السورة الجليلة:</strong>
        <p style="font-size: 13px; color: var(--text-muted);" class="font-amiri">
          تعتبر سورة ${surah.name} من السور الـ ${surah.type} العظيمة، وعدد آياتها ${surah.versesCount} آية. وقد نزلت لترسيخ العقيدة وبيان دلائل قدرة الله عز وجل وهداية القلوب إلى الحق والتوحيد.
        </p>
      </div>

      <div style="display: flex; gap: 10px; flex-wrap: wrap; margin-top: 20px;">
        <a href="/surah-${surah.id}.html" class="btn-gold">
          <span>قراءة سورة ${surah.name} كاملة</span>
        </a>
        <a href="/mp3-surah-${surah.id}.html" class="btn-outline">
          <span>استماع mp3 بصوت ياسر الدوسري</span>
        </a>
        <a href="/?tab=quran&surah=${surah.id}" class="btn-outline">
          <span>فتح في المصحف التفاعلي</span>
        </a>
      </div>
    </article>
  `;

  const html = renderSeoHtml({
    title: `تفسير سورة ${surah.name} الميسر ومعاني الآيات | موقع أثر`,
    description: `تعرف على تفسير سورة ${surah.name} الميسر والمختصر، مقاصد الآيات وأسباب النزول وفضل السورة - موقع أثر صدقة جارية عن أحمد منتصر العامودي.`,
    keywords: `تفسير سورة ${surah.name}, معاني سورة ${surah.name}, مقاصد سورة ${surah.name}, تفسير الميسر سورة ${surah.name}, موقع أثر, صدقة جارية عن أحمد منتصر العامودي`,
    canonicalUrl,
    ogType: "article",
    h1: `تفسير سورة ${surah.name} الميسر`,
    badge: `التفسير والتدبر • سورة ${surah.type}`,
    contentHtml,
    breadcrumbs: [
      { label: "التفسير الميسر", url: "/?tab=quran" },
      { label: `تفسير سورة ${surah.name}`, url: canonicalUrl }
    ],
    schemaJson
  });

  fs.writeFileSync(path.join(publicDir, fileName), html, 'utf-8');
  sitemapUrls.push({ loc: canonicalUrl, priority: "0.8", changefreq: "monthly" });
}

// -------------------------------------------------------------
// 4. GENERATE 30 JUZ PAGES
// -------------------------------------------------------------
for (let j = 1; j <= 30; j++) {
  const fileName = `juz-${j}.html`;
  const canonicalUrl = `https://athar-app.org/${fileName}`;
  const juzSurahs = SURAHS.filter(s => s.juz === j);
  const juzNames = {
    1: "جزء ألم (الفاتحة والبقرة)",
    2: "جزء سيقول السفهاء",
    3: "جزء تلك الرسل",
    4: "جزء لن تنالوا البر",
    5: "جزء والمحصنات",
    28: "جزء قد سمع",
    29: "جزء تبارك",
    30: "جزء عمّ"
  };
  const juzTitle = juzNames[j] || `الجزء ${j} من القرآن الكريم`;

  const schemaJson = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${canonicalUrl}#article`,
        "headline": `قراءة واستماع ${juzTitle} مكتوب بالرسم العثماني`,
        "description": `قراءة وتلاوة ${juzTitle} من القرآن الكريم كاملاً مكتوب ومسموع بصوت كبار القراء.`,
        "inLanguage": "ar"
      }
    ]
  };

  const contentHtml = `
    <article class="content-card">
      <h2 style="font-size: 20px; font-weight: 800; color: var(--emerald-deep); margin-bottom: 12px;">
        سور وآيات ${juzTitle}
      </h2>
      <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 16px;">
        يتضمن هذا الجزء سوراً عظيمة من كلام الله عز وجل، يمكنك قراءتها أو الاستماع لتلاواتها مباشرة:
      </p>

      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 12px; margin: 20px 0;">
        ${juzSurahs.map(s => `
          <div style="background: var(--bg-cream); border: 1px solid var(--emerald-border); border-radius: 14px; padding: 14px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
              <strong style="color: var(--emerald-deep); font-size: 16px;">سورة ${s.name}</strong>
              <span style="font-size: 11px; background: #fff; padding: 2px 8px; border-radius: 6px; border: 1px solid #ddd;">${s.type}</span>
            </div>
            <span style="font-size: 12px; color: var(--text-muted); display: block; margin-bottom: 10px;">${s.versesCount} آية • صفحة ${s.startPage}</span>
            <div style="display: flex; gap: 6px;">
              <a href="/surah-${s.id}.html" style="font-size: 11px; color: var(--emerald-deep); text-decoration: none; font-weight: 700;">قراءة</a>
              <span style="color: #bbb;">•</span>
              <a href="/mp3-surah-${s.id}.html" style="font-size: 11px; color: var(--gold-dark); text-decoration: none; font-weight: 700;">استماع mp3</a>
            </div>
          </div>
        `).join('')}
      </div>

      <div style="margin-top: 24px; text-align: center;">
        <a href="/?tab=quran" class="btn-gold">
          <span>تصفح فهرس القرآن الكريم كاملاً</span>
        </a>
      </div>
    </article>
  `;

  const html = renderSeoHtml({
    title: `${juzTitle} مكتوب ومسموع بالرسم العثماني | موقع أثر`,
    description: `قراءة واستماع ${juzTitle} كاملاً من القرآن الكريم بالرسم العثماني، تلاوات خاشعة بصوت ياسر الدوسري ومشاري العفاسي - موقع أثر صدقة جارية عن أحمد منتصر العامودي.`,
    keywords: `${juzTitle}, الجزء ${j} من القرآن الكريم, جزء ${j} مكتوب, جزء ${j} mp3, موقع أثر, صدقة جارية عن أحمد منتصر العامودي`,
    canonicalUrl,
    ogType: "article",
    h1: `${juzTitle}`,
    badge: `أجزاء القرآن الكريم • الجزء ${j}`,
    contentHtml,
    breadcrumbs: [
      { label: "المصحف الشريف", url: "/?tab=quran" },
      { label: `${juzTitle}`, url: canonicalUrl }
    ],
    schemaJson
  });

  fs.writeFileSync(path.join(publicDir, fileName), html, 'utf-8');
  sitemapUrls.push({ loc: canonicalUrl, priority: "0.8", changefreq: "weekly" });
}

// -------------------------------------------------------------
// 5. GENERATE CORE ADHKAR & DUAS PAGES
// -------------------------------------------------------------
for (const item of ADHKAR_DUAS) {
  const fileName = `${item.slug}.html`;
  const canonicalUrl = `https://athar-app.org/${fileName}`;

  const schemaJson = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${canonicalUrl}#article`,
        "headline": item.title,
        "description": item.desc,
        "inLanguage": "ar"
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "الرئيسية", "item": "https://athar-app.org/" },
          { "@type": "ListItem", "position": 2, "name": item.category, "item": "https://athar-app.org/?tab=adhkar" },
          { "@type": "ListItem", "position": 3, "name": item.title, "item": canonicalUrl }
        ]
      }
    ]
  };

  const contentHtml = `
    <article class="content-card">
      <h2 style="font-size: 20px; font-weight: 800; color: var(--emerald-deep); margin-bottom: 12px;">
        ${item.title}
      </h2>
      <p style="font-size: 14px; color: var(--text-main); line-height: 1.9; margin-bottom: 18px;" class="font-amiri">
        ${item.desc}
      </p>

      <div style="background: var(--bg-cream); border: 1px solid var(--emerald-border); border-radius: 16px; padding: 20px; margin: 18px 0;">
        <p style="font-size: 17px; line-height: 2.1; color: var(--emerald-deep); text-align: center;" class="font-quran">
          «الَّذِينَ آمَنُوا وَتَطْمَئِنُّ قُلُوبُهُم بِذِكْرِ اللَّهِ ۗ أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ»
        </p>
      </div>

      <div style="display: flex; gap: 10px; flex-wrap: wrap; margin-top: 20px;">
        <a href="/?tab=adhkar" class="btn-gold">
          <span>قراءة الأذكار كاملة في المنصة التفاعلية</span>
        </a>
        <a href="/?tab=tasbeeh" class="btn-outline">
          <span>فتح المسبحة الذكية</span>
        </a>
        <a href="/?tab=duas" class="btn-outline">
          <span>تصفح الأدعية المأثورة</span>
        </a>
      </div>
    </article>
  `;

  const html = renderSeoHtml({
    title: `${item.title} | موقع أثر`,
    description: `${item.desc} - موقع أثر الإسلامي صدقة جارية عن روح أحمد منتصر العامودي.`,
    keywords: `${item.title}, ${item.category}, حصن المسلم, أذكار وأدعية, موقع أثر, صدقة جارية عن أحمد منتصر العامودي`,
    canonicalUrl,
    ogType: "article",
    h1: item.title,
    badge: `${item.category} • حصن المسلم`,
    contentHtml,
    breadcrumbs: [
      { label: item.category, url: "/?tab=adhkar" },
      { label: item.title, url: canonicalUrl }
    ],
    schemaJson
  });

  fs.writeFileSync(path.join(publicDir, fileName), html, 'utf-8');
  sitemapUrls.push({ loc: canonicalUrl, priority: "0.85", changefreq: "weekly" });
}

// -------------------------------------------------------------
// 6. GENERATE 30 CITIES PRAYER TIMES PAGES
// -------------------------------------------------------------
for (const city of CITIES) {
  const fileName = `prayer-${city.slug}.html`;
  const canonicalUrl = `https://athar-app.org/${fileName}`;

  const schemaJson = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${canonicalUrl}#webpage`,
        "name": `مواقيت الصلاة في ${city.name} اليوم واتجاه القبلة`,
        "description": `جدول مواقيت الصلاة اليوم في ${city.name} (${city.country}) مع حساب الفجر، الظهر، العصر، المغرب، العشاء واتجاه القبلة نحو الكعبة المشرفة.`
      }
    ]
  };

  const contentHtml = `
    <article class="content-card">
      <h2 style="font-size: 20px; font-weight: 800; color: var(--emerald-deep); margin-bottom: 12px;">
        مواقيت الصلاة الرسمية في مدينة ${city.name} (${city.country})
      </h2>
      <p style="font-size: 14px; color: var(--text-muted); line-height: 1.8; margin-bottom: 16px;">
        حساب فلكي دقيق وفق طريقة رابطة العالم الإسلامي وأم القرى لمواقيت الصلوات الخمس في ${city.name}.
      </p>

      <div style="background: var(--bg-cream); border: 1px solid var(--gold-border); border-radius: 16px; padding: 18px; margin: 18px 0; text-align: center;">
        <span style="font-size: 12px; color: var(--gold-dark); font-weight: 700; display: block; margin-bottom: 6px;">قال الله تعالى:</span>
        <p style="font-size: 18px; color: var(--emerald-deep); font-weight: 700;" class="font-quran">
          «إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَّوْقُوتًا»
        </p>
      </div>

      <div style="display: flex; gap: 10px; flex-wrap: wrap; margin-top: 20px;">
        <a href="/?tab=prayer" class="btn-gold">
          <span>عرض المواقيت اللحظية والعد التنازلي والبوصلة</span>
        </a>
        <a href="/" class="btn-outline">
          <span>العودة للرئيسية</span>
        </a>
      </div>
    </article>
  `;

  const html = renderSeoHtml({
    title: `مواقيت الصلاة في ${city.name} اليوم واتجاه القبلة | موقع أثر`,
    description: `مواقيت الصلاة اليوم في ${city.name} (${city.country}): الفجر، الشروق، الظهر، العصر، المغرب، العشاء، مع بوصلة القبلة نحو مكة المكرمة - موقع أثر صدقة جارية عن أحمد منتصر العامودي.`,
    keywords: `مواقيت الصلاة في ${city.name}, أذان الفجر في ${city.name}, وقت صلاة الظهر ${city.name}, صلاة العصر ${city.name}, صلاة المغرب ${city.name}, صلاة العشاء ${city.name}, اتجاه القبلة في ${city.name}`,
    canonicalUrl,
    ogType: "website",
    h1: `مواقيت الصلاة في ${city.name} واتجاه القبلة`,
    badge: `مواقيت الصلاة • ${city.country}`,
    contentHtml,
    breadcrumbs: [
      { label: "مواقيت الصلاة", url: "/?tab=prayer" },
      { label: city.name, url: canonicalUrl }
    ],
    schemaJson
  });

  fs.writeFileSync(path.join(publicDir, fileName), html, 'utf-8');
  sitemapUrls.push({ loc: canonicalUrl, priority: "0.8", changefreq: "daily" });
}

// -------------------------------------------------------------
// 7. GENERATE SITEMAP.XML & ROBOTS.TXT
// -------------------------------------------------------------
const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapXml, 'utf-8');

const robotsTxt = `User-agent: *
Allow: /
Sitemap: https://athar-app.org/sitemap.xml
`;

fs.writeFileSync(path.join(publicDir, 'robots.txt'), robotsTxt, 'utf-8');

console.log(`Successfully generated ${sitemapUrls.length} total SEO pages and updated sitemap.xml & robots.txt!`);
