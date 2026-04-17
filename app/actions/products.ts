'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath, revalidateTag } from 'next/cache';
import { isAdmin } from './admin';
import { ProductVariant } from '@/lib/products/types';

const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

/**
 * Soft delete product by setting is_active to false.
 * Per production hardening rules, we never hard-delete product data.
 */
export async function deleteProduct(productId: string) {
  try {
    const isAuthorized = await isAdmin();
    if (!isAuthorized) throw new Error('Unauthorized');

    const supabase = createAdminClient();

    // Soft delete: hide from shop and admin lists
    const { error: dbError } = await supabase
      .from('products')
      .update({ is_active: false })
      .eq('id', productId);

    if (dbError) throw dbError;

    revalidatePath('/admin/products');
    revalidatePath('/products');
    revalidateTag('products');

    return { ok: true };
  } catch (err: any) {
    console.error('Delete product error:', err);
    return { ok: false, error: err.message };
  }
}

/**
 * Create or update product details
 */
export async function upsertProduct(_prevState: any, formData: FormData) {
  try {
    const isAuthorized = await isAdmin();
    if (!isAuthorized) throw new Error('Unauthorized');

    const id = formData.get('id') as string | null;
    const name = (formData.get('name') as string)?.trim();
    const description = (formData.get('description') as string)?.trim();
    const shortDescription = (formData.get('shortDescription') as string)?.trim();
    const categoryId = formData.get('category_id') as string;
    const price = Number(formData.get('price') || 0);
    const stock = Number(formData.get('stock') || 0);
    let inventoryStatus = formData.get('inventory_status') as string;
    
    // SEO & Status
    const seoTitle = (formData.get('seo_title') as string)?.trim();
    const seoDescription = (formData.get('seo_description') as string)?.trim();
    const customSlug = (formData.get('slug') as string)?.trim();
    const isActive = formData.get('is_active') === 'true';

    if (!name) throw new Error('Product title is required.');
    if (price < 0) throw new Error('Price cannot be negative.'); // Allow 0 for special items
    if (stock < 0) throw new Error('Stock cannot be negative.');

    const supabase = createAdminClient();

    // Fetch existing data for merging attributes
    let existingAttributes = {};
    if (id) {
      const { data: existing } = await supabase
        .from('products')
        .select('attributes')
        .eq('id', id)
        .single();
      existingAttributes = existing?.attributes || {};
    }

    // Merge SEO into attributes
    const attributes = {
      ...existingAttributes,
      seoTitle,
      seoDescription,
    };

    // Prepare Product Data
    const data: any = {
      name,
      description,
      short_description: shortDescription,
      category_id: categoryId,
      inventory_status: inventoryStatus,
      is_active: isActive,
      attributes,
    };

    // Slug management
    if (customSlug) {
      data.slug = customSlug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    } else if (!id) {
      data.slug = `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${crypto.randomUUID().slice(0, 4)}`;
    }

    let productResult;
    if (id) {
      productResult = await supabase.from('products').update(data).eq('id', id).select().single();
    } else {
      productResult = await supabase.from('products').insert(data).select().single();
    }

    if (productResult.error) throw productResult.error;
    const product = productResult.data;

    // --- Variant Management ---
    const variantsJson = formData.get('variants_json') as string;
    if (variantsJson) {
      const variants = JSON.parse(variantsJson) as any[];
      
      if (id) {
        // Hard delete removed variants — inline queries so they actually execute
        const variantIds = variants
          .filter(v => v.id && !v.id.startsWith('new-'))
          .map(v => v.id);

        if (variantIds.length > 0) {
          await supabase
            .from('product_variants')
            .delete()
            .eq('product_id', id)
            .not('id', 'in', `(${variantIds.join(',')})`);
        } else {
          await supabase
            .from('product_variants')
            .delete()
            .eq('product_id', id);
        }
      }

      for (const [vIndex, v] of variants.entries()) {
        const variantData = {
          product_id: product.id,
          label: v.weightLabel || 'Standard',
          price_inr: Number(v.priceInr || 0),
          stock_qty: Number(v.stockQty || 0),
          sku: v.sku || `7S-${product.name.slice(0,3).toUpperCase()}-${v.weightLabel?.toUpperCase() || 'STD'}`,
          is_active: v.isActive !== false,
          weight_grams: Number(v.weightGrams || 0),
          compare_at_inr: v.compareAtInr ? Number(v.compareAtInr) : null,
          sort_order: v.sort_order ?? vIndex
        };

        if (v.id && !v.id.startsWith('new-')) {
          await supabase.from('product_variants').update(variantData).eq('id', v.id);
        } else {
          await supabase.from('product_variants').insert(variantData);
        }
      }
    }

    // --- Image Management ---
    const imagesJson = formData.get('images_json') as string;
    if (imagesJson) {
      const images = JSON.parse(imagesJson) as any[];
      
      if (id) {
        const imageIds = images.filter(img => img.id && !img.id.startsWith('new-')).map(img => img.id);
        if (imageIds.length > 0) {
          await supabase
            .from('product_images')
            .delete()
            .eq('product_id', id)
            .not('id', 'in', `(${imageIds.join(',')})`);
        } else {
          await supabase
            .from('product_images')
            .delete()
            .eq('product_id', id);
        }
      }

      for (const [imgIndex, img] of images.entries()) {
        const rawUrl = img.image_url;
        if (!rawUrl || typeof rawUrl !== 'string' || rawUrl.trim() === '') continue;

        const imageData = {
          product_id: product.id,
          image_url: rawUrl.trim(),
          is_primary: img.is_primary === true,
          sort_order: img.sort_order ?? imgIndex
        };

        if (img.id && !img.id.startsWith('new-')) {
          await supabase.from('product_images').update(imageData).eq('id', img.id);
        } else {
          await supabase.from('product_images').insert(imageData);
        }
      }
    }

    // --- Revalidation ---
    const finalSlug = customSlug || (id ? (await supabase.from('products').select('slug').eq('id', id).single()).data?.slug : data.slug);
    
    // Revalidation — bust ALL storefront product surfaces
    revalidatePath('/admin/products');
    if (id) revalidatePath(`/admin/products/${id}`);
    revalidatePath('/', 'layout');
    revalidatePath('/products');
    revalidatePath('/products/tea');
    revalidatePath('/products/spices');
    if (finalSlug) {
      revalidatePath(`/products/tea/${finalSlug}`);
      revalidatePath(`/products/spices/${finalSlug}`);
    }
    revalidateTag('products');

    return { ok: true, id: product.id };
  } catch (err: any) {
    console.error('Upsert product error:', err);
    return { ok: false, error: err.message };
  }
}

/**
 * Handle individual image upload for the gallery (admin panel temporary storage)
 */
export async function uploadGalleryImage(formData: FormData) {
  try {
    const isAuthorized = await isAdmin();
    if (!isAuthorized) throw new Error('Unauthorized');

    const file = formData.get('image') as File | null;
    if (!file) throw new Error('No file provided');

    const supabase = createAdminClient();
    const fileName = `${crypto.randomUUID()}.webp`;
    const filePath = `gallery/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('products')
      .upload(filePath, file, {
        upsert: true,
        contentType: 'image/webp'
      });

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('products')
      .getPublicUrl(filePath);

    return { ok: true, url: publicUrl };
  } catch (err: any) {
    console.error('Gallery image upload error:', err);
    return { ok: false, error: err.message };
  }
}
