import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { validateCheckoutPayload } from '@/lib/checkout/validation';
import type { CheckoutPayload } from '@/lib/checkout/types';
import { computeOrderItems, computeTotals } from '@/lib/orders/compute';
import { createRazorpayOrder, getRazorpayKeyId } from '@/lib/razorpay/client';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as CheckoutPayload;
    if (payload.honey_pot) {
      console.warn('Bot detected via honeypot field.');
      return NextResponse.json({ ok: false, error: 'Request rejected.' }, { status: 403 });
    }
    const validation = validateCheckoutPayload(payload);
    if (!validation.ok) {
      return NextResponse.json({ ok: false, error: 'Invalid checkout details.', errors: validation.errors }, { status: 400 });
    }

    const supabase = createAdminClient();
    const productIds = payload.items.map((item) => item.productId);
    const { data: productsById, error } = await supabase
      .from('products')
      .select('id,name,variants,slug')
      .in('id', productIds);

    const { data: productsBySlug } =
      productsById && productsById.length === productIds.length
        ? { data: [] }
        : await supabase.from('products').select('id,name,variants,slug').in('slug', productIds);

    const products = [...(productsById ?? []), ...(productsBySlug ?? [])];

    if (error || !products.length) {
      return NextResponse.json({ ok: false, error: 'Unable to validate products.' }, { status: 500 });
    }

    let computedItems: ReturnType<typeof computeOrderItems>;
    try {
      computedItems = computeOrderItems(products as any[], payload.items);
    } catch (computeError) {
      return NextResponse.json(
        { ok: false, error: computeError instanceof Error ? computeError.message : 'Invalid cart items.' },
        { status: 400 }
      );
    }
    const totals = computeTotals(computedItems);
    if (totals.totalInr <= 0) {
      return NextResponse.json({ ok: false, error: 'Invalid order total.' }, { status: 400 });
    }

    let customerId: string | null = null;
    if (payload.customer.email) {
      const { data: customer } = await supabase
        .from('customers')
        .upsert(
          {
            email: payload.customer.email,
            full_name: payload.customer.full_name,
            phone: payload.customer.phone
          },
          { onConflict: 'email' }
        )
        .select('id')
        .single();
      customerId = customer?.id ?? null;
    } else if (payload.customer.phone) {
      const { data: existing } = await supabase
        .from('customers')
        .select('id')
        .eq('phone', payload.customer.phone)
        .maybeSingle();
      if (existing?.id) {
        customerId = existing.id;
      } else {
        const { data: created } = await supabase
          .from('customers')
          .insert({
            full_name: payload.customer.full_name,
            phone: payload.customer.phone
          })
          .select('id')
          .single();
        customerId = created?.id ?? null;
      }
    }

    const { data: address, error: addressError } = await supabase
      .from('addresses')
      .insert({
        full_name: payload.customer.full_name,
        phone: payload.customer.phone,
        email: payload.customer.email,
        line1: payload.address.line1,
        line2: payload.address.line2 || null,
        landmark: payload.address.landmark || null,
        city: payload.address.city,
        state: payload.address.state,
        pincode: payload.address.pincode,
        country: 'IN'
      })
      .select('id')
      .single();

    if (addressError || !address) {
      return NextResponse.json({ ok: false, error: 'Unable to save address.' }, { status: 500 });
    }

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        customer_id: customerId,
        customer_name: payload.customer.full_name,
        customer_email: payload.customer.email,
        customer_phone: payload.customer.phone,
        order_type: 'sale',
        status: 'payment_pending',
        payment_status: 'pending',
        currency: 'INR',
        subtotal_inr: totals.subtotalInr,
        shipping_inr: totals.shippingInr,
        tax_inr: totals.taxInr,
        discount_inr: totals.discountInr,
        total_inr: totals.totalInr,
        shipping_address_id: address.id,
        billing_address_id: address.id,
        notes: payload.notes || null
      })
      .select('id, order_code, public_token')
      .single();

    if (orderError || !order) {
      return NextResponse.json({ ok: false, error: 'Unable to create order.' }, { status: 500 });
    }

    const orderItems = computedItems.map((item) => ({
      order_id: order.id,
      product_id: item.productId,
      product_name: item.productName,
      variant_label: item.variantLabel,
      variant_sku: item.variantSku,
      unit_price_inr: item.unitPriceInr,
      qty: item.quantity,
      line_total_inr: item.lineTotalInr
    }));

    const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
    if (itemsError) {
      return NextResponse.json({ ok: false, error: 'Unable to create order items.' }, { status: 500 });
    }

    let razorpayOrder;
    try {
      razorpayOrder = await createRazorpayOrder({
        amount: totals.totalInr * 100,
        currency: 'INR',
        receipt: order.order_code ?? `order-${order.id}`,
        payment_capture: 1
      });
    } catch (razorError) {
      await supabase
        .from('orders')
        .update({ payment_status: 'failed', status: 'pending' })
        .eq('id', order.id);
      return NextResponse.json(
        { ok: false, error: razorError instanceof Error ? razorError.message : 'Payment initiation failed.' },
        { status: 500 }
      );
    }

    await supabase.from('payments').insert({
      order_id: order.id,
      provider: 'razorpay',
      provider_order_id: razorpayOrder.id,
      amount_inr: totals.totalInr,
      currency: 'INR',
      status: 'pending'
    });

    return NextResponse.json({
      ok: true,
      orderId: order.id,
      orderCode: order.order_code,
      orderToken: order.public_token,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: getRazorpayKeyId()
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'Unexpected error.' },
      { status: 500 }
    );
  }
}
