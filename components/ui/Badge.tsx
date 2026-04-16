import { ReactNode } from 'react';
import { cx } from '@/lib/utils';

type BadgeProps = {
  children: ReactNode;
  className?: string;
};

export default function Badge({ children, className }: BadgeProps) {
  return (
    <span
      className={cx(
        'inline-flex items-center rounded-full border border-accent/40 px-3 py-1 text-xs uppercase tracking-[0.2em] text-cream/70',
        className
      )}
    >
      {children}
    </span>
  );
}
