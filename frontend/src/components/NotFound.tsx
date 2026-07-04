import React from 'react';
import { Link } from '@tanstack/react-router';
import { Compass } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="flex min-h-[calc(100vh-57px)] items-center justify-center bg-slate-50
      px-4 dark:bg-slate-950">
      <div className="text-center">
        <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl
          bg-brand-50 text-brand-500 dark:bg-brand-950 dark:text-brand-400">
          <Compass className="h-7 w-7" />
        </span>
        <h1 className="text-5xl font-bold text-slate-900 dark:text-slate-100">404</h1>
        <p className="mt-2 text-lg text-slate-500 dark:text-slate-400">
          This branch of the family tree doesn't exist.
        </p>
        <Link
          to="/families"
          className="mt-6 inline-flex items-center justify-center rounded-lg bg-brand-600 px-4 py-2
            text-sm font-semibold text-white hover:bg-brand-700"
        >
          Back to Families
        </Link>
      </div>
    </div>
  );
};
