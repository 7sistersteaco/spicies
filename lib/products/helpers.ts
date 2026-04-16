import { Product } from './types';

export const formatPrice = (valueInr: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(
    valueInr
  );

export const getVariantById = (product: Product, variantId: string) =>
  product.variants.find((variant) => variant.id === variantId);
