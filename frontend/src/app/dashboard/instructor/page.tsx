'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { InstructorDashboard } from '@/components/dashboard/InstructorDashboard';
import { Language, UserAccount } from '@/types';
import { useTheme } from '@/components/shared/ThemeProvider';

export default function InstructorDashboardPage() {
  const { themeMode, setThemeMode } = useTheme();
  const [currentLang, setCurrentLang] = useState<Language>('en');
  const [user, setUser] = useState<UserAccount | null>(null);
  const router = useRouter();

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

  const handleLogout = () => {
    try {
      localStorage.removeItem('dare_user_account');
      localStorage.removeItem('dare_auth_token');
      localStorage.removeItem('dare_chat_history');
    } catch { /* ignore */ }
    router.push('/');
  };

  return (
    <InstructorDashboard
      currentLang={currentLang}
      onChangeLang={handleChangeLang}
      themeMode={themeMode}
      onChangeTheme={setThemeMode}
      currentUser={user}
      onLogout={handleLogout}
    />
  );
}
