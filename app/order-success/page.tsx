import Container from '@/components/layout/Container';
import Section from '@/components/layout/Section';
import OrderSuccessClient from '@/components/orders/OrderSuccessClient';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { formatPrice } from '@/lib/products/helpers';
import { WHATSAPP_NUMBER } from '@/lib/config/whatsapp';
import OrderTimeline from '@/components/account/OrderTimeline';
import { getStatusLabel, type OrderStatus } from '@/lib/orders/types';

export const metadata = {
  title: 'Order Confirmed',
  description: 'Thank you for your order with 7 Sisters Tea Co.'
};

export const dynamic = 'force-dynamic';

export default async function OrderSuccessPage({ searchParams }: { searchParams: { token?: string } }) {
  const token = searchParams.token ?? '';
  const supabaseAdmin = createAdminClient();
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isLoggedIn = !!user;

  const { data: orderData } = await supabaseAdmin
    .from('orders')
    .select('id, order_code, status, type, payment_status, total_inr, customer_name')
    .eq('public_token', token)
    .maybeSingle();

  const order = orderData;
  const { data: history } = order 
    ? await supabaseAdmin.from('order_status_history').select('*').eq('order_id', order.id).order('created_at', { ascending: true })
    : { data: [] };

  const { data: invoice } = order
    ? await supabaseAdmin.from('invoices').select('id').eq('order_id', order.id).maybeSingle()
    : { data: null };

  return (
    <Section className="pt-12">
      <Container className="max-w-3xl">
        <OrderSuccessClient />
        <div className="lux-surface p-8 text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-cream/50">Order Confirmed</p>
          <h1 className="mt-4 text-3xl font-semibold md:text-4xl">Thank you for your purchase.</h1>
          <p className="mt-3 text-sm text-cream/70">
            We have received your order and will begin fresh packing shortly.
          </p>

          {order ? (
            <div className="mt-8 space-y-8">
              <div className="space-y-2 text-sm text-cream/70">
                <p>Order ID: <span className="text-cream font-mono">{order.order_code ?? order.id}</span></p>
                <p>Status: <span className="text-accent font-bold uppercase tracking-wider">{getStatusLabel(order.status as OrderStatus, order.type === 'prebook')}</span></p>
                <p>Payment: <span className="text-cream">{order.payment_status ?? 'pending'}</span></p>
                <p>Total: <span className="text-cream font-bold">{formatPrice(order.total_inr ?? 0)}</span></p>
              </div>
              
              {/* Visual Timeline */}
              <div className="bg-cream/5 rounded-2xl p-6 border border-cream/5">
                <OrderTimeline 
                  status={order.status as OrderStatus} 
                  isPreOrder={order.type === 'prebook'} 
                  history={history ?? []}
                />
              </div>
            </div>
          ) : (
            <p className="mt-6 text-sm text-cream/70">Unable to locate your order details.</p>
          )}

          {!isLoggedIn && (
            <div className="mt-10 p-6 border-t border-cream/5 space-y-4">
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-[0.3em] text-accent font-bold">New to 7 Sisters?</p>
                <p className="text-sm text-cream/70 italic">Create an account to track this order, view your history, and download invoices anytime.</p>
              </div>
              <Link href="/signup">
                <Button className="w-full h-12">Create Account</Button>
              </Link>
            </div>
          )}

          <div className="mt-8 flex flex-col gap-3 md:flex-row md:justify-center">
            {invoice?.id && token ? (
              <a href={`/api/invoices/${invoice.id}/download?token=${token}`}>
                <Button className="w-full md:w-auto">Download Invoice</Button>
              </a>
            ) : null}
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                `Hi, I placed an order with 7 Sisters Tea Co. Order: ${order?.order_code ?? ''}. Please confirm my order.`
              )}`}
              target="_blank"
              rel="noreferrer"
            >
              <Button variant="secondary" className="w-full md:w-auto">
                WhatsApp Support
              </Button>
            </a>
          </div>
        </div>
      </Container>
    </Section>
  );
}
