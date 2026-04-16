'use server';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export type AuthState = {
  ok: boolean;
  error?: string;
};

export async function signUpUser(_prevState: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '').trim();
  const fullName = String(formData.get('full_name') ?? '').trim();
  const phone = String(formData.get('phone') ?? '').trim();

  if (!email || !password || !fullName || !phone) {
    return { ok: false, error: 'All fields are required.' };
  }

  const supabase = createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName, phone }
    }
  });

  if (error) return { ok: false, error: error.message };
  if (!data.user) return { ok: false, error: 'Signup failed.' };

  const userId = data.user.id;

  // CRITICAL: Linking logic
  const adminSupabase = createAdminClient();
  
  // 1. Check if a customer with this email already exists
  const { data: existingCustomer } = await adminSupabase
    .from('customers')
    .select('id')
    .eq('email', email)
    .single();

  if (existingCustomer) {
    // 2. Link existing customer to the new user_id
    await adminSupabase
      .from('customers')
      .update({ user_id: userId, full_name: fullName, phone })
      .eq('id', existingCustomer.id);
  } else {
    // 3. Create a new customer record linked to this user_id
    await adminSupabase
      .from('customers')
      .upsert({
        user_id: userId,
        email,
        full_name: fullName,
        phone
      }, { onConflict: 'email' });
  }

  revalidatePath('/', 'layout');
  redirect('/account');
}

export async function signInUser(_prevState: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '').trim();

  if (!email || !password) {
    return { ok: false, error: 'Email and password are required.' };
  }

  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return { ok: false, error: error.message };

  revalidatePath('/', 'layout');
  redirect('/account');
}

export async function signOutUser() {
  const supabase = createClient();
  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  redirect('/');
}
