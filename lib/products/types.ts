export type CategorySlug = 'tea' | 'spices';

export type ProductTag =
  | 'strong'
  | 'daily-use'
  | 'premium'
  | 'assam'
  | 'restaurant-tested'
  | 'aromatic'
  | 'fresh'
  | 'malty'
  | 'balanced-heat'
  | 'regional'
  | 'blend'
  | 'authentic';

export type ProductVariant = {
  id: string;
  sku: string;
  weightLabel: string;
  weightGrams: number;
  priceInr: number;
  compareAtInr?: number;
  stockQty: number;
};

export type ProductImage = {
  url: string;
  alt: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: CategorySlug;
  shortDescription: string;
  description: string;
  origin: string;
  tags: ProductTag[];
  featuredRank?: number;
  images: ProductImage[];
  variants: ProductVariant[];
  image_url?: string | null;
  is_active?: boolean;
  inventoryStatus?: 'in_stock' | 'out_of_stock' | 'prebook_only';
  attributes: {
    highlightTitle: string;
    highlightBody: string;
    tastingNotes?: string[];
    bestFor?: string[];
    usageTips?: string[];
  };
};

export type Category = {
  slug: CategorySlug;
  name: string;
  description: string;
  image: ProductImage;
};
