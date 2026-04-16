import { createAdminClient } from '@/lib/supabase/admin';

export type OrderFilters = {
  q?: string;
  status?: string;
  payment_status?: string;
  date_from?: string;
  date_to?: string;
};

export const getOrders = async (filters: OrderFilters) => {
  const supabase = createAdminClient();
  let query = supabase
    .from('orders')
    .select('id, order_code, customer_name, customer_phone, customer_email, status, payment_status, total_inr, created_at')
    .order('created_at', { ascending: false });

  if (filters.status) {
    query = query.eq('status', filters.status);
  }
  if (filters.payment_status) {
    query = query.eq('payment_status', filters.payment_status);
  }
  if (filters.q) {
    query = query.or(
      `order_code.ilike.%${filters.q}%,customer_name.ilike.%${filters.q}%,customer_phone.ilike.%${filters.q}%,customer_email.ilike.%${filters.q}%`
    );
  }
  if (filters.date_from) {
    query = query.gte('created_at', filters.date_from);
  }
  if (filters.date_to) {
    query = query.lte('created_at', filters.date_to);
  }

  const { data } = await query;
  return data ?? [];
};

export const getOrderById = async (id: string) => {
  const supabase = createAdminClient();
  const { data: order } = await supabase
    .from('orders')
    .select(
      'id, order_code, customer_name, customer_email, customer_phone, status, type, payment_status, subtotal_inr, shipping_inr, tax_inr, total_inr, created_at, notes, shipping_address_id'
    )
    .eq('id', id)
    .maybeSingle();

  if (!order) return null;

  const { data: items } = await supabase
    .from('order_items')
    .select('product_name, variant_label, qty, unit_price_inr, line_total_inr')
    .eq('order_id', id);

  const { data: address } = await supabase
    .from('addresses')
    .select('full_name, phone, email, line1, line2, landmark, city, state, pincode')
    .eq('id', order.shipping_address_id)
    .maybeSingle();

  const { data: payment } = await supabase
    .from('payments')
    .select('provider, provider_payment_id, status, amount_inr, created_at')
    .eq('order_id', id)
    .maybeSingle();

  const { data: invoice } = await supabase.from('invoices').select('id, invoice_code, status, pdf_path').eq('order_id', id).maybeSingle();

  const { data: history } = await supabase
    .from('order_status_history')
    .select('old_status, new_status, created_at, note')
    .eq('order_id', id)
    .order('created_at', { ascending: true });

  const { data: notes } = await supabase
    .from('admin_order_notes')
    .select('id, note, created_at')
    .eq('order_id', id)
    .order('created_at', { ascending: false });

  return { order, items: items ?? [], address, payment, invoice, notes: notes ?? [], history: history ?? [] };
};

export const updateOrderStatus = async (id: string, status: string) => {
  const supabase = createAdminClient();
  const { data: current } = await supabase.from('orders').select('status').eq('id', id).maybeSingle();
  
  await supabase.from('orders').update({ status }).eq('id', id);
  
  // Record history with both old and new status
  await supabase.from('order_status_history').insert({ 
    order_id: id, 
    old_status: current?.status,
    new_status: status 
  });
};

export const updatePaymentStatus = async (id: string, status: string) => {
  const supabase = createAdminClient();
  const { data: current } = await supabase.from('orders').select('payment_status, status').eq('id', id).maybeSingle();
  
  // Guard: Never revert or overwrite already paid status unless explicitly forced (admin should use SQL for fixes)
  if (current?.payment_status === 'paid' && status !== 'paid') {
    throw new Error('Safety Guard: Cannot revert a PAID status to ' + status);
  }

  // Idempotency: skip if already is that status
  if (current?.payment_status === status) return;

  await supabase.from('orders').update({ payment_status: status }).eq('id', id);
  
  // Audit Log
  await supabase.from('order_status_history').insert({ 
    order_id: id, 
    old_status: `payment_${current?.payment_status}`,
    new_status: `payment_${status}`,
    note: `System: Payment status updated to ${status}`
  });
};

export const addAdminNote = async (id: string, note: string) => {
  const supabase = createAdminClient();
  await supabase.from('admin_order_notes').insert({ order_id: id, note });
};

export const getNotificationStatus = async (orderId: string) => {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('order_notifications')
    .select('status, sent_at')
    .eq('order_id', orderId);
  return data ?? [];
};

export const markNotificationSent = async (orderId: string, status: string) => {
  const supabase = createAdminClient();
  await supabase.from('order_notifications').upsert({
    order_id: orderId,
    status,
    sent_at: new Date().toISOString()
  }, { onConflict: 'order_id,status' });
};
