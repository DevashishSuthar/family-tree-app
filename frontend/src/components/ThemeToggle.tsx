import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useThemeStore } from '../store/Store';

export const ThemeToggle: React.FC = () => {
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
      className="relative inline-flex h-9 w-9 items-center justify-center rounded-full
        text-slate-500 hover:bg-slate-200/70 hover:text-slate-900
        dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100
        transition-colors duration-200"
    >
      <Sun
        className={`absolute h-5 w-5 transition-all duration-300 ${
          theme === 'dark' ? 'scale-0 -rotate-90 opacity-0' : 'scale-100 rotate-0 opacity-100'
        }`}
      />
      <Moon
        className={`absolute h-5 w-5 transition-all duration-300 ${
          theme === 'dark' ? 'scale-100 rotate-0 opacity-100' : 'scale-0 rotate-90 opacity-0'
        }`}
      />
    </button>
  );
};
