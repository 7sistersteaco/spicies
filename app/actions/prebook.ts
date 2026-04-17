'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import type { FulfillmentMethod, PrebookFormState } from '@/lib/prebook/types';

const fulfillmentOptions: FulfillmentMethod[] = [
  'pickup_from_7_sisters_restro',
  'local_delivery',
  'shipping_inquiry'
];

import { WHATSAPP_NUMBER } from '@/lib/config/whatsapp';

const buildWhatsAppMessage = (name: string, productName: string, weight: string, quantity: number) =>
  `Hi, I am ${name}. I just placed a PRE-ORDER for ${productName} (${weight}), quantity ${quantity}. Please confirm my booking.`;

import { createRazorpayOrder, getRazorpayKeyId } from '@/lib/razorpay/client';

export async function submitPrebook(
  _prevState: PrebookFormState,
  formData: FormData
): Promise<PrebookFormState> {
  const fullName = String(formData.get('full_name') ?? '').trim();
  const phone = String(formData.get('phone') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim();
  const productName = String(formData.get('product_name') ?? '').trim();
  const category = String(formData.get('category') ?? '').trim();
  const selectedWeight = String(formData.get('selected_weight') ?? '').trim();
  const quantity = Number(formData.get('quantity') ?? 1);
  const fulfillmentMethod = String(formData.get('fulfillment_method') ?? '').trim();
  const paymentMode = String(formData.get('payment_mode') ?? 'reserve').trim();
  const note = String(formData.get('note') ?? '').trim();
  const sourcePage = String(formData.get('source_page') ?? '').trim();

  // ... (validation logic stays same)
  // [Lines 32-58 omitted for brevity but preserved in actual replacement]
  const errors: Record<string, string> = {};

  if (!fullName) errors.full_name = 'Full name is required.';
  if (!phone) errors.phone = 'Phone number is required.';
  if (!productName) errors.product_name = 'Product name is required.';
  if (!category) errors.category = 'Category is required.';
  if (!selectedWeight) errors.selected_weight = 'Please select a weight.';
  if (!quantity || Number.isNaN(quantity) || quantity < 1) errors.quantity = 'Quantity must be at least 1.';
  if (!fulfillmentOptions.includes(fulfillmentMethod as FulfillmentMethod)) errors.fulfillment_method = 'Please choose a fulfillment method.';

  if (Object.keys(errors).length > 0) return { ok: false, errors };

  const message = buildWhatsAppMessage(fullName, productName, selectedWeight, quantity);
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

  try {
    const supabase = createAdminClient();
    
    // 0. Fetch Product Price if Pay Now is selected
    let totalInr = 0;
    if (paymentMode === 'pay_now') {
      const { data: product } = await supabase
        .from('products')
        .select('id, product_variants(*)')
        .eq('name', productName)
        .single();
        
      const variants = product?.product_variants || (product as any)?.variants || [];
      const variant = variants.find((v: any) => (v.label || v.weight_label) === selectedWeight);
      if (variant) {
        totalInr = (variant.price_inr || variant.priceInr || 0) * quantity;
      }
    }

    // 1. Capture/Update Customer
    const { data: customer } = await supabase
      .from('customers')
      .upsert({ full_name: fullName, phone, email: email || null }, { onConflict: 'phone' })
      .select('id')
      .single();
    const customerId = customer?.id ?? null;

    // 2. Insert into Unified Orders table
    const { data: order, error } = await supabase.from('orders').insert({
      customer_id: customerId,
      customer_name: fullName,
      customer_email: email || null,
      customer_phone: phone,
      order_type: 'prebook',
      status: 'pending',
      payment_status: 'pending',
      fulfillment_method: fulfillmentMethod,
      notes: note || null,
      total_inr: totalInr
    }).select('id, order_code, public_token').single();

    if (error || !order) {
      throw new Error(`Order insertion failed: ${error?.message}`);
    }

    // 3. Optional Razorpay Order
    let razoOrderData;
    if (paymentMode === 'pay_now' && totalInr > 0) {
      const razoOrder = await createRazorpayOrder({
        amount: totalInr * 100,
        currency: 'INR',
        receipt: order.order_code,
        payment_capture: 1
      });
      
      await supabase.from('payments').insert({
        order_id: order.id,
        provider: 'razorpay',
        provider_order_id: razoOrder.id,
        amount_inr: totalInr,
        currency: 'INR',
        status: 'pending'
      });

      razoOrderData = {
        id: razoOrder.id,
        amount: razoOrder.amount,
        currency: razoOrder.currency,
        keyId: getRazorpayKeyId(),
        orderId: order.id,
        orderToken: order.public_token
      };
    }

    // 4. Detailed Pre-book Request (Legacy support)
    await supabase.from('prebook_requests').insert({
      full_name: fullName,
      phone,
      email: email || null,
      product_name: productName,
      category,
      selected_weight: selectedWeight,
      quantity,
      fulfillment_method: fulfillmentMethod,
      note: note || null,
      source_page: sourcePage || null,
      status: 'new'
    });

    // 5. Admin Notification
    const { createAdminNotification } = await import('@/lib/notifications/queries');
    await createAdminNotification({
      type: 'new_prebook',
      reference_id: order.id,
      title: 'New Pre-order Request',
      message: `${fullName} requested ${quantity}x ${productName} (${selectedWeight})`
    });

    return { ok: true, message, whatsappUrl, razoOrder: razoOrderData };
  } catch (err) {
    console.error('Prebook submission exception:', err);
    return { ok: false, errors: { form: 'Unable to submit pre-order. Please try again.' } };
  }
}
