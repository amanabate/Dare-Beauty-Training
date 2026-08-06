'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, useInView } from 'motion/react';
import { statisticsData } from '../../data/instituteData';
import { Language } from '../../types';

interface StatisticsProps {
  currentLang: Language;
}

function parseStat(str: string) {
  const match = str.match(/^([^\d]*)([\d,]+)(.*)$/);
  if (!match) return { prefix: '', num: 0, suffix: str, hasComma: false };
  const prefix = match[1] || '';
  const rawNumStr = match[2];
  const suffix = match[3] || '';
  const hasComma = rawNumStr.includes(',');
  const num = parseInt(rawNumStr.replace(/,/g, ''), 10);
  return { prefix, num, suffix, hasComma };
}

const AnimatedCounter: React.FC<{ valueStr: string }> = ({ valueStr }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const [currentValue, setCurrentValue] = useState(0);
  const parsed = useMemo(() => parseStat(valueStr), [valueStr]);

  useEffect(() => {
    if (!isInView) return;
    let startTimestamp: number | null = null;
    const duration = 2000; // 2 seconds counting animation

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      setCurrentValue(Math.floor(easeProgress * parsed.num));

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setCurrentValue(parsed.num);
      }
    };

    const animFrame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animFrame);
  }, [isInView, parsed.num]);

  const formattedNum = parsed.hasComma
    ? currentValue.toLocaleString('en-US')
    : currentValue.toString();

  return (
    <span ref={ref} className="font-mono text-3xl sm:text-5xl font-bold text-[#E9C349] tracking-tight">
      {parsed.prefix}
      {formattedNum}
      {parsed.suffix}
    </span>
  );
};

export const Statistics: React.FC<StatisticsProps> = ({ currentLang }) => {
  return (
    <section className="py-20 bg-[var(--bg-panel)] text-[var(--text-primary)] relative border-y border-[var(--border-subtle)] transition-colors duration-300 overflow-hidden">
      {/* Subtle Gold Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-[#E9C349]/5 blur-[120px] pointer-events-none rounded-full" />

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(233,195,73,0.12)_1px,transparent_1px)] [background-size:28px_28px] pointer-events-none opacity-40" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 sm:gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-[var(--border-subtle)]">
          {statisticsData.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="pt-6 md:pt-0 px-3 flex flex-col items-center justify-center group"
            >
              <div className="mb-2 transition-transform duration-300 group-hover:scale-105">
                <AnimatedCounter valueStr={stat.value} />
              </div>
              <div className="text-xs font-sans font-semibold tracking-wider uppercase text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">
                {currentLang === 'en' ? stat.label : currentLang === 'am' ? stat.amharicLabel : (stat.oromoLabel || stat.label)}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
