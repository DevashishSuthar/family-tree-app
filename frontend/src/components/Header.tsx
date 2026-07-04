import React from 'react';
import { Link } from '@tanstack/react-router';
import { TreeDeciduous } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/80 backdrop-blur-md
      dark:border-slate-800 dark:bg-slate-950/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link to="/families" className="flex items-center gap-2 text-slate-900 dark:text-slate-100 group">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500 text-white
            shadow-sm shadow-brand-500/30 transition-transform duration-200 group-hover:scale-105">
            <TreeDeciduous className="h-5 w-5" />
          </span>
          <span className="text-lg font-semibold tracking-tight">Family Tree</span>
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
};
