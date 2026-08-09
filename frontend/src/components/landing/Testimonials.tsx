'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, Quote, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { testimonialsData } from '../../data/instituteData';
import { Language } from '../../types';

interface TestimonialsProps {
  currentLang: Language;
}

const PER_PAGE = 3;
const AUTOPLAY_MS = 5000;

export const Testimonials: React.FC<TestimonialsProps> = ({ currentLang }) => {
  const totalPages = Math.ceil(testimonialsData.length / PER_PAGE);
  const [page, setPage] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1); // 1 = forward, -1 = backward
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const goTo = useCallback((next: number, direction: 1 | -1) => {
    setDir(direction);
    setPage((next + totalPages) % totalPages);
  }, [totalPages]);

  const next = useCallback(() => goTo(page + 1,  1), [page, goTo]);
  const prev = useCallback(() => goTo(page - 1, -1), [page, goTo]);

  // Autoplay
  useEffect(() => {
    if (paused) return;
    timerRef.current = setTimeout(next, AUTOPLAY_MS);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [page, paused, next]);

  const pageItems = testimonialsData.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);

  const variants = {
    enter: (d: number) => ({ opacity: 0, x: d * 40 }),
    center: { opacity: 1, x: 0 },
    exit:  (d: number) => ({ opacity: 0, x: d * -40 }),
  };

  const title =
    currentLang === 'en' ? 'Student Success Stories' :
    currentLang === 'am' ? 'የተመረቁ ተማሪዎች የስኬት ታሪክ' :
    'Seenaa Milkaa\'ina Barattootaa';

  const subtitle =
    currentLang === 'en'
      ? 'Hear how training at Dare Institute transformed our students into successful salon owners, celebrity stylists, and beauty specialists.'
      : currentLang === 'am'
      ? 'በደሬ ኢንስቲትዩት ሰልጥነው የራሳቸውን ስራ እና ሳሎን የከፈቱ ተማሪዎቻችን የተናገሩትን ይስሙ።'
      : 'Akkaataa leenjiin Dare jireenya barattoota keenyaa jijjiire dhaga\'aa.';

  const alumniLabel =
    currentLang === 'en' ? 'Alumni Stories' :
    currentLang === 'am' ? 'የተማሪዎቻችን ምስክሮች' :
    'Dhugaa Ba\'umsa Eebbifamtootaa';

  return (
    <section
      className="py-24 bg-[var(--bg-base)] relative border-t border-b border-[var(--border-subtle)] transition-colors duration-300 overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-[#E9C349]/5 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* ── Header ── */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center space-x-2 text-xs font-semibold tracking-widest uppercase text-[#A08000] dark:text-[#D4AF37] mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{alumniLabel}</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-semibold text-[var(--text-primary)] leading-tight mb-4">
            {title}
          </h2>
          <p className="text-[var(--text-secondary)] text-base leading-relaxed">
            {subtitle}
          </p>
          {/* Story counter */}
          <p className="mt-3 text-xs font-mono text-[var(--text-muted)]">
            {testimonialsData.length} graduate stories · page {page + 1} of {totalPages}
          </p>
        </div>

        {/* ── Cards ── */}
        <div className="relative min-h-[340px]">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={page}
              custom={dir}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.38, ease: [0.4, 0, 0.2, 1] }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
            >
              {pageItems.map((testimonial, idx) => (
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: idx * 0.07 }}
                  className="bg-[var(--bg-surface)] border border-[#D4AF37]/25 hover:border-[#D4AF37]/60 p-7 flex flex-col justify-between relative shadow-sm hover:shadow-xl transition-all group rounded-2xl"
                >
                  <div>
                    <Quote className="w-7 h-7 text-[#D4AF37]/40 mb-4" />

                    {/* Stars */}
                    <div className="flex space-x-0.5 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-[#D4AF37] text-[#D4AF37]" />
                      ))}
                    </div>

                    {/* Quote */}
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed italic">
                      &ldquo;{currentLang === 'en' ? testimonial.quote : currentLang === 'am' ? testimonial.amharicQuote : (testimonial.oromoQuote || testimonial.quote)}&rdquo;
                    </p>
                  </div>

                  {/* Author */}
                  <div className="flex items-center space-x-3 pt-5 mt-5 border-t border-[var(--border-subtle)]">
                    <img
                      src={testimonial.photo}
                      alt={testimonial.name}
                      referrerPolicy="no-referrer"
                      className="w-11 h-11 rounded-full object-cover border-2 border-[#D4AF37]/60 shrink-0"
                    />
                    <div className="min-w-0">
                      <h3 className="font-serif font-bold text-sm text-[var(--text-primary)] truncate">
                        {testimonial.name}
                      </h3>
                      <p className="text-[11px] font-semibold text-[#A08000] dark:text-[#D4AF37] truncate">
                        {testimonial.role}
                      </p>
                      <p className="text-[10px] text-[var(--text-muted)] truncate">
                        {testimonial.program}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Pagination controls ── */}
        <div className="mt-10 flex items-center justify-center gap-5">

          {/* Prev */}
          <button
            onClick={prev}
            aria-label="Previous page"
            className="w-10 h-10 rounded-full border border-[#D4AF37]/40 text-[#D4AF37] flex items-center justify-center hover:bg-[#D4AF37] hover:text-black transition-all disabled:opacity-30"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Dots */}
          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i, i > page ? 1 : -1)}
                aria-label={`Page ${i + 1}`}
                className={`rounded-full transition-all duration-300 ${
                  i === page
                    ? 'w-6 h-2.5 bg-[#D4AF37]'
                    : 'w-2.5 h-2.5 bg-[#D4AF37]/30 hover:bg-[#D4AF37]/60'
                }`}
              />
            ))}
          </div>

          {/* Next */}
          <button
            onClick={next}
            aria-label="Next page"
            className="w-10 h-10 rounded-full border border-[#D4AF37]/40 text-[#D4AF37] flex items-center justify-center hover:bg-[#D4AF37] hover:text-black transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Autoplay progress bar */}
        {!paused && (
          <div className="mt-5 max-w-xs mx-auto h-0.5 bg-[#D4AF37]/20 rounded-full overflow-hidden">
            <motion.div
              key={`bar-${page}`}
              className="h-full bg-[#D4AF37] rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: AUTOPLAY_MS / 1000, ease: 'linear' }}
            />
          </div>
        )}

      </div>
    </section>
  );
};
