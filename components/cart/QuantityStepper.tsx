'use client';

import { cx } from '@/lib/utils';

type QuantityStepperProps = {
  qty: number;
  onChange: (qty: number) => void;
};

export default function QuantityStepper({ qty, onChange }: QuantityStepperProps) {
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => onChange(qty - 1)}
        className={cx('h-8 w-8 rounded-full border border-cream/20 text-cream/80 hover:border-accent/60')}
      > - </button>
      <span className="min-w-6 text-center text-sm">{qty}</span>
      <button
        type="button"
        onClick={() => onChange(qty + 1)}
        className={cx('h-8 w-8 rounded-full border border-cream/20 text-cream/80 hover:border-accent/60')}
      >
        +
      </button>
    </div>
  );
}
