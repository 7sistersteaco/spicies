import { ReactNode } from 'react';
import { cx } from '@/lib/utils';

type ContainerProps = {
  children: ReactNode;
  className?: string;
  size?: 'shrunken' | 'small' | 'medium' | 'large';
};

export default function Container({ children, className, size = 'large' }: ContainerProps) {
  const sizes = {
    shrunken: 'max-w-4xl',
    small: 'max-w-5xl',
    medium: 'max-w-7xl',
    large: 'max-w-[96rem] 2xl:max-w-[104rem]'
  };

  return (
    <div className={cx('section-pad mx-auto w-full', sizes[size], className)}>
      {children}
    </div>
  );
}
