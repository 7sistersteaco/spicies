'use server';

import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { updatePrebookStatus } from '@/lib/prebook/queries';
import type { PrebookStatus } from '@/lib/prebook/types';

const allowedStatuses: PrebookStatus[] = ['new', 'contacted', 'confirmed', 'fulfilled'];

export type AdminLoginState = {
  ok: boolean;
  error?: string;
};

export async function isAdmin() {
  const supabase = createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return false;
  
  const email = user.email || '';
  const isAllowedDomain = email.endsWith('@7sisterstea.com') || email.endsWith('@gmail.com');
  const hasAdminRole = user.app_metadata?.role === 'admin';

  return hasAdminRole && isAllowedDomain;
}

export async function loginAdmin(_prevState: AdminLoginState, formData: FormData): Promise<AdminLoginState> {
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '').trim();

  if (!email || !password) {
    return { ok: false, error: 'Email and password are required.' };
  }

  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { ok: false, error: error.message };
  }

  revalidatePath('/admin', 'layout');
  return { ok: true };
}

export async function logoutAdmin() {
  const supabase = createClient();
  await supabase.auth.signOut();
  revalidatePath('/admin', 'layout');
}

export async function setPrebookStatus(formData: FormData) {
  if (!(await isAdmin())) {
    return;
  }

  const id = String(formData.get('id') ?? '').trim();
  const status = String(formData.get('status') ?? '').trim() as PrebookStatus;

  if (!id || !allowedStatuses.includes(status)) {
    return;
  }

  await updatePrebookStatus(id, status);
  revalidatePath('/admin');
}

/**
 * Invite a new user with administrative or staff roles
 */
export async function inviteNewUser(_prevState: any, formData: FormData): Promise<{ ok: boolean; message?: string; error?: string }> {
  if (!(await isAdmin())) return { ok: false, error: 'Unauthorized' };

  const email = String(formData.get('email') ?? '').trim();
  const role = String(formData.get('role') ?? 'staff').trim();
  const fullName = String(formData.get('full_name') ?? '').trim();

  if (!email || !fullName) return { ok: false, error: 'Email and full name required.' };

  const origin = headers().get('origin');
  const adminSupabase = createAdminClient();
  
  const { data, error } = await adminSupabase.auth.admin.inviteUserByEmail(email, {
    data: { role, full_name: fullName },
    redirectTo: `${origin}/api/auth/callback`,
  });

  if (error) return { ok: false, error: error.message };

  return { ok: true, message: `Invitation successfully sent to ${email}!` };
}
