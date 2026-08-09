import { Feature, GalleryItem, Testimonial, FAQItem, AdmissionStep } from '../types';

export const instituteInfo = {
  nameEn: "Dare Women's & Men's Beauty Training Institute",
  nameShort: "Dare Institute",
  nameAmharic: "ደሬ የሴቶች እና የወንዶች የውበት ሙያ ማሰልጠኛ ተቋም",
  nameOromo: "Dhaabbata Leenjii Miidhagina Dubartootaa fi Dhiiraa Dare",
  tagline: "Cultivating Excellence in Beauty Education & Vocational Mastery",
  phonePrimary: "+251 911 922 359",
  phoneSecondary: "+251 911 922 359",
  email: "info@darebeautyinstitute.com",
  locationEn: "Tsara Tsion, Burayu, Sheger City, Oromia, Ethiopia",
  locationAmharic: "ቡራዩ ፃራ ጽዮን፣ ሸገር ከተማ፣ ኦሮሚያ፣ ኢትዮጵያ",
  locationOromo: "Tsara Tsion, Burayyuu, Magaalaa Shegger, Oromiyaa, Itoophiyaa",
  workingHours: "Monday - Saturday: 8:00 AM - 6:00 PM",
  socialLinks: {
    telegram: "https://t.me/dere295",
    instagram: "https://instagram.com/dere295",
    facebook: "https://facebook.com/derebeautyinstitute",
    tiktok: "https://www.tiktok.com/@dere295",
    youtube: "https://youtube.com/@derebeautyinstitute"
  }
};

export const featuresData: Feature[] = [
  {
    id: 'prof-training',
    icon: 'GraduationCap',
    title: 'Professional Beauty Training',
    amharicTitle: 'ሙያዊ የውበት ስልጠና',
    oromoTitle: 'Leenjii Miidhaginaa Ogummaa',
    description: 'Internationally aligned curriculum tailored for both women and men seeking elite career independence.',
    amharicDescription: 'ለሴቶች እና ለወንዶች ተስማሚ የሆነ አለምአቀፍ ደረጃውን የጠበቀ የውበት ስልጠና።',
    oromoDescription: 'Syllabus sadarkaa addunyaa kan dubartootaa fi dhiirotaaf ta\'u, barnoota ogummaa fi of danda\'uuf gargaaru.'
  },
  {
    id: 'hands-on',
    icon: 'Sparkles',
    title: '80% Practical Hands-on Learning',
    amharicTitle: '80% ተግባራዊ ልምምድ',
    oromoTitle: '80% Shaakala Hanga Harkaa',
    description: 'Learn by doing on live models in our state-of-the-art salon labs with professional equipment.',
    amharicDescription: 'በቀጥታ በሰው ሞዴሎች ላይ በመለማመድ የሚሰጥ 80% ተግባራዊ ስልጠና።',
    oromoDescription: 'Namoota irratti kallattiin shaakaluudhaan meeshaalee ammayyaatiin leenjii kennamu.'
  },
  {
    id: 'instructors',
    icon: 'Users',
    title: 'Experienced Master Instructors',
    amharicTitle: 'ተመራጭ እና ባለሙያ አሰልጣኞች',
    oromoTitle: 'Barsiisota Muuxannoo Qaban',
    description: 'Guided by certified beauty masters with years of salon management and international styling experience.',
    amharicDescription: 'በሙያው የብዙ ዓመታት ልምድ ባላቸው ማስተር አሰልጣኞች የሚሰጥ።',
    oromoDescription: 'Barsiisota muuxannoo waggoota hedduu saloonii fi miidhaginaa qabaniin kan hoogganamu.'
  },
  {
    id: 'techniques',
    icon: 'Scissors',
    title: 'Modern Beauty Techniques',
    amharicTitle: 'ዘመናዊ የውበት አሰራር ቴክኒኮች',
    oromoTitle: 'Tekniikota Miidhagina Ammayyaa',
    description: 'Stay ahead of global fashion trends, high-definition makeup, Russian volume lashes, and skin fades.',
    amharicDescription: 'በአለም አቀፍ ደረጃ በወቅቱ የሚጠየቁ ዘመናዊ የውበት ቴክኒኮችን መማር።',
    oromoDescription: 'Toftaalee miidhagina ammayyaa sadarkaa addunyaatti barbaadaman barachuu.'
  },
  {
    id: 'career',
    icon: 'Briefcase',
    title: 'Career Development & Placement',
    amharicTitle: 'የስራ እድል እና የሳሎን ድጋፍ',
    oromoTitle: 'Carraa Hojii fi Deeggarsa Saloonii',
    description: 'Direct connections with top luxury hotels, beauty salons, spas, and film production crews across Ethiopia.',
    amharicDescription: 'ከታወቁ ሆቴሎች፣ ስፓዎች እና የውበት ሳሎኖች ጋር የሥራ ትስስር።',
    oromoDescription: 'Hoteelota, spaa fi saloonota beukamoo waliin hariiroo hojii uumuu.'
  },
  {
    id: 'certified',
    icon: 'Award',
    title: 'Government Certified Training',
    amharicTitle: 'በመንግስት እውቅና ያለው ሰርተፊኬት',
    oromoTitle: 'Waraqaa Ragaa Beekamtii Qabu',
    description: 'Earn an official accredited certificate that opens doors locally and for international work opportunities.',
    amharicDescription: 'በሀገር ውስጥም ሆነ በውጭ ሀገር የሚሰራ በህግ የታወቀ የምስክር ወረቀት።',
    oromoDescription: 'Waraqaa ragaa seeraan beekamtii qabu biyya keessatti fi biyya alaatti hojjetu argachuu.'
  },
  {
    id: 'entrepreneurship',
    icon: 'TrendingUp',
    title: 'Entrepreneurship & Salon Management',
    amharicTitle: 'የስራ ፈጠራ እና የሳሎን አመራር',
    oromoTitle: 'Uumama Hojii fi Bulchiinsa Saloonii',
    description: 'Learn how to start, market, price services, and run your own profitable beauty salon or barber shop.',
    amharicDescription: 'የራስዎን የውበት ሳሎን ወይም ባርበር ሾፕ እንዴት መክፈትና ማስተዳደር እንደሚችሉ የሚሰጥ ትምህርት።',
    oromoDescription: 'Saloonii miidhaginaa kan mataa keessanii akkamitti akka banattanii fi bulchitan barachuu.'
  }
];

export const statisticsData = [
  { value: '10+', label: 'Professional Programs', amharicLabel: 'የሙያ ፕሮግራሞች', oromoLabel: 'Prograamota Ogummaa' },
  { value: '1,200+', label: 'Practical Training Hours', amharicLabel: 'የተግባር ልምምድ ሰዓታት', oromoLabel: 'Sa\'aatii Shaakalaa' },
  { value: '3,500+', label: 'Successful Graduates', amharicLabel: 'ተመርቀው ስራ የያዙ', oromoLabel: 'Eebifamtoota Milkaa\'an' },
  { value: '25+', label: 'Expert Instructors', amharicLabel: 'ባለሙያ አሰልጣኞች', oromoLabel: 'Barsiisota Hayyoota' },
  { value: '98%', label: 'Career Placement Rate', amharicLabel: 'የስራ ትስስር ስኬት', oromoLabel: 'Reeshiyoo Hojii Argachuu' }
];

export const processSteps: AdmissionStep[] = [
  {
    step: 1,
    title: 'Choose Training Program',
    amharicTitle: 'የስልጠና ፕሮግራም መምረጥ',
    oromoTitle: 'Prograama Leenjii Filachuu',
    desc: 'Select your area of passion from Hair, Barbering, Makeup, Nails, Lash, Skincare, or Waxing.',
    amharicDesc: 'ከፀጉር፣ ባርበሪንግ፣ ሜካፕ፣ ጥፍር ወይም ቆዳ እንክብካቤ የሚፈልጉትን ይምረጡ።',
    oromoDesc: 'Rifeensa, barberiingii, meekaappii, qeensa, lashii ykn gogaa kunuunsuu irraa kan jaallattan filadhaa.'
  },
  {
    step: 2,
    title: 'Apply Online / Visit Us',
    amharicTitle: 'በኦንላይን ወይም በአካል መመዝገብ',
    oromoTitle: 'Oonlaayiniin ykn Qaamaan Galmaa\'uu',
    desc: 'Fill out our quick online application or visit our campus for a personalized counseling tour.',
    amharicDesc: 'የኦንላይን ፎርሙን ይሙሉ ወይም ወደ ግቢችን መጥተው ይመዝገቡ።',
    oromoDesc: 'Foormii oonlaayinii guutaa ykn Mooraa keenya daawwachuun galmaa\'aa.'
  },
  {
    step: 3,
    title: 'Practical Hands-on Training',
    amharicTitle: 'ተግባራዊ ስልጠና መከታተል',
    oromoTitle: 'Leenjii Shaakalaa Hordofuu',
    desc: 'Attend shifts (Morning, Afternoon or Weekend) with intensive live model practice and kit tools.',
    amharicDesc: 'በቀን፣ በማታ ወይም በሳምንት መጨረሻ በተግባር የተደገፈ ስልጠና መከታተል።',
    oromoDesc: 'Ganama, waaree booda ykn sanbata irratti shaakala harkaatiin leenjisuu.'
  },
  {
    step: 4,
    title: 'Assessment & Certification',
    amharicTitle: 'ምዘና እና የምስክር ወረቀት',
    oromoTitle: 'Madaallii fi Waraqaa Ragaa',
    desc: 'Demonstrate your skills in final practical exams and receive your accredited diploma.',
    amharicDesc: 'በተግባራዊ ፈተና ብቃትን በማሳየት ተቀባይነት ያለው ሰርተፊኬት መረከብ።',
    oromoDesc: 'Qormaata shaakalaa irratti dandeettii agarsiisuun waraqaa ragaa fudhachuu.'
  },
  {
    step: 5,
    title: 'Build Your Career & Salon',
    amharicTitle: 'ስራ መጀመር ወይም ሳሎን መክፈት',
    oromoTitle: 'Hojii Jalqabuu ykn Saloonii Banachuu',
    desc: 'Access job placement referrals or launch your own salon with our business mentorship.',
    amharicDesc: 'በተዘጋጀው የሥራ ትስስር ስራ መያዝ ወይም የራስዎን ስራ መጀመር።',
    oromoDesc: 'Carraa hojii argachuu ykn gorsa dandeettii keenyaan saloonii mataa keessanii banachuu.'
  }
];

export const galleryItems: GalleryItem[] = [
  {
    id: 'g1',
    title: 'Hair Styling Studio Practice',
    amharicTitle: 'የፀጉር አሰራር የተግባር ክፍል',
    oromoTitle: 'Shaakala Kutaa Rifeensaa',
    category: 'hair',
    image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=1000&q=80',
    description: 'Students working with professional styling tools on live hair extensions.'
  },
  {
    id: 'g2',
    title: 'Precision Barbering & Fade Station',
    amharicTitle: 'የወንዶች ፀጉር አቆራረጥ ልምምድ',
    oromoTitle: 'Shaakala Muruu Rifeensa Dhiiraa',
    category: 'barber',
    image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1000&q=80',
    description: 'Mastering skin fades and razor lineup in our barber lab.'
  },
  {
    id: 'g3',
    title: 'High-Definition Makeup Class',
    amharicTitle: 'የሜካፕ ትምህርት በተግባር',
    oromoTitle: 'Kutaa Barnoota Meekaappii',
    category: 'makeup',
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1000&q=80',
    description: 'Bridal and editorial makeup practice under studio lighting.'
  },
  {
    id: 'g4',
    title: 'Nail Extension & Acrylic Station',
    amharicTitle: 'የጥፍር ዲዛይን ስልጠና',
    oromoTitle: 'Leenjii Diizayinii Qeensaa',
    category: 'nails',
    image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=1000&q=80',
    description: 'Detailed acrylic nail encapsulation and e-file polishing.'
  },
  {
    id: 'g5',
    title: 'Modern Academy Lecture & Lab',
    amharicTitle: 'ዘመናዊ የመማሪያ ክፍል',
    oromoTitle: 'Kutaa Barnoota Ammayyaa',
    category: 'classroom',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1000&q=80',
    description: 'Bright, sterile, and spacious training environment.'
  },
  {
    id: 'g6',
    title: 'Student Graduation Celebration',
    amharicTitle: 'የተማሪዎች የምረቃ ስነ-ስርዓት',
    oromoTitle: 'Ayyaana Eebba Barattootaa',
    category: 'classroom',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=80',
    description: 'Celebrating certified beauty professionals at graduation day.'
  }
];

export const testimonialsData: Testimonial[] = [
  {
    id: 't1',
    name: 'Helina Tadesse',
    role: 'Salon Owner & Lead Stylist',
    program: 'Hair Dressing & Makeup Artistry',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    quote: 'Dare Institute gave me both the technical hair styling skills and the business confidence to launch my own salon in Bole. The instructors are patient and deeply knowledgeable.',
    amharicQuote: 'ደሬ ኢንስቲትዩት የፀጉር አሰራር ጥበብን ብቻ ሳይሆን የራሴን የውበት ሳሎን ለመክፈት የሚያስችል የንግድ እውቀት ሰጥቶኛል።',
    oromoQuote: 'Dhaabbanni Dare dandeettii rifeensa ijaaruu qofa osoo hin taane, saloonii mataa koo banachuuf barnoota daldalaa naaf kenneera.',
    rating: 5
  },
  {
    id: 't2',
    name: 'Yonas Kebede',
    role: 'Celebrity Barber at Luxury Hotel Spa',
    program: 'Barbering & Men\'s Grooming',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    quote: 'The 80% practical approach made all the difference. Right after graduation, I was hired at a 5-star hotel spa in Addis Ababa. Dare Institute is the best choice for men in beauty.',
    amharicQuote: 'ተግባራዊ ስልጠናው በጣም የረዳኝ ሲሆን ወዲያውኑ በባለ 5 ኮከብ ሆቴል በባርበርነት ልሰራ ችያለሁ።',
    oromoQuote: 'Leenjiin shaakalaa 80% baay\'ee na gargaare. Yeruma eebbifamuu hoteela sadarkaa 5 keessatti hojii argadheera.',
    rating: 5
  },
  {
    id: 't3',
    name: 'Bethlehem Alemu',
    role: 'Certified Lash & Nail Artist',
    program: 'Nail Tech & Eyelash Extension',
    photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    quote: 'I learned Russian volume lashes and acrylic nail art step by step. Today I have a loyal celebrity client list and book out weeks in advance.',
    amharicQuote: 'የላሽ እና የጥፍር አሰራርን በጥራት ተምሬ አሁን ላይ በበቂ ሁኔታ የራሴ ደንበኞች አሉኝ።',
    oromoQuote: 'Tooftaa lashii fi qeensaa sadarkaan baradhee ammma maamiltoota hedduu qaba.',
    rating: 5
  },
  {
    id: 't4',
    name: 'Selamawit Girma',
    role: 'Bridal Makeup Artist & Studio Founder',
    program: 'Professional Makeup Artistry',
    photo: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=400&q=80',
    quote: 'Within six months I had my own makeup studio and a waiting list of brides. Dare\'s makeup program is truly world-class — the colour theory and airbrush modules alone changed my career.',
    amharicQuote: 'ከስድስት ወር ባልበለጠ ጊዜ ውስጥ የራሴ ስቱዲዮ ከፍቼ ብዙ ጎጆ ቀዳሚዎቼ ተጠባባቂ ሆኑ።',
    oromoQuote: 'Ji\'a jaha keessatti mana shaakalaa mataa koo banee heerumtoonni hedduu na eegan.',
    rating: 5
  },
  {
    id: 't5',
    name: 'Dawit Bekele',
    role: 'Head Barber, Bole International Airport Zone',
    program: 'Barbering & Men\'s Grooming',
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
    quote: 'The fading techniques and beard sculpture modules at Dare are unmatched. I now run a premium barber shop and train my own junior staff using what I learned here.',
    amharicQuote: 'ፌዲንግ እና የፂም ቅርፃቅርፅ ስልጠናው ከፍተኛ ጥቅም ሰጥቶኛል። አሁን ፕሪሚየም ሳሎን አስኬዳለሁ።',
    oromoQuote: 'Teekniikii fading fi barsiifna areeda Dare keessatti nan baradhe. Amma saloon premium qaba.',
    rating: 5
  },
  {
    id: 't6',
    name: 'Meron Haile',
    role: 'Skincare Therapist, International Spa Chain',
    program: 'Beauty Therapy & Skincare',
    photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80',
    quote: 'The anatomy and skincare science curriculum prepared me for a job at an international spa brand in Dubai. Dare\'s certificate opened doors I never imagined.',
    amharicQuote: 'የቆዳ እንክብካቤ ሳይንስ ትምህርቱ ዱባይ ለሚሰራ ዓለም አቀፍ ስፓ ብራንድ ቅጥር አዘጋጀኝ።',
    oromoQuote: 'Saayinsii kunuunsa gogaa nan baradhee. Amma spaa idila-addunyaa Dubai keessatti hojjedha.',
    rating: 5
  },
  {
    id: 't7',
    name: 'Tigist Worku',
    role: 'Head Colorist, Top Addis Ababa Salon',
    program: 'Hair Dressing & Advanced Color',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    quote: 'The balayage and colour-correction modules at Dare are genuinely advanced. My clients now travel from across the city for colour work. Best training investment of my life.',
    amharicQuote: 'ባሌያጅ እና የቀለም ማስተካከያ ሞጁሎቹ ሙያዊ ናቸው። ደንበኞቼ ከሀገሪቱ ሁሉ ቀለም ልሰራ ይመጣሉ።',
    oromoQuote: 'Modulewwan balayage fi sirreessa halluu dhuguma sadarkaa olaanaadha. Maamiltonni koo magaalaa maraa na barbaadu.',
    rating: 5
  },
  {
    id: 't8',
    name: 'Abebe Tesfaye',
    role: 'COC-Certified TVET Instructor',
    program: 'Hair Dressing & Styling',
    photo: 'https://images.unsplash.com/photo-1500048993953-d23a436266cf?auto=format&fit=crop&w=400&q=80',
    quote: 'I came as a student and now I teach. The COC examination preparation at Dare was thorough — I passed with distinction and was offered a teaching position right away.',
    amharicQuote: 'ተማሪ ሆኜ ገብቼ አሁን አስተምራለሁ። COC ፈተናዬን ከፍተኛ ውጤት አምጥቼ ወዲያው ለትምህርት ቀርቤ ተቀጠርኩ።',
    oromoQuote: 'Barattuu tahuun gallee amma barsiisota. Qormaata COC sadarkaa olaanaan darbe yeruma ta\'een hojii barsiisummaatti waamamne.',
    rating: 5
  },
  {
    id: 't9',
    name: 'Lidya Mengistu',
    role: 'Waxing & Threading Studio Owner',
    program: 'Hair Waxing & Body Treatments',
    photo: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=400&q=80',
    quote: 'I finished the waxing module in just one month. With that skill plus the business mentorship Dare gave me, I opened my own studio in Kazanchis within three months.',
    amharicQuote: 'ዋክሲንግ ሞጁሉን ባንድ ወር አጠናቀቅሁ። ከስልጠናው ተነስቼ ሶስት ወር ባልሞላ ጊዜ ስቱዲዮ ከፍቻለሁ።',
    oromoQuote: 'Modulii waxing ji\'a tokkotti xumure. Ji\'a sadii keessatti mana shaakala mataa koo banuu danda\'e.',
    rating: 5
  },
  {
    id: 't10',
    name: 'Eyerusalem Tadesse',
    role: 'Nail Studio Owner & Trainer',
    program: 'Nail Care Technology',
    photo: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?auto=format&fit=crop&w=400&q=80',
    quote: 'Dare taught me gel, acrylic, and nail art fundamentals. I now run a studio with two employees and also teach Dare\'s nail course on weekends.',
    amharicQuote: 'ጄልን፣ አክሪሊክን እና ኔይል አርት ፈንዳሜንታሎችን ተምሬ ስቱዲዮ ከፍቼ ሁለት ሰራተኞች አሉኝ።',
    oromoQuote: 'Jel, acrylic fi art qeensaa nan baradhe. Amma mana shaakala qabu hojjetoota lama wajjin hojjedha.',
    rating: 5
  },
  {
    id: 't11',
    name: 'Kalkidan Assefa',
    role: 'Film & TV Makeup Artist',
    program: 'Professional Makeup Artistry',
    photo: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=400&q=80',
    quote: 'Dare\'s special-effects and editorial makeup units helped me break into the Ethiopian film industry. I have now worked on over 15 productions and three music videos.',
    amharicQuote: 'ስፔሻል ኢፌክቶች እና ኤዲቶሪያል ሜካፕ ሞጁሎቹ ወደ ፊልም ኢንዱስትሪ እንድገባ ረዱኝ። 15+ ፕሮዳክሽን ሰርቻለሁ።',
    oromoQuote: 'Modulewwan special-effects fi editorial makeup gargaartee industirii fiilimii keessa galuu danda\'e.',
    rating: 5
  },
  {
    id: 't12',
    name: 'Robel Mulugeta',
    role: 'Freelance Grooming Specialist',
    program: 'Barbering & Men\'s Grooming',
    photo: 'https://images.unsplash.com/photo-1463453091185-61582044d556?auto=format&fit=crop&w=400&q=80',
    quote: 'I travel to clients — weddings, graduations, corporate events. Dare\'s portable grooming unit training made me the go-to specialist for high-profile events in Addis.',
    amharicQuote: 'ሠርግ፣ ምረቃ፣ ኮርፖሬት ዝግጅቶች ጋር እሄዳለሁ። ደሬ ለዚህ ባለሙያ አደረገኝ።',
    oromoQuote: 'Fuudha, eebbifama fi naannoo daldalaatti deema. Dare ogummaa portable grooming naaf baarsise.',
    rating: 5
  }
];

export const faqData: FAQItem[] = [
  {
    id: 'faq1',
    question: 'What courses are available at Dare Beauty Training Institute?',
    amharicQuestion: 'በደሬ የውበት ማሰልጠኛ ተቋም ምን ምን ኮርሶች ይሰጣሉ?',
    oromoQuestion: 'Dhaabbata Leenjii Dare keessatti koorsiileen kennaman maal fa\'i?',
    answer: 'We offer professional certified programs in Hair Dressing & Styling, Barbering & Men\'s Grooming, Professional Makeup Artistry, Nail Technology, Beauty Therapy & Skincare, Eyelash Extension, and Hair Waxing.',
    amharicAnswer: 'የፀጉር አሰራር፣ የወንዶች ባርበሪንግ፣ ፕሮፌሽናል ሜካፕ፣ የጥፍር አሰራር፣ የቆዳ እንክብካቤ/ፌሺያል፣ የዐይን ቆብ ኤክስቴንሽን እና ዋክሲንግ ኮርሶችን እንሰጣለን።',
    oromoAnswer: 'Koorsii rifeensa dubartootaa, barbering dhiiraa, meekaappii, qeensa, kunuunsa gogaa/feeshiyaala, lashii fi waxing ni kennina.'
  },
  {
    id: 'faq2',
    question: 'How long do the training programs take to complete?',
    amharicQuestion: 'የስልጠና ፕሮግራሞቹ ምን ያህል ጊዜ ይወስዳሉ?',
    oromoQuestion: 'Prograamonni leenjii yeroo hangamii fudhatu?',
    answer: 'Program durations range from 1 Month (Lash & Waxing) up to 3 to 6 Months for comprehensive Master Diplomas in Hair, Barbering, and Beauty Therapy. Flexible shifts are available (Morning, Afternoon, and Weekend).',
    amharicAnswer: 'ኮርሶቹ ከ1 ወር (ላሽ እና ዋክሲንግ) እስከ 3 እና 6 ወራት (የፀጉር፣ ባርበሪንግ እና ፌሺያል ዲፕሎማ) ይወስዳሉ። ጠዋት፣ ከሰዓት እና የሳምንት መጨረሻ መርሃ-ግብሮች አሉን።',
    oromoAnswer: 'Koorsiileen ji\'a 1 (Lash & Waxing) hanga ji\'a 3 fi 6 (Rifeensa, Barbering, Tearsapii Gogaa) fudhatu. Sagantaan ganamaa, waaree boodaa fi sanbataa jira.'
  },
  {
    id: 'faq3',
    question: 'Is the certificate accredited and recognized for work?',
    amharicQuestion: 'የሚሰጠው ሰርተፊኬት ህጋዊ እና እውቅና ያለው ነው?',
    oromoQuestion: 'Waraqaan ragaa kennamu seeraan beekamtii qabaa?',
    answer: 'Yes, Dare Institute provides government-recognized vocational certificates. Our certificates are verified for work both in Ethiopia and internationally.',
    amharicAnswer: 'አዎ! በደሬ ኢንስቲትዩት የሚሰጠው ሰርተፊኬት በመንግስት የታወቀ እና በሀገር ውስጥም ሆነ በውጭ ሀገር ለስራ የሚያገለግል ህጋዊ ነው።',
    oromoAnswer: 'Eeyyee! Waraqaan ragaa Dhaabbata Dare beekamtii mootummaa kan qabu fi biyya keessatti fi alaatti hojjetuudha.'
  },
  {
    id: 'faq4',
    question: 'Are tools and practice models provided by the institute?',
    amharicQuestion: 'የልምምድ እቃዎች እና ሞዴሎች በተቋሙ ይዘጋጃሉ?',
    oromoQuestion: 'Meeshaaleen shaakalaa fi moodeelonni dhaabbataniin ni qophaa\'uu?',
    answer: 'Yes, we provide fully equipped salon workstations, dummy heads, chemical products, and real live models during practical training sessions.',
    amharicAnswer: 'አዎ! ለልምምድ የሚያስፈልጉ ዘመናዊ እቃዎች፣ ማኔኪን እና የቀጥታ ሞዴሎች በተቋማችን ይዘጋጃሉ።',
    oromoAnswer: 'Eeyyee! Meeshaaleen ammayyaa, manequin fi moodeelonni shaakalaaf barbaachisan dhaabbataan ni qophaa\'u.'
  },
  {
    id: 'faq5',
    question: 'What are the admission requirements to register?',
    amharicQuestion: 'ለመመዝገብ የሚያስፈልጉ ቅድመ-ሁኔታዎች ምንድናቸው?',
    oromoQuestion: 'Galmaa\'uuf ulaagaaleen barbaachisan maali?',
    answer: 'Applicants should present a copy of their ID/Passport, 2 passport-size photos, and a minimum grade 8 or 10 completion certificate. No prior beauty experience is required.',
    amharicAnswer: 'የመታወቂያ ኮፒ፣ 2 ጉርድ ፎቶግራፍ እና የትምህርት ማስረጃ ማቅረብ በቂ ነው፡ ቅድመ ተሞክሮ አይጠየቅም።',
    oromoAnswer: 'Koppii waraqaa enyummaa, suuraa 2 fi ragaa kutaa 8 ykn 10 dhiyessuun gahaadha.'
  },
  {
    id: 'faq6',
    question: 'Are there payment installment options for tuition?',
    amharicQuestion: 'ክፍያን በክፍልፋይ መክፈል ይቻላል?',
    oromoQuestion: 'Kaffaltii barnootaa kaffaltii qoodamitiin kaffaluun ni danda\'amaa?',
    answer: 'Yes, tuition fees can be paid in flexible monthly installments to support students throughout their educational journey.',
    amharicAnswer: 'አዎ! የትምህርት ክፍያውን በተማሪዎች ፍላጎት መሰረት በወርሃዊ ክፍልፋይ መክፈል ይቻላል።',
    oromoAnswer: 'Eeyyee! Kaffaltii barnootaa kaffaltii ji\'aatiin qoodanii kaffaluun ni danda\'ama.'
  }
];
