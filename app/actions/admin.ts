'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
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
  
  // You can add additional checks here, e.g., checking for an 'admin' role in a profiles table
  return user.app_metadata?.role === 'admin';
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
