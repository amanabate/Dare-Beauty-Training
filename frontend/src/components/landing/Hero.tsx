'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, Award, CheckCircle2 } from 'lucide-react';
import { Language } from '../../types';

interface HeroProps {
  currentLang: Language;
  onOpenApply: () => void;
}

export const Hero: React.FC<HeroProps> = ({ currentLang, onOpenApply }) => {
  return (
    <section id="home" className="relative pt-32 pb-20 md:pt-44 md:pb-28 overflow-hidden bg-[var(--bg-base)] border-b border-[var(--border-subtle)] transition-colors duration-300">
      {/* Background Hero Image with High-Fashion Editorial Overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          src="/images/dare_institute_hero_1785909254437.jpg"
          alt="Dare Beauty Training Institute Studio"
          className="w-full h-full object-cover opacity-20 filter contrast-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-base)]/90 via-[var(--bg-base)]/75 to-[var(--bg-base)]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Institution Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center space-x-2 px-4 py-1.5 glass-surface rounded-full mb-6 border-[#E9C349]/30"
          >
            <Sparkles className="w-4 h-4 text-[#E9C349]" />
            <span className="font-mono text-xs font-semibold tracking-wider uppercase text-[#E9C349]">
              {currentLang === 'en' 
                ? "Dare Women's & Men's Beauty Training Institute" 
                : currentLang === 'am'
                ? "ደሬ የሴቶች እና የወንዶች የውበት ሙያ ማሰልጠኛ ተቋም"
                : "Dhaabbata Leenjii Miidhagina Dubartootaa fi Dhiiraa Dare"}
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-[var(--text-primary)] leading-[1.08] mb-6"
          >
            {currentLang === 'en' ? (
              <>
                Become a Certified <br className="hidden sm:inline" />
                <span className="text-[var(--text-primary)] relative inline-block">
                  Beauty Professional
                  <span className="absolute left-0 bottom-1 w-full h-[3px] bg-gradient-to-r from-[#f5d468] via-[#E9C349] to-[#c49f27]" />
                </span>
              </>
            ) : currentLang === 'am' ? (
              <>
                የተረጋገጠ <br className="hidden sm:inline" />
                <span className="text-[var(--text-primary)] relative inline-block">
                  የውበት ባለሙያ ይሁኑ
                  <span className="absolute left-0 bottom-1 w-full h-[3px] bg-gradient-to-r from-[#f5d468] via-[#E9C349] to-[#c49f27]" />
                </span>
              </>
            ) : (
              <>
                Ogeessa Miidhaginaa <br className="hidden sm:inline" />
                <span className="text-[var(--text-primary)] relative inline-block">
                  Beekamtii Qabu Ta'aa
                  <span className="absolute left-0 bottom-1 w-full h-[3px] bg-gradient-to-r from-[#f5d468] via-[#E9C349] to-[#c49f27]" />
                </span>
              </>
            )}
          </motion.h1>

          {/* Subtitle / Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-base sm:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto mb-10 leading-relaxed font-sans"
          >
            {currentLang === 'en' 
              ? "Learn professional beauty skills through practical training, expert guidance, and career-focused education at Dare Women's & Men's Beauty Training Institute."
              : currentLang === 'am'
              ? "በደሬ የሴቶች እና የወንዶች የውበት ሙያ ማሰልጠኛ ተቋም በከፍተኛ ባለሙያዎች፣ በተግባር ልምምድ እና በዘመናዊ መንገድ የውበት ሙያን በጥራት ይማሩ።"
              : "Dhaabbata Leenjii Miidhagina Dubartootaa fi Dhiiraa Dare keessatti leenjii shaakalaa, gorsa hayyootaa fi ogummaa gabaa irratti xiyyeeffateen baradhaa."}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 mb-16"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              onClick={onOpenApply}
              className="w-full sm:w-auto px-9 py-4 bg-[#E9C349] text-[#0F0F10] text-xs font-sans font-bold tracking-widest uppercase rounded-xl transition-all shadow-[0_0_24px_rgba(233,195,73,0.35)] hover:bg-[#f5d468] flex items-center justify-center space-x-2 group touch-target"
            >
              <span>{currentLang === 'en' ? 'Apply Now' : currentLang === 'am' ? 'አሁኑኑ ያመልክቱ' : 'Amma Galmaa\'aa'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-[#0F0F10]" />
            </motion.button>

            <motion.a
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              href="#programs"
              className="w-full sm:w-auto px-9 py-4 bg-white/10 border border-white/15 backdrop-blur text-[var(--text-primary)] text-xs font-sans font-bold tracking-widest uppercase rounded-xl hover:bg-white/20 transition-all flex items-center justify-center space-x-2 touch-target"
            >
              <span>{currentLang === 'en' ? 'Explore Programs' : currentLang === 'am' ? 'ኮርሶችን ይመልከቱ' : 'Prograamota Ilaalaa'}</span>
            </motion.a>
          </motion.div>

          {/* Highlights / Trust Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 border-t border-[var(--border-subtle)] max-w-3xl mx-auto text-left"
          >
            <div className="flex items-center space-x-2 text-xs font-sans font-medium text-[var(--text-primary)]">
              <CheckCircle2 className="w-4 h-4 text-[#E9C349] shrink-0" />
              <span>{currentLang === 'en' ? '80% Practical Hands-on' : currentLang === 'am' ? '80% የተግባር ልምምድ' : '80% Shaakala Harkaa'}</span>
            </div>
            <div className="flex items-center space-x-2 text-xs font-sans font-medium text-[var(--text-primary)]">
              <Award className="w-4 h-4 text-[#E9C349] shrink-0" />
              <span>{currentLang === 'en' ? 'Accredited Certificate' : currentLang === 'am' ? 'ህጋዊ ሰርተፊኬት' : 'Waraqaa Ragaa Beekamtii'}</span>
            </div>
            <div className="flex items-center space-x-2 text-xs font-sans font-medium text-[var(--text-primary)]">
              <CheckCircle2 className="w-4 h-4 text-[#E9C349] shrink-0" />
              <span>{currentLang === 'en' ? 'Women & Men Shifts' : currentLang === 'am' ? 'ለሴቶች እና ለወንዶች' : 'Dubartootaa fi Dhiirotaaf'}</span>
            </div>
            <div className="flex items-center space-x-2 text-xs font-sans font-medium text-[var(--text-primary)]">
              <Award className="w-4 h-4 text-[#E9C349] shrink-0" />
              <span>{currentLang === 'en' ? 'Job Placement Support' : currentLang === 'am' ? 'የስራ እድል ትስስር' : 'Deeggarsa Carraa Hojii'}</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
