'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Lock, Mail, Eye, EyeOff, ArrowRight, Sparkles, ArrowLeft } from 'lucide-react';
import { useAuthPage, DEMO_USERS } from './useAuth';

export function SignInPage() {
  const { currentLang, isLoading, t, apiSignIn, handleDemo } = useAuthPage();

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw]     = useState(false);
  const [error, setError]       = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password) { setError(t.fillAll); return; }
    apiSignIn(email, password, setError);
  };

  return (
    <div className="h-screen overflow-hidden flex bg-[var(--bg-base)]">

      {/* ── LEFT  ·  Image panel (desktop) ─────────────────────── */}
      <div className="hidden lg:flex lg:w-[52%] relative flex-shrink-0">
        <Image
          src="/images/dare_institute_hero_1785909254437.jpg"
          alt="Dare Beauty Institute"
          fill
          className="object-cover object-center"
          priority
          sizes="52vw"
        />
        {/* gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-black/40 to-black/80" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        <div className="absolute inset-0 flex flex-col justify-between p-14 z-10">
          {/* Logo */}
          <Link href="/" className="group w-fit">
            <span className="font-serif text-3xl font-bold text-white drop-shadow-lg group-hover:text-[#E9C349] transition-colors leading-none">
              Dare Institute
            </span>
            <span className="block text-[11px] tracking-[0.25em] text-[#E9C349] uppercase font-mono mt-1">
              {currentLang === 'en' ? 'Beauty Training Institute'
                : currentLang === 'am' ? 'ደሬ የውበት ማሰልጠኛ ተቋም'
                : 'Dhaabbata Leenjii Miidhaginaa'}
            </span>
          </Link>

          {/* Bottom */}
          <div className="space-y-6">
            <p className="text-[2.25rem] font-serif font-bold text-white leading-tight drop-shadow-md max-w-xs">
              {currentLang === 'en' ? <>Transform your passion<br />into a profession.</>
                : currentLang === 'am' ? <>ስነ ውበትን ሙያ<br />አድርጉት።</>
                : <>Hawwii kee ogummaa<br />godhuu.</>}
            </p>
            <p className="text-sm text-gray-300 leading-relaxed max-w-xs">
              {currentLang === 'en'
                ? "Ethiopia's premier vocational beauty academy — accredited & government-recognized."
                : currentLang === 'am'
                ? 'የኢትዮጵያ ቀዳሚ የውበት ሙያ ትምህርት ቤት — ተቀባይነት ያለውና በመንግስት የተዋቀረ።'
                : "Akkaadaamii leenjii miidhaginaa biyyatti — mirkanaa'e."}
            </p>
            <div className="flex items-center space-x-8 pt-4 border-t border-white/20">
              {[
                { n: '500+', label: currentLang === 'en' ? 'Graduates' : currentLang === 'am' ? 'ተመርቀዋል' : 'Eebbifaman' },
                { n: '6',    label: currentLang === 'en' ? 'Programs'  : currentLang === 'am' ? 'ኮርሶች'   : 'Sagantaalee' },
                { n: '98%',  label: currentLang === 'en' ? 'Pass Rate' : currentLang === 'am' ? 'ማለፍ ደረጃ' : 'Darbi' },
              ].map((s) => (
                <div key={s.n}>
                  <div className="text-2xl font-bold text-[#E9C349] font-mono leading-none">{s.n}</div>
                  <div className="text-[10px] text-gray-400 uppercase tracking-wider mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT  ·  Form panel ─────────────────────────────────── */}
      <div className="flex-1 relative lg:bg-[var(--bg-surface)]">

        {/* Mobile blurred bg */}
        <div className="absolute inset-0 lg:hidden">
          <Image src="/images/dare_institute_hero_1785909254437.jpg" alt="" fill className="object-cover" sizes="100vw" />
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
          <div className="w-full max-w-[400px]">

            {/* Brand mark */}
            <div className="flex items-center space-x-2.5 mb-8">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#D4AF37] to-[#F5D468] flex items-center justify-center shadow-lg shadow-[#D4AF37]/30 flex-shrink-0">
                <Sparkles className="w-4 h-4 text-black" />
              </div>
              <span className="text-[10px] font-mono tracking-[0.2em] text-[#E9C349] uppercase font-bold">
                Dare Institute Portal
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-[2rem] font-serif font-bold text-[var(--text-primary)] leading-tight mb-1">
              {currentLang === 'en' ? 'Welcome back'
                : currentLang === 'am' ? 'እንኳን ደህና መጡ'
                : 'Baga nagaan dhuftan'}
            </h1>
            <p className="text-sm text-[var(--text-secondary)] mb-8">
              {currentLang === 'en' ? 'Sign in to access your training portal.'
                : currentLang === 'am' ? 'ወደ ስልጠና ፖርታልዎ ለመዳረስ ይግቡ።'
                : "Gara portal leenjii keessanitti seenuuf galmaa'aa."}
            </p>

            {/* Error banner */}
            {error && (
              <div className="mb-5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center space-x-2">
                <span className="shrink-0 text-base leading-none">⚠</span>
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Email */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">
                  {t.email}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                  <input
                    type="email" required autoComplete="email"
                    value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@darebeauty.edu.et"
                    className="w-full bg-[var(--bg-input)] border border-[var(--border-default)] hover:border-[var(--border-strong)] focus:border-[#E9C349] rounded-xl py-3.5 pl-11 pr-4 text-sm text-[var(--text-primary)] outline-none transition-all placeholder-[var(--text-faint)]"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">
                    {t.password}
                  </label>
                  <button type="button" onClick={() => alert('Reset email sent.')}
                    className="text-[11px] text-[#D4AF37] hover:text-[#F5D468] transition-colors">
                    {t.forgot}
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                  <input
                    type={showPw ? 'text' : 'password'} required autoComplete="current-password"
                    value={password} onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[var(--bg-input)] border border-[var(--border-default)] hover:border-[var(--border-strong)] focus:border-[#E9C349] rounded-xl py-3.5 pl-11 pr-11 text-sm text-[var(--text-primary)] outline-none transition-all"
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors">
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember */}
              <div className="flex items-center space-x-2.5">
                <input type="checkbox" id="rm" defaultChecked className="accent-[#E9C349] w-4 h-4 cursor-pointer rounded" />
                <label htmlFor="rm" className="text-xs text-[var(--text-muted)] cursor-pointer">{t.remember}</label>
              </div>

              {/* Submit */}
              <button type="submit" disabled={isLoading}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#E9C349] hover:brightness-110 active:scale-[.99] text-black font-bold text-sm uppercase tracking-widest flex items-center justify-center space-x-2.5 disabled:opacity-50 transition-all shadow-xl shadow-[#D4AF37]/20"
              >
                <span>{isLoading ? 'Signing in…' : t.signInBtn}</span>
                {!isLoading && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>

            {/* Switch */}
            <p className="mt-8 text-center text-sm text-[var(--text-muted)]">
              {t.noAcct}{' '}
              <Link href="/auth/signup" className="text-[#E9C349] font-semibold hover:brightness-110 underline-offset-2 hover:underline transition-all">
                {t.goSignUp} →
              </Link>
            </p>

            {/* Demo logins */}
            <div className="mt-6 pt-6 border-t border-[var(--border-subtle)]">
              <p className="text-center text-[11px] font-mono text-[var(--text-muted)] uppercase tracking-widest mb-3">
                {t.demo}
              </p>
              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    { role: 'Admin'      as const, color: 'text-amber-400',   label: currentLang === 'am' ? 'አድሚን'   : currentLang === 'om' ? 'Bulchiinsa' : 'Admin'      },
                    { role: 'Instructor' as const, color: 'text-emerald-400', label: currentLang === 'am' ? 'አስተማሪ' : currentLang === 'om' ? 'Barsiisaa'  : 'Instructor' },
                    { role: 'Student'   as const,  color: 'text-[#E9C349]',   label: currentLang === 'am' ? 'ተማሪ'   : currentLang === 'om' ? 'Barataa'    : 'Student'    },
                  ]
                ).map(({ role, color, label }) => (
                  <button
                    key={role}
                    type="button"
                    disabled={isLoading}
                    onClick={() => handleDemo(role)}
                    className="flex flex-col items-center py-2.5 px-2 rounded-xl bg-[var(--bg-panel)] border border-[var(--border-default)] hover:border-[#E9C349]/60 hover:bg-[var(--bg-card)] transition-all disabled:opacity-50 group"
                  >
                    <span className={`text-[11px] font-bold font-mono ${color}`}>{label}</span>
                    <span className="text-[9px] text-[var(--text-muted)] mt-0.5 truncate w-full text-center leading-tight">
                      {DEMO_USERS[role].email}
                    </span>
                  </button>
                ))}
              </div>
              <p className="text-center text-[10px] text-[var(--text-muted)] mt-2 font-mono">
                {currentLang === 'am' ? 'ማናቸውም የይለፍ ቃል ይቀበላል' : currentLang === 'om' ? 'Jecha darbiinsaa kamiyyuu ni fudhatama' : 'Any password accepted for demo'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
