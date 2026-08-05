'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from './Navbar';
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
import { ApplicationModal } from './ApplicationModal';
import { ProgramDetailModal } from './ProgramDetailModal';
import { ContactModal } from './ContactModal';
import { AdminChatWidget } from './AdminChatWidget';
import { AuthModal } from './AuthModal';
import { AdminReportsModal } from './AdminReportsModal';
import { AdminDashboard } from './AdminDashboard';
import { StudentDashboard } from './StudentDashboard';
import { InstructorDashboard } from './InstructorDashboard';
import { withRoleProtection, RoleGuard } from './AccessDenied';
import { Language, TrainingProgram, ThemeMode, UserAccount } from '@/types';

const ProtectedAdminDashboard = withRoleProtection(
  AdminDashboard,
  ['Admin'],
  'Enterprise Admin Dashboard'
);

export function HomeClient() {
  const [currentLang, setCurrentLang] = useState<Language>('en');
  const [themeMode, setThemeMode] = useState<ThemeMode>('dark');
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [selectedProgramId, setSelectedProgramId] = useState<string | undefined>(undefined);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [activeSyllabusProgram, setActiveSyllabusProgram] = useState<TrainingProgram | null>(null);
  const [reportsModalOpen, setReportsModalOpen] = useState(false);
  const [adminDashboardOpen, setAdminDashboardOpen] = useState(false);
  const [studentDashboardOpen, setStudentDashboardOpen] = useState(false);
  const [instructorDashboardOpen, setInstructorDashboardOpen] = useState(false);
  const [user, setUser] = useState<UserAccount | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState<'signin' | 'signup'>('signin');

  // Hydrate theme & user from localStorage after mount (avoids SSR mismatch)
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('hc-theme') as ThemeMode | null;
      if (savedTheme) setThemeMode(savedTheme);

      const savedUser = localStorage.getItem('dare_user_account');
      if (savedUser) setUser(JSON.parse(savedUser));
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('hc-theme', themeMode);
    } catch {
      // ignore
    }
    const root = document.documentElement;
    root.setAttribute('data-theme', themeMode);
    if (themeMode === 'light') {
      root.classList.remove('dark');
    } else {
      root.classList.add('dark');
    }
  }, [themeMode]);

  const toggleLanguage = () => {
    setCurrentLang((prev) => {
      if (prev === 'en') return 'am';
      if (prev === 'am') return 'om';
      return 'en';
    });
  };

  const handleOpenApply = (programId?: string) => {
    setSelectedProgramId(programId);
    setApplyModalOpen(true);
  };

  const handleCloseApply = () => {
    setApplyModalOpen(false);
    setSelectedProgramId(undefined);
  };

  const handleSignOut = () => {
    setUser(null);
    try {
      localStorage.removeItem('dare_user_account');
    } catch {
      // ignore
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] font-sans relative transition-colors duration-300">
      {/* Background Page-Level Glow & Vignette */}
      <div className="bg-glow-layer">
        <div className="bg-glow-top-left" />
        <div className="bg-glow-bottom-right" />
        <div className="bg-vignette" />
      </div>

      <Navbar
        currentLang={currentLang}
        onToggleLang={toggleLanguage}
        themeMode={themeMode}
        onChangeTheme={setThemeMode}
        onOpenApply={handleOpenApply}
        onOpenContact={() => setContactModalOpen(true)}
        user={user}
        onOpenSignIn={() => { setAuthInitialMode('signin'); setAuthModalOpen(true); }}
        onOpenSignUp={() => { setAuthInitialMode('signup'); setAuthModalOpen(true); }}
        onSignOut={handleSignOut}
        onOpenReportsModal={() => setReportsModalOpen(true)}
        onOpenAdminDashboard={() => setAdminDashboardOpen(true)}
        onOpenStudentDashboard={() => setStudentDashboardOpen(true)}
        onOpenInstructorDashboard={() => setInstructorDashboardOpen(true)}
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

      {/* Modals */}
      <ApplicationModal
        isOpen={applyModalOpen}
        onClose={handleCloseApply}
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
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        currentLang={currentLang}
        initialMode={authInitialMode}
        onLoginSuccess={(loggedUser) => setUser(loggedUser)}
      />

      <RoleGuard
        isOpen={reportsModalOpen}
        currentUser={user}
        allowedRoles={['Admin']}
        featureName="Admin Financial & Student CSV Reports Manager"
        onClose={() => setReportsModalOpen(false)}
        onOpenSignIn={() => { setAuthInitialMode('signin'); setAuthModalOpen(true); }}
      >
        <AdminReportsModal
          isOpen={reportsModalOpen}
          onClose={() => setReportsModalOpen(false)}
          currentLang={currentLang}
        />
      </RoleGuard>

      <AdminChatWidget
        currentLang={currentLang}
        userRole={user?.role === 'Instructor' ? 'Instructor' : 'Admin'}
        onOpenReportsModal={() => setReportsModalOpen(true)}
      />

      <ProtectedAdminDashboard
        isOpen={adminDashboardOpen}
        onClose={() => setAdminDashboardOpen(false)}
        currentLang={currentLang}
        onToggleLang={toggleLanguage}
        themeMode={themeMode}
        onChangeTheme={setThemeMode}
        currentUser={user}
        onOpenSignIn={() => { setAuthInitialMode('signin'); setAuthModalOpen(true); }}
        onOpenInstructorDashboard={() => {
          setAdminDashboardOpen(false);
          setInstructorDashboardOpen(true);
        }}
        onOpenStudentDashboard={() => {
          setAdminDashboardOpen(false);
          setStudentDashboardOpen(true);
        }}
      />

      <StudentDashboard
        isOpen={studentDashboardOpen}
        onClose={() => setStudentDashboardOpen(false)}
        currentLang={currentLang}
        onToggleLang={toggleLanguage}
        themeMode={themeMode}
        onChangeTheme={setThemeMode}
        currentUser={user}
      />

      <InstructorDashboard
        isOpen={instructorDashboardOpen}
        onClose={() => setInstructorDashboardOpen(false)}
        currentLang={currentLang}
        onToggleLang={toggleLanguage}
        themeMode={themeMode}
        onChangeTheme={setThemeMode}
        currentUser={user}
      />
    </div>
  );
}
