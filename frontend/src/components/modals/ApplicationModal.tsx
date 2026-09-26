'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  X, CheckCircle2, Sparkles, User, Mail, Phone,
  AlertCircle, ChevronRight, ChevronLeft, Award, Upload, Image,
} from 'lucide-react';
import { programsData } from '../../data/programsData';
import { Language } from '../../types';

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultProgramId?: string;
  currentLang: Language;
  onSubmitApplication?: (application: any) => void;
}

const applicationSchema = z.object({
  fullName:       z.string().min(3, 'Full name must be at least 3 characters'),
  email:          z.string().email('Please enter a valid email address'),
  phone:          z.string().min(9, 'Please enter a valid phone number (e.g. 0911234567)'),
  programId:      z.string().min(1, 'Please select a training program'),
  duration:       z.string().min(1, 'Please select program duration'),
  gender:         z.enum(['female', 'male', 'other']),
  educationLevel: z.string().min(1, 'Please select your education level'),
  message:        z.string().optional(),
});

type FormValues = z.infer<typeof applicationSchema>;

// ── shared input class ─────────────────────────────────────────────────────────
const INPUT =
  'w-full pl-10 pr-4 py-3 rounded-xl bg-white/80 dark:bg-[#1a1a1a]/80 ' +
  'border border-[#D4AF37]/35 dark:border-[#D4AF37]/25 text-sm ' +
  'text-[#111] dark:text-white placeholder-gray-400 dark:placeholder-gray-500 ' +
  'focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37] ' +
  'transition-all duration-200 backdrop-blur-sm';

const SELECT =
  'w-full px-4 py-3 rounded-xl bg-white/80 dark:bg-[#1a1a1a]/80 ' +
  'border border-[#D4AF37]/35 dark:border-[#D4AF37]/25 text-sm ' +
  'text-[#111] dark:text-white ' +
  'focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37] ' +
  'transition-all duration-200 backdrop-blur-sm appearance-none cursor-pointer';

const LABEL =
  'block text-[11px] font-bold uppercase tracking-widest ' +
  'text-[#555] dark:text-[#aaa] mb-2';

export const ApplicationModal: React.FC<ApplicationModalProps> = ({
  isOpen,
  onClose,
  defaultProgramId,
  currentLang,
  onSubmitApplication,
}) => {
  const [step, setStep]               = useState<number>(1);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [refId, setRefId]             = useState<string>('');
  const [paymentScreenshot, setPaymentScreenshot] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      fullName:       '',
      email:          '',
      phone:          '',
      programId:      defaultProgramId || 'hair-dressing',
      duration:       '3 Months',
      gender:         'female',
      educationLevel: 'Grade 10 Complete',
      message:        '',
    },
  });

  const selectedProgramId = watch('programId');
  const selectedProgram   = programsData.find(p => p.id === selectedProgramId) || programsData[0];

  const onSubmit = (data: FormValues) => {
    // Validate payment screenshot
    if (!paymentScreenshot) {
      alert(
        currentLang === 'en'
          ? 'Please upload your registration payment receipt'
          : currentLang === 'am'
          ? 'እባክዎ የምዝገባ ክፍያ ደረሰኝዎን ይጫኑ'
          : 'Maaloo raagaa kaffaltii galmee keessanii ol\'kaa\'aa'
      );
      return;
    }

    const randomRef = 'DARE-' + Math.floor(100000 + Math.random() * 900000);
    setRefId(randomRef);

    // Create application object
    const application = {
      id: `APP-${Date.now()}`,
      name: data.fullName,
      phone: data.phone,
      email: data.email,
      program: selectedProgram.name,
      duration: data.duration,
      shift: 'Morning', // Default
      status: 'Pending Approval' as const,
      paymentReceipt: screenshotPreview || '', // Base64 preview
      date: new Date().toISOString().slice(0, 10),
      gender: data.gender,
      educationLevel: data.educationLevel,
      referenceNumber: randomRef,
    };

    // Pass to parent handler
    if (onSubmitApplication) {
      onSubmitApplication(application);
    }

    setIsSubmitted(true);
  };

  if (!isOpen) return null;

  const t = {
    badge:      currentLang === 'am' ? 'የኦንላይን ምዝገባ ፎርም' : currentLang === 'om' ? 'Unka Galmee Sararaa' : 'Official Online Admission',
    title:      currentLang === 'am' ? 'የስልጠና ማመልከቻ' : currentLang === 'om' ? 'Unka Iyyannoo Leenjii' : 'Enrollment Application',
    sub:        currentLang === 'am' ? 'ደሬ የሴቶች እና የወንዶች የውበት ሙያ ማሰልጠኛ ተቋም' : currentLang === 'om' ? 'Dhaabbata Leenjii Miidhagina Dubartootaa fi Dhiiraa Dare' : "Dare Women's & Men's Beauty Training Institute",
    step1:      currentLang === 'am' ? 'የግል መረጃ' : currentLang === 'om' ? 'Odeeffannoo Dhuunfaa' : 'Personal Details',
    step2:      currentLang === 'am' ? 'ኮርስ' : currentLang === 'om' ? 'Koorsii' : 'Program',
    name:       currentLang === 'am' ? 'ሙሉ ስም *' : 'Full Name *',
    phone:      currentLang === 'am' ? 'ስልክ ቁጥር *' : 'Phone Number *',
    email:      currentLang === 'am' ? 'ኢሜይል *' : 'Email Address *',
    gender:     currentLang === 'am' ? 'ፆታ *' : 'Gender *',
    female:     currentLang === 'am' ? 'ሴት' : 'Female',
    male:       currentLang === 'am' ? 'ወንድ' : 'Male',
    next:       currentLang === 'am' ? 'ቀጣይ →' : 'Next: Program →',
    back:       currentLang === 'am' ? '← ተመለስ' : '← Back',
    program:    currentLang === 'am' ? 'የሚፈልጉትን ዘርፍ ይምረጡ *' : 'Select Training Program *',
    duration:   currentLang === 'am' ? 'የስልጠና ጊዜ *' : 'Duration *',
    education:  currentLang === 'am' ? 'የትምህርት ደረጃ' : 'Educational Qualification',
    submit:     currentLang === 'am' ? 'ማመልከቻ ላክ ✓' : 'Submit Application ✓',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-xl my-8"
      >
        {/* ── Glow halo behind card ── */}
        <div className="absolute inset-x-8 -bottom-6 h-16 bg-[#D4AF37]/20 blur-2xl rounded-full pointer-events-none" />

        {/* ── Card ── */}
        <div className="relative rounded-3xl overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.45)] border border-[#D4AF37]/30">

          {/* Gold top bar */}
          <div className="h-1 w-full bg-gradient-to-r from-[#c49f27] via-[#E9C349] to-[#c49f27]" />

          {/* Card body */}
          <div className="bg-[#FAFAF8] dark:bg-[#141414] px-7 pt-7 pb-8 sm:px-10 sm:pt-8 sm:pb-10">

            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center
                bg-black/5 dark:bg-white/8 hover:bg-[#D4AF37]/20 text-gray-500 dark:text-gray-400
                hover:text-[#D4AF37] transition-all duration-200 z-10"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            {!isSubmitted ? (
              <>
                {/* ── Header ── */}
                <div className="mb-7">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full
                    bg-[#D4AF37]/12 border border-[#D4AF37]/30 mb-3">
                    <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#b8920c] dark:text-[#E9C349]">
                      {t.badge}
                    </span>
                  </div>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#111] dark:text-white leading-tight">
                    {t.title}
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 font-sans">
                    {t.sub}
                  </p>
                </div>

                {/* ── Step indicator ── */}
                <div className="flex items-center gap-3 mb-8">
                  {/* Step 1 */}
                  <div className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-300 ${
                      step >= 1
                        ? 'bg-[#111] dark:bg-[#D4AF37] border-[#111] dark:border-[#D4AF37] text-white dark:text-black'
                        : 'bg-transparent border-gray-300 dark:border-gray-600 text-gray-400'
                    }`}>1</div>
                    <span className={`text-xs font-semibold hidden sm:inline transition-colors ${
                      step >= 1 ? 'text-[#111] dark:text-white' : 'text-gray-400'
                    }`}>{t.step1}</span>
                  </div>

                  {/* Connector */}
                  <div className="flex-1 h-px relative overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                    <motion.div
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#D4AF37] to-[#E9C349]"
                      initial={{ width: '0%' }}
                      animate={{ width: step >= 2 ? '100%' : '0%' }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>

                  {/* Step 2 */}
                  <div className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-300 ${
                      step >= 2
                        ? 'bg-[#111] dark:bg-[#D4AF37] border-[#111] dark:border-[#D4AF37] text-white dark:text-black'
                        : 'bg-transparent border-gray-300 dark:border-gray-600 text-gray-400'
                    }`}>2</div>
                    <span className={`text-xs font-semibold hidden sm:inline transition-colors ${
                      step >= 2 ? 'text-[#111] dark:text-white' : 'text-gray-400'
                    }`}>{t.step2}</span>
                  </div>
                </div>

                {/* ── Form ── */}
                <form onSubmit={handleSubmit(onSubmit)}>
                  <AnimatePresence mode="wait">

                    {/* ── STEP 1 ── */}
                    {step === 1 && (
                      <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: -18 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -18 }}
                        transition={{ duration: 0.22 }}
                        className="space-y-5"
                      >
                        {/* Full Name */}
                        <div>
                          <label className={LABEL}>{t.name}</label>
                          <div className="relative">
                            <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#D4AF37] pointer-events-none" />
                            <input
                              type="text"
                              {...register('fullName')}
                              placeholder="e.g. Abebech Tadesse / Kebede Alemu"
                              className={INPUT}
                            />
                          </div>
                          {errors.fullName && (
                            <p className="mt-1.5 text-[11px] text-red-500 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3 shrink-0" />{errors.fullName.message}
                            </p>
                          )}
                        </div>

                        {/* Phone + Email */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className={LABEL}>{t.phone}</label>
                            <div className="relative">
                              <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#D4AF37] pointer-events-none" />
                              <input
                                type="tel"
                                {...register('phone')}
                                placeholder="0911234567"
                                className={INPUT}
                              />
                            </div>
                            {errors.phone && (
                              <p className="mt-1.5 text-[11px] text-red-500 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3 shrink-0" />{errors.phone.message}
                              </p>
                            )}
                          </div>
                          <div>
                            <label className={LABEL}>{t.email}</label>
                            <div className="relative">
                              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#D4AF37] pointer-events-none" />
                              <input
                                type="email"
                                {...register('email')}
                                placeholder="example@gmail.com"
                                className={INPUT}
                              />
                            </div>
                            {errors.email && (
                              <p className="mt-1.5 text-[11px] text-red-500 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3 shrink-0" />{errors.email.message}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Gender */}
                        <div>
                          <label className={LABEL}>{t.gender}</label>
                          <div className="grid grid-cols-2 gap-3">
                            {(['female', 'male'] as const).map((g) => {
                              const label = g === 'female' ? t.female : t.male;
                              const isActive = watch('gender') === g;
                              return (
                                <label
                                  key={g}
                                  className={`relative flex items-center gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all duration-200 select-none
                                    ${isActive
                                      ? 'border-[#D4AF37] bg-[#D4AF37]/10 dark:bg-[#D4AF37]/12'
                                      : 'border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-white/5 hover:border-[#D4AF37]/50'
                                    }`}
                                >
                                  <input
                                    type="radio"
                                    value={g}
                                    {...register('gender')}
                                    className="sr-only"
                                  />
                                  {/* custom radio dot */}
                                  <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                                    isActive ? 'border-[#D4AF37]' : 'border-gray-300 dark:border-gray-600'
                                  }`}>
                                    {isActive && <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />}
                                  </span>
                                  <span className="text-sm font-semibold text-[#111] dark:text-white">{label}</span>
                                </label>
                              );
                            })}
                          </div>
                        </div>

                        {/* Next button */}
                        <div className="pt-2 flex justify-end">
                          <button
                            type="button"
                            onClick={() => setStep(2)}
                            className="flex items-center gap-2 px-7 py-3 rounded-xl bg-[#111] dark:bg-[#D4AF37]
                              text-white dark:text-black text-xs font-bold uppercase tracking-widest
                              hover:bg-[#D4AF37] hover:text-black dark:hover:bg-[#E9C349]
                              shadow-md hover:shadow-[#D4AF37]/30 transition-all duration-200"
                          >
                            {t.next}
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {/* ── STEP 2 ── */}
                    {step === 2 && (
                      <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 18 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 18 }}
                        transition={{ duration: 0.22 }}
                        className="space-y-5"
                      >
                        {/* Program select */}
                        <div>
                          <label className={LABEL}>{t.program}</label>
                          <div className="relative">
                            <select
                              {...register('programId')}
                              className={SELECT}
                            >
                              {programsData.map((p) => (
                                <option key={p.id} value={p.id} className="bg-white dark:bg-[#1a1a1a]">
                                  {p.name}
                                </option>
                              ))}
                            </select>
                            {/* chevron */}
                            <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[#D4AF37]">▾</span>
                          </div>
                        </div>

                        {/* Duration */}
                        <div>
                          <label className={LABEL}>{t.duration}</label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {selectedProgram.durationOptions.map((dur) => {
                              const isActive = watch('duration') === dur;
                              return (
                                <label
                                  key={dur}
                                  className={`flex items-center gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all duration-200 select-none
                                    ${isActive
                                      ? 'border-[#D4AF37] bg-[#D4AF37]/10 dark:bg-[#D4AF37]/12'
                                      : 'border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-white/5 hover:border-[#D4AF37]/50'
                                    }`}
                                >
                                  <input
                                    type="radio"
                                    value={dur}
                                    {...register('duration')}
                                    className="sr-only"
                                  />
                                  <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                                    isActive ? 'border-[#D4AF37]' : 'border-gray-300 dark:border-gray-600'
                                  }`}>
                                    {isActive && <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />}
                                  </span>
                                  <span className="text-sm font-semibold text-[#111] dark:text-white">{dur}</span>
                                </label>
                              );
                            })}
                          </div>
                        </div>

                        {/* Education */}
                        <div>
                          <label className={LABEL}>{t.education}</label>
                          <div className="relative">
                            <select {...register('educationLevel')} className={SELECT}>
                              <option value="Grade 8 Complete"          className="bg-white dark:bg-[#1a1a1a]">Grade 8 Complete</option>
                              <option value="Grade 10 Complete"         className="bg-white dark:bg-[#1a1a1a]">Grade 10 Complete</option>
                              <option value="Grade 12 Complete"         className="bg-white dark:bg-[#1a1a1a]">Grade 12 Complete</option>
                              <option value="College/University Degree" className="bg-white dark:bg-[#1a1a1a]">College / University Degree</option>
                            </select>
                            <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[#D4AF37]">▾</span>
                          </div>
                        </div>

                        {/* Payment Screenshot Upload */}
                        <div>
                          <label className={LABEL}>
                            {currentLang === 'en' ? 'Registration Payment Receipt' : currentLang === 'am' ? 'የምዝገባ ክፍያ ደረሰኝ' : 'Raagaa Kaffaltii Galmee'}
                            <span className="text-red-400 ml-1">*</span>
                          </label>
                          <div className="space-y-2">
                            <label
                              htmlFor="payment-screenshot"
                              className={`relative flex items-center justify-center gap-3 p-6 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200
                                ${screenshotPreview
                                  ? 'border-[#D4AF37] bg-[#D4AF37]/10'
                                  : 'border-gray-300 dark:border-gray-600 bg-white/60 dark:bg-white/5 hover:border-[#D4AF37]/60'
                                }`}
                            >
                              <input
                                id="payment-screenshot"
                                type="file"
                                accept="image/*"
                                className="sr-only"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    setPaymentScreenshot(file);
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                      setScreenshotPreview(reader.result as string);
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                              />
                              {screenshotPreview ? (
                                <div className="flex items-center gap-3">
                                  <div className="w-16 h-16 rounded-lg overflow-hidden border-2 border-[#D4AF37]/50 shrink-0">
                                    <img src={screenshotPreview} alt="Payment receipt" className="w-full h-full object-cover" />
                                  </div>
                                  <div className="text-left">
                                    <div className="text-sm font-semibold text-[#111] dark:text-white flex items-center gap-1.5">
                                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                      {currentLang === 'en' ? 'Receipt Uploaded' : currentLang === 'am' ? 'ደረሰኝ ተጭኗል' : 'Raagaan Ol\'kaa\'e'}
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                      {paymentScreenshot?.name}
                                    </div>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        setPaymentScreenshot(null);
                                        setScreenshotPreview(null);
                                      }}
                                      className="text-xs text-red-500 hover:text-red-400 mt-1 underline"
                                    >
                                      {currentLang === 'en' ? 'Remove' : currentLang === 'am' ? 'አስወግድ' : 'Balleessi'}
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <Upload className="w-6 h-6 text-[#D4AF37]" />
                                  <div className="text-center">
                                    <div className="text-sm font-semibold text-[#111] dark:text-white">
                                      {currentLang === 'en' ? 'Upload Payment Screenshot' : currentLang === 'am' ? 'የክፍያ ደረሰኝ ስክሪንሾት ይጫኑ' : 'Suuraa Raagaa Ol\'kaa\'i'}
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                      {currentLang === 'en' ? 'JPG, PNG or HEIC (Max 5MB)' : 'JPG, PNG ወይም HEIC'}
                                    </div>
                                  </div>
                                </>
                              )}
                            </label>
                            <div className="flex items-start gap-2 p-3 rounded-xl bg-blue-500/10 border border-blue-500/25">
                              <AlertCircle className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                              <p className="text-[11px] text-blue-300 dark:text-blue-200 leading-relaxed">
                                {currentLang === 'en'
                                  ? 'Please upload a clear screenshot of your registration fee payment (bank transfer, mobile money, or Telebirr confirmation).'
                                  : currentLang === 'am'
                                  ? 'እባክዎ የምዝገባ ክፍያዎን ያረጋገጠ (ባንክ ዝውውር፣ ሞባይል ገንዘብ ወይም ቴሌብር) ግልጽ ስክሪንሾት ይጫኑ።'
                                  : 'Maaloo suuraa raagaa kaffaltii galmee keessanii (dabarsaa baankii, maallaqa mobaayilaa ykn Telebirr) ifa ta\'e ol\'kaa\'aa.'}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="pt-2 flex items-center justify-between gap-3">
                          <button
                            type="button"
                            onClick={() => setStep(1)}
                            className="flex items-center gap-1.5 px-5 py-3 rounded-xl
                              border-2 border-gray-200 dark:border-gray-700
                              text-gray-600 dark:text-gray-300 text-xs font-semibold uppercase
                              hover:border-[#D4AF37]/60 hover:text-[#111] dark:hover:text-white
                              transition-all duration-200"
                          >
                            <ChevronLeft className="w-4 h-4" />
                            {t.back}
                          </button>
                          <button
                            type="submit"
                            className="flex items-center gap-2 px-8 py-3 rounded-xl
                              bg-gradient-to-r from-[#c49f27] to-[#E9C349]
                              text-black text-xs font-bold uppercase tracking-widest
                              shadow-lg shadow-[#D4AF37]/30
                              hover:shadow-[#D4AF37]/50 hover:brightness-110
                              transition-all duration-200"
                          >
                            {t.submit}
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </form>
              </>
            ) : (
              /* ── Success state ── */
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="py-6 text-center space-y-5"
              >
                {/* Icon */}
                <div className="relative w-20 h-20 mx-auto">
                  <div className="absolute inset-0 rounded-full bg-[#D4AF37]/15 animate-ping opacity-50" />
                  <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-[#E9C349] to-[#c49f27] flex items-center justify-center shadow-lg shadow-[#D4AF37]/30">
                    <CheckCircle2 className="w-10 h-10 text-black" />
                  </div>
                </div>

                <div>
                  <h3 className="font-serif text-2xl font-bold text-[#111] dark:text-white mb-2">
                    {currentLang === 'en' ? 'Application Submitted!' : 'ማመልከቻዎ ተልኳል!'}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto leading-relaxed">
                    {currentLang === 'en'
                      ? "Thank you for choosing Dare. Our admissions counselor will contact you within 24 hours."
                      : 'ደሬን ስለመረጡ እናመሰግናለን። ቡድናችን በ 24 ሰዓት ውስጥ ያናግርዎታል።'}
                  </p>
                </div>

                {/* Ref ID */}
                <div className="mx-auto max-w-xs rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/40 p-5 space-y-1">
                  <div className="flex items-center justify-center gap-1.5 mb-2">
                    <Award className="w-4 h-4 text-[#D4AF37]" />
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#a88b0d] dark:text-[#D4AF37]">
                      {currentLang === 'en' ? 'Reference Number' : 'የምዝገባ ቁጥር'}
                    </span>
                  </div>
                  <span className="font-mono text-2xl font-bold text-[#111] dark:text-white tracking-wider">
                    {refId}
                  </span>
                  <p className="text-[11px] text-gray-400 mt-1">Keep this number for your records</p>
                </div>

                {/* Campus info */}
                <div className="text-xs text-gray-500 dark:text-gray-400 space-y-0.5">
                  <p>📍 Campus: Shager, Burayu, Tsara Tsion</p>
                  <p>📞 Admission Hotline: +251 911 23 45 67</p>
                </div>

                <button
                  onClick={onClose}
                  className="px-10 py-3 rounded-xl bg-[#111] dark:bg-[#D4AF37]
                    text-white dark:text-black text-xs font-bold uppercase tracking-widest
                    hover:bg-[#D4AF37] hover:text-black dark:hover:bg-[#E9C349]
                    shadow-md transition-all duration-200"
                >
                  {currentLang === 'en' ? 'Close Window' : 'መስኮቱን ዝጋ'}
                </button>
              </motion.div>
            )}
          </div>
          {/* Bottom decorative line */}
          <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent" />
        </div>
      </motion.div>
    </div>
  );
};
