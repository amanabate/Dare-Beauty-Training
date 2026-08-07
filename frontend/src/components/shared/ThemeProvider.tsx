'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { ThemeMode } from '@/types';

interface ThemeContextValue {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  themeMode: 'dark',
  setThemeMode: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeMode, setThemeModeState] = useState<ThemeMode>('dark');

  // Hydrate from localStorage on first mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('hc-theme') as ThemeMode | null;
      if (saved) setThemeModeState(saved);
    } catch { /* ignore */ }
  }, []);

  // Apply theme to document whenever it changes
  useEffect(() => {
    try { localStorage.setItem('hc-theme', themeMode); } catch { /* ignore */ }
    const root = document.documentElement;
    root.setAttribute('data-theme', themeMode);
    root.classList.toggle('dark', themeMode !== 'light');
  }, [themeMode]);

  const setThemeMode = (mode: ThemeMode) => setThemeModeState(mode);

  return (
    <ThemeContext.Provider value={{ themeMode, setThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}
