import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/lib/products/types';
import { formatPrice } from '@/lib/products/helpers';
import { cx, getSafeImage, isValidImageUrl } from '@/lib/utils';
import SafeImage from '@/components/ui/SafeImage';
import { getProductFallbackImage } from '@/lib/products/visuals';

export default function ProductCard({ product }: { product: Product }) {
  const activeVariants = product.variants.filter(v => v.isActive);
  const prices = activeVariants.map((variant) => variant.priceInr);
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;
  
  const priceDisplay = prices.length === 0 
    ? 'Contact for Price' 
    : minPrice === maxPrice 
      ? formatPrice(minPrice) 
      : `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`;

  const href = product.category === 'tea' ? `/products/tea/${product.slug}` : `/products/spices/${product.slug}`;

  // Image Selection Logic
  const primaryUploaded =
    product.product_images?.find(img => img.is_primary)?.image_url ||
    product.product_images?.[0]?.image_url ||
    product.image_url;

  const premiumFallback = getProductFallbackImage(product.category, product.slug);
  const hasValidPrimary = isValidImageUrl(primaryUploaded);
  const primaryImg = hasValidPrimary ? (primaryUploaded as string) : premiumFallback;

  const secondaryUploaded = product.product_images?.length > 1 
    ? (product.product_images.filter(img => !img.is_primary)[0]?.image_url || product.product_images[1]?.image_url) 
    : null;
  
  const hasValidSecondary = isValidImageUrl(secondaryUploaded);
  const secondaryImg = hasValidSecondary ? (secondaryUploaded as string) : null;

  // Real uploaded photos should cover the card; SVG placeholders need padding
  const isUploadedPhoto = (url: string) => url.startsWith('http');
  const primaryFit = hasValidPrimary && isUploadedPhoto(primaryImg)
    ? 'object-cover'
    : 'object-contain p-8';
  const secondaryFit = hasValidSecondary && secondaryImg && isUploadedPhoto(secondaryImg)
    ? 'object-cover'
    : 'object-contain p-8';

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
      <div className="relative h-48 w-full overflow-hidden rounded-xl bg-white/[0.03]">
        <SafeImage
          src={primaryImg}
          fallback={premiumFallback}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className={cx(
            primaryFit,
            "transition-all duration-700",
            secondaryImg ? "group-hover:opacity-0 group-hover:scale-105" : "group-hover:scale-105"
          )}
          priority
        />
        {secondaryImg && (
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-700 pointer-events-none hidden md:block">
            <SafeImage
              src={secondaryImg}
              fallback={premiumFallback}
              alt={`${product.name} detail`}
              fill
              className={secondaryFit}
            />
          </div>
        )}
      </div>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-lg font-semibold text-cream">{product.name}</p>
          <p className="text-sm text-cream/60">{product.shortDescription}</p>
        </div>
        <p className="text-sm font-semibold text-accent">{priceDisplay}</p>
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
