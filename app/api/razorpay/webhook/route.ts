import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createAdminClient } from '@/lib/supabase/admin';
import { ensureInvoice } from '@/lib/invoices/createInvoice';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ ok: false, error: 'Webhook secret not configured.' }, { status: 500 });
  }

  const signature = request.headers.get('x-razorpay-signature') ?? '';
  const payloadText = await request.text();
  const expected = crypto.createHmac('sha256', secret).update(payloadText).digest('hex');

  if (signature !== expected) {
    return NextResponse.json({ ok: false, error: 'Invalid signature.' }, { status: 401 });
  }

  const payload = JSON.parse(payloadText) as {
    event: string;
    payload: { payment: { entity: { id: string; order_id: string; status: string; amount: number } } };
  };

  const eventId = request.headers.get('x-razorpay-event-id');
  const supabase = createAdminClient();

  if (eventId) {
    const { data: existing } = await supabase
      .from('payment_events')
      .select('id')
      .eq('provider_event_id', eventId)
      .maybeSingle();
    if (existing) {
      return NextResponse.json({ ok: true });
    }
    await supabase.from('payment_events').insert({
      provider: 'razorpay',
      provider_event_id: eventId,
      payload: payload
    });
  }

  const paymentEntity = payload.payload.payment.entity;
  const { data: payment } = await supabase
    .from('payments')
    .select('id, order_id, status')
    .eq('provider_order_id', paymentEntity.order_id)
    .maybeSingle();

  if (!payment) {
    return NextResponse.json({ ok: false, error: 'Payment not found.' }, { status: 404 });
  }

  if (payload.event === 'payment.captured') {
    await supabase
      .from('payments')
      .update({ status: 'paid', provider_payment_id: paymentEntity.id, captured_at: new Date().toISOString() })
      .eq('id', payment.id);
    await supabase
      .from('orders')
      .update({
        payment_status: 'paid',
        status: 'paid',
        placed_at: new Date().toISOString(),
        razorpay_order_id: paymentEntity.order_id,
        razorpay_payment_id: paymentEntity.id
      })
      .eq('id', payment.order_id);
    try {
      await ensureInvoice(payment.order_id);
    } catch {
      // Invoice generation can be retried from admin.
    }
  }

  if (payload.event === 'payment.failed') {
    await supabase
      .from('payments')
      .update({ status: 'failed', provider_payment_id: paymentEntity.id })
      .eq('id', payment.id);
    await supabase.from('orders').update({ payment_status: 'failed', status: 'pending' }).eq('id', payment.order_id);
  }

  return NextResponse.json({ ok: true });
}
