'use client';

import React from 'react';
import { motion } from 'motion/react';
import { X, Clock, Award, CheckCircle2, ArrowRight, Sparkles, BookOpen } from 'lucide-react';
import { TrainingProgram, Language } from '../types';

interface ProgramDetailModalProps {
  program: TrainingProgram | null;
  onClose: () => void;
  onOpenApply: (programId: string) => void;
  currentLang: Language;
}

export const ProgramDetailModal: React.FC<ProgramDetailModalProps> = ({
  program,
  onClose,
  onOpenApply,
  currentLang
}) => {
  if (!program) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-[#FDF8F8] dark:bg-[#171717] border border-[#D4AF37] max-w-3xl w-full p-6 sm:p-8 relative shadow-2xl my-8 max-h-[90vh] overflow-y-auto transition-colors duration-300"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#111111] dark:text-[#FFFFFF] hover:text-[#D4AF37] focus:outline-none z-10 bg-white/80 dark:bg-black/80 rounded-full"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header Image */}
        <div className="relative aspect-[16/8] overflow-hidden -mx-6 -mt-6 sm:-mx-8 sm:-mt-8 mb-6 border-b border-[#D4AF37]">
          <img
            src={program.image}
            alt={program.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-6">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest bg-[#D4AF37] text-black px-2.5 py-1 inline-block mb-2">
                {program.duration}
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl font-bold text-white">
                {program.name}
              </h2>
              <p className="text-xs font-semibold text-[#D4AF37]">
                {program.amharicName}
              </p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="space-y-6">
          <div>
            <h3 className="font-serif font-bold text-base text-[#111111] dark:text-[#FFFFFF] mb-2">
              {currentLang === 'en' ? 'Program Overview' : currentLang === 'am' ? 'የኮርሱ ማጠቃለያ' : 'Gufachiisa Prograamii'}
            </h3>
            <p className="text-xs sm:text-sm text-[#444748] dark:text-[#CCCCCC] leading-relaxed">
              {currentLang === 'en' ? program.description : currentLang === 'am' ? program.amharicDescription : (program.oromoDescription || program.description)}
            </p>
          </div>

          {/* Training Units / Modules */}
          <div className="p-4 bg-[#FFF8F0] dark:bg-[#222222] border-l-4 border-[#D4AF37]">
            <h4 className="font-serif font-bold text-xs uppercase text-[#111111] dark:text-[#FFFFFF] mb-2 flex items-center space-x-1.5">
              <BookOpen className="w-4 h-4 text-[#D4AF37]" />
              <span>{currentLang === 'en' ? 'Core Training Units' : currentLang === 'am' ? 'ዋና ዋና የትምህርት ክፍሎች' : 'Kutaa Leenjii Ijoo'}</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#111111] dark:text-[#FFFFFF]">
              {program.trainingUnits.map((unit, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                  <span>{unit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Practical Skills Learned */}
          <div>
            <h4 className="font-serif font-bold text-sm text-[#111111] dark:text-[#FFFFFF] mb-3">
              {currentLang === 'en' ? 'Practical Skills You Will Master' : currentLang === 'am' ? 'የሚቀስሟቸው ሙያዊ ቴክኒኮች' : 'Ogummaa Shaakalaa Barattan'}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-[#444748] dark:text-[#CCCCCC]">
              {(currentLang === 'en' ? program.skills : currentLang === 'am' ? program.amharicSkills : (program.oromoSkills || program.skills)).map((skill, idx) => (
                <div key={idx} className="flex items-start space-x-2 bg-white dark:bg-[#222222] p-2.5 border border-[#E5E2E1] dark:border-[#333333]">
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                  <span>{skill}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Certification Badge */}
          <div className="flex items-center space-x-3 p-4 bg-[#111111] dark:bg-[#222222] text-white border border-[#D4AF37]">
            <Award className="w-8 h-8 text-[#D4AF37] shrink-0" />
            <div>
              <span className="text-[10px] uppercase text-[#D4AF37] font-mono tracking-widest block">
                {currentLang === 'en' ? 'Accredited Qualification' : currentLang === 'am' ? 'ህጋዊ የምስክር ወረቀት' : 'Waraqaa Ragaa Seeraa'}
              </span>
              <p className="text-xs font-bold">{program.certification}</p>
            </div>
          </div>

          {/* Modal Action Buttons */}
          <div className="pt-4 border-t border-[#E5E2E1] dark:border-[#262626] flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-6 py-3 border border-gray-400 dark:border-gray-600 text-[#111111] dark:text-[#FFFFFF] text-xs font-semibold uppercase hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {currentLang === 'en' ? 'Close' : currentLang === 'am' ? 'ዝጋ' : 'Cufi'}
            </button>
            <button
              onClick={() => {
                onClose();
                onOpenApply(program.id);
              }}
              className="px-8 py-3 bg-[#111111] dark:bg-[#D4AF37] text-white dark:text-black text-xs font-bold uppercase tracking-wider hover:bg-[#D4AF37] dark:hover:bg-white hover:text-black transition-colors flex items-center space-x-2"
            >
              <span>{currentLang === 'en' ? 'Apply for This Course' : currentLang === 'am' ? 'በዚህ ኮርስ ያመልክቱ' : 'Koorsii Kanaaf Galmaa\'aa'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
