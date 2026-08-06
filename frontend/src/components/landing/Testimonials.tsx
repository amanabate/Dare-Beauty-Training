'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Star, Quote, Sparkles } from 'lucide-react';
import { testimonialsData } from '../../data/instituteData';
import { Language } from '../../types';

interface TestimonialsProps {
  currentLang: Language;
}

export const Testimonials: React.FC<TestimonialsProps> = ({ currentLang }) => {
  return (
    <section className="py-24 bg-[#FFF8F0]/70 dark:bg-[#0B0B0B] relative border-t border-b border-[#E5E2E1] dark:border-[#262626] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 text-xs font-semibold tracking-widest uppercase text-[#A08000] dark:text-[#D4AF37] mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{currentLang === 'en' ? 'Alumni Stories' : currentLang === 'am' ? 'የተማሪዎቻችን ምስክሮች' : 'Dhugaa Ba\'umsa Eebbifamtootaa'}</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl font-semibold text-[#111111] dark:text-[#FFFFFF] leading-tight mb-4">
            {currentLang === 'en' ? 'Student Success Stories' : currentLang === 'am' ? 'የተመረቁ ተማሪዎች የስኬት ታሪክ' : 'Seenaa Milkaa\'ina Barattootaa'}
          </h2>

          <p className="text-[#444748] dark:text-[#CCCCCC] text-base">
            {currentLang === 'en'
              ? 'Hear how training at Dare Institute transformed our students into successful salon owners, celebrity stylists, and beauty specialists.'
              : currentLang === 'am'
              ? 'በደሬ ኢንስቲትዩት ሰልጥነው የራሳቸውን ስራ እና ሳሎን የከፈቱ ተማሪዎቻችን የተናገሩትን ይስሙ።'
              : 'Akkaataa leenjiin Dare jireenya barattoota keenyaa jijjiire dhaga\'aa.'}
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonialsData.map((testimonial, idx) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-white dark:bg-[#171717] border border-[#D4AF37]/30 p-8 flex flex-col justify-between relative shadow-sm hover:border-[#D4AF37] hover:shadow-xl transition-all"
            >
              <Quote className="w-8 h-8 text-[#D4AF37]/40 mb-4" />

              {/* Stars */}
              <div className="flex space-x-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#D4AF37] text-[#D4AF37]" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-xs text-[#444748] dark:text-[#CCCCCC] leading-relaxed italic mb-8">
                "{currentLang === 'en' ? testimonial.quote : currentLang === 'am' ? testimonial.amharicQuote : (testimonial.oromoQuote || testimonial.quote)}"
              </p>

              {/* Author Footer */}
              <div className="flex items-center space-x-4 pt-4 border-t border-[#F7F3F2] dark:border-[#262626]">
                <img
                  src={testimonial.photo}
                  alt={testimonial.name}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-full object-cover border border-[#D4AF37]"
                />
                <div>
                  <h3 className="font-serif font-bold text-sm text-[#111111] dark:text-[#FFFFFF]">
                    {testimonial.name}
                  </h3>
                  <p className="text-[11px] font-semibold text-[#A08000] dark:text-[#D4AF37]">
                    {testimonial.role}
                  </p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400">
                    {testimonial.program}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
