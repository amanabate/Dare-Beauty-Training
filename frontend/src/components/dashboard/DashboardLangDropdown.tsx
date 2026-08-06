'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Globe, Check } from 'lucide-react';
import { Language } from '../../types';

const LANGUAGES: { code: Language; native: string }[] = [
  { code: 'en', native: 'English' },
  { code: 'am', native: 'አማርኛ' },
  { code: 'om', native: 'Afaan Oromoo' },
];

interface Props {
  currentLang: Language;
  onChangeLang: (lang: Language) => void;
}

export const DashboardLangDropdown: React.FC<Props> = ({ currentLang, onChangeLang }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-mono text-xs uppercase transition-all border border-white/10 flex items-center space-x-1.5"
        title="Switch Language"
      >
        <Globe className="w-3.5 h-3.5 text-[#E9C349]" />
        <span className="text-[#E9C349]">{currentLang.toUpperCase()}</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-44 bg-[#1A1A1E] border border-[#E9C349]/30 rounded-2xl shadow-2xl p-1.5 z-50">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => { onChangeLang(lang.code); setOpen(false); }}
              className={`w-full px-3 py-2 text-left rounded-xl text-xs font-semibold flex items-center justify-between transition-all ${
                currentLang === lang.code
                  ? 'bg-[#E9C349] text-black'
                  : 'text-gray-300 hover:bg-white/10'
              }`}
            >
              <span>{lang.native}</span>
              {currentLang === lang.code && <Check className="w-3 h-3" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
