'use server';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

export type AuthState = {
  ok: boolean;
  error?: string;
  message?: string;
};

/**
 * Enhanced Signup: Handles both automatic login and pending email confirmation
 */
export async function signUpUser(_prevState: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '').trim();
  const fullName = String(formData.get('full_name') ?? '').trim();
  const phone = String(formData.get('phone') ?? '').trim();

  if (!email || !password || !fullName || !phone) {
    return { ok: false, error: 'All fields are required.' };
  }

  const origin = headers().get('origin');
  const supabase = createClient();
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName, phone },
      emailRedirectTo: `${origin}/api/auth/callback`,
    }
  });

  if (error) return { ok: false, error: error.message };
  if (!data.user) return { ok: false, error: 'Signup failed.' };

  // If email confirmation is enabled, session will be null
  if (!data.session) {
    return { 
      ok: true, 
      message: 'Registration successful! Please check your email to confirm your account before logging in.' 
    };
  }

  const userId = data.user.id;
  const adminSupabase = createAdminClient();
  
  // Link existing customer or create new
  const { data: existingCustomer } = await adminSupabase
    .from('customers')
    .select('id')
    .eq('email', email)
    .single();

  if (existingCustomer) {
    await adminSupabase
      .from('customers')
      .update({ user_id: userId, full_name: fullName, phone })
      .eq('id', existingCustomer.id);
  } else {
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

/**
 * Standard Password Login
 */
export async function signInUser(_prevState: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '').trim();

  if (!email || !password) {
    return { ok: false, error: 'Email and password are required.' };
  }

  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    if (error.message.includes('Email not confirmed')) {
      return { ok: false, error: 'Please confirm your email address before logging in.' };
    }
    return { ok: false, error: error.message };
  }

  revalidatePath('/', 'layout');
  redirect('/account');
}

/**
 * Magic Link Login
 */
export async function signInWithMagicLink(_prevState: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get('email') ?? '').trim();
  if (!email) return { ok: false, error: 'Email is required for magic link.' };

  const origin = headers().get('origin');
  const supabase = createClient();
  
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${origin}/api/auth/callback`,
    },
  });

  if (error) return { ok: false, error: error.message };
  
  return { ok: true, message: 'Magic link sent! Check your email inbox.' };
}

/**
 * Forgot Password: Send reset link
 */
export async function requestPasswordReset(_prevState: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get('email') ?? '').trim();
  if (!email) return { ok: false, error: 'Email is required.' };

  const origin = headers().get('origin');
  const supabase = createClient();
  
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/api/auth/callback?next=/reset-password`,
  });

  if (error) return { ok: false, error: error.message };
  
  return { ok: true, message: 'Password reset link sent! Check your email.' };
}

/**
 * Reset Password: Update password with new one
 */
export async function updatePassword(_prevState: AuthState, formData: FormData): Promise<AuthState> {
  const password = String(formData.get('password') ?? '').trim();
  const confirmPassword = String(formData.get('confirm_password') ?? '').trim();

  if (!password || password.length < 6) return { ok: false, error: 'Password must be at least 6 characters.' };
  if (password !== confirmPassword) return { ok: false, error: 'Passwords do not match.' };

  const supabase = createClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) return { ok: false, error: error.message };
  
  return { ok: true, message: 'Password updated successfully! You can now log in.' };
}

/**
 * Reauthentication: Verify current password before sensitive changes
 */
export async function reauthenticate(formData: FormData) {
  const password = String(formData.get('password') ?? '').trim();
  if (!password) return { ok: false, error: 'Password required.' };

  const supabase = createClient();
  
  // For reauthentication, the user must be logged in. 
  // We use signInWithPassword with the current user's email to verify.
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) return { ok: false, error: 'Not authenticated.' };

  const { error } = await supabase.auth.signInWithPassword({
    email: user.email,
    password,
  });

  if (error) return { ok: false, error: 'Invalid password. Please try again.' };
  
  return { ok: true };
}

export async function signOutUser() {
  const supabase = createClient();
  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  redirect('/');
}
