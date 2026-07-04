import React from 'react';
import { useLoaderStore } from '../store/Store';

export const Loader: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isLoading = useLoaderStore((state) => state.isLoading);

  return (
    <>
      {isLoading && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30
            backdrop-blur-sm animate-fade-in"
          role="status"
          aria-live="polite"
        >
          <div className="flex flex-col items-center gap-3 rounded-2xl bg-white/90 px-6 py-5
            shadow-xl dark:bg-slate-900/90 animate-scale-in">
            <div className="h-9 w-9 animate-spin rounded-full border-3 border-brand-200
              border-t-brand-600" />
            <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Loading…</p>
          </div>
        </div>
      )}
      {children}
    </>
  );
};
