'use client';

import CartItem from '@/components/cart/CartItem';
import CartSummary from '@/components/cart/CheckoutSummary';
import { useCartStore } from '@/store/cart';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import Reveal from '@/components/motion/Reveal';

export default function CartClient() {
  const hasHydrated = useCartStore((state) => state.hasHydrated);
  const items = useCartStore((state) => state.items);

  if (hasHydrated && items.length === 0) {
    return (
      <Reveal>
        <div className="mt-20 flex flex-col items-center justify-center text-center space-y-6 py-20 bg-white/5 rounded-2xl border border-white/10">
          <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-accent/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold">Your kitchen essentials await</h2>
            <p className="text-cream/60 max-w-md mx-auto">
              It looks like you haven't added anything to your cart yet. Discover our premium Assam tea and authentic spices.
            </p>
          </div>
          <Link href="/products">
            <Button variant="secondary" size="lg">Explore Collection</Button>
          </Link>
        </div>
      </Reveal>
    );
  }

  return (
    <div className="mt-12 grid gap-10 md:grid-cols-[1.3fr_0.7fr]">
      <div className="space-y-6">
        {!hasHydrated ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent"></div>
          </div>
        ) : (
          items.map((item) => <CartItem key={item.id} item={item} />)
        )}
      </div>
      <CartSummary onPay={() => {}} />
    </div>
  );
}
