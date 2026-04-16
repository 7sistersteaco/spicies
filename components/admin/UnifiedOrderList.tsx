'use client';

import { formatPrice } from '@/lib/products/helpers';
import Link from 'next/link';
import OrderStatusSelect from './OrderStatusSelect';
import PaymentStatusSelect from './PaymentStatusSelect';

type Order = {
  id: string;
  order_code: string;
  order_type: 'sale' | 'prebook';
  customer_name: string;
  total_inr: number;
  status: string;
  payment_status: string;
  created_at: string;
};

export default function UnifiedOrderList({ orders }: { orders: any[] }) {
  const formatDate = (date: string) => new Date(date).toLocaleDateString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });

  return (
    <div className="overflow-hidden rounded-2xl border border-white/20 bg-surface-strong">
      <div className="hidden grid-cols-6 gap-4 border-b border-white/20 px-6 py-4 text-xs uppercase tracking-[0.2em] text-cream/60 md:grid">
        <span className="col-span-2">Customer / ID</span>
        <span>Type</span>
        <span>Total</span>
        <span>Order Status</span>
        <span>Payment</span>
      </div>
      <div className="divide-y divide-white/20">
        {orders.length === 0 ? (
          <div className="px-6 py-12 text-center text-sm text-cream/50">
            No orders found matching the filters.
          </div>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="grid grid-cols-2 gap-y-4 px-6 py-6 text-sm md:grid-cols-6 items-center">
              {/* Customer / ID - Full Width on Mobile */}
              <div className="col-span-2 md:col-span-2">
                <Link href={`/admin/orders/${order.id}`} className="font-semibold text-cream hover:text-accent transition">
                  {order.customer_name ?? 'Guest'}
                </Link>
                <div className="flex items-center gap-2 mt-1">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-cream/40">{order.order_code ?? order.id.slice(0, 8)}</p>
                  <span className={`px-1.5 py-0.5 rounded text-[9px] uppercase tracking-tighter md:hidden ${
                    order.order_type === 'prebook' ? 'bg-accent/20 text-accent' : 'bg-cream/10 text-cream/40'
                  }`}>
                    {order.order_type === 'prebook' ? 'PRE-ORDER' : 'ORDER'}
                  </span>
                </div>
                <p className="text-[11px] text-cream/30 mt-1">{formatDate(order.created_at)}</p>
              </div>

              {/* Type - Desktop Only Label */}
              <div className="hidden md:block">
                <span className={`inline-block px-2 py-1 rounded text-[10px] uppercase tracking-tighter ${
                  order.order_type === 'prebook' ? 'bg-accent/20 text-accent' : 'bg-cream/10 text-cream/60'
                }`}>
                  {order.order_type === 'prebook' ? 'PRE-ORDER' : 'ORDER'}
                </span>
              </div>

              {/* Total */}
              <div className="flex flex-col md:block">
                 <span className="text-[10px] uppercase tracking-widest text-cream/30 md:hidden">Amount</span>
                 <span className="font-medium text-cream/80">
                  {order.order_type === 'sale' ? formatPrice(order.total_inr) : '--'}
                 </span>
              </div>

              {/* Status */}
              <div className="flex flex-col md:block">
                <span className="text-[10px] uppercase tracking-widest text-cream/30 md:hidden mb-1">Status</span>
                <OrderStatusSelect id={order.id} current={order.status} />
              </div>

              {/* Payment */}
              <div className="flex flex-col md:block col-span-2 md:col-span-1">
                <span className="text-[10px] uppercase tracking-widest text-cream/30 md:hidden mb-1">Payment</span>
                <PaymentStatusSelect id={order.id} current={order.payment_status} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
