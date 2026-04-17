'use client';

import { formatPrice } from '@/lib/products/helpers';
import Link from 'next/link';
import OrderStatusSelect from './OrderStatusSelect';
import PaymentStatusSelect from './PaymentStatusSelect';
import { User, CreditCard, ChevronRight, Clock } from 'lucide-react';

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
    <div className="space-y-4">
      {/* Desktop Header */}
      <div className="hidden md:grid grid-cols-6 gap-4 rounded-t-2xl border border-white/20 bg-surface-strong px-6 py-4 text-xs uppercase tracking-[0.2em] text-cream/60">
        <span className="col-span-2">Customer / ID</span>
        <span>Type</span>
        <span>Total</span>
        <span>Order Status</span>
        <span>Payment</span>
      </div>

      <div className="divide-y divide-white/5 md:divide-y-0 md:space-y-4">
        {orders.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.01] px-6 py-12 text-center text-sm text-cream/30">
            No orders match the current filters.
          </div>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="group">
              {/* Desktop Row */}
              <div className="hidden md:grid grid-cols-6 gap-4 items-center rounded-2xl border border-white/5 bg-white/[0.02] px-6 py-6 text-sm transition-all hover:bg-white/[0.04] hover:border-white/10">
                <div className="col-span-2">
                  <Link href={`/admin/orders/${order.id}`} className="font-semibold text-cream hover:text-accent transition flex items-center gap-2">
                    {order.customer_name ?? 'Guest'}
                    <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
                  </Link>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="font-mono text-[10px] uppercase tracking-widest text-cream/40">{order.order_code ?? order.id.slice(0, 8)}</p>
                  </div>
                  <p className="text-[11px] text-cream/30 mt-1">{formatDate(order.created_at)}</p>
                </div>

                <div>
                  <span className={`inline-block px-2 py-1 rounded text-[10px] font-bold uppercase tracking-tighter ${
                    order.order_type === 'prebook' ? 'bg-accent/20 text-accent border border-accent/20' : 'bg-cream/10 text-cream/40 border border-white/5'
                  }`}>
                    {order.order_type === 'prebook' ? 'Pre-order' : 'Order'}
                  </span>
                </div>

                <div>
                   <span className="font-medium text-cream/80">
                    {order.order_type === 'sale' ? formatPrice(order.total_inr) : '--'}
                   </span>
                </div>

                <div>
                  <OrderStatusSelect id={order.id} current={order.status} />
                </div>

                <div>
                  <PaymentStatusSelect id={order.id} current={order.payment_status} />
                </div>
              </div>

              {/* Mobile Card */}
              <div className="md:hidden rounded-2xl border border-white/5 bg-white/[0.02] p-5 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <Link href={`/admin/orders/${order.id}`} className="flex items-center gap-2 text-sm font-semibold text-cream">
                      {order.customer_name ?? 'Guest'}
                      <ChevronRight size={14} className="text-accent" />
                    </Link>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-cream/30">{order.order_code}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-[9px] font-bold uppercase tracking-wider ${
                    order.order_type === 'prebook' ? 'bg-accent/20 text-accent' : 'bg-white/5 text-cream/40'
                  }`}>
                    {order.order_type === 'prebook' ? 'Pre-order' : 'Direct'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 py-3 border-y border-white/5">
                   <div className="space-y-1">
                      <p className="text-[9px] uppercase tracking-widest text-cream/30 flex items-center gap-1.5">
                        <CreditCard size={10} /> Amount
                      </p>
                      <p className="text-sm font-medium text-cream">
                        {order.order_type === 'sale' ? formatPrice(order.total_inr) : 'Demand Signal'}
                      </p>
                   </div>
                   <div className="space-y-1">
                      <p className="text-[9px] uppercase tracking-widest text-cream/30 flex items-center gap-1.5">
                        <Clock size={10} /> Placed
                      </p>
                      <p className="text-xs text-cream/60">{formatDate(order.created_at)}</p>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="space-y-1.5">
                    <p className="text-[9px] uppercase tracking-widest text-cream/30">Order Status</p>
                    <OrderStatusSelect id={order.id} current={order.status} />
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-[9px] uppercase tracking-widest text-cream/30">Payment</p>
                    <PaymentStatusSelect id={order.id} current={order.payment_status} />
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
