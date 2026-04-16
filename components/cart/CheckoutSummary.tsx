'use client';

import Button from '@/components/ui/Button';
import { formatPrice } from '@/lib/products/helpers';
import { selectCartSubtotal, useCartStore } from '@/store/cart';

type CheckoutSummaryProps = {
  onPay: () => void;
  loading?: boolean;
  error?: string | null;
};

export default function CheckoutSummary({ onPay, loading, error }: CheckoutSummaryProps) {
  const hasHydrated = useCartStore((state) => state.hasHydrated);
  const items = useCartStore((state) => state.items);
  const subtotal = selectCartSubtotal(items);
  const shipping = subtotal > 0 ? 0 : 0;
  const total = subtotal + shipping;
  const isEmpty = items.length === 0;

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

      <Button className="mt-6 w-full h-14 text-lg" onClick={onPay} disabled={loading || isEmpty || !hasHydrated}>
        {loading ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Processing...
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Pay Securely
          </div>
        )}
      </Button>

      {error && <p className="mt-3 text-sm text-accent font-medium flex items-center gap-2">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        {error}
      </p>}
      
      <div className="mt-8 space-y-4 pt-6 border-t border-white/5">
        <div className="flex items-center gap-3 text-xs text-cream/60">
          <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <span>100% Secure Checkout powered by Razorpay</span>
        </div>
        <div className="flex items-center gap-3 text-xs text-cream/60">
          <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <span>Instant Order Confirmation via WhatsApp</span>
        </div>
        <div className="flex items-center gap-3 text-xs text-cream/60">
          <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent/60">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span>Real-time tracking for every milestone</span>
        </div>
      </div>
    </div>
  );
}
