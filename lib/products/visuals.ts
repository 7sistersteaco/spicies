import { CategorySlug } from './types';

export function getProductFallbackImage(category: CategorySlug | string, slug?: string): string {
  const cat = category.toLowerCase();
  
  // Specific overrides based on slug if needed
  if (slug?.includes('turmeric')) return '/images/product-turmeric.svg';
  if (slug?.includes('chilli')) return '/images/product-chilli.svg';
  if (slug?.includes('garam')) return '/images/product-garam.svg';
  if (slug?.includes('blend')) return '/images/product-blend.svg';
  
  // Category defaults
  if (cat === 'tea') return '/images/product-ctc.svg';
  if (cat === 'spices') return '/images/product-turmeric.svg';
  
  return '/images/product-ctc.svg'; // Final safety
}
