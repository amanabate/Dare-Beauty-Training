'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, CheckCircle2, FileText, Calendar, CreditCard, ShieldCheck } from 'lucide-react';
import { Language } from '../types';

interface AdmissionsProps {
  currentLang: Language;
  onOpenApply: () => void;
}

export const Admissions: React.FC<AdmissionsProps> = ({ currentLang, onOpenApply }) => {
  return (
    <section id="admissions" className="py-24 bg-[#FDF8F8] dark:bg-[#0B0B0B] relative transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 text-xs font-semibold tracking-widest uppercase text-[#A08000] dark:text-[#D4AF37] mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{currentLang === 'en' ? 'Admission & Registration' : currentLang === 'am' ? 'የምዝገባ ሂደት እና መረጃ' : 'Adeemsa Galmee fi Odeeffannoo'}</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl font-semibold text-[#111111] dark:text-[#FFFFFF] leading-tight mb-4">
            {currentLang === 'en' ? 'Start Your Application Today' : currentLang === 'am' ? 'አሁኑኑ መመዝገብ ይጀምሩ' : 'Har\'ama Galmaa\'uu Jalqabaa'}
          </h2>

          <p className="text-[#444748] dark:text-[#CCCCCC] text-base">
            {currentLang === 'en'
              ? 'Enrollment is open for upcoming morning, afternoon, and weekend batches. No prior beauty experience required.'
              : currentLang === 'am'
              ? 'ለቀጣዩ የስልጠና ዙር በጠዋት፣ በከሰዓት እና በሳምንት መጨረሻ ክፍለ ጊዜዎች ምዝገባ ተጀምሯል።'
              : 'Marsaa dhufuuf ganama, waareessaan fi dhuma torbaniitiin galmeen banameera.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Requirements & Info */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-7 space-y-6"
          >
            <div className="bg-white dark:bg-[#171717] border border-[#D4AF37]/40 p-8 shadow-sm">
              <h3 className="font-serif text-2xl font-bold text-[#111111] dark:text-[#FFFFFF] mb-6 flex items-center space-x-2">
                <FileText className="w-5 h-5 text-[#D4AF37]" />
                <span>{currentLang === 'en' ? 'Admission Requirements' : currentLang === 'am' ? 'ለመመዝገብ የሚያስፈልጉ ቅድመ ሁኔታዎች' : 'Ulaagaalee Galmeedhaaf Barbaachisan'}</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[#444748] dark:text-[#CCCCCC]">
                <div className="p-3 bg-[#FFF8F0] dark:bg-[#222222] border-l-2 border-[#D4AF37] flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-[#111111] dark:text-[#FFFFFF]">
                      {currentLang === 'en' ? 'Valid Identification' : currentLang === 'am' ? 'ህጋዊ መታወቂያ' : 'Waraqaa Eenyummaa Seeraa'}
                    </strong>
                    <span>{currentLang === 'en' ? 'Copy of Kebele ID or Passport' : currentLang === 'am' ? 'የቀበሌ መታወቂያ ወይም ፓስፖርት ኮፒ' : 'Koppii Eenyummaa Gandaa ykn Paaspoortii'}</span>
                  </div>
                </div>

                <div className="p-3 bg-[#FFF8F0] dark:bg-[#222222] border-l-2 border-[#D4AF37] flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-[#111111] dark:text-[#FFFFFF]">
                      {currentLang === 'en' ? 'Passport Photographs' : currentLang === 'am' ? 'ጉርድ ፎቶግራፍ' : 'Suuraa Paaspoortii'}
                    </strong>
                    <span>{currentLang === 'en' ? '2 recent passport size photos' : currentLang === 'am' ? '2 አዲስ ጉርድ ፎቶግራፎች' : 'Suuraa Paaspoortii Haarawa 2'}</span>
                  </div>
                </div>

                <div className="p-3 bg-[#FFF8F0] dark:bg-[#222222] border-l-2 border-[#D4AF37] flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-[#111111] dark:text-[#FFFFFF]">
                      {currentLang === 'en' ? 'Educational Background' : currentLang === 'am' ? 'የትምህርት ማስረጃ' : 'Sadarkaa Barumsaa'}
                    </strong>
                    <span>{currentLang === 'en' ? 'Minimum Grade 8/10 completion' : currentLang === 'am' ? 'ቢያንስ የ 8ኛ ወይም የ10ኛ ክፍል ማጠናቀቂያ' : 'Kutaa 8 ykn 10 kan Xumure'}</span>
                  </div>
                </div>

                <div className="p-3 bg-[#FFF8F0] dark:bg-[#222222] border-l-2 border-[#D4AF37] flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-[#111111] dark:text-[#FFFFFF]">
                      {currentLang === 'en' ? 'No Prior Experience Needed' : currentLang === 'am' ? 'ቅድመ ተሞክሮ አይጠየቅም' : 'Muuxannoon Duraa Mirkana\'ee Miti'}
                    </strong>
                    <span>{currentLang === 'en' ? 'We train from total beginner level' : currentLang === 'am' ? 'ስልጠናው ከመሰረቱ ይጀመራል' : 'Jalqaba irraa kaasee leenjina'}</span>
                  </div>
                </div>
              </div>

              {/* Flexible Shift Options */}
              <div className="mt-8 pt-6 border-t border-[#E5E2E1] dark:border-[#262626] grid grid-cols-3 gap-3 text-center">
                <div className="p-3 bg-[#FDF8F8] dark:bg-[#222222] border border-[#E5E2E1] dark:border-[#333333]">
                  <Calendar className="w-4 h-4 text-[#D4AF37] mx-auto mb-1" />
                  <span className="block text-xs font-bold text-[#111111] dark:text-[#FFFFFF] uppercase">
                    {currentLang === 'en' ? 'Morning Shift' : currentLang === 'am' ? 'የጠዋት ክፍለጊዜ' : 'Tajaajila Ganamaa'}
                  </span>
                  <span className="text-[10px] text-gray-500 dark:text-gray-400">8:30 AM - 12:30 PM</span>
                </div>

                <div className="p-3 bg-[#FDF8F8] dark:bg-[#222222] border border-[#E5E2E1] dark:border-[#333333]">
                  <Calendar className="w-4 h-4 text-[#D4AF37] mx-auto mb-1" />
                  <span className="block text-xs font-bold text-[#111111] dark:text-[#FFFFFF] uppercase">
                    {currentLang === 'en' ? 'Afternoon Shift' : currentLang === 'am' ? 'የከሰዓት ክፍለጊዜ' : 'Tajaajila Waareessaa'}
                  </span>
                  <span className="text-[10px] text-gray-500 dark:text-gray-400">1:30 PM - 5:30 PM</span>
                </div>

                <div className="p-3 bg-[#FDF8F8] dark:bg-[#222222] border border-[#E5E2E1] dark:border-[#333333]">
                  <Calendar className="w-4 h-4 text-[#D4AF37] mx-auto mb-1" />
                  <span className="block text-xs font-bold text-[#111111] dark:text-[#FFFFFF] uppercase">
                    {currentLang === 'en' ? 'Weekend Shift' : currentLang === 'am' ? 'የሳምንት መጨረሻ' : 'Dhuma Torbanii'}
                  </span>
                  <span className="text-[10px] text-gray-500 dark:text-gray-400">Saturday & Sunday</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Registration CTA Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-5 bg-[#111111] dark:bg-[#171717] text-white p-8 border border-[#D4AF37] shadow-2xl relative"
          >
            <div className="inline-block px-3 py-1 bg-[#D4AF37] text-black text-[10px] font-bold uppercase tracking-widest mb-4">
              {currentLang === 'en' ? 'Instant Registration' : currentLang === 'am' ? 'የቀጥታ ኦንላይን ምዝገባ' : 'Galmee Kallattii Sararaa'}
            </div>

            <h3 className="font-serif text-3xl font-bold text-white mb-3">
              {currentLang === 'en' ? 'Ready to Transform Your Career?' : currentLang === 'am' ? 'ወደ የውበት ሙያ ለመግባት ዝግጁ ነዎት?' : 'Ogummaa keessan jijjiiruuf qophiidhaa?'}
            </h3>

            <p className="text-xs text-gray-300 leading-relaxed mb-6">
              {currentLang === 'en'
                ? 'Fill out our 2-minute online application form to reserve your seat and training kit for the upcoming intake.'
                : currentLang === 'am'
                ? 'የ 2-ደቂቃ የኦንላይን ማመልከቻ ፎርሙን በመሙላት ቦታዎን እና የልምምድ እቃዎችዎን አሁኑኑ ያስይዙ።'
                : 'Unka galmee sarara irraa daqiiqaa 2 guutuun bakka keessan kabachiisaa.'}
            </p>

            <div className="space-y-3 mb-8">
              <div className="flex items-center space-x-2 text-xs text-gray-200">
                <CreditCard className="w-4 h-4 text-[#D4AF37]" />
                <span>{currentLang === 'en' ? 'Flexible Monthly Installments Available' : currentLang === 'am' ? 'ክፍያን በየወሩ በክፍልፋይ መክፈል ይቻላል' : 'Kaffaltii ji\'a ji\'aan kaffaluun ni danda\'ama'}</span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-gray-200">
                <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                <span>{currentLang === 'en' ? 'Free Training Kit Included with Program' : currentLang === 'am' ? 'የልምምድ እቃዎች በነጻ ያካትታል' : 'Meeshaan Shaakalaa Billeen Ni Includama'}</span>
              </div>
            </div>

            <button
              onClick={onOpenApply}
              className="w-full py-4 bg-[#D4AF37] text-black text-xs font-bold uppercase tracking-widest hover:bg-white transition-colors shadow-lg"
            >
              {currentLang === 'en' ? 'Apply Online Now' : currentLang === 'am' ? 'በኦንላይን ያመልክቱ' : 'Sarara Irraan Galmaa\'aa'}
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
