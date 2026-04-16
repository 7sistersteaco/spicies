import { Product } from '@/lib/products/types';
import { formatPrice } from '@/lib/products/helpers';

export default function ProductMeta({ product }: { product: Product }) {
  const prices = product.variants.map((variant) => variant.priceInr);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  return (
    <div className="space-y-4">
      <p className="text-xs uppercase tracking-[0.4em] text-cream/50">{product.category}</p>
      <h1 className="text-4xl font-semibold md:text-5xl">{product.name}</h1>
      <p className="text-lg text-cream/70">{product.shortDescription}</p>
      <div className="flex items-center gap-4 text-lg font-semibold text-accent">
        {min === max ? formatPrice(min) : `${formatPrice(min)} - ${formatPrice(max)}`}
      </div>
      <div className="flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.2em] text-cream/50">
        {product.tags.map((tag) => (
          <span key={tag} className="rounded-full border border-cream/10 px-3 py-1">
            {tag.replace('-', ' ')}
          </span>
        ))}
      </div>
    </div>
  );
}
