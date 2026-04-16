import { cx } from '@/lib/utils';

type DividerProps = {
  className?: string;
};

export default function Divider({ className }: DividerProps) {
  return <div className={cx('lux-divider', className)} />;
}
