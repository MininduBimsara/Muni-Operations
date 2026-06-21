'use client';

import React, { createContext, useContext, useState } from 'react';
import en from './locales/en.json';
import si from './locales/si.json';
import ta from './locales/ta.json';

export type Lang = 'en' | 'si' | 'ta';
type Translations = Record<string, string>;

const translations: Record<Lang, Translations> = { en, si, ta };

interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'en',
  setLang: () => {},
  t: (key) => key,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>('en');

  const t = (key: string, vars?: Record<string, string | number>): string => {
    let str = translations[lang]?.[key] ?? translations['en']?.[key] ?? key;
    if (vars) {
      Object.entries(vars).forEach(([k, v]) => {
        str = str.replace(`{{${k}}}`, String(v));
      });
    }
    return str;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useTranslation = () => useContext(LanguageContext);
