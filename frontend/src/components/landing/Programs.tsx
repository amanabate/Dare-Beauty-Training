'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, CheckCircle2, ArrowRight, Sparkles, ChevronDown, ChevronUp, BookOpen } from 'lucide-react';
import { programsData } from '../../data/programsData';
import { TrainingProgram, Language } from '../../types';

interface ProgramsProps {
  currentLang: Language;
  onSelectProgram: (program: TrainingProgram) => void;
  onOpenApply: (programId?: string) => void;
}

export const Programs: React.FC<ProgramsProps> = ({
  currentLang,
  onSelectProgram,
  onOpenApply
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedCardIds, setExpandedCardIds] = useState<Record<string, boolean>>({});

  const categories = [
    { id: 'all', label: currentLang === 'en' ? 'All Programs' : currentLang === 'am' ? 'ሁሉም' : 'Hunda' },
    { id: 'hair', label: currentLang === 'en' ? 'Hair Dressing' : currentLang === 'am' ? 'የሴቶች ፀጉር' : 'Rifeensa Dubartootaa' },
    { id: 'barber', label: currentLang === 'en' ? 'Barbering' : currentLang === 'am' ? 'ባርበሪንግ' : 'Baarбариንጊ' },
    { id: 'makeup', label: currentLang === 'en' ? 'Makeup Art' : currentLang === 'am' ? 'ሜካፕ' : 'Mikaappii' },
    { id: 'nails', label: currentLang === 'en' ? 'Nail Tech' : currentLang === 'am' ? 'ጥፍር አሰራር' : 'Qoollee (Nail)' },
    { id: 'therapy', label: currentLang === 'en' ? 'Beauty Therapy' : currentLang === 'am' ? 'ቆዳ እንክብካቤ' : 'Gogaa Therapy' },
    { id: 'lashes', label: currentLang === 'en' ? 'Eyelashes' : currentLang === 'am' ? 'የዓይን ቆብ' : 'Ija Haguuggii' },
    { id: 'waxing', label: currentLang === 'en' ? 'Hair Waxing' : currentLang === 'am' ? 'ዋክሲንግ' : 'Waaksiingii' },
  ];

  const filteredPrograms = selectedCategory === 'all'
    ? programsData
    : programsData.filter(p => p.category === selectedCategory);

  const toggleExpand = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setExpandedCardIds(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <section id="programs" className="py-20 bg-[var(--bg-surface)] relative border-t border-b border-[var(--border-subtle)] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center space-x-2 text-xs font-mono font-semibold tracking-widest uppercase text-[#E9C349] px-3 py-1 bg-[#E9C349]/15 border border-[#E9C349]/30 rounded-full">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{currentLang === 'en' ? 'Vocational Curriculum' : currentLang === 'am' ? 'የሙያ ማሰልጠኛ ፕሮግራሞች' : 'Prograamota Leenjii Ogummaa'}</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl font-semibold text-[var(--text-primary)] leading-tight">
            {currentLang === 'en' ? 'Professional Training Programs' : currentLang === 'am' ? 'የተዘጋጁ የሙያ ስልጠናዎች' : 'Prograamota Leenjii Ogummaa'}
          </h2>

          <p className="text-[var(--text-secondary)] text-sm sm:text-base font-sans max-w-2xl mx-auto">
            {currentLang === 'en'
              ? 'Select an accredited beauty program. Click any card to expand full course modules and details.'
              : currentLang === 'am'
              ? 'የስልጠናውን ዝርዝር መረጃ ለማየት ካርዶቹን ይጫኑ።'
              : 'Odeeffannoo guutuu argachuuf kaardii irratti cuqaasaa.'}
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center justify-center flex-wrap gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 text-xs font-sans uppercase tracking-wider font-semibold rounded-xl transition-all touch-target ${
                selectedCategory === cat.id
                  ? 'bg-[#E9C349] text-[#0F0F10] shadow-[0_0_18px_rgba(233,195,73,0.3)] font-bold'
                  : 'bg-white/5 text-[var(--text-secondary)] border border-[var(--border-default)] hover:border-[#E9C349]/40 hover:text-[var(--text-primary)] backdrop-blur'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Compact & Expandable Programs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
          {filteredPrograms.map((program) => {
            const isExpanded = !!expandedCardIds[program.id];
            const name = currentLang === 'en' ? program.name : currentLang === 'am' ? program.amharicName : (program.oromoName || program.name);
            const subName = currentLang === 'om' ? program.name : program.amharicName;
            const description = currentLang === 'en' ? program.description : currentLang === 'am' ? program.amharicDescription : (program.oromoDescription || program.description);
            const skills = currentLang === 'en' ? program.skills : currentLang === 'am' ? program.amharicSkills : (program.oromoSkills || program.skills);

            return (
              <motion.div
                key={program.id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                onClick={() => toggleExpand(program.id)}
                className={`glass-surface rounded-2xl flex flex-col justify-between group overflow-hidden relative cursor-pointer border transition-all duration-300 ${
                  isExpanded ? 'border-[#E9C349] shadow-xl ring-1 ring-[#E9C349]/30' : 'border-[var(--border-default)] hover:border-[#E9C349]/50'
                }`}
              >
                <div>
                  {/* Compact Header with Image */}
                  <div className="relative aspect-[16/8] sm:aspect-[16/9] overflow-hidden bg-[var(--bg-panel)]">
                    <img
                      src={program.image}
                      alt={program.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Duration Badge */}
                    <div className="absolute top-2.5 left-2.5 bg-[#0F0F10]/85 backdrop-blur-md text-[#E9C349] px-2.5 py-0.5 text-[11px] font-mono font-semibold rounded-full border border-[#E9C349]/30 flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-[#E9C349]" />
                      <span>{program.duration}</span>
                    </div>

                    {program.popular && (
                      <div className="absolute top-2.5 right-2.5 bg-[#E9C349] text-[#0F0F10] px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase rounded-full shadow">
                        {currentLang === 'en' ? 'Popular' : currentLang === 'am' ? 'ተመራጭ' : 'Filatamaa'}
                      </div>
                    )}
                  </div>

                  {/* Main Header Info (Compact View) */}
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-serif text-lg font-bold text-[var(--text-primary)] group-hover:text-[#E9C349] transition-colors leading-snug">
                          {name}
                        </h3>
                        <p className="text-[11px] font-mono text-[#E9C349]">
                          {subName}
                        </p>
                      </div>

                      {/* Expand Toggle Button */}
                      <button
                        onClick={(e) => toggleExpand(program.id, e)}
                        className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-[#E9C349] hover:bg-[#E9C349] hover:text-black transition-all shrink-0 mt-0.5"
                        aria-label="Expand program details"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Brief description in collapsed state, full in expanded state */}
                    <p className={`text-xs text-[var(--text-secondary)] leading-relaxed mt-2.5 font-sans ${isExpanded ? '' : 'line-clamp-2'}`}>
                      {description}
                    </p>

                    {/* Expandable Details Container */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25 }}
                          className="pt-4 mt-4 border-t border-[var(--border-subtle)] space-y-4 overflow-hidden"
                        >
                          {/* Training Modules */}
                          <div>
                            <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-primary)] block mb-2 font-bold">
                              {currentLang === 'en' ? 'Core Modules:' : currentLang === 'am' ? 'ዋና ክፍሎች፡' : 'Kutaalee:'}
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {program.trainingUnits.map((unit, i) => (
                                <span
                                  key={i}
                                  className="px-2.5 py-0.5 bg-white/10 text-[var(--text-primary)] border border-white/15 rounded-full text-[10px] font-mono"
                                >
                                  {unit}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Skills Gained */}
                          <div>
                            <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-primary)] block mb-2 font-bold">
                              {currentLang === 'en' ? 'Practical Skills:' : currentLang === 'am' ? 'የሚቀስሙት ክህሎት፡' : 'Ogummaa Shaakalaa:'}
                            </span>
                            <div className="space-y-1.5">
                              {skills.map((skill, idx) => (
                                <div key={idx} className="flex items-center space-x-2 text-xs text-[var(--text-secondary)] font-sans">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-[#E9C349] shrink-0" />
                                  <span>{skill}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="px-5 pb-5 pt-3 border-t border-[var(--border-subtle)] flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => onSelectProgram(program)}
                    className="flex-1 py-2 text-[11px] font-sans uppercase tracking-wider font-semibold border border-[var(--border-strong)] text-[var(--text-primary)] rounded-xl hover:border-[#E9C349] hover:text-[#E9C349] transition-colors flex items-center justify-center space-x-1"
                  >
                    <BookOpen className="w-3 h-3" />
                    <span>{currentLang === 'en' ? 'Syllabus' : currentLang === 'am' ? 'ካሪኩለም' : 'Silabaasii'}</span>
                  </button>

                  <button
                    onClick={() => onOpenApply(program.id)}
                    className="flex-1 py-2 text-[11px] font-sans uppercase tracking-wider font-bold bg-[#E9C349] text-[#0F0F10] rounded-xl hover:bg-[#f5d468] transition-colors flex items-center justify-center space-x-1 shadow-[0_0_12px_rgba(233,195,73,0.3)]"
                  >
                    <span>{currentLang === 'en' ? 'Apply' : currentLang === 'am' ? 'ማመልከቻ' : 'Itti Aanaati'}</span>
                    <ArrowRight className="w-3 h-3 text-[#0F0F10]" />
                  </button>

                  <button
                    onClick={(e) => toggleExpand(program.id, e)}
                    className="p-2 text-[11px] font-sans uppercase text-[#E9C349] border border-[#E9C349]/30 hover:bg-[#E9C349]/10 rounded-xl transition-colors shrink-0"
                    title={isExpanded ? 'Show Less' : 'Expand Details'}
                  >
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
