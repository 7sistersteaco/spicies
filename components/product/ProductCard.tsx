import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/lib/products/types';
import { formatPrice } from '@/lib/products/helpers';

export default function ProductCard({ product }: { product: Product }) {
  const minPrice = Math.min(...product.variants.map((variant) => variant.priceInr));
  const href = product.category === 'tea' ? `/products/tea/${product.slug}` : `/products/spices/${product.slug}`;

  return (
    <Link
      href={href}
      className="group relative flex flex-col gap-4 lux-surface p-6 transition hover:border-accent/60"
    >
      {product.inventoryStatus === 'prebook_only' && (
        <div className="absolute top-4 left-4 z-10 bg-accent text-ink px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-md shadow-lg">
          Pre-order
        </div>
      )}
      {product.inventoryStatus === 'out_of_stock' && (
        <div className="absolute top-4 left-4 z-10 bg-cream/20 text-cream/60 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-md backdrop-blur-sm">
          Sold Out
        </div>
      )}
      <div className="relative h-48 w-full overflow-hidden rounded-xl bg-ink/80">
        <Image
          src={product.image_url || product.images[0]?.url || '/images/product-ctc.svg'}
          alt={product.images[0]?.alt || product.name || 'Product'}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-contain p-6 transition-transform duration-700 group-hover:scale-110"
        />
      </div>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-lg font-semibold text-cream">{product.name}</p>
          <p className="text-sm text-cream/60">{product.shortDescription}</p>
        </div>
        <p className="text-sm font-semibold text-accent">{formatPrice(minPrice)}</p>
      </div>
      <div className="flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.2em] text-cream/50">
        {product.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="rounded-full border border-cream/10 px-3 py-1">
            {tag.replace('-', ' ')}
          </span>
        ))}
      </div>
    </Link>
  );
}
