'use client';

import { ButtonHTMLAttributes } from 'react';
import { cx } from '@/lib/utils';
import { useFormStatus } from 'react-dom';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
};

export default function Button({ 
  variant = 'primary', 
  size = 'md',
  className, 
  loading, 
  disabled, 
  children, 
  ...props 
}: ButtonProps) {
  const { pending } = useFormStatus();
  const isPending = pending || loading;

  const base =
    'inline-flex items-center justify-center rounded-full text-xs uppercase tracking-[0.25em] transition disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-accent text-ink hover:shadow-glow',
    secondary: 'border border-accent/70 text-accent hover:bg-accent hover:text-ink',
    ghost: 'text-cream/80 hover:text-cream',
    outline: 'border border-white/10 text-cream/80 hover:bg-white/5'
  };

  const sizes = {
    sm: 'px-4 py-2 min-h-[36px]',
    md: 'px-6 py-3 min-h-[44px]',
    lg: 'px-8 py-4 min-h-[52px]'
  };

  return (
    <button 
      className={cx(base, variants[variant], sizes[size], className)} 
      disabled={isPending || disabled}
      {...props}
    >
      {isPending ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Processing...
        </span>
      ) : children}
    </button>
  );
}
