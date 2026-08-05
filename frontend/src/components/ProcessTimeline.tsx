'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowDown } from 'lucide-react';
import { processSteps } from '../data/instituteData';
import { Language } from '../types';

interface ProcessTimelineProps {
  currentLang: Language;
  onOpenApply: () => void;
}

export const ProcessTimeline: React.FC<ProcessTimelineProps> = ({ currentLang, onOpenApply }) => {
  return (
    <section className="py-24 bg-[#FFF8F0]/80 dark:bg-[#0B0B0B] relative border-t border-b border-[#E5E2E1] dark:border-[#262626] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 text-xs font-semibold tracking-widest uppercase text-[#A08000] dark:text-[#D4AF37] mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{currentLang === 'en' ? 'Student Journey' : currentLang === 'am' ? 'የተማሪዎች ጉዞ' : 'Imala Barattootaa'}</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl font-semibold text-[#111111] dark:text-[#FFFFFF] leading-tight mb-4">
            {currentLang === 'en' ? '5-Step Training Process' : currentLang === 'am' ? 'የ 5-ደረጃ ስልጠና ሂደት' : 'Adeemsa Leenjii Sadarkaa 5'}
          </h2>

          <p className="text-[#444748] dark:text-[#CCCCCC] text-base">
            {currentLang === 'en'
              ? 'A structured pathway designed to transform beginner enthusiasm into certified professional mastery.'
              : currentLang === 'am'
              ? 'ከምዝገባ ጀምሮ በስኬት ተመርቀው ስራ እስከመያዝ ያለው ቀላል እና ግልፅ አካሄድ።'
              : 'Jalqaba irraa kaasee hanga eebbaatti adeemsa salphaa fi ifa ta\'e.'}
          </p>
        </div>

        {/* Timeline Desktop Grid / Mobile Stack */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          {processSteps.map((step, idx) => (
            <React.Fragment key={step.step}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white dark:bg-[#171717] border border-[#D4AF37]/40 p-6 flex flex-col justify-between relative shadow-sm hover:border-[#111111] dark:hover:border-[#D4AF37] hover:shadow-lg transition-all group"
              >
                {/* Step Gold Number */}
                <div>
                  <div className="flex justify-between items-center mb-4 pb-2 border-b border-[#F7F3F2] dark:border-[#262626]">
                    <span className="font-serif text-3xl font-bold text-[#D4AF37] group-hover:text-[#111111] dark:group-hover:text-[#FFFFFF] transition-colors">
                      0{step.step}
                    </span>
                    <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
                  </div>

                  <h3 className="font-serif text-base font-bold text-[#111111] dark:text-[#FFFFFF] mb-2">
                    {currentLang === 'en' ? step.title : currentLang === 'am' ? step.amharicTitle : (step.oromoTitle || step.title)}
                  </h3>

                  <p className="text-xs text-[#444748] dark:text-[#CCCCCC] leading-relaxed">
                    {currentLang === 'en' ? step.desc : currentLang === 'am' ? step.amharicDesc : (step.oromoDesc || step.desc)}
                  </p>
                </div>

                {step.step === 5 && (
                  <button
                    onClick={onOpenApply}
                    className="mt-4 w-full py-2 bg-[#111111] dark:bg-[#D4AF37] text-white dark:text-black text-[11px] uppercase tracking-wider font-semibold hover:bg-[#D4AF37] dark:hover:bg-white hover:text-black transition-colors"
                  >
                    {currentLang === 'en' ? 'Start Step 1' : currentLang === 'am' ? 'ደረጃ 1ን ይጀምሩ' : 'Sadarkaa 1 Jalqabaa'}
                  </button>
                )}
              </motion.div>

              {/* Arrow Connector for Mobile */}
              {idx < processSteps.length - 1 && (
                <div className="flex md:hidden justify-center my-1 text-[#D4AF37]">
                  <ArrowDown className="w-5 h-5 animate-bounce" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};
