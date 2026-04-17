'use server';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';

export type UnifiedOrder = {
  id: string;
  order_code: string;
  type: 'order' | 'prebook';
  created_at: string;
  total_inr: number;
  payment_status: string;
  status: string;
  public_token?: string;
  product_summary?: string;
  history?: any[];
};

export async function getAccountDashboardData() {
  const supabase = createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    console.error('Account dashboard auth error:', authError);
    return { ok: false, error: 'Unauthorized', needsLogin: true };
  }

  const adminSupabase = createAdminClient();

  // 1. Get or Create/Link Customer Record
  console.log('Fetching customer for user:', user.id);
  let { data: customer, error: customerError } = await adminSupabase
    .from('customers')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();

  if (customerError) {
    console.error('Customer fetch error:', customerError);
  }

  if (!customer) {
    console.log('Customer not found by user_id, checking email:', user.email);
    // Check if a guest record exists for this email
    const { data: guestRecord, error: guestError } = await adminSupabase
      .from('customers')
      .select('*')
      .eq('email', user.email)
      .maybeSingle();

    if (guestError) {
      console.error('Guest lookup error:', guestError);
      return { ok: false, error: 'Failed to verify guest status.' };
    }

    if (guestRecord) {
      console.log('Found guest record, linking to user_id...');
      // Link previous guest orders and data
      const { data: updated, error: updateError } = await adminSupabase
        .from('customers')
        .update({ user_id: user.id })
        .eq('id', guestRecord.id)
        .select()
        .single();
      
      if (updateError) {
        console.error('Customer link error:', updateError);
        return { ok: false, error: 'Failed to link account.' };
      }
      customer = updated;
    } else {
      console.log('No guest record, creating new customer focus...');
      // Create fresh customer record
      const { data: created, error: insertError } = await adminSupabase
        .from('customers')
        .insert({
          user_id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || '',
          phone: user.user_metadata?.phone || ''
        })
        .select()
        .single();

      if (insertError) {
        console.error('Customer insert error:', insertError);
      }
      customer = created;
    }
  }

  if (!customer) {
    console.error('Account data sync failed - no customer record could be established');
    return { ok: false, error: 'Customer synchronization failed.' };
  }

  // 2. Fetch Normal Orders
  const { data: orders, error: ordersError } = await adminSupabase
    .from('orders')
    .select('*, order_items(product_name)')
    .eq('customer_id', customer.id)
    .order('created_at', { ascending: false });

  if (ordersError) {
    console.error('Orders fetch error:', ordersError);
  }

  // 3. Fetch Prebook Requests (by email match)
  const { data: prebooks, error: prebooksError } = await adminSupabase
    .from('prebook_requests')
    .select('*')
    .eq('email', user.email)
    .order('created_at', { ascending: false });

  if (prebooksError) {
    console.error('Prebooks fetch error:', prebooksError);
  }

  // 4. Fetch History for all orders/prebooks
  const allIds = [...(orders || []).map(o => o.id), ...(prebooks || []).map(p => p.id)];
  const { data: history } = await adminSupabase
    .from('order_status_history')
    .select('*')
    .in('order_id', allIds)
    .order('created_at', { ascending: true });

  // 5. Unify Orders
  const unified: UnifiedOrder[] = [
    ...(orders || []).map(o => ({
      id: o.id,
      order_code: o.order_number || o.id.slice(0, 8),
      type: 'order' as const,
      created_at: o.created_at,
      total_inr: o.total_inr,
      payment_status: o.payment_status || 'pending',
      status: o.status || 'new',
      public_token: o.public_token,
      product_summary: o.order_items?.[0]?.product_name ? `${o.order_items[0].product_name}${o.order_items.length > 1 ? ` +${o.order_items.length - 1}` : ''}` : 'View details',
      history: history?.filter(h => h.order_id === o.id) || []
    })),
    ...(prebooks || []).map(p => ({
      id: p.id,
      order_code: `PRE-${p.id.slice(0, 5).toUpperCase()}`,
      type: 'prebook' as const,
      created_at: p.created_at,
      total_inr: 0,
      payment_status: 'paid',
      status: p.status,
      product_summary: p.product_name,
      history: history?.filter(h => h.order_id === p.id) || []
    }))
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return {
    ok: true,
    user: {
      email: user.email,
      id: user.id
    },
    customer,
    orders: unified
  };
}

export async function updateProfile(_prevState: any, formData: FormData) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { ok: false, error: 'Unauthorized' };

  const fullName = String(formData.get('full_name') ?? '').trim();
  const phone = String(formData.get('phone') ?? '').trim();

  if (!fullName) return { ok: false, error: 'Name is required.' };

  const adminSupabase = createAdminClient();
  const { error } = await adminSupabase
    .from('customers')
    .update({ full_name: fullName, phone })
    .eq('user_id', user.id);

  if (error) return { ok: false, error: error.message };

  revalidatePath('/account');
  return { ok: true, message: 'Profile updated successfully.' };
}

/**
 * Update Email with verification logic
 */
export async function updateEmail(newEmail: string) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: 'Unauthorized' };

  const { error } = await supabase.auth.updateUser({ email: newEmail });
  
  if (error) return { ok: false, error: error.message };
  
  return { ok: true, message: 'Verification link sent to both old and new email addresses.' };
}

/**
 * Update Password
 */
export async function updatePassword(formData: FormData) {
  const password = String(formData.get('password') ?? '').trim();
  const confirm = String(formData.get('confirm') ?? '').trim();

  if (!password || password.length < 6) return { ok: false, error: 'Min 6 characters required.' };
  if (password !== confirm) return { ok: false, error: 'Passwords do not match.' };

  const supabase = createClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) return { ok: false, error: error.message };

  return { ok: true, message: 'Password updated successfully!' };
}
