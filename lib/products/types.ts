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

export type ProductImage = {
  id: string;
  productId: string;
  image_url: string;
  sort_order: number;
  is_primary: boolean;
};

export type ProductVariant = {
  id: string;
  productId: string;
  weightLabel: string;
  weightGrams?: number;
  priceInr: number;
  compareAtInr?: number;
  stockQty: number;
  sku: string;
  isActive: boolean;
  sort_order: number;
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
  product_images: ProductImage[];
  variants: ProductVariant[];
  image_url?: string | null;
  is_active?: boolean;
  category_id?: string;
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
  id?: string;
  slug: CategorySlug;
  name: string;
  description: string;
  image: {
    url: string;
    alt: string;
  };
};
