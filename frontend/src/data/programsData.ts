import { TrainingProgram } from '../types';

export const programsData: TrainingProgram[] = [
  {
    id: 'hair-dressing',
    name: 'Hair Dressing & Styling',
    amharicName: 'የፀጉር አሰራር እና ስታይሊንግ',
    oromoName: 'Tajaajila Rifeensaa fi Ijaarsa Style',
    category: 'hair',
    duration: '3 Months / 6 Months',
    durationOptions: ['3 Months (Basic to Intermediate)', '6 Months (Master Advanced)'],
    description: 'Master the art of professional hair dressing, from fundamental washing and heat styling to advanced bridal, editorial, and ethnic hair artistry for women and men.',
    amharicDescription: 'ከመሰረታዊ የፀጉር እጠበታ እና የሂት ስታይሊንግ ጀምሮ እስከ ከፍተኛ የሰርግ እና የሞዴል ፀጉር አሰራር በሙያ ደረጃ ይማሩ።',
    oromoDescription: 'Aartii rifeensa dhiiraa fi dubartootaa, miiccuu, diriirsuu, rifeensa cidhaa fi moodeela ammayyaa leenjii ogummaatiin baradhaa.',
    image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=1200&q=80',
    skills: [
      'Hair Washing, Conditioning & Scalp Treatments',
      'Flat Ironing, Silk Press & Heat Styling',
      'Blow-drying & Precision Volume Techniques',
      'Hair Finishing, Trimming & Layering',
      'Bridal Updos & Fashion Runway Hair',
      'Chemical Relaxing & Color Application'
    ],
    amharicSkills: [
      'የፀጉር እጠበታ እና የቆዳ ህክምና',
      'ፍላት አይረን እና ሂት ስታይሊንግ',
      'ብሎው ድራይንግ እና የቮልዩም ቴክኒኮች',
      'የፀጉር ቁርጠት እና ቅርፅ ማውጣት',
      'የሙሽራ እና የፋሽን ሞዴል ፀጉር አሰራር'
    ],
    oromoSkills: [
      'Rifeensa miiccuu fi gogaa mataa kunuunsuu',
      'Aayironii fi tooftaa oowwaa',
      'Blow-drying fi teekniika volume',
      'Rifeensa muruu fi boocuu',
      'Rifeensa cidhaa fi moodeela faashinii'
    ],
    trainingUnits: [
      'Hair Washing & Scalp Care Hygiene',
      'Flat Ironing & Heat Styling Tools',
      'Blow-drying & Hair Volume Shaping',
      'Hair Finishing & Precision Trimming'
    ],
    certification: 'Government Recognized Vocational Certificate in Hair Artistry',
    popular: true
  },
  {
    id: 'barbering',
    name: 'Barbering & Men\'s Grooming',
    amharicName: 'የወንዶች ፀጉር እና ፂም አሰራር (ባርበሪንግ)',
    oromoName: 'Muruu Rifeensa Dhiiraa fi Areeda',
    category: 'barber',
    duration: '3 Months / 6 Months',
    durationOptions: ['3 Months (Standard Barbering)', '6 Months (Master Barber & Salon Management)'],
    description: 'Comprehensive professional training in modern barbering, skin fades, precision razor lineup, beard sculpting, facial hot towel treatments, and hair replacement techniques.',
    amharicDescription: 'ዘመናዊ የወንዶች ፀጉር አቆራረጥ፣ የፂም ቅርፅ ማውጣት፣ የሆት ታወል ፌሺያል እና የሳሎን አመራር ሙያን በከፍተኛ ደረጃ የሚያስተምር።',
    oromoDescription: 'Muruu rifeensa dhiiraa ammayyaa, afeeraa, qeensa, kunuunsa areedaa, feeshiyaala huccuu oowwaa fi bulchiinsa saloonii.',
    image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1200&q=80',
    skills: [
      'Clipper Fades, Skin Fades & Tapers',
      'Straight Razor Lineups & Edge-ups',
      'Beard Sculpting, Grooming & Oils',
      'Hot Towel Facial & Scalp Massage',
      'Hair Dyeing, Highlights & Texturizing',
      'Sanitation, Blade Safety & Client Service'
    ],
    amharicSkills: [
      'ክሊፐር እና ስኪን ፌድ አቆራረጥ',
      'በምላጭ የፂም እና የፀጉር መስመር ማውጣት',
      'የፂም እንክብካቤ እና ሞዴሊንግ',
      'የሆት ታወል ፌሺያል እና የራስ ቅል ማስሳጅ'
    ],
    oromoSkills: [
      'Muruu Kilipperii fi Skin Fade',
      'Tooftaa afeeraa fi sarara rifeensaa',
      'Areeda boocuu fi kunuunsuu',
      'Feeshiyaala huccuu oowwaa fi sukkuumsaa'
    ],
    trainingUnits: [
      'Clipper Controls & Guard Angles',
      'Razor Techniques & Safety Rules',
      'Beard Design & Line Precision',
      'Scalp Health & Male Facial Care'
    ],
    certification: 'Certified Master Barber Diploma',
    popular: true
  },
  {
    id: 'makeup-artistry',
    name: 'Professional Makeup Artistry',
    amharicName: 'ፕሮፌሽናል የሜካፕ አርት (ሜካፕ አርቲስትሪ)',
    oromoName: 'Aartii Meekaappii Profeeshinaala',
    category: 'makeup',
    duration: '2 Months / 4 Months',
    durationOptions: ['2 Months (Glamour & Bridal)', '4 Months (Advanced Editorial & Special FX)'],
    description: 'Transform faces with elite makeup techniques. Covers skin preparation, foundation blending, contouring, highlighting, bridal glam, photography makeup, and eye artistry.',
    amharicDescription: 'የቆዳ ዝግጅት፣ ኮንቱሪንግ፣ የሙሽራ ሜካፕ፣ የፎቶግራፍ እና የፋሽን ሜካፕ ጥበብን በጥራት ይማሩ።',
    oromoDescription: 'Tooftaa meekaappii sadarkaa olaanaatiin fuula miidhagsuu. Kunuunsa gogaa, foundation, contouring, meekaappii cidhaa fi suuraa.',
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1200&q=80',
    skills: [
      'Skin Analysis, Primer & Base Matching',
      'Highlighting, Contouring & Baking',
      'Cut Crease, Smokey & Editorial Eye Art',
      'Bridal Makeup & High-Definition Cameras',
      'Lash Application & Eyebrow Architecture',
      'Sanitation, Kit Hygiene & Client Consultations'
    ],
    amharicSkills: [
      'የቆዳ አይነት መለየት እና የመሰረት ሜካፕ',
      'ኮንቱሪንግ እና ሃይላይቲንግ',
      'የዓይን ሜካፕ እና የቅንድብ አሰራር',
      'የሙሽራ እና የፋሽን ፎቶግራፍ ሜካፕ'
    ],
    oromoSkills: [
      'Qorannoo gogaa fi meekaappii jalqabaa',
      'Contouring fi Highlighting',
      'Meekaappii ijaa fi nyaara ijaa',
      'Meekaappii cidhaa fi moodeela suuraa'
    ],
    trainingUnits: [
      'Color Theory & Undertone Analysis',
      'Contour, Highlight & Blush Placement',
      'Eye Drama & Eyebrow Sculpting',
      'Bridal Consultation & Long-wear Setting'
    ],
    certification: 'Certified Professional Makeup Artist Certificate',
    popular: true
  },
  {
    id: 'nail-technology',
    name: 'Nail Technology & Nail Art',
    amharicName: 'የጥፍር አሰራር እና አርት (ኔይል ቴክኖሎጂ)',
    oromoName: 'Aartii Qeensaa fi Teeknoolojii',
    category: 'nails',
    duration: '2 Months / 3 Months',
    durationOptions: ['2 Months (Nail Tech Essentials)', '3 Months (Advanced Extension & Master Nail Art)'],
    description: 'Learn acrylic extensions, gel overlays, nail art designs, 3D encapsulation, spa manicures, pedicures, and nail health hygiene protocols.',
    amharicDescription: 'አክሬሊክ፣ ጄል ኤክስቴንሽን፣ የጥፍር ዲዛይን፣ ስፓ ማኒኪዩር እና ፔዲኪዩርን የሚያስተምር ሙያ።',
    oromoDescription: 'Akriilikii, jeeleyyiin rifeensa/qeensa dheeressuu, aartii qeensaa, spa maniikyuurii fi pediikyuurii barachuu.',
    image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=1200&q=80',
    skills: [
      'Acrylic Application, Tip Fitting & Sculpting',
      'Builder Gel & Polygel Extensions',
      '3D Nail Art, Chrome, Rhinestones & Ombre',
      'Spa Manicure & Pedicure Exfoliation',
      'E-file Electric Drill Precision',
      'Nail Fungus Prevention & Sanitation'
    ],
    amharicSkills: [
      'አክሬሊክ እና ጄል ኤክስቴንሽን',
      'የጥፍር አርት፣ ዲዛይን እና ክሮም',
      'ስፓ ማኒኪዩር እና ፔዲኪዩር',
      'የኢ-ፋይል ኤሌክትሪክ ድሪል አጠቃቀም'
    ],
    oromoSkills: [
      'Akriilikii fi Jeelii Dheeressuu',
      'Aartii Qeensaa fi Diizayinii',
      'Spa Maniikyuurii fi Pediikyuurii',
      'Meeshaa E-file goliisaa fayyadamuu'
    ],
    trainingUnits: [
      'Nail Anatomy & Nail Bed Preparation',
      'Acrylic Bead Control & Curing',
      'Artistic Encapsulation & Foils',
      'Spa Sanitation & Hygiene Standards'
    ],
    certification: 'Certified Nail Specialist Diploma'
  },
  {
    id: 'beauty-therapy',
    name: 'Beauty Therapy & Skincare',
    amharicName: 'የውበት ቴራፒ እና የቆዳ እንክብካቤ',
    oromoName: 'Tearaapii Miidhaginaa fi Kunuunsa Gogaa',
    category: 'therapy',
    duration: '3 Months / 6 Months',
    durationOptions: ['3 Months (Facials & Skin Care)', '6 Months (Advanced Esthetics & Spa Body Therapy)'],
    description: 'Become a certified esthetician providing deep-cleansing facials, skin analysis, face/body massage therapy, exfoliation treatments, and luxury spa care.',
    amharicDescription: 'የፊት ቆዳ ጥልቅ ፅዳት (ፌሺያል)፣ የቆዳ ምርመራ፣ የሰውነት ማስሳጅ እና የስፓ ቴራፒ ሙያን በስፋት ይማሩ።',
    oromoDescription: 'Gogaa fuulaa qulqulleessuu (Facial), qorannoo gogaa, sukkuumsaa qaamaa fi kunuunsa spa sadarkaa olaanaa baradhaa.',
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1200&q=80',
    skills: [
      'Deep Cleansing Facials & Steaming',
      'Derma-planing & Exfoliation Masks',
      'Swedish Body Massage & Aromatherapy',
      'Acne Treatment & Anti-aging Protocols',
      'High Frequency & Galvanic Facial Tools',
      'Client Consultation & Skincare Prescriptions'
    ],
    amharicSkills: [
      'ጥልቅ የፊት ፌሺያል እና ስቲሚንግ',
      'የስዊዲሽ ማስሳጅ እና አሮማቴራፒ',
      'የብጉር እና የእርጅና መከላከያ ቴራፒ',
      'የዘመናዊ የቆዳ እንክብካቤ መሳሪያዎች አጠቃቀም'
    ],
    oromoSkills: [
      'Feeshiyaala fuulaa fi steamed care',
      'Sukkuumsaa qaamaa Swedish & Aromatherapy',
      'Tearaapii nafa fi finniisaa',
      'Meeshaalee kunuunsa gogaa ammayyaa'
    ],
    trainingUnits: [
      'Skin Anatomy & Analysis Science',
      'Facial Massage & Extraction Protocol',
      'Body Scrubs, Wraps & Relax Therapy',
      'Client Spa Protocol & Hygiene'
    ],
    certification: 'Certified Esthetician & Spa Therapist Diploma'
  },
  {
    id: 'eyelash-extension',
    name: 'Eyelash Extension & Lash Lift',
    amharicName: 'የዐይን ቆብ ኤክስቴንሽን እና ሊፍት',
    oromoName: 'Dheeressuu Rifeensa Ijaa (Eyelash)',
    category: 'lashes',
    duration: '1 Month / 2 Months',
    durationOptions: ['1 Month (Classic Lash Mastery)', '2 Months (Volume, Hybrid & Lash Lifting Master)'],
    description: 'Specialized high-precision training in classic single lash placement, Russian volume fans, hybrid lash extensions, lash lifting, and eyebrow laminations.',
    amharicDescription: 'ክላሲክ፣ ቮልዩም እና ሃይብሪድ የዐይን ቆብ ኤክስቴንሽን፣ ላሽ ሊፍቲንግ እና ብሮው ላሚኔሽን ሙያ።',
    oromoDescription: 'Tooftaa rifeensa ijaa tokkoon tokkoon dhaabuu (Classic), Russian volume, lash lift fi brow lamination.',
    image: 'https://images.unsplash.com/photo-1583001809873-a1284a5da2d8?auto=format&fit=crop&w=1200&q=80',
    skills: [
      'Classic 1:1 Lash Isolation & Application',
      'Volume Hand-made Fan Creation (2D-6D)',
      'Lash Mapping & Eye Shape Customization',
      'Lash Lift & Tint Perming Methods',
      'Safe Removal & Aftercare Advisory',
      'Adhesive Safety, Humidity & Eye Hygiene'
    ],
    amharicSkills: [
      'ክላሲክ 1:1 የላሽ አገጣጠም',
      'ቮልዩም ፋን አሰራር (2D-6D)',
      'የዓይን ቅርፅ ላሽ ማፒንግ',
      'ላሽ ሊፍት እና ቲንቲንግ'
    ],
    oromoSkills: [
      'Dheeressuu Rifeensa Ijaa Classic 1:1',
      'Ijaarsa Volume Fan (2D-6D)',
      'Diizayinii Ijaa fi Lash Mapping',
      'Lash Lift fi Tinting'
    ],
    trainingUnits: [
      'Lash Anatomy & Natural Lash Safety',
      'Isolation Tweezer Precision Practice',
      'Adhesive Chemistry & Humidity Control',
      'Client Patch Testing & Retention Tips'
    ],
    certification: 'Lash Extension Master Certificate'
  },
  {
    id: 'hair-waxing',
    name: 'Hair Waxing & Body Hair Removal',
    amharicName: 'የሰውነት ፀጉር ማፅዳት (ዋክሲንግ)',
    oromoName: 'Rifeensa Qaamaa Qulqulleessuu (Waxing)',
    category: 'waxing',
    duration: '1 Month / 2 Months',
    durationOptions: ['1 Month (Facial & Body Waxing)', '2 Months (Full Esthetic Hair Removal & Threading)'],
    description: 'Master sanitary warm wax, hard wax, facial precision waxing, body hair removal, threading techniques, and soothing post-wax skin soothing care.',
    amharicDescription: 'በዋርም እና ሃርድ ዋክስ የሰውነት እና የፊት ፀጉር ማፅዳት፣ Thread አሰራር እና የቆዳ እንክብካቤ።',
    oromoDescription: 'Waxing oowwaa fi jabaa, rifeensa fuulaa fi qaamaa qulqulleessuu, tooftaa Threading fi kunuunsa gogaa wax boodaa.',
    image: 'https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?auto=format&fit=crop&w=1200&q=80',
    skills: [
      'Hard Wax vs Soft Strip Wax Techniques',
      'Facial Waxing (Brows, Lip, Chin)',
      'Full Body & Sensitive Area Waxing',
      'Eyebrow Threading & Shaping',
      'Ingrown Hair Treatment & Skin Prep',
      'Hygiene, Sanitation & Infection Prevention'
    ],
    amharicSkills: [
      'የሃርድ ዋክስ እና ሶፍት ዋክስ አጠቃቀም',
      'የፊት እና የሰውነት ዋክሲንግ',
      'የቅንድብ ትሬዲንግ (Threading)',
      'የቆዳ ዝግጅት እና እንክብካቤ'
    ],
    oromoSkills: [
      'Fayyadaminsa Hard Wax fi Soft Wax',
      'Waxing fuulaa fi qaamaa',
      'Threading Nyaara Ijaa',
      'Kunuunsa gogaa qulqulleessuu'
    ],
    trainingUnits: [
      'Wax Temperature & Skin Protection',
      'Directional Hair Removal Application',
      'Threading Technique & Precision',
      'Post-Wax Calming Lotion Application'
    ],
    certification: 'Certified Waxing & Depilatory Specialist'
  }
];
