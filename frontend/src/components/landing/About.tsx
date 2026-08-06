'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { ArrowRight, Check, Target, Eye, ShieldCheck, Sparkles, X } from 'lucide-react';
import { Language } from '../../types';

interface AboutProps {
  currentLang: Language;
  onOpenApply: () => void;
}

export const About: React.FC<AboutProps> = ({ currentLang, onOpenApply }) => {
  const [storyModalOpen, setStoryModalOpen] = useState(false);

  return (
    <section id="about" className="py-24 bg-[#FDF8F8] dark:bg-[#0B0B0B] relative transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column - Copy & Mission */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-6 space-y-6"
          >
            <div className="inline-flex items-center space-x-2 text-xs font-semibold tracking-widest uppercase text-[#A08000] dark:text-[#D4AF37]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{currentLang === 'en' ? 'About Dare Institute' : currentLang === 'am' ? 'ስለ ደሬ የውበት ኢንስቲትዩት' : 'Sinaa Dhaabbata Dare'}</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#111111] dark:text-[#FFFFFF] leading-tight">
              {currentLang === 'en' ? (
                <>Cultivating Excellence <br />in Beauty Education</>
              ) : currentLang === 'am' ? (
                <>በውበት ትምህርት የላቀ <br />ብቃትን ማጎልበት</>
              ) : (
                <>Barumsa Miidhaginaa Keessatti <br />Gita Dhabeessa Ta'uu</>
              )}
            </h2>

            <div className="space-y-4 text-[#444748] dark:text-[#CCCCCC] text-base leading-relaxed font-normal">
              <p>
                {currentLang === 'en' 
                  ? "At Dare Institute, we merge professional rigor with high-fashion elegance. Our curriculum is designed for those who view career transformation as an art form. We provide an elite environment where discipline meets creativity."
                  : currentLang === 'am'
                  ? "በደሬ ኢንስቲትዩት የሙያ ጥራትን ከዘመናዊ ፋሽን ጋር አዋህደን እናስተምራለን። የትምህርት ካሪኩለማችን በውበት ዘርፍ ውጤታማ እና ተወዳዳሪ ባለሙያ ለመሆን ለሚመኙ የተዘጋጀ ነው።"
                  : "Dhaabbata Dare keessatti ogummaa sadarkaa olaanaa fi miidhagina Ammayyaa walitti makuun leenjisa. Sirni barumsaa keenya ogeessa dandeettii qabu oomishuu irratti xiyyeeffata."}
              </p>
              <p>
                {currentLang === 'en'
                  ? "Our internationally recognized training ensures that every student masters the techniques required to excel in the premium beauty industry. From practical fundamentals to advanced editorial styling, our approach is meticulous and uncompromising."
                  : currentLang === 'am'
                  ? "አለምአቀፍ ደረጃውን የጠበቀ ስልጠናችን እያንዳንዱ ተማሪ በውበት ኢንደስትሪው ውስጥ ብቁ እና ስኬታማ እንዲሆን ያደርጋል። ከመሰረታዊ አሰራር ጀምሮ እስከ ከፍተኛ ደረጃ የስታይሊንግ ጥበብ በጥራት ይሰጣል።"
                  : "Leenjiin keenya beekamtii sadarkaa idil-addunyaa qabu barattoonni keenya sekteera miidhaginaa keessatti milkaa'oo akka ta'an mirkaneessa. Shaakala jalqabaa irraa kaasee hanga ammayyaatti kaffalama."}
              </p>
            </div>

            {/* Core Values / Mission & Vision Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#E5E2E1] dark:border-[#262626]">
              <div className="p-4 bg-[#FFF8F0] dark:bg-[#171717] border-l-2 border-[#D4AF37]">
                <div className="flex items-center space-x-2 mb-1">
                  <Target className="w-4 h-4 text-[#D4AF37]" />
                  <h3 className="font-serif font-bold text-sm text-[#111111] dark:text-[#FFFFFF]">
                    {currentLang === 'en' ? 'Our Mission' : currentLang === 'am' ? 'ተልዕኳችን' : 'Ergama Keenya'}
                  </h3>
                </div>
                <p className="text-xs text-[#444748] dark:text-[#CCCCCC]">
                  {currentLang === 'en'
                    ? 'Empowering women and men with high-value vocational beauty skills for career independence.'
                    : currentLang === 'am'
                    ? 'ሴቶችን እና ወንዶችን በከፍተኛ የውበት ሙያ በማሰልጠን የራሳቸውን ገቢ እና ስራ እንዲፈጥሩ ማስቻልት።'
                    : 'Dubartoota fi dhiirota ogummaa miidhaginaa sadarkaa olaanaatiin dandeessisuun of danda\'oo gochuu.'}
                </p>
              </div>

              <div className="p-4 bg-[#FFF8F0] dark:bg-[#171717] border-l-2 border-[#D4AF37]">
                <div className="flex items-center space-x-2 mb-1">
                  <Eye className="w-4 h-4 text-[#D4AF37]" />
                  <h3 className="font-serif font-bold text-sm text-[#111111] dark:text-[#FFFFFF]">
                    {currentLang === 'en' ? 'Our Vision' : currentLang === 'am' ? 'ራዕያችን' : 'Mul\'ata Keenya'}
                  </h3>
                </div>
                <p className="text-xs text-[#444748] dark:text-[#CCCCCC]">
                  {currentLang === 'en'
                    ? 'To be East Africa’s premier vocational beauty academy producing world-class stylists and salon owners.'
                    : currentLang === 'am'
                    ? 'በምስራቅ አፍሪካ ቀዳሚው የውበት ማሰልጠኛ ተቋም በመሆን ብቁ ባለሙያዎችን ማፍራት።'
                    : 'Afrikaa Bahaa keessatti akadaamii leenjii miidhaginaa isa duraa ta\'uun ogeessota idil-addunyaa oomishuu.'}
                </p>
              </div>
            </div>

            {/* Read Our Story Link */}
            <div className="pt-2">
              <button
                onClick={() => setStoryModalOpen(true)}
                className="inline-flex items-center space-x-2 text-xs font-semibold tracking-widest uppercase text-[#111111] dark:text-[#FFFFFF] hover:text-[#A08000] dark:hover:text-[#D4AF37] border-b border-[#D4AF37] pb-1 transition-all group"
              >
                <span>{currentLang === 'en' ? 'Read Our Full Story' : currentLang === 'am' ? 'የኢንስቲትዩቱን ታሪክ ያንብቡ' : 'Seenaa Keenya Guutuu Dubbisaa'}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-[#D4AF37]" />
              </button>
            </div>
          </motion.div>

          {/* Right Column - Image Card Frame */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-6"
          >
            <div className="relative p-2 bg-white dark:bg-[#171717] border border-[#D4AF37]/40 shadow-xl">
              <div className="relative aspect-[4/3] sm:aspect-[1/1] overflow-hidden">
                <img
                  src="/images/dare_about_training_1785909267732.jpg"
                  alt="Dare Beauty Institute Practical Training"
                  className="w-full h-full object-cover filter contrast-105 hover:scale-105 transition-transform duration-700"
                />
              </div>

              {/* Floating Badge */}
              <div className="absolute -bottom-6 -left-6 bg-[#111111] dark:bg-[#0B0B0B] text-white p-5 border border-[#D4AF37] shadow-xl max-w-xs hidden sm:block">
                <div className="flex items-center space-x-3">
                  <ShieldCheck className="w-8 h-8 text-[#D4AF37] shrink-0" />
                  <div>
                    <h4 className="font-serif font-bold text-sm text-[#D4AF37]">
                      {currentLang === 'en' ? 'Accredited Institute' : currentLang === 'am' ? 'በህግ የተመዘገበ ተቋም' : 'Dhaabbata Beekamtii Qabu'}
                    </h4>
                    <p className="text-[11px] text-gray-300">
                      {currentLang === 'en' ? 'Certified by Vocational Training Authorities' : currentLang === 'am' ? 'የሙያና ቴክኒክ አቅም ማረጋገጫ ያለው' : 'Abbaa Taayitaa Leenjii Ogummaatiin Mirkanaa\'e'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Story Modal */}
      {storyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#FDF8F8] dark:bg-[#171717] border border-[#D4AF37] p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative shadow-2xl"
          >
            <button
              onClick={() => setStoryModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-[#111111] dark:text-white hover:text-[#D4AF37]"
            >
              <X className="w-6 h-6" />
            </button>

            <h3 className="font-serif text-2xl font-bold text-[#111111] dark:text-[#FFFFFF] mb-4 border-b border-[#D4AF37]/30 pb-2">
              {currentLang === 'en' ? 'The Dare Institute Story' : currentLang === 'am' ? 'የደሬ የውበት ኢንስቲትዩት ታሪክ' : 'Seenaa Dhaabbata Dare'}
            </h3>

            <div className="space-y-4 text-sm text-[#444748] dark:text-[#CCCCCC] leading-relaxed">
              <p>
                {currentLang === 'en'
                  ? 'Dare Women’s & Men’s Beauty Training Institute was established with a singular vision: to revolutionize vocational beauty education in Ethiopia by providing international-standard practical training for both female and male students.'
                  : currentLang === 'am'
                  ? 'ደሬ የሴቶች እና የወንዶች የውበት ሙያ ማሰልጠኛ ተቋም በኢትዮጵያ የውበት ትምህርትን በአለምአቀፍ ደረጃ ለማሳደግ እና ለሴቶችም ሆነ ለወንዶች ሰፊ የስራ እድል ለመፍጠር የተመሰረተ ተቋም ነው።'
                  : 'Dhaabbatan Leenjii Miidhagina Dubartootaa fi Dhiiraa Dare barumsa ogummaa miidhaginaa Itiyoophiyaa keessatti sadarkaa idil-addunyaatti ol kaasuuf hundaa\'e.'}
              </p>
              <p>
                {currentLang === 'en'
                  ? 'Unlike standard beauty salons, Dare Institute is a dedicated vocational academy. We combine state-of-the-art workstations, professional cosmetic products, and rigorous curriculum modules covering Hair Dressing, Barbering, Makeup Artistry, Nail Tech, Esthetics, and Salon Management.'
                  : currentLang === 'am'
                  ? 'ተቋማችን ከተራ ሳሎን የተለየ የተሟላ የሙያ አካዳሚ ሲሆን በዘመናዊ እቃዎች፣ ጥራት ባላቸው ምርቶች እና በባለሙያ መምህራን የተደራጀ ነው።'
                  : 'Dhaabbanni keenya mana miidhaginaa caalaa akadaamii ogummaa guutuu ta\'ee meeshaalee ammayyaatiin kan gurmaa\'edha.'}
              </p>
              <p>
                {currentLang === 'en'
                  ? 'Over the past decade, we have trained and certified over 3,500 successful graduates who now manage top beauty salons, work in 5-star hotel spas, or run their own thriving beauty businesses across Ethiopia and internationally.'
                  : currentLang === 'am'
                  ? 'ባለፉት አመታት ከ3,500 በላይ ሰልጣኞችን አስመርቀን ለስራ እና ለራሳቸው የውበት ድርጅት ባለቤትነት አብቅተናል።'
                  : 'Waggaatti barattoota 3,500 ol leenjisee eebbisiisuun carraa hojii uumera.'}
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-[#E5E2E1] dark:border-[#262626] flex justify-end">
              <button
                onClick={() => {
                  setStoryModalOpen(false);
                  onOpenApply();
                }}
                className="px-6 py-2.5 bg-[#111111] dark:bg-[#D4AF37] text-white dark:text-black text-xs font-semibold tracking-wider uppercase hover:bg-[#D4AF37] dark:hover:bg-white hover:text-black transition-colors"
              >
                {currentLang === 'en' ? 'Enroll Today' : currentLang === 'am' ? 'አሁኑኑ ይመዝገቡ' : 'Amma Galmaa\'aa'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </section>
  );
};
