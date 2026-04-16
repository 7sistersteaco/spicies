'use client';

import Image from 'next/image';
import { CartItem as CartItemType, useCartStore } from '@/store/cart';
import { formatPrice } from '@/lib/products/helpers';
import QuantityStepper from './QuantityStepper';

export default function CartItem({ item }: { item: CartItemType }) {
  const updateQty = useCartStore((state) => state.updateQty);
  const removeItem = useCartStore((state) => state.removeItem);

  return (
    <div className="flex flex-col gap-4 border-b border-white/10 pb-6 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-4">
        <div className="relative h-20 w-20 overflow-hidden rounded-xl bg-charcoal/70">
          <Image src={item.image} alt={item.name} fill sizes="80px" className="object-contain" />
        </div>
        <div>
          <p className="text-lg font-semibold">{item.name}</p>
          <p className="text-sm text-cream/60">{item.weightLabel}</p>
          <button
            type="button"
            onClick={() => removeItem(item.id)}
            className="mt-2 text-xs uppercase tracking-[0.2em] text-cream/40 hover:text-accent"
          >
            Remove
          </button>
        </div>
      </div>
      <div className="flex items-center justify-between gap-6 md:justify-end">
        <QuantityStepper qty={item.qty} onChange={(qty) => updateQty(item.id, qty)} />
        <p className="text-sm font-semibold text-accent">{formatPrice(item.priceInr * item.qty)}</p>
      </div>
    </div>
  );
}
