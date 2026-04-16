'use client';

import { selectCartSubtotal, useCartStore } from '@/store/cart';
import { formatPrice } from '@/lib/products/helpers';
import Button from '@/components/ui/Button';
import Link from 'next/link';

export default function CartSummary() {
  const hasHydrated = useCartStore((state) => state.hasHydrated);
  const items = useCartStore((state) => state.items);
  const subtotal = selectCartSubtotal(items);
  const shipping = subtotal > 0 ? 0 : 0;
  const total = subtotal + shipping;

  return (
    <div className="lux-surface p-6">
      <h3 className="text-lg font-semibold">Order Summary</h3>
      <div className="mt-6 space-y-3 text-sm text-cream/70">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{hasHydrated ? formatPrice(subtotal) : '—'}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span>{hasHydrated ? (shipping === 0 ? 'Free' : formatPrice(shipping)) : '—'}</span>
        </div>
        <div className="lux-divider" />
        <div className="flex justify-between text-base font-semibold text-cream">
          <span>Total</span>
          <span>{hasHydrated ? formatPrice(total) : '—'}</span>
        </div>
      </div>
      <Link href="/checkout" className="mt-8 block">
        <Button className="w-full">Proceed to Checkout</Button>
      </Link>
      <p className="mt-4 text-xs text-cream/50">Daily essentials, premium quality.</p>
    </div>
  );
}
