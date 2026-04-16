import Image from 'next/image';
import { Product } from '@/lib/products/types';

export default function ProductGallery({ product }: { product: Product }) {
  const displayImage = product.image_url || product.images[0]?.url || '/images/product-ctc.svg';
  const altText = product.images[0]?.alt || product.name || 'Product';

  return (
    <div className="relative h-[300px] w-full overflow-hidden rounded-3xl bg-charcoal/70 shadow-soft md:h-[420px]">
      <Image
        src={displayImage}
        alt={altText}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-contain p-8"
        priority
      />
    </div>
  );
}
