'use client';

import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles, PhoneCall } from 'lucide-react';
import { Language } from '../../types';

interface CTAProps {
  currentLang: Language;
  onOpenApply: () => void;
  onOpenContact: () => void;
}

export const CTA: React.FC<CTAProps> = ({ currentLang, onOpenApply, onOpenContact }) => {
  return (
    <section className="py-24 bg-[#111111] dark:bg-[#0B0B0B] text-white relative overflow-hidden border-t border-[#D4AF37]/40 transition-colors duration-300">
      {/* Background Accent Lines */}
      <div className="absolute inset-0 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:32px_32px] opacity-10 pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 bg-[#FFF8F0]/10 border border-[#D4AF37] text-[#D4AF37] text-xs font-semibold tracking-widest uppercase mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>
              {currentLang === 'en' 
                ? 'Your Beauty Career Begins Here' 
                : currentLang === 'am'
                ? 'የስኬት ጉዞዎን ከደሬ ኢንስቲትዩት ጋር ይጀምሩ'
                : 'Imalli Ogummaa Miidhagina Keessan Asitti Jalqaba'}
            </span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight mb-6 max-w-4xl mx-auto">
            {currentLang === 'en' ? (
              <>Start Your Journey Toward a <br />Successful Beauty Career Today</>
            ) : currentLang === 'am' ? (
              <>ወደ ስኬታማ የውበት ሙያ <br />የሚያደርሰውን ጉዞዎን ዛሬውኑ ይጀምሩ</>
            ) : (
              <>Imala Gara Ogummaa Miidhaginaa <br />Milkaa'aatti Geessu Har'uma Jalqabaa</>
            )}
          </h2>

          <p className="text-gray-300 text-sm sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            {currentLang === 'en'
              ? 'Join hundreds of certified beauty professionals trained at Dare Women’s & Men’s Beauty Training Institute. Limited seats available for the upcoming batch.'
              : currentLang === 'am'
              ? 'በደሬ የሴቶች እና የወንዶች የውበት ሙያ ማሰልጠኛ ተቋም ሰልጥነው ስኬታማ ከሆኑ አያሌ ባለሙያዎች ጋር የተቀላቀሉ። ቦታዎች ውስን በመሆናቸው ፈጥነው ያመልክቱ።'
              : 'Dhaabbata Leenjii Miidhagina Dubartootaa fi Dhiiraa Dare keessatti leenjifamuun barattoota milkaa\'an sadii ol waliin deemaa.'}
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <button
              onClick={onOpenApply}
              className="w-full sm:w-auto px-9 py-4 bg-[#D4AF37] text-black text-xs font-bold uppercase tracking-widest hover:bg-white transition-all shadow-xl flex items-center justify-center space-x-2 group"
            >
              <span>{currentLang === 'en' ? 'Apply Now' : currentLang === 'am' ? 'አሁኑኑ ያመልክቱ' : 'Amma Galmaa\'aa'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onOpenContact}
              className="w-full sm:w-auto px-9 py-4 border border-[#D4AF37] text-white text-xs font-semibold uppercase tracking-widest hover:bg-[#FFF8F0]/10 transition-colors flex items-center justify-center space-x-2"
            >
              <PhoneCall className="w-4 h-4 text-[#D4AF37]" />
              <span>{currentLang === 'en' ? 'Contact Us' : currentLang === 'am' ? 'ደውለው ያናግሩን' : 'Nu Quunnamaa'}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
