'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';
import { isAdmin } from './admin';

const MAX_LOGO_SIZE = 2 * 1024 * 1024; // 2MB
const MAX_FAVICON_SIZE = 512 * 1024; // 512KB
const ALLOWED_LOGO_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
const ALLOWED_FAVICON_TYPES = ['image/png', 'image/x-icon', 'image/vnd.microsoft.icon', 'image/webp'];

export async function getBrandingSettings() {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('branding_settings')
      .select('*')
      .eq('id', 1)
      .single();

    // If table doesn't exist or row missing, ignore and return defaults
    if (error) {
      return { logo_url: null, favicon_url: null };
    }
    return data || { logo_url: null, favicon_url: null };
  } catch (err) {
    // Catch-all for configuration errors or missing table issues
    return { logo_url: null, favicon_url: null };
  }
}

export async function updateBrandingLogo(formData: FormData) {
  try {
    const isAuthorized = await isAdmin();
    if (!isAuthorized) throw new Error('Unauthorized');

    const file = formData.get('logo') as File | null;
    if (!file) throw new Error('No file provided');

    if (file.size > MAX_LOGO_SIZE) {
      throw new Error('Logo size exceeds 2MB limit.');
    }

    if (!ALLOWED_LOGO_TYPES.includes(file.type)) {
      throw new Error('Invalid file type. Allowed: JPG, PNG, WEBP, SVG');
    }

    const supabase = createAdminClient();
    const fileExt = file.name.split('.').pop();
    const filePath = `logo-${Date.now()}.${fileExt}`;

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
      .upsert({ id: 1, logo_url: publicUrl, updated_at: new Date().toISOString() });

    if (dbError) throw dbError;

    revalidatePath('/', 'layout');
    revalidatePath('/admin/branding');

    return { ok: true, url: publicUrl };
  } catch (err: any) {
    console.error('Update branding logo error:', err);
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

    return { ok: true, url: publicUrl };
  } catch (err: any) {
    console.error('Update branding favicon error:', err);
    return { ok: false, error: err.message };
  }
}

export async function removeBrandingAsset(type: 'logo' | 'favicon') {
  try {
    const isAuthorized = await isAdmin();
    if (!isAuthorized) throw new Error('Unauthorized');

    const supabase = createAdminClient();
    
    const updateObj: any = { id: 1, updated_at: new Date().toISOString() };
    if (type === 'logo') updateObj.logo_url = null;
    else updateObj.favicon_url = null;

    const { error: dbError } = await supabase
      .from('branding_settings')
      .upsert(updateObj);

    if (dbError) throw dbError;

    revalidatePath('/', 'layout');
    revalidatePath('/admin/branding');

    return { ok: true };
  } catch (err: any) {
    console.error('Remove branding asset error:', err);
    return { ok: false, error: err.message };
  }
}
