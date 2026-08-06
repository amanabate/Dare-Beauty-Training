'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, CheckCircle2, Sparkles, User, Mail, Phone, BookOpen, Clock, AlertCircle } from 'lucide-react';
import { programsData } from '../../data/programsData';
import { Language, ApplicationFormData } from '../../types';

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultProgramId?: string;
  currentLang: Language;
}

const applicationSchema = z.object({
  fullName: z.string().min(3, 'Full name must be at least 3 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(9, 'Please enter a valid phone number (e.g. 0911234567)'),
  programId: z.string().min(1, 'Please select a training program'),
  duration: z.string().min(1, 'Please select program duration'),
  gender: z.enum(['female', 'male', 'other']),
  preferredShift: z.enum(['morning', 'afternoon', 'weekend']),
  educationLevel: z.string().min(1, 'Please select your education level'),
  message: z.string().optional()
});

type FormValues = z.infer<typeof applicationSchema>;

export const ApplicationModal: React.FC<ApplicationModalProps> = ({
  isOpen,
  onClose,
  defaultProgramId,
  currentLang
}) => {
  const [step, setStep] = useState<number>(1);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [refId, setRefId] = useState<string>('');

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<FormValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      programId: defaultProgramId || 'hair-dressing',
      duration: '3 Months',
      gender: 'female',
      preferredShift: 'morning',
      educationLevel: 'Grade 10 Complete',
      message: ''
    }
  });

  const selectedProgramId = watch('programId');
  const selectedProgram = programsData.find(p => p.id === selectedProgramId) || programsData[0];

  const onSubmit = (data: FormValues) => {
    // Generate reference ID
    const randomRef = 'DARE-' + Math.floor(100000 + Math.random() * 900000);
    setRefId(randomRef);
    setIsSubmitted(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[var(--overlay-modal-bg)] backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        transition={{ duration: 0.2 }}
        className="bg-[var(--bg-panel)] border border-[var(--border-default)] rounded-3xl max-w-2xl w-full p-6 sm:p-8 relative shadow-2xl my-8 transition-colors duration-300"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-[var(--text-secondary)] hover:text-[#E9C349] focus:outline-none transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {!isSubmitted ? (
          <div>
            {/* Header */}
            <div className="mb-6 border-b border-[var(--border-subtle)] pb-4">
              <div className="inline-flex items-center space-x-1.5 text-xs font-mono font-semibold uppercase text-[#E9C349] mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>
                  {currentLang === 'en' ? 'Official Online Admission' : currentLang === 'am' ? 'የኦንላይን ምዝገባ ፎርም' : 'Unka Galmee Sararaa'}
                </span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
                {currentLang === 'en' ? 'Enrollment Application Form' : currentLang === 'am' ? 'የስልጠና ማመልከቻ መሙያ' : 'Unka Iyyannoo Leenjii'}
              </h2>
              <p className="text-xs text-[var(--text-secondary)] mt-1 font-sans">
                {currentLang === 'en'
                  ? "Dare Women's & Men's Beauty Training Institute"
                  : currentLang === 'am'
                  ? "ደሬ የሴቶች እና የወንዶች የውበት ሙያ ማሰልጠኛ ተቋም"
                  : "Dhaabbata Leenjii Miidhagina Dubartootaa fi Dhiiraa Dare"}
              </p>
            </div>

            {/* Step Progress Bar */}
            <div className="flex items-center justify-between mb-8 text-xs font-semibold uppercase">
              <div className={`flex items-center space-x-2 ${step >= 1 ? 'text-[#111111] dark:text-[#FFFFFF]' : 'text-gray-400'}`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 1 ? 'bg-[#111111] dark:bg-[#D4AF37] text-white dark:text-black' : 'bg-gray-200 dark:bg-gray-700'}`}>1</span>
                <span className="hidden sm:inline">{currentLang === 'en' ? 'Personal Details' : currentLang === 'am' ? 'የግል መረጃ' : 'Odeeffannoo dhuunfaa'}</span>
              </div>
              <div className="h-[1px] bg-[#D4AF37]/40 flex-1 mx-2" />
              <div className={`flex items-center space-x-2 ${step >= 2 ? 'text-[#111111] dark:text-[#FFFFFF]' : 'text-gray-400'}`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 2 ? 'bg-[#111111] dark:bg-[#D4AF37] text-white dark:text-black' : 'bg-gray-200 dark:bg-gray-700'}`}>2</span>
                <span className="hidden sm:inline">{currentLang === 'en' ? 'Program & Shift' : currentLang === 'am' ? 'ኮርስ እና ሰዓት' : 'Koorsii fi Sa\'aatii'}</span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              
              {/* Step 1: Personal Details */}
              {step === 1 && (
                <div className="space-y-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] dark:text-[#FFFFFF] mb-1">
                      {currentLang === 'en' ? 'Full Name *' : 'ሙሉ ስም *'}
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        {...register('fullName')}
                        placeholder="e.g. Abebech Tadesse / Kebede Alemu"
                        className="w-full pl-9 pr-3 py-2.5 bg-white dark:bg-[#222222] border border-[#D4AF37]/40 text-xs focus:border-[#111111] dark:focus:border-[#D4AF37] focus:outline-none text-[#111111] dark:text-[#FFFFFF]"
                      />
                    </div>
                    {errors.fullName && (
                      <span className="text-[11px] text-red-600 dark:text-red-400 mt-1 flex items-center space-x-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>{errors.fullName.message}</span>
                      </span>
                    )}
                  </div>

                  {/* Phone & Email Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] dark:text-[#FFFFFF] mb-1">
                        {currentLang === 'en' ? 'Phone Number *' : 'ስልክ ቁጥር *'}
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                        <input
                          type="tel"
                          {...register('phone')}
                          placeholder="0911234567"
                          className="w-full pl-9 pr-3 py-2.5 bg-white dark:bg-[#222222] border border-[#D4AF37]/40 text-xs focus:border-[#111111] dark:focus:border-[#D4AF37] focus:outline-none text-[#111111] dark:text-[#FFFFFF]"
                        />
                      </div>
                      {errors.phone && (
                        <span className="text-[11px] text-red-600 dark:text-red-400 mt-1 flex items-center space-x-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>{errors.phone.message}</span>
                        </span>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] dark:text-[#FFFFFF] mb-1">
                        {currentLang === 'en' ? 'Email Address *' : 'ኢሜይል አድራሻ *'}
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                        <input
                          type="email"
                          {...register('email')}
                          placeholder="example@gmail.com"
                          className="w-full pl-9 pr-3 py-2.5 bg-white dark:bg-[#222222] border border-[#D4AF37]/40 text-xs focus:border-[#111111] dark:focus:border-[#D4AF37] focus:outline-none text-[#111111] dark:text-[#FFFFFF]"
                        />
                      </div>
                      {errors.email && (
                        <span className="text-[11px] text-red-600 dark:text-red-400 mt-1 flex items-center space-x-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>{errors.email.message}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Gender Selection */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] dark:text-[#FFFFFF] mb-1">
                      {currentLang === 'en' ? 'Gender *' : 'ፆታ *'}
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <label className="p-3 bg-white dark:bg-[#222222] border border-[#D4AF37]/40 flex items-center space-x-2 text-xs cursor-pointer hover:border-[#111111] dark:hover:border-[#D4AF37] text-[#111111] dark:text-[#FFFFFF]">
                        <input
                          type="radio"
                          value="female"
                          {...register('gender')}
                          className="accent-[#111111] dark:accent-[#D4AF37]"
                        />
                        <span>{currentLang === 'en' ? 'Female' : 'ሴት'}</span>
                      </label>
                      <label className="p-3 bg-white dark:bg-[#222222] border border-[#D4AF37]/40 flex items-center space-x-2 text-xs cursor-pointer hover:border-[#111111] dark:hover:border-[#D4AF37] text-[#111111] dark:text-[#FFFFFF]">
                        <input
                          type="radio"
                          value="male"
                          {...register('gender')}
                          className="accent-[#111111] dark:accent-[#D4AF37]"
                        />
                        <span>{currentLang === 'en' ? 'Male' : 'ወንድ'}</span>
                      </label>
                    </div>
                  </div>

                  {/* Step 1 Next Button */}
                  <div className="pt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="px-6 py-3 bg-[#111111] dark:bg-[#D4AF37] text-white dark:text-black text-xs uppercase font-bold tracking-wider hover:bg-[#D4AF37] dark:hover:bg-white hover:text-black transition-colors"
                    >
                      {currentLang === 'en' ? 'Next: Select Program →' : 'ቀጣይ፡ ኮርስ መምረጥ →'}
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Program & Shift Selection */}
              {step === 2 && (
                <div className="space-y-4">
                  {/* Select Training Program */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] dark:text-[#FFFFFF] mb-1">
                      {currentLang === 'en' ? 'Select Training Program *' : 'የሚፈልጉትን የትምህርት ዘርፍ ይምረጡ *'}
                    </label>
                    <select
                      {...register('programId')}
                      className="w-full p-2.5 bg-white dark:bg-[#222222] border border-[#D4AF37]/40 text-xs focus:border-[#111111] dark:focus:border-[#D4AF37] focus:outline-none text-[#111111] dark:text-[#FFFFFF]"
                    >
                      {programsData.map((p) => (
                        <option key={p.id} value={p.id} className="bg-white dark:bg-[#222222]">
                          {p.name} ({p.amharicName})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Program Duration Options */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] dark:text-[#FFFFFF] mb-1">
                      {currentLang === 'en' ? 'Select Duration *' : 'የስልጠና ጊዜ *'}
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {selectedProgram.durationOptions.map((dur, i) => (
                        <label key={i} className="p-2.5 bg-white dark:bg-[#222222] border border-[#D4AF37]/30 flex items-center space-x-2 text-xs cursor-pointer hover:border-[#111111] dark:hover:border-[#D4AF37] text-[#111111] dark:text-[#FFFFFF]">
                          <input
                            type="radio"
                            value={dur}
                            {...register('duration')}
                            className="accent-[#111111] dark:accent-[#D4AF37]"
                          />
                          <span>{dur}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Preferred Shift */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] dark:text-[#FFFFFF] mb-1">
                      {currentLang === 'en' ? 'Preferred Training Shift *' : 'የሚመችዎ የስልጠና ሰዓት *'}
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <label className="p-2.5 bg-white dark:bg-[#222222] border border-[#D4AF37]/30 text-center block text-xs cursor-pointer hover:border-[#111111] dark:hover:border-[#D4AF37] text-[#111111] dark:text-[#FFFFFF]">
                        <input
                          type="radio"
                          value="morning"
                          {...register('preferredShift')}
                          className="accent-[#111111] dark:accent-[#D4AF37] block mx-auto mb-1"
                        />
                        <span>{currentLang === 'en' ? 'Morning' : 'ጠዋት'}</span>
                      </label>
                      <label className="p-2.5 bg-white dark:bg-[#222222] border border-[#D4AF37]/30 text-center block text-xs cursor-pointer hover:border-[#111111] dark:hover:border-[#D4AF37] text-[#111111] dark:text-[#FFFFFF]">
                        <input
                          type="radio"
                          value="afternoon"
                          {...register('preferredShift')}
                          className="accent-[#111111] dark:accent-[#D4AF37] block mx-auto mb-1"
                        />
                        <span>{currentLang === 'en' ? 'Afternoon' : 'ከሰዓት'}</span>
                      </label>
                      <label className="p-2.5 bg-white dark:bg-[#222222] border border-[#D4AF37]/30 text-center block text-xs cursor-pointer hover:border-[#111111] dark:hover:border-[#D4AF37] text-[#111111] dark:text-[#FFFFFF]">
                        <input
                          type="radio"
                          value="weekend"
                          {...register('preferredShift')}
                          className="accent-[#111111] dark:accent-[#D4AF37] block mx-auto mb-1"
                        />
                        <span>{currentLang === 'en' ? 'Weekend' : 'ቅዳሜ/እሁድ'}</span>
                      </label>
                    </div>
                  </div>

                  {/* Education Background */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] dark:text-[#FFFFFF] mb-1">
                      {currentLang === 'en' ? 'Educational Qualification' : 'የትምህርት ደረጃ'}
                    </label>
                    <select
                      {...register('educationLevel')}
                      className="w-full p-2.5 bg-white dark:bg-[#222222] border border-[#D4AF37]/40 text-xs focus:border-[#111111] dark:focus:border-[#D4AF37] focus:outline-none text-[#111111] dark:text-[#FFFFFF]"
                    >
                      <option value="Grade 8 Complete" className="bg-white dark:bg-[#222222]">Grade 8 Complete (የ 8ኛ ክፍል ማጠናቀቂያ)</option>
                      <option value="Grade 10 Complete" className="bg-white dark:bg-[#222222]">Grade 10 Complete (የ 10ኛ ክፍል ማጠናቀቂያ)</option>
                      <option value="Grade 12 Complete" className="bg-white dark:bg-[#222222]">Grade 12 Complete (የ 12ኛ ክፍል ማጠናቀቂያ)</option>
                      <option value="College/University Degree" className="bg-white dark:bg-[#222222]">College / University Degree (ዲፕሎማ / ዲግሪ)</option>
                    </select>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-4 flex justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-5 py-3 border border-gray-400 dark:border-gray-600 text-[#111111] dark:text-[#FFFFFF] text-xs font-semibold uppercase hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      ← {currentLang === 'en' ? 'Back' : 'ተመለስ'}
                    </button>
                    <button
                      type="submit"
                      className="px-8 py-3 bg-[#111111] dark:bg-[#D4AF37] text-white dark:text-black text-xs font-bold uppercase tracking-wider hover:bg-[#D4AF37] dark:hover:bg-white hover:text-black transition-colors shadow-lg"
                    >
                      {currentLang === 'en' ? 'Submit Application ✓' : 'ማመልከቻውን ላክ ✓'}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        ) : (
          /* Confirmation State */
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 bg-[#D4AF37]/20 border-2 border-[#D4AF37] rounded-full flex items-center justify-center mx-auto text-[#111111] dark:text-[#D4AF37]">
              <CheckCircle2 className="w-10 h-10 text-[#A08000] dark:text-[#D4AF37]" />
            </div>

            <h3 className="font-serif text-2xl font-bold text-[#111111] dark:text-[#FFFFFF]">
              {currentLang === 'en' ? 'Application Submitted Successfully!' : 'ማመልከቻዎ በጥሩ ሁኔታ ተልኳል!'}
            </h3>

            <p className="text-xs text-[#444748] dark:text-[#CCCCCC] max-w-md mx-auto">
              {currentLang === 'en'
                ? 'Thank you for choosing Dare Women’s & Men’s Beauty Training Institute. Our admissions counselor will contact you within 24 hours.'
                : 'ደሬ የሴቶች እና የወንዶች የውበት ማሰልጠኛ ተቋምን ስለመረጡ እናመሰግናለን። የአድሚሽን ቡድናችን በ 24 ሰዓት ውስጥ በስልክ ያናግርዎታል::'}
            </p>

            <div className="p-4 bg-[#FFF8F0] dark:bg-[#222222] border border-[#D4AF37] max-w-sm mx-auto text-center space-y-1 my-4">
              <span className="text-[10px] uppercase tracking-widest text-[#A08000] dark:text-[#D4AF37] font-bold block">
                {currentLang === 'en' ? 'Registration Reference Number' : 'የምዝገባ መለያ ቁጥር'}
              </span>
              <span className="font-mono text-xl font-bold text-[#111111] dark:text-[#FFFFFF]">{refId}</span>
            </div>

            <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
              <p>📍 Campus: Bole Road, Near Olympia Light, Addis Ababa</p>
              <p>📞 Admission Hotline: +251 911 23 45 67</p>
            </div>

            <div className="pt-4">
              <button
                onClick={onClose}
                className="px-8 py-3 bg-[#111111] dark:bg-[#D4AF37] text-white dark:text-black text-xs font-bold uppercase tracking-wider hover:bg-[#D4AF37] dark:hover:bg-white hover:text-black transition-colors"
              >
                {currentLang === 'en' ? 'Close Window' : 'መስኮቱን ዝጋ'}
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
