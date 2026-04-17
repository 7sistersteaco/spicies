'use client';

import { useEffect, useState } from 'react';
import Button from '@/components/ui/Button';
import { Product, ProductVariant } from '@/lib/products/types';
import { useCartStore } from '@/store/cart';

type AddToCartButtonProps = {
  product: Product;
  variant: ProductVariant;
  qty?: number;
  className?: string;
  label?: string;
};

export default function AddToCartButton({
  product,
  variant,
  qty = 1,
  className,
  label = 'Add to Cart'
}: AddToCartButtonProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!added) {
      return;
    }
    const timer = window.setTimeout(() => setAdded(false), 1600);
    return () => window.clearTimeout(timer);
  }, [added]);

  useEffect(() => {
    setAdded(false);
  }, [variant.id, qty]);

  return (
    <Button
      type="button"
      className={className ?? 'w-full'}
      onClick={() => {
        addItem(product, variant, qty);
        setAdded(true);
      }}
    >
      {added ? 'Added' : label}
    </Button>
  );
}
