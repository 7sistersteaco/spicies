'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath, revalidateTag, unstable_cache } from 'next/cache';
import { isAdmin } from './admin';

const MAX_LOGO_SIZE = 2 * 1024 * 1024; // 2MB
const MAX_FAVICON_SIZE = 512 * 1024; // 512KB
const ALLOWED_LOGO_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
const ALLOWED_FAVICON_TYPES = ['image/png', 'image/x-icon', 'image/vnd.microsoft.icon', 'image/webp'];

export const getBrandingSettings = unstable_cache(
  async () => {
    try {
      const supabase = createAdminClient();
      const { data, error } = await supabase
        .from('branding_settings')
        .select('*')
        .eq('id', 1)
        .single();

      if (error) {
        return { logo_url: null, favicon_url: null, whatsapp_number: null, hero_image_url: null, banner_image_url: null, restro_image_url: null, about_image_url: null, fssai_license_number: null, fssai_certificate_url: null };
      }
      return data || { logo_url: null, favicon_url: null, whatsapp_number: null, hero_image_url: null, banner_image_url: null, restro_image_url: null };
    } catch (err) {
      return { logo_url: null, favicon_url: null, whatsapp_number: null, hero_image_url: null, banner_image_url: null, restro_image_url: null, about_image_url: null, fssai_license_number: null, fssai_certificate_url: null };
    }
  },
  ['branding-settings'],
  { revalidate: 3600, tags: ['branding'] }
);

export async function updateBrandingAsset(formData: FormData, type: 'logo' | 'favicon' | 'hero' | 'banner' | 'restro' | 'about' | 'fssai_certificate') {
  try {
    const isAuthorized = await isAdmin();
    if (!isAuthorized) throw new Error('Unauthorized');

    const file = formData.get(type) as File | null;
    if (!file) throw new Error('No file provided');

    const maxSizeMap = {
      logo: 2 * 1024 * 1024,
      favicon: 512 * 1024,
      hero: 4 * 1024 * 1024,
      banner: 3 * 1024 * 1024,
      restro: 4 * 1024 * 1024,
      about: 4 * 1024 * 1024,
      fssai_certificate: 4 * 1024 * 1024
    };

    if (file.size > maxSizeMap[type]) {
      throw new Error(`${type} size exceeds limit.`);
    }

    const supabase = createAdminClient();
    const fileExt = file.name.split('.').pop();
    const filePath = `${type}-${Date.now()}.${fileExt}`;

    // 1. Upload to Storage
    const { error: uploadError } = await supabase.storage
      .from('branding')
      .upload(filePath, file, {
        upsert: true,
        contentType: file.type
      });

    if (uploadError) throw uploadError;

    // 2. Get Public URL
    const { data: { publicUrl } } = supabase.storage
      .from('branding')
      .getPublicUrl(filePath);

    if (!publicUrl || publicUrl.trim() === '') {
      throw new Error('Failed to generate a valid public URL.');
    }

    const finalUrl = publicUrl.trim();

    // 3. Update Database
    const columnMap = {
      logo: 'logo_url',
      favicon: 'favicon_url',
      hero: 'hero_image_url',
      banner: 'banner_image_url',
      restro: 'restro_image_url',
      about: 'about_image_url',
      fssai_certificate: 'fssai_certificate_url'
    };

    const { error: dbError } = await supabase
      .from('branding_settings')
      .upsert({ id: 1, [columnMap[type]]: finalUrl, updated_at: new Date().toISOString() });

    if (dbError) throw dbError;

    revalidatePath('/', 'layout');
    revalidatePath('/admin/branding');
    revalidateTag('branding');

    return { ok: true, url: publicUrl };
  } catch (err: any) {
    console.error(`Update branding ${type} error:`, err);
    return { ok: false, error: err.message };
  }
}

export async function updateBrandingLogo(formData: FormData) {
  return updateBrandingAsset(formData, 'logo');
}

export async function updateBrandingHero(formData: FormData) {
  return updateBrandingAsset(formData, 'hero');
}

export async function updateBrandingBanner(formData: FormData) {
  return updateBrandingAsset(formData, 'banner');
}

export async function updateBrandingRestro(formData: FormData) {
  return updateBrandingAsset(formData, 'restro');
}

export async function updateBrandingAbout(formData: FormData) {
  return updateBrandingAsset(formData, 'about');
}

export async function updateBrandingFssaiCert(formData: FormData) {
  return updateBrandingAsset(formData, 'fssai_certificate');
}

export async function updateFssaiLicenseNumber(formData: FormData) {
  try {
    const isAuthorized = await isAdmin();
    if (!isAuthorized) throw new Error('Unauthorized');

    const licenseNumber = (formData.get('fssai_license_number') as string || '').trim();

    const supabase = createAdminClient();
    const { error } = await supabase
      .from('branding_settings')
      .upsert({ id: 1, fssai_license_number: licenseNumber || null, updated_at: new Date().toISOString() });

    if (error) throw error;

    revalidatePath('/', 'layout');
    revalidatePath('/admin/branding');
    revalidatePath('/compliance');
    revalidateTag('branding');

    return { ok: true };
  } catch (err: any) {
    console.error('Update FSSAI license error:', err);
    return { ok: false, error: err.message };
  }
}

export async function updateBrandingFavicon(formData: FormData) {
  try {
    const isAuthorized = await isAdmin();
    if (!isAuthorized) throw new Error('Unauthorized');

    const file = formData.get('favicon') as File | null;
    if (!file) throw new Error('No file provided');

    if (file.size > MAX_FAVICON_SIZE) {
      throw new Error('Favicon size exceeds 512KB limit.');
    }

    if (!ALLOWED_FAVICON_TYPES.includes(file.type)) {
      throw new Error('Invalid file type. Allowed: PNG, ICO, WEBP');
    }

    const supabase = createAdminClient();
    const fileExt = file.name.split('.').pop();
    const filePath = `favicon-${Date.now()}.${fileExt}`;

    // 1. Upload to Storage
    const { error: uploadError } = await supabase.storage
      .from('branding')
      .upload(filePath, file, {
        upsert: true,
        contentType: file.type
      });

    if (uploadError) throw uploadError;

    // 2. Get Public URL
    const { data: { publicUrl } } = supabase.storage
      .from('branding')
      .getPublicUrl(filePath);

    // 3. Update Database
    const { error: dbError } = await supabase
      .from('branding_settings')
      .upsert({ id: 1, favicon_url: publicUrl, updated_at: new Date().toISOString() });

    if (dbError) throw dbError;

    revalidatePath('/', 'layout');
    revalidatePath('/admin/branding');
    revalidateTag('branding');

    return { ok: true, url: publicUrl };
  } catch (err: any) {
    console.error('Update branding favicon error:', err);
    return { ok: false, error: err.message };
  }
}

export async function removeBrandingAsset(type: 'logo' | 'favicon' | 'hero' | 'banner' | 'restro' | 'about' | 'fssai_certificate') {
  try {
    const isAuthorized = await isAdmin();
    if (!isAuthorized) throw new Error('Unauthorized');

    const supabase = createAdminClient();
    
    const updateObj: any = { id: 1, updated_at: new Date().toISOString() };
    const columnMap = {
      logo: 'logo_url',
      favicon: 'favicon_url',
      hero: 'hero_image_url',
      banner: 'banner_image_url',
      restro: 'restro_image_url',
      about: 'about_image_url',
      fssai_certificate: 'fssai_certificate_url'
    };
    updateObj[columnMap[type]] = null;

    const { error: dbError } = await supabase
      .from('branding_settings')
      .upsert(updateObj);

    if (dbError) throw dbError;

    revalidatePath('/', 'layout');
    revalidatePath('/admin/branding');
    revalidateTag('branding');

    return { ok: true };
  } catch (err: any) {
    console.error(`Remove branding ${type} error:`, err);
    return { ok: false, error: err.message };
  }
}

export async function updateWhatsAppNumber(formData: FormData) {
  try {
    const isAuthorized = await isAdmin();
    if (!isAuthorized) throw new Error('Unauthorized');

    const whatsapp = formData.get('whatsapp') as string;
    if (!whatsapp) throw new Error('WhatsApp number is required');

    // Basic normalization
    const cleanNumber = whatsapp.replace(/[^0-9]/g, '');
    if (cleanNumber.length < 10) throw new Error('Invalid WhatsApp number. Expected at least 10 digits.');

    const supabase = createAdminClient();
    const { error: dbError } = await supabase
      .from('branding_settings')
      .upsert({ id: 1, whatsapp_number: cleanNumber, updated_at: new Date().toISOString() });

    if (dbError) throw dbError;

    revalidatePath('/', 'layout');
    revalidatePath('/admin/branding');
    revalidateTag('branding');

    return { ok: true };
  } catch (err: any) {
    console.error('Update WhatsApp number error:', err);
    return { ok: false, error: err.message };
  }
}

export async function updateCategoryImage(formData: FormData, slug: 'tea' | 'spices') {
  try {
    const isAuthorized = await isAdmin();
    if (!isAuthorized) throw new Error('Unauthorized');

    const file = formData.get('category_image') as File | null;
    if (!file) throw new Error('No file provided');

    const MAX_SIZE = 4 * 1024 * 1024; // 4MB
    if (file.size > MAX_SIZE) throw new Error('File too large. Max 4MB allowed.');

    const supabase = createAdminClient();
    const fileExt = file.name.split('.').pop();
    const filePath = `category-${slug}-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('branding')
      .upload(filePath, file, { upsert: true, contentType: file.type });

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('branding')
      .getPublicUrl(filePath);

    if (!publicUrl) throw new Error('Failed to get public URL');

    const { error: dbError } = await supabase
      .from('categories')
      .update({ image_url: publicUrl })
      .eq('slug', slug);

    if (dbError) throw dbError;

    revalidatePath('/');
    revalidatePath('/products');
    revalidateTag('categories');

    return { ok: true, url: publicUrl };
  } catch (err: any) {
    console.error(`Update category image (${slug}) error:`, err);
    return { ok: false, error: err.message };
  }
}

export async function removeCategoryImage(slug: 'tea' | 'spices') {
  try {
    const isAuthorized = await isAdmin();
    if (!isAuthorized) throw new Error('Unauthorized');

    const supabase = createAdminClient();
    const { error: dbError } = await supabase
      .from('categories')
      .update({ image_url: null })
      .eq('slug', slug);

    if (dbError) throw dbError;

    revalidatePath('/');
    revalidatePath('/products');
    revalidateTag('categories');

    return { ok: true };
  } catch (err: any) {
    console.error(`Remove category image (${slug}) error:`, err);
    return { ok: false, error: err.message };
  }
}

