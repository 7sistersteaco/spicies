import type { CheckoutItemInput } from '@/lib/checkout/types';

type VariantRecord = {
  id: string;
  sku?: string;
  weight_label?: string;
  weightLabel?: string;
  price_inr?: number;
  priceInr?: number;
};

type ProductRecord = {
  id: string;
  name: string;
  slug?: string;
  variants: VariantRecord[];
};

export type ComputedItem = {
  productId: string;
  productName: string;
  variantId: string;
  variantLabel: string;
  variantSku: string;
  unitPriceInr: number;
  quantity: number;
  lineTotalInr: number;
};

export type OrderTotals = {
  subtotalInr: number;
  shippingInr: number;
  taxInr: number;
  discountInr: number;
  totalInr: number;
};

export const computeOrderItems = (products: ProductRecord[], items: CheckoutItemInput[]): ComputedItem[] => {
  return items.map((item) => {
    const product = products.find((record) => record.id === item.productId || record.slug === item.productId);
    if (!product) {
      throw new Error('Invalid product.');
    }
    const variant = product.variants.find((entry) => String(entry.id) === item.variantId);
    if (!variant) {
      throw new Error('Invalid variant.');
    }
    const price = Number(variant.price_inr ?? variant.priceInr ?? 0);
    if (price <= 0) {
      throw new Error('Invalid price.');
    }
    const variantLabel = String(variant.weight_label ?? variant.weightLabel ?? '');
    const variantSku = String(variant.sku ?? '');
    const qty = Math.max(1, item.quantity);
    return {
      productId: product.id,
      productName: product.name,
      variantId: item.variantId,
      variantLabel,
      variantSku,
      unitPriceInr: price,
      quantity: qty,
      lineTotalInr: price * qty
    };
  });
};

export const computeTotals = (computedItems: ComputedItem[]): OrderTotals => {
  const subtotalInr = computedItems.reduce((total, item) => total + item.lineTotalInr, 0);
  const shippingInr = subtotalInr > 0 ? 0 : 0;
  const taxInr = 0;
  const discountInr = 0;
  const totalInr = subtotalInr + shippingInr + taxInr - discountInr;
  return { subtotalInr, shippingInr, taxInr, discountInr, totalInr };
};
