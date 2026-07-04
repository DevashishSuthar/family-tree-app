import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: React.ReactNode;
  icon: LucideIcon;
  accent?: 'brand' | 'rose' | 'sky' | 'amber';
}

const accentClasses: Record<NonNullable<StatCardProps['accent']>, string> = {
  brand: 'bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-400',
  rose: 'bg-pink-50 text-pink-600 dark:bg-pink-950/50 dark:text-pink-400',
  sky: 'bg-sky-50 text-sky-600 dark:bg-sky-950/50 dark:text-sky-400',
  amber: 'bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400',
};

export const StatCard: React.FC<StatCardProps> = ({ label, value, icon: Icon, accent = 'brand' }) => {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4
      shadow-sm transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
      <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${accentClasses[accent]}`}>
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <p className="text-2xl font-bold leading-tight text-slate-900 dark:text-slate-100">{value}</p>
        <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
      </div>
    </div>
  );
};
