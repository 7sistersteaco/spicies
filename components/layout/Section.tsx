import { ReactNode } from 'react';
import { cx } from '@/lib/utils';

type SectionProps = {
  children: ReactNode;
  className?: string;
  id?: string;
};

export default function Section({ children, className, id }: SectionProps) {
  return (
    <section id={id} className={cx('py-16 md:py-24', className)}>
      {children}
    </section>
  );
}
