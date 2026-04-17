'use client';

import { useState, useEffect } from 'react';
import Image, { ImageProps } from 'next/image';
import { getSafeImage } from '@/lib/utils';
import { cx } from '@/lib/utils';

interface SafeImageProps extends Omit<ImageProps, 'src'> {
  src: string | null | undefined;
  fallback: string;
}

export default function SafeImage({ src, fallback, className, alt, onError, ...props }: SafeImageProps) {
  const isLocal = (url: string | null | undefined) => url?.startsWith('/images/') || url?.startsWith('data:');

  const initialSrc = getSafeImage(src, fallback);
  // Remote URLs are already loaded by the browser — don't hide them behind a skeleton
  // Skeleton is only useful for local SVG paths (they load synchronously anyway)
  const [imgSrc, setImgSrc] = useState<string>(initialSrc);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync state if src prop changes
  useEffect(() => {
    const safe = getSafeImage(src, fallback);
    setImgSrc(safe);
    setHasError(false);
    setIsLoaded(true);  // FIX: always visible on prop change
  }, [src, fallback]);

  const handleError = (e: any) => {
    if (!hasError) {
      console.error('[SafeImage] onError triggered — falling back. Failed src:', imgSrc);
      setImgSrc(fallback);
      setHasError(true);
      setIsLoaded(true); // force load to show fallback
      if (onError) onError(e);
    }
  };

  return (
    <div className="relative h-full w-full overflow-hidden">
      {!isLoaded && !hasError && mounted && (
        <div className="absolute inset-0 z-10 lux-skeleton" />
      )}
      
      <Image
        {...props}
        src={imgSrc}
        alt={alt}
        className={cx(
          className,
          "transition-opacity duration-700",
          isLoaded || hasError ? 'opacity-100' : 'opacity-0'
        )}
        onLoad={() => setIsLoaded(true)}
        onError={handleError}
      />
    </div>
  );
}
