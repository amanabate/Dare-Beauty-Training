'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Lock, 
  Mail, 
  User, 
  Phone, 
  Eye, 
  EyeOff, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight,
  UserCheck,
  GraduationCap,
  Briefcase
} from 'lucide-react';
import { Language, UserAccount } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: Language;
  onLoginSuccess: (user: UserAccount) => void;
  initialMode?: 'signin' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentLang = 'en',
  onLoginSuccess,
  initialMode = 'signin'
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  
  // Sign In Form State
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');

  // Sign Up Form State
  const [signUpFullName, setSignUpFullName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPhone, setSignUpPhone] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState('');
  const [signUpRole, setSignUpRole] = useState<'Student' | 'Applicant' | 'Instructor' | 'Admin'>('Student');
  const [signUpProgram, setSignUpProgram] = useState('Hair Dressing & Styling');

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const t = {
    signInTitle: currentLang === 'en' ? 'Sign In' : currentLang === 'am' ? 'ይግቡ' : 'Seenaa',
    signUpTitle: currentLang === 'en' ? 'Create Account' : currentLang === 'am' ? 'አካውንት ይፍጠሩ' : 'Akkaawuntii Uumaa',
    subSignIn: currentLang === 'en' ? 'Access your Dare Institute portal & training records' : currentLang === 'am' ? 'ወደ ደሬ ውበት ማሰልጠኛ ፖርታል ይግቡ' : 'Portal Dhaabbata Dare seenaa',
    subSignUp: currentLang === 'en' ? 'Join Ethiopia\'s premier beauty training academy' : currentLang === 'am' ? 'የኢትዮጵያ ቀዳሚ የውበት ማሰልጠኛ ተቋምን ይቀላቀሉ' : 'Akkaadaamii leenjii miidhaginaa seenaa',
    fullName: currentLang === 'en' ? 'Full Name' : currentLang === 'am' ? 'ሙሉ ስም' : 'Maqaa Guutuu',
    emailLabel: currentLang === 'en' ? 'Email Address' : currentLang === 'am' ? 'ኢሜይል አድራሻ' : 'Teessoo Imeelii',
    phoneLabel: currentLang === 'en' ? 'Phone Number' : currentLang === 'am' ? 'ስልክ ቁጥር' : 'Lakkoofsa Bilbilaa',
    passwordLabel: currentLang === 'en' ? 'Password' : currentLang === 'am' ? 'የይለፍ ቃል' : 'Jecha Darbiinsaa',
    confirmPasswordLabel: currentLang === 'en' ? 'Confirm Password' : currentLang === 'am' ? 'የይለፍ ቃል ያረጋግጡ' : 'Jecha Darbiinsaa Mirkaneessaa',
    roleLabel: currentLang === 'en' ? 'Account Role' : currentLang === 'am' ? 'የአካውንት አይነት' : 'Gosa Akkaawuntii',
    programLabel: currentLang === 'en' ? 'Enrolled Program' : currentLang === 'am' ? 'የተመዘገቡበት ኮርስ' : 'Prograammi Galmaa\'an',
    signInBtn: currentLang === 'en' ? 'Sign In to Account' : currentLang === 'am' ? 'ወደ አካውንት ይግቡ' : 'Seenaa',
    signUpBtn: currentLang === 'en' ? 'Complete Registration' : currentLang === 'am' ? 'ምዝገባውን ያጠናቅቁ' : 'Galmee Xumuraa',
    noAccount: currentLang === 'en' ? "Don't have an account?" : currentLang === 'am' ? "አካውንት የለዎትም?" : "Akkaawuntii hin qabdan?",
    alreadyAccount: currentLang === 'en' ? "Already have an account?" : currentLang === 'am' ? "አካውንት አለዎት?" : "Akkaawuntii qabduu?",
    switchSignUp: currentLang === 'en' ? 'Sign Up' : currentLang === 'am' ? 'ተመዝገብ' : 'Galmaa\'aa',
    switchSignIn: currentLang === 'en' ? 'Sign In' : currentLang === 'am' ? 'ይግቡ' : 'Seenaa',
    quickDemo: currentLang === 'en' ? 'Quick One-Click Demo Login:' : currentLang === 'am' ? 'በአንድ ጠቅታ የማሳያ መግቢያ:' : 'Seensa Saffisaa Demo:'
  };

  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    if (!signInEmail.trim() || !signInPassword) {
      setErrorMsg(currentLang === 'en' ? 'Please fill in all required fields.' : 'እባክዎን ሁሉንም መስኮች ይሙሉ');
      setIsLoading(false);
      return;
    }

    setTimeout(() => {
      setIsLoading(false);
      const user: UserAccount = {
        id: `usr-${Date.now()}`,
        fullName: signInEmail.split('@')[0].replace('.', ' ') || 'Registered User',
        email: signInEmail,
        role: signInEmail.toLowerCase().includes('admin') ? 'Admin' : signInEmail.toLowerCase().includes('instructor') ? 'Instructor' : 'Student',
        phone: '+251 91 123 4567',
        joinedDate: new Date().toLocaleDateString()
      };

      try {
        localStorage.setItem('dare_user_account', JSON.stringify(user));
      } catch {}

      onLoginSuccess(user);
      onClose();
    }, 600);
  };

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    if (!signUpFullName.trim() || !signUpEmail.trim() || !signUpPassword) {
      setErrorMsg(currentLang === 'en' ? 'Please complete all fields.' : 'እባክዎን ሁሉንም መስኮች ይሙሉ');
      setIsLoading(false);
      return;
    }

    if (signUpPassword !== signUpConfirmPassword) {
      setErrorMsg(currentLang === 'en' ? 'Passwords do not match.' : 'የይለፍ ቃሎች አይመሳሰሉም');
      setIsLoading(false);
      return;
    }

    setTimeout(() => {
      setIsLoading(false);
      const newUser: UserAccount = {
        id: `usr-${Date.now()}`,
        fullName: signUpFullName,
        email: signUpEmail,
        role: signUpRole,
        phone: signUpPhone || '+251 91 000 0000',
        programEnrolled: signUpRole === 'Student' ? signUpProgram : undefined,
        joinedDate: new Date().toLocaleDateString()
      };

      try {
        localStorage.setItem('dare_user_account', JSON.stringify(newUser));
      } catch {}

      setSuccessMsg(currentLang === 'en' ? 'Account created successfully!' : 'አካውንትዎ በስኬት ተፈጥሯል!');
      setTimeout(() => {
        onLoginSuccess(newUser);
        onClose();
      }, 700);
    }, 700);
  };

  const handleQuickDemo = (role: 'Admin' | 'Student' | 'Instructor') => {
    setIsLoading(true);
    setTimeout(() => {
      let demoUser: UserAccount;
      if (role === 'Admin') {
        demoUser = {
          id: 'admin-001',
          fullName: 'Director Selamawit Abera',
          email: 'admin@darebeauty.edu.et',
          role: 'Admin',
          phone: '+251 911 223344',
          avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
          joinedDate: '2024-01-15'
        };
      } else if (role === 'Instructor') {
        demoUser = {
          id: 'inst-002',
          fullName: 'Master Instructor Tigist Haile',
          email: 'tigist.haile@darebeauty.edu.et',
          role: 'Instructor',
          phone: '+251 922 334455',
          programEnrolled: 'Advanced Hair Dressing',
          joinedDate: '2024-03-01'
        };
      } else {
        demoUser = {
          id: 'stud-003',
          fullName: 'Bethlehem Worku',
          email: 'bethlehem.worku@student.dare.et',
          role: 'Student',
          phone: '+251 933 445566',
          programEnrolled: 'Professional Hair Dressing',
          joinedDate: '2026-02-10'
        };
      }

      try {
        localStorage.setItem('dare_user_account', JSON.stringify(demoUser));
      } catch {}

      setIsLoading(false);
      onLoginSuccess(demoUser);
      onClose();
    }, 400);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-lg bg-[#FAF8F5] dark:bg-[#121214] text-[var(--text-primary)] rounded-3xl shadow-2xl border border-[#E9C349]/40 overflow-hidden my-8"
        >
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-[#111111] via-[#1A1A1E] to-[#111111] p-6 text-white border-b border-[#E9C349]/30 relative">
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/10 text-gray-300 hover:text-white hover:bg-white/20 transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#D4AF37] to-[#F5D468] text-black flex items-center justify-center shadow-lg">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono tracking-widest text-[#E9C349] uppercase font-bold">
                  Dare Institute Portal
                </span>
                <h2 className="text-xl font-serif font-bold text-white tracking-wide">
                  {mode === 'signin' ? t.signInTitle : t.signUpTitle}
                </h2>
              </div>
            </div>
            <p className="text-xs text-gray-300 font-sans max-w-sm leading-relaxed">
              {mode === 'signin' ? t.subSignIn : t.subSignUp}
            </p>

            {/* Switch Tabs Header */}
            <div className="mt-5 grid grid-cols-2 gap-2 bg-black/40 p-1 rounded-2xl border border-white/10">
              <button
                type="button"
                onClick={() => { setMode('signin'); setErrorMsg(''); }}
                className={`py-2 text-xs font-semibold rounded-xl transition-all flex items-center justify-center space-x-1.5 ${
                  mode === 'signin'
                    ? 'bg-[#E9C349] text-black shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                <span>{t.switchSignIn}</span>
              </button>
              <button
                type="button"
                onClick={() => { setMode('signup'); setErrorMsg(''); }}
                className={`py-2 text-xs font-semibold rounded-xl transition-all flex items-center justify-center space-x-1.5 ${
                  mode === 'signup'
                    ? 'bg-[#E9C349] text-black shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>{t.switchSignUp}</span>
              </button>
            </div>
          </div>

          {/* Quick Demo Login Bar */}
          <div className="bg-[#E9C349]/10 dark:bg-[#E9C349]/5 border-b border-[#E9C349]/20 px-5 py-3 text-xs">
            <span className="block text-[11px] font-mono font-bold text-[#D4AF37] mb-2 uppercase tracking-wider">
              {t.quickDemo}
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('Admin')}
                className="py-1.5 px-2 bg-white dark:bg-[#1C1C20] border border-[var(--border-default)] hover:border-[#E9C349] text-xs rounded-xl flex items-center justify-center space-x-1 transition-all shadow-xs"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                <span className="font-semibold">Admin</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('Instructor')}
                className="py-1.5 px-2 bg-white dark:bg-[#1C1C20] border border-[var(--border-default)] hover:border-[#E9C349] text-xs rounded-xl flex items-center justify-center space-x-1 transition-all shadow-xs"
              >
                <Briefcase className="w-3.5 h-3.5 text-emerald-500" />
                <span className="font-semibold">Instructor</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('Student')}
                className="py-1.5 px-2 bg-white dark:bg-[#1C1C20] border border-[var(--border-default)] hover:border-[#E9C349] text-xs rounded-xl flex items-center justify-center space-x-1 transition-all shadow-xs"
              >
                <GraduationCap className="w-3.5 h-3.5 text-blue-500" />
                <span className="font-semibold">Student</span>
              </button>
            </div>
          </div>

          {/* Modal Content Body */}
          <div className="p-6">
            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-medium flex items-center space-x-2">
                <X className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-medium flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {mode === 'signin' ? (
              /* SIGN IN FORM */
              <form onSubmit={handleSignInSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">
                    {t.emailLabel}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-3 text-gray-400" />
                    <input
                      type="email"
                      required
                      value={signInEmail}
                      onChange={(e) => setSignInEmail(e.target.value)}
                      placeholder="admin@darebeauty.edu.et or student@mail.com"
                      className="w-full bg-white dark:bg-[#1B1B1E] border border-[var(--border-default)] focus:border-[#E9C349] rounded-xl py-2.5 pl-10 pr-4 text-xs text-[var(--text-primary)] outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-[var(--text-secondary)]">
                      {t.passwordLabel}
                    </label>
                    <a href="#forgot" onClick={(e) => { e.preventDefault(); alert("Password reset link sent to email."); }} className="text-[11px] text-[#D4AF37] hover:underline font-medium">
                      Forgot Password?
                    </a>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-3 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={signInPassword}
                      onChange={(e) => setSignInPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-white dark:bg-[#1B1B1E] border border-[var(--border-default)] focus:border-[#E9C349] rounded-xl py-2.5 pl-10 pr-10 text-xs text-[var(--text-primary)] outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center space-x-2 pt-1">
                  <input
                    type="checkbox"
                    id="remember"
                    defaultChecked
                    className="rounded text-[#E9C349] focus:ring-[#E9C349]"
                  />
                  <label htmlFor="remember" className="text-xs text-[var(--text-secondary)]">
                    Remember me on this browser
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#E9C349] hover:from-[#E9C349] hover:to-[#F5D468] text-[#0F0F10] font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    <span>Authenticating...</span>
                  ) : (
                    <>
                      <span>{t.signInBtn}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* SIGN UP FORM */
              <form onSubmit={handleSignUpSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                    {t.fullName} *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3.5 top-3 text-gray-400" />
                    <input
                      type="text"
                      required
                      value={signUpFullName}
                      onChange={(e) => setSignUpFullName(e.target.value)}
                      placeholder="e.g. Bethlehem Worku"
                      className="w-full bg-white dark:bg-[#1B1B1E] border border-[var(--border-default)] focus:border-[#E9C349] rounded-xl py-2.5 pl-10 pr-4 text-xs text-[var(--text-primary)] outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                      {t.emailLabel} *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                      <input
                        type="email"
                        required
                        value={signUpEmail}
                        onChange={(e) => setSignUpEmail(e.target.value)}
                        placeholder="you@domain.com"
                        className="w-full bg-white dark:bg-[#1B1B1E] border border-[var(--border-default)] focus:border-[#E9C349] rounded-xl py-2.5 pl-9 pr-3 text-xs text-[var(--text-primary)] outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                      {t.phoneLabel}
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                      <input
                        type="tel"
                        value={signUpPhone}
                        onChange={(e) => setSignUpPhone(e.target.value)}
                        placeholder="+251 9..."
                        className="w-full bg-white dark:bg-[#1B1B1E] border border-[var(--border-default)] focus:border-[#E9C349] rounded-xl py-2.5 pl-9 pr-3 text-xs text-[var(--text-primary)] outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                    {t.roleLabel}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['Student', 'Applicant', 'Instructor'] as const).map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setSignUpRole(r)}
                        className={`py-2 text-xs font-medium rounded-xl border transition-all ${
                          signUpRole === r
                            ? 'bg-[#E9C349] text-black border-[#E9C349] font-bold shadow-xs'
                            : 'bg-white dark:bg-[#1B1B1E] border-[var(--border-default)] text-[var(--text-secondary)] hover:border-[#E9C349]'
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                {signUpRole === 'Student' && (
                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                      {t.programLabel}
                    </label>
                    <select
                      value={signUpProgram}
                      onChange={(e) => setSignUpProgram(e.target.value)}
                      className="w-full bg-white dark:bg-[#1B1B1E] border border-[var(--border-default)] focus:border-[#E9C349] rounded-xl py-2.5 px-3 text-xs text-[var(--text-primary)] outline-none transition-all"
                    >
                      <option value="Hair Dressing & Styling">Hair Dressing & Styling</option>
                      <option value="Barbering & Grooming">Barbering & Grooming</option>
                      <option value="Makeup Artistry">Professional Makeup Artistry</option>
                      <option value="Nail Care Technology">Nail Care & Aesthetics</option>
                      <option value="Beauty Therapy">Beauty Therapy & Spa</option>
                    </select>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                      {t.passwordLabel} *
                    </label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={signUpPassword}
                      onChange={(e) => setSignUpPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-white dark:bg-[#1B1B1E] border border-[var(--border-default)] focus:border-[#E9C349] rounded-xl py-2.5 px-3 text-xs text-[var(--text-primary)] outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                      {t.confirmPasswordLabel} *
                    </label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={signUpConfirmPassword}
                      onChange={(e) => setSignUpConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-white dark:bg-[#1B1B1E] border border-[var(--border-default)] focus:border-[#E9C349] rounded-xl py-2.5 px-3 text-xs text-[var(--text-primary)] outline-none transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#E9C349] hover:from-[#E9C349] hover:to-[#F5D468] text-[#0F0F10] font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center space-x-2 disabled:opacity-50 mt-2"
                >
                  {isLoading ? (
                    <span>Creating Account...</span>
                  ) : (
                    <>
                      <span>{t.signUpBtn}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Toggle Footer */}
            <div className="mt-5 pt-4 border-t border-[var(--border-subtle)] text-center text-xs">
              {mode === 'signin' ? (
                <p className="text-[var(--text-secondary)]">
                  {t.noAccount}{' '}
                  <button
                    type="button"
                    onClick={() => { setMode('signup'); setErrorMsg(''); }}
                    className="text-[#D4AF37] font-bold hover:underline"
                  >
                    {t.switchSignUp}
                  </button>
                </p>
              ) : (
                <p className="text-[var(--text-secondary)]">
                  {t.alreadyAccount}{' '}
                  <button
                    type="button"
                    onClick={() => { setMode('signin'); setErrorMsg(''); }}
                    className="text-[#D4AF37] font-bold hover:underline"
                  >
                    {t.switchSignIn}
                  </button>
                </p>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
