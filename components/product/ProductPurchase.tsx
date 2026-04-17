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
  
  const activeVariants = useMemo(() => product.variants.filter(v => v.isActive), [product.variants]);
  
  const [selectedId, setSelectedId] = useState(activeVariants[0]?.id ?? '');
  const [quantity, setQuantity] = useState(1);
  const [variantError, setVariantError] = useState('');

  const activeVariant = useMemo(
    () => activeVariants.find((variant) => variant.id === selectedId) ?? activeVariants[0],
    [activeVariants, selectedId]
  );

  useEffect(() => {
    if (!selectedId && product.variants[0]?.id) {
      setSelectedId(product.variants[0].id);
    }
  }, [product.variants, selectedId]);

  useEffect(() => {
    if (activeVariants.length === 0) {
      setVariantError('This product is temporarily unavailable.');
    } else if (!activeVariant) {
      setVariantError('Please select a weight to continue.');
    } else {
      setVariantError('');
    }
  }, [activeVariant, activeVariants.length]);

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

  const LAUNCH_DATE = new Date('2026-06-04');
  const isGlobalPreOrder = new Date() < LAUNCH_DATE;
  const isPrebook = isGlobalPreOrder || product.inventoryStatus === 'prebook_only';
  const isOutOfStock = product.inventoryStatus === 'out_of_stock' || activeVariant.stockQty <= 0;

  return (
    <div className="space-y-6">
      <div className="lux-surface p-6">
        <div className="flex items-center justify-between">
          <p className="text-xs uppercase tracking-[0.3em] text-cream/50">Select Weight</p>
          <p className="text-sm text-cream/80">{formatPrice(activeVariant.priceInr)}</p>
        </div>
        <div className="mt-4">
          <WeightSelector variants={activeVariants} selectedId={activeVariant.id} onSelect={setSelectedId} />
        </div>
        <div className="mt-6 flex items-center justify-between">
          <p className="text-xs uppercase tracking-[0.3em] text-cream/50">Quantity</p>
          <QuantityStepper qty={quantity} onChange={(nextQty) => setQuantity(Math.max(1, nextQty))} />
        </div>

        <div className="mt-8">
          {isOutOfStock ? (
            <div className="space-y-4">
              <Button disabled className="w-full bg-cream/5 text-cream/20 border-white/5 cursor-not-allowed">
                Sold Out
              </Button>
              <p className="text-[10px] text-center text-accent/50 uppercase tracking-widest leading-relaxed">
                This weight option is currently unavailable
              </p>
            </div>
          ) : isPrebook ? (
            <div className="space-y-4">
               <Button 
                variant="secondary" 
                className="w-full py-4 text-accent border-accent/20 hover:bg-accent/5" 
                onClick={() => {
                  const el = document.getElementById('prebook-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Pre-order Now
              </Button>
              <p className="text-[10px] text-center text-cream/40 uppercase tracking-widest leading-relaxed">
                Pre-orders open • Dispatch begins June 4
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
        {!isPrebook && !isOutOfStock && activeVariant && (
           <p className="mt-4 text-xs text-cream/50">Secure checkout. Freshly packed from Assam.</p>
        )}
      </div>

      {(isPrebook || true) && (
        <div id="prebook-section" className="lux-surface p-6">
          <div className="space-y-2 mb-6">
             <h3 className="text-sm uppercase tracking-[0.3em] text-cream/70 font-semibold">
               {isPrebook ? 'Exclusive Pre-order' : 'Confirm Your Order'}
             </h3>
             <p className="text-xs text-cream/50">
               {isPrebook 
                 ? 'This product is currently in production. Secure your pre-order now to guarantee delivery from the upcoming harvest.' 
                 : 'Place a pre-order to secure your batch before our official launch.'}
             </p>
          </div>
          <PrebookForm product={product} variant="embedded" />
        </div>
      )}
    </div>
  );
}
