'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Sparkles, HelpCircle } from 'lucide-react';
import { faqData } from '../data/instituteData';
import { Language } from '../types';

interface FAQProps {
  currentLang: Language;
}

export const FAQ: React.FC<FAQProps> = ({ currentLang }) => {
  const [openId, setOpenId] = useState<string | null>('faq1');

  const toggleFAQ = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq" className="py-24 bg-[#FFF8F0]/80 dark:bg-[#0B0B0B] relative border-t border-b border-[#E5E2E1] dark:border-[#262626] transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 text-xs font-semibold tracking-widest uppercase text-[#A08000] dark:text-[#D4AF37] mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{currentLang === 'en' ? 'Frequently Asked Questions' : currentLang === 'am' ? 'ተደጋግመው የሚጠየቁ ጥያቄዎች' : 'Gaaffilee Yeroo Baay\'ee Gaafataman'}</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl font-semibold text-[#111111] dark:text-[#FFFFFF] leading-tight mb-4">
            {currentLang === 'en' ? 'Got Questions? We Have Answers' : currentLang === 'am' ? 'ጥያቄ አልዎት? መልሶቹን እዚህ ያገኛሉ' : 'Gaaffii Qabduu? Deebii Hunda Asitti Argattu'}
          </h2>

          <p className="text-[#444748] dark:text-[#CCCCCC] text-base">
            {currentLang === 'en'
              ? 'Everything you need to know about course structures, certificates, shift hours, and enrollment prerequisites.'
              : currentLang === 'am'
              ? 'ስለ ኮርሶቹ፣ ሰርተፊኬቱ፣ የትምህርት ክፍለጊዜ እና ምዝገባ ማወቅ የሚፈልጉትን መረጃ ያግኙ።'
              : 'Waa\'ee prograamotaa, waraqaa ragaa fi galmee warrren beekuu qabdan.'}
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {faqData.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className={`bg-white dark:bg-[#171717] border transition-all duration-300 ${
                  isOpen ? 'border-[#D4AF37] shadow-md' : 'border-[#D4AF37]/30 hover:border-[#D4AF37]'
                }`}
              >
                <button
                  onClick={() => toggleFAQ(faq.id)}
                  className="w-full p-6 text-left flex items-center justify-between space-x-4 focus:outline-none"
                >
                  <span className="font-serif font-bold text-base sm:text-lg text-[#111111] dark:text-[#FFFFFF]">
                    {currentLang === 'en' ? faq.question : currentLang === 'am' ? faq.amharicQuestion : (faq.oromoQuestion || faq.question)}
                  </span>
                  <div className={`p-1 rounded-full transition-transform duration-300 ${
                    isOpen 
                      ? 'rotate-180 bg-[#111111] dark:bg-[#D4AF37] text-white dark:text-black' 
                      : 'bg-[#FFF8F0] dark:bg-[#222222] text-[#111111] dark:text-[#FFFFFF]'
                  }`}>
                    <ChevronDown className="w-5 h-5" />
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-2 text-xs sm:text-sm text-[#444748] dark:text-[#CCCCCC] leading-relaxed border-t border-[#F7F3F2] dark:border-[#262626]">
                        {currentLang === 'en' ? faq.answer : currentLang === 'am' ? faq.amharicAnswer : (faq.oromoAnswer || faq.answer)}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
