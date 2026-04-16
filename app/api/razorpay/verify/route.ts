import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createAdminClient } from '@/lib/supabase/admin';
import { ensureInvoice } from '@/lib/invoices/createInvoice';

export const runtime = 'nodejs';

type VerifyPayload = {
  orderId: string;
  orderToken: string;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as VerifyPayload;
    if (!payload.orderId || !payload.razorpay_payment_id || !payload.razorpay_order_id || !payload.razorpay_signature) {
      return NextResponse.json({ ok: false, error: 'Invalid payment payload.' }, { status: 400 });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      return NextResponse.json({ ok: false, error: 'Payment verification not configured.' }, { status: 500 });
    }

    const body = `${payload.razorpay_order_id}|${payload.razorpay_payment_id}`;
    const expected = crypto.createHmac('sha256', secret).update(body).digest('hex');

    const supabase = createAdminClient();
    const { data: order } = await supabase
      .from('orders')
      .select('public_token')
      .eq('id', payload.orderId)
      .maybeSingle();

    if (!order || (payload.orderToken && order.public_token !== payload.orderToken)) {
      return NextResponse.json({ ok: false, error: 'Order token mismatch.' }, { status: 400 });
    }

    const { data: payment } = await supabase
      .from('payments')
      .select('id, order_id, status')
      .eq('order_id', payload.orderId)
      .eq('provider_order_id', payload.razorpay_order_id)
      .maybeSingle();

    if (!payment) {
      return NextResponse.json({ ok: false, error: 'Payment record not found.' }, { status: 404 });
    }

    if (expected !== payload.razorpay_signature) {
      await supabase
        .from('payments')
        .update({ 
          status: 'failed', 
          provider_payment_id: payload.razorpay_payment_id, 
          provider_signature: payload.razorpay_signature,
          notes: 'Signature verification failed'
        })
        .eq('id', payment.id);
      
      await supabase
        .from('orders')
        .update({ 
          payment_status: 'failed', 
          status: 'pending' 
        })
        .eq('id', payload.orderId);
        
      return NextResponse.json({ ok: false, error: 'Payment verification failed. Please contact support.' }, { status: 400 });
    }

    if (payment.status === 'paid') {
      return NextResponse.json({ ok: true });
    }

    await supabase
      .from('payments')
      .update({
        status: 'paid',
        provider_payment_id: payload.razorpay_payment_id,
        provider_signature: payload.razorpay_signature,
        captured_at: new Date().toISOString()
      })
      .eq('id', payment.id);

    await supabase
      .from('orders')
      .update({
        payment_status: 'paid',
        status: 'paid',
        placed_at: new Date().toISOString(),
        razorpay_order_id: payload.razorpay_order_id,
        razorpay_payment_id: payload.razorpay_payment_id,
        razorpay_signature: payload.razorpay_signature
      })
      .eq('id', payload.orderId);

    try {
      await ensureInvoice(payload.orderId);
    } catch {
      // Invoice generation can be retried from admin panel.
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'Unexpected error.' },
      { status: 500 }
    );
  }
}
