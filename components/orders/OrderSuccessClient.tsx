'use client';

import { useEffect } from 'react';
import { useCartStore } from '@/store/cart';

export default function OrderSuccessClient() {
  const clearCart = useCartStore((state) => state.clear);

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return null;
}
