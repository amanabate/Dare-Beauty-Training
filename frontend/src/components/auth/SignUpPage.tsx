'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Mail, User, Phone, Eye, EyeOff, ArrowRight,
  Sparkles, ArrowLeft, CheckCircle2,
} from 'lucide-react';
import { useAuthPage } from './useAuth';

export function SignUpPage() {
  const { currentLang, isLoading, t, apiSignUp } = useAuthPage();

  const [fullName, setFullName] = useState('');
  const [email, setEmail]       = useState('');
  const [phone, setPhone]       = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm]   = useState('');
  const [showPw, setShowPw]     = useState(false);
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!fullName.trim() || !email.trim() || !password) { setError(t.fillAll); return; }
    if (password !== confirm) { setError(t.pwMismatch); return; }
    setSuccess(t.created);
    apiSignUp(
      { fullName, email, phone, password, role: 'Applicant' },
      setError,
    );
  };

  const inputClass = 'w-full bg-[var(--bg-input)] border border-[var(--border-default)] hover:border-[var(--border-strong)] focus:border-[#E9C349] rounded-xl py-3 text-sm text-[var(--text-primary)] outline-none transition-all placeholder-[var(--text-faint)]';
  const labelClass = 'block text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-1.5';
  const iconClass = 'w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]';

  return (
    <div className="h-screen overflow-hidden flex bg-[var(--bg-base)]">

      {/* ── LEFT  ·  Form panel ──────────────────────────────────── */}
      <div className="flex-1 relative lg:bg-[var(--bg-surface)]">

        {/* Mobile blurred bg */}
        <div className="absolute inset-0 lg:hidden">
          <Image src="/images/dare_about_training_1785909267732.jpg" alt="" fill className="object-cover" sizes="100vw" />
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
        </div>

        {/* Back link — pinned top-left */}
        <Link
          href="/"
          className="absolute top-8 left-8 z-20 flex items-center space-x-1.5 text-xs text-gray-500 hover:text-[#E9C349] transition-colors group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          <span>{t.backHome}</span>
        </Link>

        {/* Perfectly centered content */}
        <div className="relative z-10 h-full flex items-center justify-center px-6">
          <div className="w-full max-w-[420px]">

            {/* Brand mark */}
            <div className="flex items-center space-x-2.5 mb-7">
              <img
                src="/images/dareLogo.jpeg"
                alt="Dare Institute Logo"
                className="w-9 h-9 rounded-full object-cover border border-[#D4AF37]/50 shadow-lg shrink-0"
              />
              <span className="text-[10px] font-mono tracking-[0.2em] text-[#E9C349] uppercase font-bold">
                Dare Institute Portal
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-[2rem] font-serif font-bold text-[var(--text-primary)] leading-tight mb-1">
              {currentLang === 'en' ? 'Create your account'
                : currentLang === 'am' ? 'አካውንትዎን ይፍጠሩ'
                : 'Akkaawuntii kee Uumi'}
            </h1>
            <p className="text-sm text-[var(--text-secondary)] mb-7">
              {currentLang === 'en' ? 'Join Ethiopia\'s premier beauty training institute.'
                : currentLang === 'am' ? 'ሀገሪቱን ቀዳሚ የውበት ሙያ ተቋም ይቀላቀሉ።'
                : 'Dhaabbata leenjii miidhaginaa kutaa-duraatti biyyatti makama.'}
            </p>

            {/* Messages */}
            {error && (
              <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center space-x-2">
                <span className="shrink-0 text-base leading-none">⚠</span><span>{error}</span>
              </div>
            )}
            {success && (
              <div className="mb-4 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" /><span>{success}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Full name */}
              <div>
                <label className={labelClass}>{t.fullName} *</label>
                <div className="relative">
                  <User className={iconClass} />
                  <input type="text" required autoComplete="name"
                    value={fullName} onChange={(e) => setFullName(e.target.value)}
                    placeholder="Bethlehem Worku"
                    className={`${inputClass} pl-11 pr-4`} />
                </div>
              </div>

              {/* Email + Phone */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>{t.email} *</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                    <input type="email" required autoComplete="email"
                      value={email} onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@mail.com"
                      className={`${inputClass} pl-10 pr-3 text-xs`} />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>{t.phone}</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                    <input type="tel" autoComplete="tel"
                      value={phone} onChange={(e) => setPhone(e.target.value)}
                      placeholder="+251 9…"
                      className={`${inputClass} pl-10 pr-3 text-xs`} />
                  </div>
                </div>
              </div>

              {/* Password + Confirm */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>{t.password} *</label>
                  <div className="relative">
                    <input type={showPw ? 'text' : 'password'} required autoComplete="new-password"
                      value={password} onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className={`${inputClass} px-4 pr-10`} />
                    <button type="button" onClick={() => setShowPw(!showPw)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors">
                      {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className={labelClass}>{t.confirm} *</label>
                  <input type={showPw ? 'text' : 'password'} required autoComplete="new-password"
                    value={confirm} onChange={(e) => setConfirm(e.target.value)}
                    placeholder="••••••••"
                    className={`${inputClass} px-4`} />
                </div>
              </div>

              {/* Submit */}
              <button type="submit" disabled={isLoading}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#E9C349] hover:brightness-110 active:scale-[.99] text-black font-bold text-sm uppercase tracking-widest flex items-center justify-center space-x-2.5 disabled:opacity-50 transition-all shadow-xl shadow-[#D4AF37]/20 mt-1"
              >
                <span>{isLoading ? 'Creating…' : t.signUpBtn}</span>
                {!isLoading && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>

            <p className="mt-7 text-center text-sm text-[var(--text-muted)]">
              {t.haveAcct}{' '}
              <Link href="/auth/signin" className="text-[#E9C349] font-semibold hover:brightness-110 hover:underline underline-offset-2 transition-all">
                {t.goSignIn} →
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* ── RIGHT  ·  Image panel (desktop) ─────────────────────── */}
      <div className="hidden lg:flex lg:w-[52%] relative flex-shrink-0">
        <Image
          src="/images/dare_about_training_1785909267732.jpg"
          alt="Dare Beauty Training"
          fill
          className="object-cover object-center"
          priority
          sizes="52vw"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-black/10 via-black/40 to-black/80" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/20" />

        <div className="absolute inset-0 flex flex-col justify-between p-14 z-10">
          <div className="flex justify-end">
            <span className="px-3.5 py-1.5 rounded-full bg-[#E9C349]/12 border border-[#E9C349]/25 text-[#E9C349] text-[11px] font-mono font-bold uppercase tracking-widest backdrop-blur-sm">
              {currentLang === 'en' ? 'Gov. Accredited'
                : currentLang === 'am' ? 'መንግስት ተቀባይ'
                : "Mootummaan Mirkanaa'e"}
            </span>
          </div>

          <div className="text-right max-w-xs ml-auto space-y-5">
            <p className="text-[2.25rem] font-serif font-bold text-white leading-tight drop-shadow-md">
              {currentLang === 'en' ? <>Start your journey<br />with the best.</>
                : currentLang === 'am' ? <>ከምርጡ ጋር<br />ጉዞዎን ይጀምሩ።</>
                : <>Imala kee kan<br />gaarii ta'een jalqabi.</>}
            </p>
            <p className="text-sm text-gray-300 leading-relaxed">
              {currentLang === 'en'
                ? 'Hands-on practical training led by industry masters in Addis Ababa.'
                : currentLang === 'am'
                ? 'በአዲስ አበባ የኢንዱስትሪ ባለሙያዎች የሚመሩ ተግባራዊ ሥልጠናዎች።'
                : 'Leenjii harka-qabataa ogeeyyota iduustiriin hoogganamu Addiis Abaabaatti.'}
            </p>
            <div className="flex flex-wrap gap-2 justify-end">
              {['Hair Dressing', 'Makeup Artistry', 'Barbering', 'Nail Tech', 'Beauty Therapy'].map((p) => (
                <span key={p} className="px-2.5 py-1 rounded-full bg-black/35 border border-white/12 text-white text-[10px] font-mono backdrop-blur-sm">
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
