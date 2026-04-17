'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Product, ProductImage } from '@/lib/products/types';
import { cx, getSafeImage, isValidImageUrl } from '@/lib/utils';
import Reveal from '@/components/motion/Reveal';
import SafeImage from '@/components/ui/SafeImage';
import { getProductFallbackImage } from '@/lib/products/visuals';

export default function ProductGallery({ product }: { product: Product }) {
  const images = product.product_images || [];
  
  const premiumFallback = getProductFallbackImage(product.category, product.slug);
  
  const primaryUploaded = 
    images.find(img => img.is_primary)?.image_url || 
    images[0]?.image_url || 
    product.image_url;

  const hasValidPrimary = isValidImageUrl(primaryUploaded);
  const primaryImageUrl = hasValidPrimary ? (primaryUploaded as string) : premiumFallback;

  const [activeImageUrl, setActiveImageUrl] = useState<string>(primaryImageUrl);

  return (
    <div className="flex flex-col gap-6">
      {/* Main Feature Image */}
      <Reveal>
        <div className="relative aspect-square w-full overflow-hidden rounded-3xl bg-white/[0.03] shadow-2xl border border-white/5 md:aspect-[4/5] lg:aspect-square">
          <SafeImage
            src={activeImageUrl}
            fallback={premiumFallback}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-contain p-8"
            priority
          />
        </div>
      </Reveal>

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <Reveal delay={0.2}>
          <div className="flex flex-wrap gap-4 px-2">
            {images.map((img) => (
              <button
                key={img.id}
                onClick={() => setActiveImageUrl(img.image_url)}
                className={cx(
                  "relative h-20 w-20 overflow-hidden rounded-2xl border-2 transition-all duration-300",
                  activeImageUrl === img.image_url 
                    ? "border-accent ring-2 ring-accent/20" 
                    : "border-white/5 grayscale hover:grayscale-0 hover:border-white/20"
                )}
              >
                <SafeImage
                  src={img.image_url}
                  fallback={premiumFallback}
                  alt={`${product.name} thumbnail`}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </Reveal>
      )}
    </div>
  );
}
