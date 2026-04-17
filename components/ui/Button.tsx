'use client';

import { ButtonHTMLAttributes, AnchorHTMLAttributes } from 'react';
import { cx } from '@/lib/utils';
import { useFormStatus } from 'react-dom';
import Link from 'next/link';

type BaseProps = {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  href?: string;
};

type ButtonProps = BaseProps & ButtonHTMLAttributes<HTMLButtonElement>;
type AnchorProps = BaseProps & AnchorHTMLAttributes<HTMLAnchorElement>;

export default function Button({ 
  variant = 'primary', 
  size = 'md',
  className, 
  loading, 
  disabled, 
  href,
  children, 
  ...props 
}: any) { // Using any safely here to handle polymorphic props
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

  const combinedClassName = cx(base, variants[variant as keyof typeof variants], sizes[size as keyof typeof sizes], className);

  const content = (
    <>
      {isPending ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Processing...
        </span>
      ) : children}
    </>
  );

  if (href) {
    return (
      <Link 
        href={href} 
        className={combinedClassName}
        {...(props as AnchorProps)}
      >
        {content}
      </Link>
    );
  }

  return (
    <button 
      className={combinedClassName} 
      disabled={isPending || disabled}
      {...(props as ButtonProps)}
    >
      {content}
    </button>
  );
}
