import { createClient } from '@supabase/supabase-js';
import { categories as localCategories, products as localProducts } from './catalog';
import type { Category, CategorySlug, Product, ProductImage, ProductVariant } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const canUseSupabase = Boolean(supabaseUrl && supabaseAnonKey);

const supabase = canUseSupabase
  ? createClient(supabaseUrl as string, supabaseAnonKey as string, {
      auth: { persistSession: false, autoRefreshToken: false }
    })
  : null;

const normalizeImages = (images: unknown, fallback: ProductImage[] = []): ProductImage[] => {
  if (!Array.isArray(images)) {
    return fallback;
  }
  return images
    .map((image) => {
      if (typeof image === 'string') {
        return { url: image, alt: 'Product image' };
      }
      if (image && typeof image === 'object') {
        const entry = image as { url?: string; alt?: string };
        return { url: entry.url ?? '', alt: entry.alt ?? 'Product image' };
      }
      return null;
    })
    .filter((image): image is ProductImage => Boolean(image && image.url));
};

const normalizeVariants = (variants: unknown, fallback: ProductVariant[] = []): ProductVariant[] => {
  if (!Array.isArray(variants)) {
    return fallback;
  }
  return variants.map((variant, index) => {
    const entry = variant as Record<string, unknown>;
    const weightLabel = (entry.weight_label ?? entry.weightLabel ?? '100g') as ProductVariant['weightLabel'];
    return {
      id: String(entry.id ?? `${index}`),
      sku: String(entry.sku ?? ''),
      weightLabel,
      weightGrams: Number(entry.weight_grams ?? entry.weightGrams ?? 0),
      priceInr: Number(entry.price_inr ?? entry.priceInr ?? 0),
      compareAtInr: entry.compare_at_inr ? Number(entry.compare_at_inr) : undefined,
      stockQty: Number(entry.stock_qty ?? entry.stockQty ?? 0)
    };
  });
};

const mapCategory = (row: Record<string, unknown>): Category => {
  const slug = (row.slug as CategorySlug) ?? 'tea';
  const fallback = localCategories.find((category) => category.slug === slug);
  const imageUrl = (row.image_url as string | null) ?? fallback?.image.url ?? '/images/tea-hero.svg';
  return {
    slug,
    name: String(row.name ?? fallback?.name ?? ''),
    description: String(row.description ?? fallback?.description ?? ''),
    image: {
      url: imageUrl,
      alt: `${row.name ?? fallback?.name ?? 'Category'} image`
    }
  };
};

const mapProduct = (row: Record<string, unknown>): Product => {
  const slug = String(row.slug ?? '');
  const fallback = localProducts.find((product) => product.slug === slug);
  const categorySlug = (row.category_slug as CategorySlug) ?? fallback?.category ?? 'tea';
  return {
    id: String(row.id ?? fallback?.id ?? slug),
    slug,
    name: String(row.name ?? fallback?.name ?? ''),
    category: categorySlug,
    shortDescription: String(row.short_description ?? fallback?.shortDescription ?? ''),
    description: String(row.description ?? fallback?.description ?? ''),
    origin: String(row.origin ?? fallback?.origin ?? ''),
    tags: (row.tags as Product['tags']) ?? fallback?.tags ?? [],
    featuredRank: row.featured_rank ? Number(row.featured_rank) : fallback?.featuredRank,
    images: normalizeImages(row.images, fallback?.images),
    variants: normalizeVariants(row.variants, fallback?.variants),
    image_url: (row.image_url as string | null) ?? null,
    is_active: row.is_active !== false, // Default to true unless explicitly false
    inventoryStatus: (row.inventory_status as Product['inventoryStatus']) ?? (fallback as any)?.inventoryStatus ?? 'in_stock',
    attributes: fallback?.attributes ?? {
      highlightTitle: 'Freshness & Aroma',
      highlightBody: 'Premium daily essentials from Assam.',
      bestFor: [],
      usageTips: []
    }
  };
};

export const getCategoriesSafe = async (): Promise<Category[]> => {
  if (!supabase) {
    return localCategories;
  }
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('slug,name,description,image_url,sort_order,is_active')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });
    if (error || !data) {
      return localCategories;
    }
    return data.map((row) => mapCategory(row as Record<string, unknown>));
  } catch {
    return localCategories;
  }
};

export const getProductsSafe = async (): Promise<Product[]> => {
  if (!supabase) {
    return localProducts;
  }
  try {
    const { data, error } = await supabase
      .from('products')
      .select('id,slug,name,short_description,description,origin,tags,images,variants,image_url,inventory_status,featured_rank,is_active,category_id, categories:category_id (slug)')
      .eq('is_active', true)
      .order('featured_rank', { ascending: true });
    if (error || !data) {
      return localProducts;
    }
    return data.map((row) => {
      const record = row as Record<string, unknown>;
      const category = record.categories as { slug?: string } | null;
      return mapProduct({ ...record, category_slug: category?.slug });
    });
  } catch {
    return localProducts;
  }
};

export const getProductsByCategorySafe = async (slug: CategorySlug): Promise<Product[]> => {
  const products = await getProductsSafe();
  return products.filter((product) => product.category === slug);
};

export const getFeaturedProductsSafe = async (): Promise<Product[]> => {
  const products = await getProductsSafe();
  return [...products]
    .filter((product) => product.featuredRank)
    .sort((a, b) => (a.featuredRank ?? 99) - (b.featuredRank ?? 99));
};

export const getProductBySlugSafe = async (slug: string, category?: CategorySlug): Promise<Product | undefined> => {
  const products = await getProductsSafe();
  return products.find((product) => product.slug === slug && (category ? product.category === category : true));
};

export const getProductByIdSafe = async (id: string): Promise<Product | undefined> => {
  const products = await getProductsSafe();
  return products.find((product) => product.id === id);
};
