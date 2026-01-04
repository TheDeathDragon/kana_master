import { useState, useCallback, useMemo } from 'react';
import { Language, Translations, getTranslation } from '../i18n';

const LANG_KEY = 'kana-app-language';

function getStoredLanguage(): Language {
  try {
    const stored = localStorage.getItem(LANG_KEY);
    if (stored === 'zh' || stored === 'en') {
      return stored;
    }
  } catch {
    // ignore
  }
  return 'zh';
}

function storeLanguage(lang: Language): void {
  try {
    localStorage.setItem(LANG_KEY, lang);
  } catch {
    // ignore
  }
}

interface UseLanguageReturn {
  language: Language;
  t: Translations;
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
}

export function useLanguage(): UseLanguageReturn {
  const [language, setLanguageState] = useState<Language>(getStoredLanguage);
  const t = useMemo(() => getTranslation(language), [language]);
  const toggleLanguage = useCallback(() => {
    setLanguageState((prev) => {
      const next = prev === 'zh' ? 'en' : 'zh';
      storeLanguage(next);
      return next;
    });
  }, []);
  const setLanguage = useCallback((lang: Language) => {
    storeLanguage(lang);
    setLanguageState(lang);
  }, []);
  return { language, t, toggleLanguage, setLanguage };
}
