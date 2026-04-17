import { unstable_cache } from 'next/cache';
import { cache } from 'react';
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

const normalizeImages = (images: any): ProductImage[] => {
  const rawImages = Array.isArray(images) ? images : [];
  return rawImages
    .filter(img => img && (img.image_url || img.imageUrl || img.url))
    .map((img) => ({
      id: img.id,
      productId: img.product_id,
      image_url: (img.image_url || img.imageUrl || img.url || '').trim(),
      sort_order: img.sort_order || 0,
      is_primary: Boolean(img.is_primary)
    }))
    .sort((a, b) => (a.is_primary === b.is_primary ? a.sort_order - b.sort_order : a.is_primary ? -1 : 1));
};

const normalizeVariants = (variants: any[]): ProductVariant[] => {
  return (variants || []).map((v, index) => ({
    id: v.id,
    productId: v.product_id,
    weightLabel: v.label || v.weightLabel || 'Standard',
    weightGrams: v.weight_grams || v.weightGrams || 0,
    priceInr: v.price_inr || v.priceInr || 0,
    compareAtInr: v.compare_at_inr || v.compareAtInr || undefined,
    stockQty: v.stock_qty || v.stockQty || 0,
    sku: v.sku || '',
    isActive: v.is_active !== false,
    sort_order: v.sort_order || index
  })).sort((a, b) => a.sort_order - b.sort_order);
};

const mapProduct = (row: any): Product => {
  const categorySlug = row.categories?.slug || (row.category_id === 'tea' ? 'tea' : 'spices');
  const images = normalizeImages(row.product_images || row.productImages || []);
  const primaryImg = images.find((i) => i.is_primary) || images[0];
  
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    shortDescription: row.short_description,
    category: categorySlug,
    category_id: row.category_id,
    origin: row.origin || 'Assam, India',
    product_images: images,
    image_url: primaryImg?.image_url || null, // Top-level legacy support
    variants: normalizeVariants(row.product_variants || []),
    inventoryStatus: row.inventory_status,
    is_active: row.is_active,
    featuredRank: row.featured_rank ?? undefined,
    tags: row.attributes?.tags || [],
    attributes: row.attributes || {}
  };
};

const mapCategory = (row: any): Category => {
  const local = localCategories.find((c) => c.slug === row.slug);
  return {
    id: row.id,
    slug: row.slug as CategorySlug,
    name: row.name,
    description: row.description,
    image: {
      url: row.image_url || local?.image.url || '',
      alt: row.name
    }
  };
};

export const getCategoriesSafe: () => Promise<Category[]> = unstable_cache(
  async (): Promise<Category[]> => {
    if (!supabase) {
      return localCategories;
    }
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('id,slug,name,description,image_url,sort_order,is_active')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });
      if (error || !data) {
        return localCategories;
      }
      return data.map((row) => mapCategory(row as Record<string, unknown>));
    } catch {
      return localCategories;
    }
  },
  ['categories'],
  { revalidate: 60, tags: ['categories'] }
);

// NOTE: react.cache() deduplicates within a single server render pass (per-request).
// We do NOT use unstable_cache here because it was confirmed to serve stale
// product_images: [] for all products — images added after the cache snapshot
// were invisible until TTL expired (60s), even after revalidateTag('products').
export const getProductsSafe: () => Promise<Product[]> = cache(
  async (): Promise<Product[]> => {
    if (!supabase) return localProducts;

    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories:category_id (name, slug),
          product_variants (*),
          product_images (*)
        `)
        .eq('is_active', true)
        .order('id')
        .order('is_primary', { foreignTable: 'product_images', ascending: false })
        .order('sort_order', { foreignTable: 'product_images', ascending: true });

      if (error || !data) return localProducts;
      return data.map(row => mapProduct(row));
    } catch {
      return localProducts;
    }
  }
);

export const getProductBySlugSafe = async (slug: string, category?: CategorySlug): Promise<Product | undefined> => {
  if (!supabase) return localProducts.find(p => p.slug === slug);

  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories:category_id (name, slug),
        product_variants (*),
        product_images (*)
      `)
      .eq('slug', slug)
      .order('is_primary', { foreignTable: 'product_images', ascending: false })
      .order('sort_order', { foreignTable: 'product_images', ascending: true })
      .single();

    if (error || !data) return undefined;
    return mapProduct(data);
  } catch {
    return undefined;
  }
};

export const getProductByIdSafe = async (id: string): Promise<Product | undefined> => {
  if (!supabase) return localProducts.find(p => p.id === id);

  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories:category_id (name, slug),
        product_variants (*),
        product_images (*)
      `)
      .eq('id', id)
      .order('is_primary', { foreignTable: 'product_images', ascending: false })
      .order('sort_order', { foreignTable: 'product_images', ascending: true })
      .single();

    if (error || !data) return undefined;
    return mapProduct(data);
  } catch {
    return undefined;
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
