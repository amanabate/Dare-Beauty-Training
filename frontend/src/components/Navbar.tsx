'use client';

import React, { useState, useEffect } from 'react';
import { Menu, X, Globe, Phone, Sparkles, Sun, Moon, LogIn, UserPlus, LogOut, User as UserIcon, Shield, ChevronDown, FileSpreadsheet, LayoutDashboard, GraduationCap, UserCheck } from 'lucide-react';
import { Language, ThemeMode, UserAccount } from '../types';
import { instituteInfo } from '../data/instituteData';
import { NotificationCenter } from './NotificationCenter';

const TikTokIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .56.04.82.12V9.4a6.27 6.27 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.86 4.48 6.31 6.31 0 0 0 1.86-4.47V9.03a8.16 8.16 0 0 0 4.87 1.6V7.17a4.85 4.85 0 0 1-1-.48z"/>
  </svg>
);

interface NavbarProps {
  currentLang: Language;
  onToggleLang: () => void;
  onOpenApply: (programId?: string) => void;
  onOpenContact: () => void;
  themeMode: ThemeMode;
  onChangeTheme: (mode: ThemeMode) => void;
  user?: UserAccount | null;
  onOpenSignIn: () => void;
  onOpenSignUp: () => void;
  onSignOut: () => void;
  onOpenReportsModal?: () => void;
  onOpenAdminDashboard?: () => void;
  onOpenStudentDashboard?: () => void;
  onOpenInstructorDashboard?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentLang,
  onToggleLang,
  onOpenApply,
  onOpenContact,
  themeMode,
  onChangeTheme,
  user,
  onOpenSignIn,
  onOpenSignUp,
  onSignOut,
  onOpenReportsModal,
  onOpenAdminDashboard,
  onOpenStudentDashboard,
  onOpenInstructorDashboard
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#home', label: currentLang === 'en' ? 'Home' : currentLang === 'am' ? 'ዋና ገፅ' : 'Fuula Duraa' },
    { href: '#about', label: currentLang === 'en' ? 'About' : currentLang === 'am' ? 'ስለ እኛ' : 'Sinaa Dare' },
    { href: '#programs', label: currentLang === 'en' ? 'Programs' : currentLang === 'am' ? 'ትምህርቶች' : 'Prograamota' },
    { href: '#why-us', label: currentLang === 'en' ? 'Why Dare' : currentLang === 'am' ? 'ለምን ደሬ' : 'Maaliif Dare' },
    { href: '#gallery', label: currentLang === 'en' ? 'Gallery' : currentLang === 'am' ? 'ጋለሪ' : 'Gaalarii' },
    { href: '#location', label: currentLang === 'en' ? 'Location' : currentLang === 'am' ? 'ካምፓስ አድራሻ' : 'Teessoo Mooraa' },
    { href: '#admissions', label: currentLang === 'en' ? 'Admissions' : currentLang === 'am' ? 'ምዝገባ' : 'Galmee' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      {/* Top Notification / Language & Theme Bar */}
      <div className="bg-[#111111] dark:bg-[#080808] text-white text-xs py-1.5 px-3 sm:px-6 border-b border-[#E9C349]/30">
        <div className="max-w-7xl mx-auto flex items-center justify-end space-x-3">
          {/* Controls: Notifications, Student Portal, Admin Portal, Light/Dark Theme Icon & Language */}
          <div className="flex items-center space-x-2.5">
            {/* Student Dashboard Portal Button */}
            {onOpenStudentDashboard && (
              <button
                type="button"
                onClick={onOpenStudentDashboard}
                className="flex items-center space-x-1.5 text-xs font-bold px-3 py-1 rounded-lg bg-black/80 hover:bg-[#E9C349] border border-[#E9C349] text-[#E9C349] hover:text-black shadow-sm transition-all shrink-0 font-mono"
                title="Open Student Dashboard Portal"
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Student Portal</span>
              </button>
            )}

            {/* Instructor Dashboard Portal Button */}
            {onOpenInstructorDashboard && (
              <button
                type="button"
                onClick={onOpenInstructorDashboard}
                className="flex items-center space-x-1.5 text-xs font-bold px-3 py-1 rounded-lg bg-[#E9C349]/10 hover:bg-[#E9C349] border border-[#E9C349] text-[#E9C349] hover:text-black shadow-sm transition-all shrink-0 font-mono"
                title="Open Instructor Dashboard Portal"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Instructor Portal</span>
              </button>
            )}

            {/* Admin Dashboard Portal Button */}
            {onOpenAdminDashboard && (
              <button
                type="button"
                onClick={onOpenAdminDashboard}
                className="flex items-center space-x-1.5 text-xs font-bold px-3 py-1 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#E9C349] text-black hover:brightness-110 shadow-sm transition-all shrink-0 font-mono"
                title="Open Enterprise Admin Dashboard"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Admin Portal</span>
              </button>
            )}

            {/* Persistent In-App Notifications Center */}
            <NotificationCenter
              currentLang={currentLang}
              onOpenReportsModal={onOpenReportsModal}
              onOpenApply={() => onOpenApply()}
            />

            {/* Dark/Light Mode Toggle Icon Button */}
            <button
              type="button"
              onClick={() => onChangeTheme(themeMode === 'light' ? 'dark' : 'light')}
              className="p-1.5 rounded-lg bg-black/60 dark:bg-white/10 border border-[#E9C349]/40 text-[#E9C349] hover:bg-[#E9C349] hover:text-black transition-all"
              title={themeMode === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
              aria-label="Toggle Theme"
            >
              {themeMode === 'light' ? (
                <Moon className="w-3.5 h-3.5" />
              ) : (
                <Sun className="w-3.5 h-3.5" />
              )}
            </button>
            
            {/* Language Switcher */}
            <button
              type="button"
              onClick={onToggleLang}
              className="flex items-center space-x-1 text-xs font-semibold px-2.5 py-1 rounded-lg border border-[#E9C349]/50 text-[#E9C349] hover:bg-[#E9C349] hover:text-black transition-all shrink-0"
              title="Switch Language (English / አማርኛ / Afaan Oromoo)"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{currentLang === 'en' ? 'English' : currentLang === 'am' ? 'አማርኛ' : 'Afaan Oromoo'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav className={`w-full transition-all duration-300 ${
        isScrolled 
          ? 'bg-[#FDF8F8]/95 dark:bg-[#0B0B0B]/95 backdrop-blur-md shadow-md py-3 border-b border-[#D4AF37]/20' 
          : 'bg-[#FDF8F8]/90 dark:bg-[#0B0B0B]/90 backdrop-blur-sm py-4 border-b border-[#E5E2E1] dark:border-[#262626]'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <a href="#home" className="flex flex-col group focus:outline-none">
            <span className="font-serif text-2xl font-bold tracking-tight text-[#111111] dark:text-[#FFFFFF] group-hover:text-[#D4AF37] transition-colors">
              Dare Institute
            </span>
            <span className="text-[10px] tracking-widest text-[#A08000] dark:text-[#D4AF37] uppercase font-semibold font-mono">
              {currentLang === 'en' ? "Beauty Training Institute" : currentLang === 'am' ? "ደሬ የውበት ማሰልጠኛ ተቋም" : "Dhaabbata Leenjii Miidhaginaa"}
            </span>
          </a>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-8">
            <ul className="flex space-x-6 text-xs tracking-wider uppercase font-semibold text-[#444748] dark:text-[#CCCCCC]">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="hover:text-[#111111] dark:hover:text-[#FFFFFF] border-b-2 border-transparent hover:border-[#D4AF37] pb-1 transition-all"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>

            {/* CTA & Auth Buttons */}
            <div className="flex items-center space-x-3">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center space-x-2.5 px-3 py-1.5 rounded-xl bg-[#111111] dark:bg-[#1A1A1E] text-white border border-[#E9C349]/50 hover:border-[#E9C349] transition-all"
                  >
                    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#F5D468] text-black font-bold text-[10px] flex items-center justify-center shrink-0">
                      {user.avatarUrl ? (
                        <img src={user.avatarUrl} alt={user.fullName} className="w-full h-full rounded-full object-cover" />
                      ) : (
                        user.fullName.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div className="text-left hidden sm:block">
                      <div className="text-xs font-bold leading-none text-[#E9C349] truncate max-w-[110px]">
                        {user.fullName}
                      </div>
                      <div className="text-[9px] font-mono text-gray-400 mt-0.5 uppercase">
                        {user.role}
                      </div>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                  </button>

                  {/* User Profile Dropdown Menu */}
                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-[#FAFAFA] dark:bg-[#161619] border border-[#E9C349]/40 rounded-2xl shadow-2xl p-2 z-50 text-xs">
                      <div className="px-3 py-2 border-b border-[var(--border-subtle)] mb-1">
                        <p className="font-bold text-[var(--text-primary)] truncate">{user.fullName}</p>
                        <p className="text-[10px] text-[var(--text-muted)] truncate">{user.email}</p>
                        <span className="inline-block mt-1.5 px-2 py-0.5 rounded-full bg-[#E9C349]/20 text-[#D4AF37] text-[9px] font-mono font-bold uppercase">
                          {user.role} Account
                        </span>
                      </div>
                      
                      {user.programEnrolled && (
                        <div className="px-3 py-1.5 text-[10px] text-[var(--text-secondary)] font-mono">
                          Program: <span className="text-[#D4AF37] font-semibold">{user.programEnrolled}</span>
                        </div>
                      )}

                      {onOpenReportsModal && (
                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            onOpenReportsModal();
                          }}
                          className="w-full mt-1 px-3 py-2 text-left rounded-xl hover:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold flex items-center space-x-2 transition-all border-t border-[var(--border-subtle)]"
                        >
                          <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
                          <span>Export Data Center</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onSignOut();
                        }}
                        className="w-full mt-1 px-3 py-2 text-left rounded-xl hover:bg-red-500/10 text-red-600 dark:text-red-400 font-semibold flex items-center space-x-2 transition-all"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={onOpenSignIn}
                    className="px-3 py-1.5 text-xs uppercase tracking-wider font-semibold text-[#111111] dark:text-white hover:text-[#D4AF37] transition-colors flex items-center space-x-1"
                  >
                    <LogIn className="w-3.5 h-3.5 text-[#E9C349]" />
                    <span>{currentLang === 'en' ? 'Sign In' : currentLang === 'am' ? 'ይግቡ' : 'Seenaa'}</span>
                  </button>
                  <button
                    onClick={onOpenSignUp}
                    className="px-3.5 py-1.5 text-xs uppercase tracking-wider font-semibold rounded-lg bg-[#E9C349] text-black hover:bg-[#f5d468] transition-all shadow-sm flex items-center space-x-1"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>{currentLang === 'en' ? 'Sign Up' : currentLang === 'am' ? 'ተመዝገብ' : 'Galmaa\'aa'}</span>
                  </button>
                </div>
              )}

              <button
                onClick={onOpenContact}
                className="hidden xl:block px-4 py-2 text-xs uppercase tracking-wider font-semibold border border-[#D4AF37] text-[#111111] dark:text-white hover:bg-[#FFF8F0] dark:hover:bg-[#171717] transition-colors focus:outline-none"
              >
                {currentLang === 'en' ? 'Contact' : currentLang === 'am' ? 'አድራሻ' : 'Nu Quunnamaa'}
              </button>
              <button
                onClick={() => onOpenApply()}
                className="px-4 py-2 text-xs uppercase tracking-wider font-semibold bg-[#111111] dark:bg-[#D4AF37] text-white dark:text-black hover:bg-[#D4AF37] dark:hover:bg-white hover:text-black transition-colors shadow-sm focus:outline-none"
              >
                {currentLang === 'en' ? 'Apply Now' : currentLang === 'am' ? 'አሁኑኑ ያመልክቱ' : 'Amma Galmaa\'aa'}
              </button>
            </div>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex lg:hidden items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#111111] dark:text-white hover:text-[#D4AF37] focus:outline-none"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#FDF8F8] dark:bg-[#171717] border-b border-[#D4AF37]/30 px-4 pt-3 pb-6 space-y-4 shadow-xl">
            <ul className="flex flex-col space-y-3 text-sm tracking-wider uppercase font-semibold text-[#111111] dark:text-white">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-1 hover:text-[#A08000] dark:hover:text-[#D4AF37] transition-colors border-l-2 border-transparent hover:border-[#D4AF37] pl-2"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>

            <div className="pt-3 border-t border-[#D4AF37]/30 flex flex-col space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-semibold text-[#444748] dark:text-[#CCCCCC]">
                  {currentLang === 'en' ? 'Appearance' : currentLang === 'am' ? 'ገፅታ' : 'Bifa'}
                </span>
                <button
                  type="button"
                  onClick={() => onChangeTheme(themeMode === 'light' ? 'dark' : 'light')}
                  className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-black/60 dark:bg-white/10 border border-[#E9C349]/40 text-[#E9C349] hover:bg-[#E9C349] hover:text-black transition-all text-xs font-mono font-bold"
                >
                  {themeMode === 'light' ? (
                    <>
                      <Moon className="w-3.5 h-3.5" />
                      <span>Dark Mode</span>
                    </>
                  ) : (
                    <>
                      <Sun className="w-3.5 h-3.5" />
                      <span>Light Mode</span>
                    </>
                  )}
                </button>
              </div>

              <a
                href={instituteInfo.socialLinks.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 text-xs uppercase tracking-wider font-semibold bg-[#E9C349]/15 border border-[#E9C349] text-[#E9C349] hover:bg-[#E9C349] hover:text-black transition-colors flex items-center justify-center space-x-2 rounded-xl"
              >
                <TikTokIcon className="w-4 h-4" />
                <span>TikTok @dere295</span>
              </a>

              {/* Mobile Auth Actions */}
              {user ? (
                <div className="bg-black/5 dark:bg-white/5 p-3 rounded-2xl border border-[#E9C349]/30 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-xs text-[#E9C349]">{user.fullName}</p>
                    <p className="text-[10px] text-[var(--text-muted)] font-mono">{user.email} • {user.role}</p>
                  </div>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onSignOut();
                    }}
                    className="p-2 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 text-xs font-bold"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenSignIn();
                    }}
                    className="py-2.5 text-xs uppercase tracking-wider font-semibold border border-[#E9C349] text-[#111111] dark:text-white hover:bg-[#E9C349] hover:text-black transition-all flex items-center justify-center space-x-1.5 rounded-xl"
                  >
                    <LogIn className="w-3.5 h-3.5 text-[#E9C349]" />
                    <span>{currentLang === 'en' ? 'Sign In' : currentLang === 'am' ? 'ይግቡ' : 'Seenaa'}</span>
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenSignUp();
                    }}
                    className="py-2.5 text-xs uppercase tracking-wider font-semibold bg-[#E9C349] text-black hover:bg-[#f5d468] transition-all flex items-center justify-center space-x-1.5 rounded-xl font-bold"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>{currentLang === 'en' ? 'Sign Up' : currentLang === 'am' ? 'ተመዝገብ' : 'Galmaa\'aa'}</span>
                  </button>
                </div>
              )}

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenContact();
                }}
                className="w-full py-2.5 text-xs uppercase tracking-wider font-semibold border border-[#D4AF37] text-[#111111] dark:text-white hover:bg-[#FFF8F0] dark:hover:bg-[#222222] transition-colors text-center"
              >
                {currentLang === 'en' ? 'Contact Us' : currentLang === 'am' ? 'አድራሻና ስልክ' : 'Nu Quunnamaa'}
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenApply();
                }}
                className="w-full py-2.5 text-xs uppercase tracking-wider font-semibold bg-[#111111] dark:bg-[#D4AF37] text-white dark:text-black hover:bg-[#D4AF37] dark:hover:bg-white hover:text-black transition-colors text-center"
              >
                {currentLang === 'en' ? 'Apply Now' : currentLang === 'am' ? 'አሁኑኑ ያመልክቱ' : 'Amma Galmaa\'aa'}
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
