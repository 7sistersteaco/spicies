import { InputHTMLAttributes, useId } from 'react';
import { cx } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: React.ReactNode;
}

export default function Input({ label, error, className, id, ...props }: InputProps) {
  const generatedId = useId();
  const inputId = id || props.name || generatedId;
  
  return (
    <div className="w-full space-y-2">
      {label && (
        <label 
          htmlFor={inputId} 
          className="text-[10px] uppercase tracking-[0.3em] text-cream/60 font-semibold block ml-1"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={cx(
          'w-full rounded-lg border border-white/20 bg-cream/90 px-4 py-3 text-sm text-ink placeholder:text-ink/40 focus:border-accent focus:outline-none transition-all duration-200 shadow-sm',
          error ? 'border-accent ring-1 ring-accent/20' : '',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-accent ml-1 font-medium">{error}</p>}
    </div>
  );
}
