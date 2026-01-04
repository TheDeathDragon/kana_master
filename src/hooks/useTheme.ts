import { useState, useEffect, useCallback } from 'react';

export type Theme = 'light' | 'dark';

const THEME_KEY = 'kana-app-theme';

function getStoredTheme(): Theme {
  try {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === 'dark' || stored === 'light') {
      return stored;
    }
  } catch {
    // ignore
  }
  return 'light';
}

function storeTheme(theme: Theme): void {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    // ignore
  }
}

export function useTheme(): { theme: Theme; toggleTheme: () => void; setTheme: (t: Theme) => void } {
  const [theme, setThemeState] = useState<Theme>(getStoredTheme);
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    storeTheme(theme);
  }, [theme]);
  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);
  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
  }, []);
  return { theme, toggleTheme, setTheme };
}
