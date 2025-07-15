'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Language = 'zh-CN' | 'en-US' | 'ja-JP';

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('zh-CN');

  // 从localStorage加载保存的语言偏好
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language | null;
    if (savedLanguage && ['zh-CN', 'en-US', 'ja-JP'].includes(savedLanguage)) {
      setLanguage(savedLanguage);
    } else {
      // 回退到浏览器语言
      const browserLang = navigator.language;
      if (browserLang.startsWith('en')) setLanguage('en-US');
      else if (browserLang.startsWith('ja')) setLanguage('ja-JP');
    }
  }, []);

  // 保存语言偏好到localStorage
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
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