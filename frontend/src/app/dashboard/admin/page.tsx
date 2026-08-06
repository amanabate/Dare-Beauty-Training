'use client';

import React, { useState, useEffect } from 'react';
import { AdminDashboard } from '@/components/dashboard/AdminDashboard';
import { Language, ThemeMode, UserAccount } from '@/types';

export default function AdminDashboardPage() {
  const [currentLang, setCurrentLang] = useState<Language>('en');
  const [themeMode, setThemeMode] = useState<ThemeMode>('dark');
  const [user, setUser] = useState<UserAccount | null>(null);

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('hc-theme') as ThemeMode | null;
      if (savedTheme) setThemeMode(savedTheme);

      const savedUser = localStorage.getItem('dare_user_account');
      if (savedUser) setUser(JSON.parse(savedUser));

      const savedLang = localStorage.getItem('hc-lang') as Language | null;
      if (savedLang) setCurrentLang(savedLang);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    try { localStorage.setItem('hc-theme', themeMode); } catch { /* ignore */ }
    const root = document.documentElement;
    root.setAttribute('data-theme', themeMode);
    root.classList.toggle('dark', themeMode !== 'light');
  }, [themeMode]);

  const handleChangeLang = (lang: Language) => {
    setCurrentLang(lang);
    try { localStorage.setItem('hc-lang', lang); } catch { /* ignore */ }
  };

  return (
    <AdminDashboard
      currentLang={currentLang}
      onChangeLang={handleChangeLang}
      themeMode={themeMode}
      onChangeTheme={setThemeMode}
      currentUser={user}
    />
  );
}
