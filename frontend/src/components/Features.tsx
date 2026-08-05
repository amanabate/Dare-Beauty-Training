'use client';

import React from 'react';
import { motion } from 'motion/react';
import { 
  GraduationCap, 
  Sparkles, 
  Users, 
  Scissors, 
  Briefcase, 
  Award, 
  TrendingUp, 
  CheckCircle 
} from 'lucide-react';
import { featuresData } from '../data/instituteData';
import { Language } from '../types';

interface FeaturesProps {
  currentLang: Language;
}

export const Features: React.FC<FeaturesProps> = ({ currentLang }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'GraduationCap': return <GraduationCap className="w-6 h-6 text-[#D4AF37]" />;
      case 'Sparkles': return <Sparkles className="w-6 h-6 text-[#D4AF37]" />;
      case 'Users': return <Users className="w-6 h-6 text-[#D4AF37]" />;
      case 'Scissors': return <Scissors className="w-6 h-6 text-[#D4AF37]" />;
      case 'Briefcase': return <Briefcase className="w-6 h-6 text-[#D4AF37]" />;
      case 'Award': return <Award className="w-6 h-6 text-[#D4AF37]" />;
      case 'TrendingUp': return <TrendingUp className="w-6 h-6 text-[#D4AF37]" />;
      default: return <CheckCircle className="w-6 h-6 text-[#D4AF37]" />;
    }
  };

  return (
    <section id="why-us" className="py-24 bg-[#FDF8F8] dark:bg-[#0B0B0B] relative transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 text-xs font-semibold tracking-widest uppercase text-[#A08000] dark:text-[#D4AF37] mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{currentLang === 'en' ? 'The Dare Advantage' : currentLang === 'am' ? 'የደሬ ኢንስቲትዩት ብልጫዎች' : 'Caalmaya Dhaabbata Dare'}</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl font-semibold text-[#111111] dark:text-[#FFFFFF] leading-tight mb-4">
            {currentLang === 'en' ? 'Why Choose Dare Institute?' : currentLang === 'am' ? 'ለምን ደሬ ኢንስቲትዩትን ይመርጣሉ?' : 'Maaliif Dhaabbata Dare Filattu?'}
          </h2>

          <p className="text-[#444748] dark:text-[#CCCCCC] text-base">
            {currentLang === 'en'
              ? 'We provide more than just beauty classes. We build confident beauty professionals, business leaders, and master stylists.'
              : currentLang === 'am'
              ? 'ከመደበኛ ትምህርት በላይ የራስዎን ገቢ መፍጠር የሚያስችል የተሟላ የሙያ እና የቢዝነስ እውቀት እንሰጣለን።'
              : 'Barumsa kutaatiin alatti ogeessota miidhaginaa fi gaggeessitoota dandeessifna.'}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuresData.map((feature, idx) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-white dark:bg-[#171717] border border-[#D4AF37]/30 p-8 hover:border-[#D4AF37] hover:shadow-xl transition-all duration-300 relative group"
            >
              {/* Top Accent Line */}
              <div className="absolute top-0 left-0 w-0 h-[3px] bg-[#D4AF37] group-hover:w-full transition-all duration-500" />

              <div className="p-3 bg-[#FFF8F0] dark:bg-[#222222] border border-[#D4AF37]/30 w-fit mb-6 group-hover:bg-[#111111] dark:group-hover:bg-[#D4AF37] transition-colors">
                {getIcon(feature.icon)}
              </div>

              <h3 className="font-serif text-xl font-bold text-[#111111] dark:text-[#FFFFFF] mb-2 group-hover:text-[#A08000] dark:group-hover:text-[#D4AF37] transition-colors">
                {currentLang === 'en' ? feature.title : currentLang === 'am' ? feature.amharicTitle : (feature.oromoTitle || feature.title)}
              </h3>

              <p className="text-xs text-[#444748] dark:text-[#CCCCCC] leading-relaxed">
                {currentLang === 'en' ? feature.description : currentLang === 'am' ? feature.amharicDescription : (feature.oromoDescription || feature.description)}
              </p>
            </motion.div>
          ))}

          {/* Bonus Highlight Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="bg-[#111111] dark:bg-[#171717] text-white p-8 border border-[#D4AF37] flex flex-col justify-between relative shadow-xl"
          >
            <div>
              <div className="text-xs font-mono tracking-widest text-[#D4AF37] uppercase mb-2">
                ★ {currentLang === 'en' ? 'Exclusive Benefit' : currentLang === 'am' ? 'ልዩ እድል' : 'Carraa Addaa'}
              </div>
              <h3 className="font-serif text-2xl font-bold text-white mb-3">
                {currentLang === 'en' ? 'Salon Start-up Mentorship' : currentLang === 'am' ? 'የራስዎን ሳሎን ለመክፈት የምክር አገልግሎት' : 'Gorsa Mana Miidhaginaa Banuu'}
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed mb-6">
                {currentLang === 'en'
                  ? 'Graduates receive guidance on salon licensing, equipment purchasing, client retention strategies, and pricing in Addis Ababa.'
                  : currentLang === 'am'
                  ? 'ተመርቀው ሲወጡ የራሳቸውን ሳሎን እንዴት እንደሚከፍቱ፣ እቃዎችን ከየት እንደሚያስመጡ እና ደንበኛ እንደሚያፈሩ ሙሉ ድጋፍ እናደርጋለን።'
                  : 'Eebbifamtootni hayyama, meeshaalee fi teessoo gabaa irratti gorsa argatu.'}
              </p>
            </div>

            <a
              href="#admissions"
              className="inline-flex items-center space-x-2 text-xs font-semibold tracking-wider uppercase text-[#D4AF37] hover:text-white transition-colors"
            >
              <span>{currentLang === 'en' ? 'Learn Admission Steps' : currentLang === 'am' ? 'የምዝገባ ደረጃዎች' : 'Sadarkaa Galmee'}</span>
              <span>→</span>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
