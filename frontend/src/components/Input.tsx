import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', id, ...props }, ref) => {
    const inputId = id ?? props.name;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={`rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400
            transition-colors duration-150 outline-none
            focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20
            dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500
            ${error ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : 'border-slate-300 dark:border-slate-700'}
            ${className}`}
          {...props}
        />
        {error && <span className="text-xs font-medium text-red-600 dark:text-red-400">{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';