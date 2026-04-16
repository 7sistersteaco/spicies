'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Product } from '@/lib/products/types';
import Button from '@/components/ui/Button';
import WeightSelector from '@/components/product/WeightSelector';
import QuantityStepper from '@/components/cart/QuantityStepper';
import AddToCartButton from '@/components/product/AddToCartButton';
import PrebookForm from '@/components/prebook/PrebookForm';
import { useCartStore } from '@/store/cart';
import { formatPrice } from '@/lib/products/helpers';

export default function ProductPurchase({ product }: { product: Product }) {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const [selectedId, setSelectedId] = useState(product.variants[0]?.id ?? '');
  const [quantity, setQuantity] = useState(1);
  const [variantError, setVariantError] = useState('');

  const activeVariant = useMemo(
    () => product.variants.find((variant) => variant.id === selectedId) ?? product.variants[0],
    [product.variants, selectedId]
  );

  useEffect(() => {
    if (!selectedId && product.variants[0]?.id) {
      setSelectedId(product.variants[0].id);
    }
  }, [product.variants, selectedId]);

  useEffect(() => {
    if (product.variants.length === 0) {
      setVariantError('This product is temporarily unavailable.');
    } else if (!activeVariant) {
      setVariantError('Please select a weight to continue.');
    } else {
      setVariantError('');
    }
  }, [activeVariant, product.variants.length]);

  if (!activeVariant) {
    return (
      <div className="lux-surface p-6">
        <p className="text-sm text-cream/60">This product is temporarily unavailable.</p>
      </div>
    );
  }

  const handleBuyNow = () => {
    addItem(product, activeVariant, quantity);
    router.push('/checkout');
  };

  const isPrebook = product.inventoryStatus === 'prebook_only';
  const isOutOfStock = product.inventoryStatus === 'out_of_stock';

  return (
    <div className="space-y-6">
      <div className="lux-surface p-6">
        <div className="flex items-center justify-between">
          <p className="text-xs uppercase tracking-[0.3em] text-cream/50">Select Weight</p>
          <p className="text-sm text-cream/80">{formatPrice(activeVariant.priceInr)}</p>
        </div>
        <div className="mt-4">
          <WeightSelector variants={product.variants} selectedId={activeVariant.id} onSelect={setSelectedId} />
        </div>
        <div className="mt-6 flex items-center justify-between">
          <p className="text-xs uppercase tracking-[0.3em] text-cream/50">Quantity</p>
          <QuantityStepper qty={quantity} onChange={(nextQty) => setQuantity(Math.max(1, nextQty))} />
        </div>

        <div className="mt-8">
          {isOutOfStock ? (
            <Button disabled className="w-full bg-cream/5 text-cream/30 border-white/5 cursor-not-allowed">
              Sold Out
            </Button>
          ) : isPrebook ? (
            <div className="space-y-4">
               <Button 
                variant="secondary" 
                className="w-full py-4 text-accent border-accent/30 hover:bg-accent/10" 
                onClick={() => {
                  const el = document.getElementById('prebook-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Reserve / Pre-order Now
              </Button>
              <p className="text-[10px] text-center text-cream/40 uppercase tracking-widest leading-relaxed">
                Limited Batch • Reserve to Secure Availability
              </p>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              <AddToCartButton product={product} variant={activeVariant} qty={quantity} label="Add to Cart" />
              <Button type="button" variant="secondary" className="w-full" onClick={handleBuyNow}>
                Buy Now
              </Button>
            </div>
          )}
        </div>

        {variantError && <p className="mt-3 text-xs text-accent">{variantError}</p>}
        {!isPrebook && !isOutOfStock && (
           <p className="mt-4 text-xs text-cream/50">Secure checkout. Freshly packed from Assam.</p>
        )}
      </div>

      {(isPrebook || true) && (
        <div id="prebook-section" className="lux-surface p-6">
          <div className="space-y-2 mb-6">
             <h3 className="text-sm uppercase tracking-[0.3em] text-cream/70 font-semibold">
               {isPrebook ? 'Exclusive Pre-order' : 'Prefer to reserve instead?'}
             </h3>
             <p className="text-xs text-cream/50">
               {isPrebook 
                 ? 'This product is currently in production. Reserve your pack now to ensure you get it from the next limited harvest.' 
                 : 'Planning a large order or want to pay later? Use our reservation lead flow.'}
             </p>
          </div>
          <PrebookForm product={product} variant="embedded" />
        </div>
      )}
    </div>
  );
}
