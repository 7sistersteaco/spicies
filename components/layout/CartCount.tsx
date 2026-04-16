'use client';

import { useCartStore, selectCartCount } from '@/store/cart';

export default function CartCount() {
  const hasHydrated = useCartStore((state) => state.hasHydrated);
  const count = useCartStore((state) => selectCartCount(state.items));
  if (!hasHydrated || !count) {
    return null;
  }
  return (
    <span className="ml-2 inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-accent px-2 text-xs font-semibold text-ink">
      {count}
    </span>
  );
}
