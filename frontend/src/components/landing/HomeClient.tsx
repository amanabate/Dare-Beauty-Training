'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '../shared/Navbar';
import { Hero } from './Hero';
import { About } from './About';
import { Programs } from './Programs';
import { Features } from './Features';
import { ProcessTimeline } from './ProcessTimeline';
import { Statistics } from './Statistics';
import { AnalyticsSection } from './AnalyticsSection';
import { Gallery } from './Gallery';
import { Testimonials } from './Testimonials';
import { Admissions } from './Admissions';
import { LocationSection } from './LocationSection';
import { FAQ } from './FAQ';
import { CTA } from './CTA';
import { Footer } from './Footer';
import { ApplicationModal } from '../modals/ApplicationModal';
import { ProgramDetailModal } from '../modals/ProgramDetailModal';
import { ContactModal } from '../modals/ContactModal';
import { Language, TrainingProgram, UserAccount } from '@/types';
import { useTheme } from '../shared/ThemeProvider';

export function HomeClient() {
  const searchParams = useSearchParams();
  const { themeMode, setThemeMode } = useTheme();
  const [currentLang, setCurrentLang] = useState<Language>('en');
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [selectedProgramId, setSelectedProgramId] = useState<string | undefined>(undefined);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [activeSyllabusProgram, setActiveSyllabusProgram] = useState<TrainingProgram | null>(null);
  const [user, setUser] = useState<UserAccount | null>(null);

  // Hydrate lang & user from localStorage after mount
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('dare_user_account');
      if (savedUser) setUser(JSON.parse(savedUser));

      const savedLang = localStorage.getItem('hc-lang') as Language | null;
      if (savedLang) setCurrentLang(savedLang);
    } catch { /* ignore */ }
  }, []);

  const handleChangeLang = (lang: Language) => {
    setCurrentLang(lang);
    try { localStorage.setItem('hc-lang', lang); } catch { /* ignore */ }
  };

  const handleOpenApply = (programId?: string) => {
    setSelectedProgramId(programId);
    setApplyModalOpen(true);
  };

  const handleSignOut = () => {
    setUser(null);
    try { localStorage.removeItem('dare_user_account'); } catch { /* ignore */ }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] font-sans relative transition-colors duration-300">
      {/* Background glows */}
      <div className="bg-glow-layer">
        <div className="bg-glow-top-left" />
        <div className="bg-glow-bottom-right" />
        <div className="bg-vignette" />
      </div>

      <Navbar
        currentLang={currentLang}
        onChangeLang={handleChangeLang}
        themeMode={themeMode}
        onChangeTheme={setThemeMode}
        onOpenContact={() => setContactModalOpen(true)}
        user={user}
        onSignOut={handleSignOut}
      />

      <main>
        <Hero currentLang={currentLang} onOpenApply={() => handleOpenApply()} />
        <About currentLang={currentLang} onOpenApply={() => handleOpenApply()} />
        <Programs
          currentLang={currentLang}
          onSelectProgram={(program) => setActiveSyllabusProgram(program)}
          onOpenApply={handleOpenApply}
        />
        <Features currentLang={currentLang} />
        <ProcessTimeline currentLang={currentLang} onOpenApply={() => handleOpenApply()} />
        <Statistics currentLang={currentLang} />
        <AnalyticsSection currentLang={currentLang} />
        <Gallery currentLang={currentLang} />
        <Testimonials currentLang={currentLang} />
        <Admissions currentLang={currentLang} onOpenApply={() => handleOpenApply()} />
        <LocationSection
          currentLang={currentLang}
          onOpenApply={() => handleOpenApply()}
          onOpenContact={() => setContactModalOpen(true)}
        />
        <FAQ currentLang={currentLang} />
        <CTA
          currentLang={currentLang}
          onOpenApply={() => handleOpenApply()}
          onOpenContact={() => setContactModalOpen(true)}
        />
      </main>

      <Footer
        currentLang={currentLang}
        onOpenApply={() => handleOpenApply()}
        onOpenContact={() => setContactModalOpen(true)}
      />

      {/* Remaining modals (ApplicationModal and ContactModal stay, ProgramDetailModal stays) */}
      <ApplicationModal
        isOpen={applyModalOpen}
        onClose={() => { setApplyModalOpen(false); setSelectedProgramId(undefined); }}
        defaultProgramId={selectedProgramId}
        currentLang={currentLang}
      />
      <ProgramDetailModal
        program={activeSyllabusProgram}
        onClose={() => setActiveSyllabusProgram(null)}
        onOpenApply={handleOpenApply}
        currentLang={currentLang}
      />
      <ContactModal
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
        currentLang={currentLang}
      />
    </div>
  );
}
