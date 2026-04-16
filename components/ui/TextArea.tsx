import { TextareaHTMLAttributes } from 'react';
import { cx } from '@/lib/utils';

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: React.ReactNode;
}

export default function TextArea({ label, error, className, id, ...props }: TextAreaProps) {
  const inputId = id || props.name;
  
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
      <textarea
        id={inputId}
        className={cx(
          'w-full rounded-lg border border-white/20 bg-cream/90 px-4 py-3 text-sm text-ink placeholder:text-ink/40 focus:border-accent focus:outline-none transition-all duration-200 shadow-sm min-h-[100px]',
          error ? 'border-accent ring-1 ring-accent/20' : '',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-accent ml-1">{error}</p>}
    </div>
  );
}
