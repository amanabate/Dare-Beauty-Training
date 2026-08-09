'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Menu, X, Globe, Sun, Moon, LogIn, LogOut, ChevronDown,
  LayoutDashboard, GraduationCap, UserCheck, Check
} from 'lucide-react';
import { Language, ThemeMode, UserAccount } from '../../types';
import { instituteInfo } from '../../data/instituteData';

const TikTokIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .56.04.82.12V9.4a6.27 6.27 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.86 4.48 6.31 6.31 0 0 0 1.86-4.47V9.03a8.16 8.16 0 0 0 4.87 1.6V7.17a4.85 4.85 0 0 1-1-.48z" />
  </svg>
);

const LANGUAGES: { code: Language; native: string }[] = [
  { code: 'en', native: 'English' },
  { code: 'am', native: 'አማርኛ' },
  { code: 'om', native: 'Afaan Oromoo' },
];

interface NavbarProps {
  currentLang: Language;
  onChangeLang: (lang: Language) => void;
  onOpenContact: () => void;
  themeMode: ThemeMode;
  onChangeTheme: (mode: ThemeMode) => void;
  user?: UserAccount | null;
  onSignOut: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentLang,
  onChangeLang,
  onOpenContact,
  themeMode,
  onChangeTheme,
  user,
  onSignOut,
}) => {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  // Separate refs for desktop and mobile lang dropdowns
  const desktopLangRef = useRef<HTMLDivElement>(null);
  const mobileLangRef  = useRef<HTMLDivElement>(null);
  const userRef        = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      const inDesktopLang = desktopLangRef.current?.contains(target);
      const inMobileLang  = mobileLangRef.current?.contains(target);
      if (!inDesktopLang && !inMobileLang) setLangDropdownOpen(false);
      if (userRef.current && !userRef.current.contains(target)) setUserDropdownOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const navLinks = [
    { href: '#home',       label: currentLang === 'en' ? 'Home'       : currentLang === 'am' ? 'ዋና ገፅ'      : 'Fuula Duraa' },
    { href: '#about',      label: currentLang === 'en' ? 'About'      : currentLang === 'am' ? 'ስለ እኛ'      : 'Sinaa Dare' },
    { href: '#programs',   label: currentLang === 'en' ? 'Programs'   : currentLang === 'am' ? 'ትምህርቶች'     : 'Prograamota' },
    { href: '#why-us',     label: currentLang === 'en' ? 'Why Dare'   : currentLang === 'am' ? 'ለምን ደሬ'     : 'Maaliif Dare' },
    { href: '#gallery',    label: currentLang === 'en' ? 'Gallery'    : currentLang === 'am' ? 'ጋለሪ'        : 'Gaalarii' },
    { href: '#location',   label: currentLang === 'en' ? 'Location'   : currentLang === 'am' ? 'ካምፓስ አድራሻ' : 'Teessoo Mooraa' },
    { href: '#admissions', label: currentLang === 'en' ? 'Admissions' : currentLang === 'am' ? 'ምዝገባ'       : 'Galmee' },
  ];

  const dashboardHref  = user?.role === 'Admin' ? '/dashboard/admin' : user?.role === 'Instructor' ? '/dashboard/instructor' : '/dashboard/student';
  const dashboardLabel = user?.role === 'Admin' ? 'Admin Portal' : user?.role === 'Instructor' ? 'Instructor Portal' : 'Student Portal';
  const DashboardIcon  = user?.role === 'Admin' ? LayoutDashboard : user?.role === 'Instructor' ? UserCheck : GraduationCap;

  const signInLabel = currentLang === 'en' ? 'Sign In' : currentLang === 'am' ? 'ይግቡ' : 'Seenaa';
  const contactLabel = currentLang === 'en' ? 'Contact' : currentLang === 'am' ? 'አድራሻ' : 'Nu Quunnamaa';

  // Shared language dropdown items JSX
  const LangDropdown = () => (
    <div className="absolute right-0 mt-2 w-44 bg-[#FAFAFA] dark:bg-[#1A1A1E] border border-[#E9C349]/40 rounded-2xl shadow-2xl p-1.5 z-[60]">
      {LANGUAGES.map((lang) => (
        <button
          key={lang.code}
          onClick={() => { onChangeLang(lang.code); setLangDropdownOpen(false); }}
          className={`w-full px-3 py-2.5 text-left rounded-xl text-xs font-semibold flex items-center justify-between transition-all ${
            currentLang === lang.code
              ? 'bg-[#E9C349] text-black'
              : 'text-[#111111] dark:text-white hover:bg-[#E9C349]/10'
          }`}
        >
          <span>{lang.native}</span>
          {currentLang === lang.code && <Check className="w-3 h-3" />}
        </button>
      ))}
    </div>
  );

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#FDF8F8]/97 dark:bg-[#0B0B0B]/97 backdrop-blur-md shadow-md'
          : 'bg-[#FDF8F8]/95 dark:bg-[#0B0B0B]/95 backdrop-blur-sm'
      } border-b border-[#E5E2E1] dark:border-[#262626]`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex items-center justify-between transition-all duration-300 ${isScrolled ? 'py-2' : 'py-3'}`}>

          {/* Logo */}
          <a href="#home" className="flex items-center gap-2.5 group focus:outline-none shrink-0">
            <img
              src="/images/dareLogo.jpeg"
              alt="Dare Institute Logo"
              className="w-9 h-9 rounded-full object-cover border border-[#D4AF37]/50 shadow group-hover:border-[#D4AF37] transition-all"
            />
            <div className="flex flex-col">
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#111111] dark:text-white group-hover:text-[#D4AF37] transition-colors">
                Dare Institute
              </span>
              <span className="text-[9px] tracking-widest text-[#A08000] dark:text-[#D4AF37] uppercase font-semibold font-mono leading-tight">
                {currentLang === 'en' ? 'Beauty Training Institute' : currentLang === 'am' ? 'ደሬ የውበት ማሰልጠኛ ተቋም' : 'Dhaabbata Leenjii Miidhaginaa'}
              </span>
            </div>
          </a>

          {/* Desktop nav links */}
          <nav className="hidden lg:block">
            <ul className="flex space-x-5 text-[11px] tracking-wider uppercase font-semibold text-[#444748] dark:text-[#CCCCCC]">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="hover:text-[#111111] dark:hover:text-white border-b-2 border-transparent hover:border-[#D4AF37] pb-0.5 transition-all">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Desktop controls */}
          <div className="hidden lg:flex items-center space-x-2">
            {/* Theme */}
            <button
              type="button"
              onClick={() => onChangeTheme(themeMode === 'light' ? 'dark' : 'light')}
              className="p-1.5 rounded-lg bg-black/5 dark:bg-white/10 border border-[#E9C349]/40 text-[#E9C349] hover:bg-[#E9C349] hover:text-black transition-all"
              aria-label="Toggle Theme"
            >
              {themeMode === 'light' ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
            </button>

            {/* Language dropdown — desktop */}
            <div ref={desktopLangRef} className="relative">
              <button
                type="button"
                onClick={() => setLangDropdownOpen((v) => !v)}
                className="p-1.5 rounded-lg bg-black/5 dark:bg-white/10 border border-[#E9C349]/40 text-[#E9C349] hover:bg-[#E9C349] hover:text-black transition-all"
                aria-label="Language"
              >
                <Globe className="w-3.5 h-3.5" />
              </button>
              {langDropdownOpen && <LangDropdown />}
            </div>

            {/* Contact */}
            <button
              onClick={onOpenContact}
              className="px-3 py-1.5 text-[11px] uppercase tracking-wider font-semibold border border-[#D4AF37] text-[#111111] dark:text-white hover:bg-[#FFF8F0] dark:hover:bg-[#171717] transition-colors"
            >
              {contactLabel}
            </button>

            {/* Auth */}
            {user ? (
              <div ref={userRef} className="relative">
                <button
                  onClick={() => setUserDropdownOpen((v) => !v)}
                  className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-[#111111] dark:bg-[#1A1A1E] text-white border border-[#E9C349]/50 hover:border-[#E9C349] transition-all"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#F5D468] text-black font-bold text-[10px] flex items-center justify-center shrink-0">
                    {user.avatarUrl
                      ? <img src={user.avatarUrl} alt={user.fullName} className="w-full h-full rounded-full object-cover" />
                      : user.fullName.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-left hidden sm:block">
                    <div className="text-xs font-bold leading-none text-[#E9C349] truncate max-w-[100px]">{user.fullName}</div>
                    <div className="text-[9px] font-mono text-gray-400 mt-0.5 uppercase">{user.role}</div>
                  </div>
                  <ChevronDown className="w-3 h-3 text-gray-400" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-[#FAFAFA] dark:bg-[#161619] border border-[#E9C349]/40 rounded-2xl shadow-2xl p-2 z-50 text-xs">
                    <div className="px-3 py-2 border-b border-white/10 mb-1">
                      <p className="font-bold text-[#111111] dark:text-white truncate">{user.fullName}</p>
                      <p className="text-[10px] text-gray-500 truncate">{user.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-[#E9C349]/20 text-[#D4AF37] text-[9px] font-mono font-bold uppercase">
                        {user.role} Account
                      </span>
                    </div>
                    {user.programEnrolled && (
                      <div className="px-3 py-1.5 text-[10px] text-gray-500 font-mono">
                        Program: <span className="text-[#D4AF37] font-semibold">{user.programEnrolled}</span>
                      </div>
                    )}
                    <button
                      onClick={() => { setUserDropdownOpen(false); router.push(dashboardHref); }}
                      className="w-full mt-1 px-3 py-2 text-left rounded-xl hover:bg-[#E9C349]/10 text-[#D4AF37] font-semibold flex items-center space-x-2 transition-all border-t border-white/10"
                    >
                      <DashboardIcon className="w-4 h-4" />
                      <span>{dashboardLabel}</span>
                    </button>
                    <button
                      onClick={() => { setUserDropdownOpen(false); onSignOut(); }}
                      className="w-full mt-1 px-3 py-2 text-left rounded-xl hover:bg-red-500/10 text-red-500 font-semibold flex items-center space-x-2 transition-all"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => router.push('/auth/signin')}
                className="px-3 py-1.5 text-[11px] uppercase tracking-wider font-semibold text-[#111111] dark:text-white hover:text-[#D4AF37] transition-colors flex items-center space-x-1"
              >
                <LogIn className="w-3.5 h-3.5 text-[#E9C349]" />
                <span>{signInLabel}</span>
              </button>
            )}
          </div>

          {/* Mobile toggle */}
          <div className="flex lg:hidden items-center space-x-2">
            <button
              type="button"
              onClick={() => onChangeTheme(themeMode === 'light' ? 'dark' : 'light')}
              className="p-1.5 rounded-lg border border-[#E9C349]/40 text-[#E9C349] hover:bg-[#E9C349] hover:text-black transition-all"
              aria-label="Toggle Theme"
            >
              {themeMode === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>

            {/* Language dropdown — mobile (separate ref) */}
            <div ref={mobileLangRef} className="relative">
              <button
                type="button"
                onClick={() => setLangDropdownOpen((v) => !v)}
                className="p-1.5 rounded-lg border border-[#E9C349]/40 text-[#E9C349] hover:bg-[#E9C349] hover:text-black transition-all"
                aria-label="Language"
              >
                <Globe className="w-4 h-4" />
              </button>
              {langDropdownOpen && <LangDropdown />}
            </div>

            <button
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="p-2 text-[#111111] dark:text-white hover:text-[#D4AF37]"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FDF8F8] dark:bg-[#171717] border-t border-[#D4AF37]/20 px-4 pt-3 pb-6 space-y-4 shadow-xl">
          <nav>
            <ul className="flex flex-col space-y-2 text-sm tracking-wider uppercase font-semibold text-[#111111] dark:text-white">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-1.5 hover:text-[#A08000] dark:hover:text-[#D4AF37] transition-colors border-l-2 border-transparent hover:border-[#D4AF37] pl-2"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="pt-3 border-t border-[#D4AF37]/30 flex flex-col space-y-3">
            <a
              href={instituteInfo.socialLinks.tiktok}
              target="_blank" rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 text-xs uppercase tracking-wider font-semibold bg-[#E9C349]/15 border border-[#E9C349] text-[#E9C349] hover:bg-[#E9C349] hover:text-black transition-colors flex items-center justify-center space-x-2 rounded-xl"
            >
              <TikTokIcon className="w-4 h-4" />
              <span>TikTok @dere295</span>
            </a>

            {user ? (
              <div className="bg-black/5 dark:bg-white/5 p-3 rounded-2xl border border-[#E9C349]/30 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-xs text-[#E9C349]">{user.fullName}</p>
                    <p className="text-[10px] text-gray-500 font-mono">{user.email} · {user.role}</p>
                  </div>
                  <button onClick={() => { setMobileMenuOpen(false); onSignOut(); }} className="p-2 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20">
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
                <button
                  onClick={() => { setMobileMenuOpen(false); router.push(dashboardHref); }}
                  className="w-full py-2 text-xs uppercase tracking-wider font-semibold bg-[#E9C349]/15 border border-[#E9C349] text-[#E9C349] hover:bg-[#E9C349] hover:text-black transition-colors flex items-center justify-center space-x-2 rounded-xl"
                >
                  <DashboardIcon className="w-3.5 h-3.5" />
                  <span>{dashboardLabel}</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => { setMobileMenuOpen(false); router.push('/auth/signin'); }}
                className="w-full py-2.5 text-xs uppercase tracking-wider font-semibold border border-[#E9C349] text-[#111111] dark:text-white hover:bg-[#E9C349] hover:text-black transition-all flex items-center justify-center space-x-1.5 rounded-xl"
              >
                <LogIn className="w-3.5 h-3.5 text-[#E9C349]" />
                <span>{signInLabel}</span>
              </button>
            )}

            <button
              onClick={() => { setMobileMenuOpen(false); onOpenContact(); }}
              className="w-full py-2.5 text-xs uppercase tracking-wider font-semibold border border-[#D4AF37] text-[#111111] dark:text-white hover:bg-[#FFF8F0] dark:hover:bg-[#222222] transition-colors text-center"
            >
              {currentLang === 'en' ? 'Contact Us' : currentLang === 'am' ? 'አድራሻና ስልክ' : 'Nu Quunnamaa'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
