import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getItem, setItem } from '../services/storage/localStorage';

interface ThemeContextType {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const THEME_KEY = 'careermate_dark_mode';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [darkMode, setDarkMode] = useState<boolean>(() => getItem<boolean>(THEME_KEY, false));

  useEffect(() => {
    if (darkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      document.documentElement.classList.remove('dark');
    }
    setItem(THEME_KEY, darkMode);
  }, [darkMode]);

  const toggleDarkMode = useCallback(() => {
    setDarkMode((prev) => !prev);
  }, []);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
}
