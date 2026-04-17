'use server';

import { revalidatePath } from 'next/cache';
import { updateOrderStatus, updatePaymentStatus, addAdminNote, markNotificationSent } from '@/lib/orders/queries';
import { ensureInvoice } from '@/lib/invoices/createInvoice';
import { createAdminClient } from '@/lib/supabase/admin';
import { isAdmin } from './admin';

export async function setOrderStatus(formData: FormData) {
  const id = String(formData.get('id') ?? '').trim();
  const status = String(formData.get('status') ?? '').trim();
  if (!id || !status || !(await isAdmin())) return { ok: false, error: 'Unauthorized' };
  try {
    await updateOrderStatus(id, status);

    // Notification Hook
    const { createAdminNotification } = await import('@/lib/notifications/queries');
    await createAdminNotification({
      type: 'status_update',
      reference_id: id,
      title: 'Order Status Updated',
      message: `Order #${id.slice(0, 8)} moved to ${status}`
    });

    revalidatePath('/admin/orders');
    revalidatePath(`/admin/orders/${id}`);
    return { ok: true, message: `Status updated to ${status}` };
  } catch (err) {
    return { ok: false, error: 'Failed to update status' };
  }
}

export async function markNotificationSentAction(formData: FormData) {
  const id = String(formData.get('id') ?? '').trim();
  const status = String(formData.get('status') ?? '').trim();
  if (!id || !status || !(await isAdmin())) return { ok: false, error: 'Unauthorized' };
  
  try {
    await markNotificationSent(id, status);
    revalidatePath(`/admin/orders/${id}`);
    return { ok: true, message: 'Notification logged' };
  } catch (err) {
    return { ok: false, error: 'Failed to log notification' };
  }
}

export async function setPaymentStatus(formData: FormData) {
  const id = String(formData.get('id') ?? '').trim();
  const status = String(formData.get('status') ?? '').trim();
  if (!id || !status || !(await isAdmin())) return { ok: false, error: 'Unauthorized' };
  try {
    await updatePaymentStatus(id, status);

    // Notification Hook
    const { createAdminNotification } = await import('@/lib/notifications/queries');
    if (status === 'paid') {
      await createAdminNotification({
        type: 'payment_success',
        reference_id: id,
        title: 'Payment Confirmed',
        message: `Order #${id.slice(0, 8)} has been marked as PAID.`
      });
    }

    revalidatePath('/admin/orders');
    revalidatePath(`/admin/orders/${id}`);
    return { ok: true, message: `Payment set to ${status}` };
  } catch (err) {
    return { ok: false, error: 'Failed to update payment' };
  }
}

export async function addOrderNote(formData: FormData) {
  const id = String(formData.get('id') ?? '').trim();
  const note = String(formData.get('note') ?? '').trim();
  if (!id || !note || !(await isAdmin())) return { ok: false, error: 'Unauthorized' };
  try {
    await addAdminNote(id, note);
    revalidatePath(`/admin/orders/${id}`);
    return { ok: true, message: 'Note added' };
  } catch (err) {
     return { ok: false, error: 'Failed to add note' };
  }
}

export async function generateInvoiceAction(formData: FormData) {
  const id = String(formData.get('id') ?? '').trim();
  if (!id || !(await isAdmin())) return { ok: false, error: 'Unauthorized' };
  try {
    await ensureInvoice(id);
    revalidatePath(`/admin/orders/${id}`);
    return { ok: true, message: 'Invoice generated' };
  } catch (err) {
    return { ok: false, error: 'Failed to generate invoice' };
  }
}

export async function quickConfirmOrder(formData: FormData) {
  const id = String(formData.get('id') ?? '').trim();
  if (!id || !(await isAdmin())) return { ok: false, error: 'Unauthorized' };
  try {
    await updatePaymentStatus(id, 'paid');
    await updateOrderStatus(id, 'confirmed');
    
    revalidatePath('/admin/orders');
    revalidatePath(`/admin/orders/${id}`);
    revalidatePath('/account');
    return { ok: true, message: 'Order confirmed' };
  } catch (err) {
    return { ok: false, error: 'Quick confirm failed' };
  }
}

export async function quickMarkAsPaid(formData: FormData) {
  const id = String(formData.get('id') ?? '').trim();
  if (!id || !(await isAdmin())) return { ok: false, error: 'Unauthorized' };
  try {
    await updatePaymentStatus(id, 'paid');
    await updateOrderStatus(id, 'confirmed');
    
    revalidatePath('/admin/orders');
    revalidatePath(`/admin/orders/${id}`);
    revalidatePath('/account');
    return { ok: true, message: 'Marked as paid' };
  } catch (err) {
    return { ok: false, error: 'Mark as paid failed' };
  }
}

export async function archiveOrder(orderId: string) {
  try {
    const isAuthorized = await isAdmin();
    if (!isAuthorized) throw new Error('Unauthorized');

    const supabase = createAdminClient();

    // Soft delete by updating status
    const { error: dbError } = await supabase
      .from('orders')
      .update({ status: 'archived' })
      .eq('id', orderId);

    if (dbError) throw dbError;

    revalidatePath('/admin/orders');
    revalidatePath(`/admin/orders/${orderId}`);
    
    return { ok: true };
  } catch (err: any) {
    console.error('Archive order error:', err);
    return { ok: false, error: err.message };
  }
}
