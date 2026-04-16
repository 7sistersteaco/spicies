'use client';

import { ProductVariant } from '@/lib/products/types';
import { cx } from '@/lib/utils';

type WeightSelectorProps = {
  variants: ProductVariant[];
  selectedId: string;
  onSelect: (id: string) => void;
};

export default function WeightSelector({ variants, selectedId, onSelect }: WeightSelectorProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {variants.map((variant) => (
        <button
          key={variant.id}
          type="button"
          onClick={() => onSelect(variant.id)}
          className={cx(
            'rounded-full border px-4 py-2 text-xs uppercase tracking-[0.2em] transition',
            selectedId === variant.id
              ? 'border-accent bg-accent text-ink'
              : 'border-cream/20 text-cream/70 hover:border-accent/60'
          )}
        >
          {variant.weightLabel}
        </button>
      ))}
    </div>
  );
}
