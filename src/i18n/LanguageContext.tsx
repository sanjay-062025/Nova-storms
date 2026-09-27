import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../types';
import { TRANSLATIONS, Translations } from './translations';

export interface LanguageOption {
  code: Language;
  label: string;
  nativeLabel: string;
  badge: string;
  scriptName?: string;
  regionInfo?: string;
  isTribal?: boolean;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  {
    code: 'en',
    label: 'English',
    nativeLabel: 'English',
    badge: 'EN',
    scriptName: 'Latin',
    regionInfo: 'National & Central Guidelines',
    isTribal: false
  },
  {
    code: 'hi',
    label: 'Hindi',
    nativeLabel: 'हिन्दी',
    badge: 'हिं',
    scriptName: 'Devanagari',
    regionInfo: 'Central Official Language',
    isTribal: false
  },
  {
    code: 'sat',
    label: 'Santhali',
    nativeLabel: 'ᱥᱟᱱᱛᱟᱲᱤ',
    badge: 'ᱥᱟᱱ',
    scriptName: 'Ol Chiki (ᱚᱞ ᱪᱤᱠᱤ)',
    regionInfo: 'Constitutional 8th Schedule Tribal Language (Jharkhand, Odisha, West Bengal, Assam)',
    isTribal: true
  },
  {
    code: 'ta',
    label: 'Tamil',
    nativeLabel: 'தமிழ்',
    badge: 'தமி',
    scriptName: 'Tamil Script',
    regionInfo: 'Southern ST & PVTG Communities (Nilgiris, Irular, Toda)',
    isTribal: false
  }
];

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof Translations, fallback?: string) => string;
  translations: Translations;
  languages: LanguageOption[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('mota_user_lang') as Language;
      if (saved && (saved === 'en' || saved === 'hi' || saved === 'sat' || saved === 'ta')) {
        return saved;
      }
    } catch (e) {
      console.warn('Could not read saved language', e);
    }
    return 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('mota_user_lang', lang);
    } catch (e) {
      console.warn('Could not save language', e);
    }
  };

  const currentTranslations = TRANSLATIONS[language] || TRANSLATIONS.en;

  const t = (key: keyof Translations, fallback?: string): string => {
    const val = currentTranslations[key];
    if (val) return val;
    const enVal = TRANSLATIONS.en[key];
    if (enVal) return enVal;
    return fallback || String(key);
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        translations: currentTranslations,
        languages: SUPPORTED_LANGUAGES
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
