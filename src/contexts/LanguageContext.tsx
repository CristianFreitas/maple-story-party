'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, Translation } from '@/i18n/translations';

type Language = 'en' | 'pt';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translation;
  availableLanguages: { code: Language; name: string; flag: string }[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  const availableLanguages = [
    { code: 'en' as Language, name: 'English', flag: '🇺🇸' },
    { code: 'pt' as Language, name: 'Português', flag: '🇧🇷' },
  ];

  // Load language from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('maplePartyLanguage') as Language;
      if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'pt')) {
        setLanguageState(savedLanguage);
      } else {
        // Detect browser language
        const browserLang = navigator.language.toLowerCase();
        const detectedLang = browserLang.startsWith('pt') ? 'pt' : 'en';
        setLanguageState(detectedLang);
      }
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('maplePartyLanguage', lang);
    }
  };

  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, availableLanguages }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
