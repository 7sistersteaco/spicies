'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';
import { isAdmin } from './admin';

const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export async function updateProductImage(productId: string, formData: FormData) {
  try {
    const isAuthorized = await isAdmin();
    if (!isAuthorized) throw new Error('Unauthorized');

    const file = formData.get('image') as File | null;
    if (!file) throw new Error('No file provided');

    if (file.size > MAX_FILE_SIZE) {
      throw new Error('File size exceeds 3MB limit.');
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      throw new Error('Only JPG, PNG and WEBP are allowed.');
    }

    const supabase = createAdminClient();
    const filePath = `${productId}.webp`;

    // 1. Upload to Storage (Overwrite if exists)
    const { error: uploadError } = await supabase.storage
      .from('products')
      .upload(filePath, file, {
        upsert: true,
        contentType: 'image/webp'
      });

    if (uploadError) throw uploadError;

    // 2. Get Public URL
    const { data: { publicUrl } } = supabase.storage
      .from('products')
      .getPublicUrl(filePath);

    // 3. Update Database
    const { error: dbError } = await supabase
      .from('products')
      .update({ image_url: publicUrl })
      .eq('id', productId);

    if (dbError) throw dbError;

    revalidatePath('/admin/products');
    revalidatePath(`/admin/products/${productId}`);
    revalidatePath('/products');

    return { ok: true, url: publicUrl };
  } catch (err: any) {
    console.error('Update product image error:', err);
    return { ok: false, error: err.message };
  }
}

export async function removeProductImage(productId: string) {
  try {
    const isAuthorized = await isAdmin();
    if (!isAuthorized) throw new Error('Unauthorized');

    const supabase = createAdminClient();

    // Reset image_url to null
    const { error: dbError } = await supabase
      .from('products')
      .update({ image_url: null })
      .eq('id', productId);

    if (dbError) throw dbError;

    revalidatePath('/admin/products');
    revalidatePath(`/admin/products/${productId}`);
    revalidatePath('/products');

    return { ok: true };
  } catch (err: any) {
    console.error('Remove product image error:', err);
    return { ok: false, error: err.message };
  }
}
