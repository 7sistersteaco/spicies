import { isAdmin } from '@/app/actions/admin';
import { redirect, notFound } from 'next/navigation';
import OrderStatusSelect from '@/components/admin/OrderStatusSelect';
import PaymentStatusSelect from '@/components/admin/PaymentStatusSelect';
import OrderNotificationButton from '@/components/admin/OrderNotificationButton';
import { getOrderById, getNotificationStatus } from '@/lib/orders/queries';
import { formatPrice } from '@/lib/products/helpers';
import { generateInvoiceAction, quickConfirmOrder, quickMarkAsPaid } from '@/app/actions/orders';
import AdminActionButton from '@/components/admin/AdminActionButton';
import AdminNoteForm from '@/components/admin/AdminNoteForm';
import AdminOrderDangerZone from '@/components/admin/AdminOrderDangerZone';
import Link from 'next/link';
import { ChevronLeft, Info, Receipt, User, Truck, CreditCard } from 'lucide-react';

export const metadata = {
  title: 'Admin | Order Details',
  description: 'Detailed transaction audit and management.'
};

export default async function AdminOrderDetailPage({ params }: { params: { id: string } }) {
  const isAuthorized = await isAdmin();
  if (!isAuthorized) redirect('/login');

  const data = await getOrderById(params.id);
  if (!data) notFound();

  const { order, items, address, payment, invoice, notes } = data;
  const isPrebook = order.type === 'prebook';

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <Link 
            href="/admin/orders" 
            className="group inline-flex items-center gap-2 text-[10px] uppercase tracking-widest text-cream/30 hover:text-accent transition-colors mb-2 font-semibold"
          >
            <ChevronLeft size={12} className="transition-transform group-hover:-translate-x-0.5" />
            Back to Orders
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight text-cream">{order.order_code ?? order.id}</h1>
            <span className={`px-2 py-0.5 rounded text-[8px] uppercase tracking-widest font-bold border ${
              isPrebook ? 'bg-accent/10 text-accent border-accent/20' : 'bg-white/5 text-cream/30 border-white/5'
            }`}>
              {isPrebook ? 'Pre-order' : 'Direct Order'}
            </span>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <OrderNotificationButton 
            orderId={order.id}
            customerName={order.customer_name ?? 'Customer'}
            customerPhone={order.customer_phone ?? ''}
            productName={items[0]?.product_name ?? 'Tea Order'}
            status={order.status ?? 'new'}
            isInitiated={(await getNotificationStatus(order.id)).some(n => n.status === order.status)}
          />
          <div className="h-10 w-px bg-white/5 hidden md:block" />
          <OrderStatusSelect id={order.id} current={order.status ?? 'pending'} />
          <PaymentStatusSelect id={order.id} current={order.payment_status ?? 'pending'} />
        </div>
      </div>

      {isPrebook && (
        <div className="rounded-2xl border border-accent/20 bg-accent/[0.03] p-6">
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex gap-4 items-center">
                <div className="p-3 bg-accent/10 rounded-xl text-accent">
                  <Receipt size={24} />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-accent uppercase tracking-widest">Reservation Fulfillment</p>
                  <p className="text-[11px] text-cream/50 leading-relaxed italic">Lead management: Review inventory before confirming reservation.</p>
                </div>
              </div>
              <div className="flex gap-2">
                {order.status !== 'confirmed' && (
                  <AdminActionButton 
                    action={quickConfirmOrder} 
                    formData={{ id: order.id }}
                    className="h-10 px-6 text-[10px] uppercase tracking-widest"
                  >
                    Confirm Reservation
                  </AdminActionButton>
                )}
                {order.payment_status !== 'paid' && (
                  <AdminActionButton 
                    action={quickMarkAsPaid} 
                    formData={{ id: order.id }}
                    variant="secondary"
                    className="h-10 px-6 text-[10px] uppercase tracking-widest"
                  >
                    Mark as Paid
                  </AdminActionButton>
                )}
              </div>
           </div>
        </div>
      )}

      {/* Grid: Details */}
      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8 space-y-8">
          {/* Items Table */}
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden">
            <div className="px-6 py-4 border-b border-white/5 bg-white/[0.01]">
              <h3 className="text-[10px] font-semibold uppercase tracking-widest text-cream/40">Itemized Breakdown</h3>
            </div>
            <div className="divide-y divide-white/5">
              {items.map((item, index) => (
                <div key={index} className="px-6 py-5 flex items-center justify-between text-sm">
                  <div className="space-y-1">
                    <p className="font-medium text-cream">{item.product_name}</p>
                    <p className="text-[10px] text-cream/30 uppercase tracking-widest">{item.variant_label || 'Standard'}</p>
                  </div>
                  <div className="text-right space-y-1 font-mono">
                    <p className="text-cream/80">{item.qty} × {formatPrice(item.unit_price_inr ?? 0)}</p>
                    <p className="text-xs font-medium text-accent">{formatPrice(item.line_total_inr ?? 0)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-6 py-5 bg-white/[0.04] flex items-center justify-between font-semibold">
              <span className="text-[10px] uppercase tracking-[0.2em] text-cream/40 px-2.5 py-1 rounded-lg border border-white/5">Order Total</span>
              <span className="text-lg text-cream tracking-tight underline decoration-accent/40 underline-offset-8 decoration-2">{formatPrice(order.total_inr ?? 0)}</span>
            </div>
          </div>

          {/* Admin Notes */}
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
               <h3 className="text-[10px] font-semibold uppercase tracking-widest text-cream/40">Audit Notes</h3>
            </div>
            <AdminNoteForm orderId={order.id} />
            <div className="space-y-4">
              {notes.length === 0 ? (
                <div className="p-12 text-center text-[10px] uppercase tracking-widest text-cream/10 italic">Zero internal logs found.</div>
              ) : (
                notes.map((note) => (
                  <div key={note.id} className="rounded-xl border border-white/5 bg-white/[0.01] p-4 group transition-colors hover:bg-white/[0.02]">
                    <p className="text-xs leading-relaxed text-cream/70">{note.note}</p>
                    <p className="mt-3 text-[9px] uppercase tracking-tighter text-cream/20 font-mono">
                      {new Date(note.created_at).toLocaleString('en-IN')}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Info Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          {/* Customer Card */}
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/5 rounded-lg text-cream/40">
                <User size={16} />
              </div>
              <h3 className="text-[10px] font-semibold text-cream uppercase tracking-widest leading-none">Customer Information</h3>
            </div>
            <div className="space-y-4">
              <div className="space-y-1">
                <p className="text-sm font-semibold text-cream">{order.customer_name}</p>
                <p className="text-xs text-cream/50">{order.customer_email}</p>
                <p className="text-xs text-cream/50">{order.customer_phone}</p>
              </div>
              {order.notes && (
                <div className="p-3 bg-white/5 rounded-xl border border-white/5 space-y-1">
                   <p className="text-[9px] font-semibold text-accent uppercase">Customer Note</p>
                   <p className="text-[11px] text-cream/60 leading-relaxed italic">“{order.notes}”</p>
                </div>
              )}
            </div>
          </div>

          {/* Logisitcs Card */}
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/5 rounded-lg text-cream/40">
                <Truck size={16} />
              </div>
              <h3 className="text-[10px] font-semibold text-cream uppercase tracking-widest leading-none">Logistics & Shipping</h3>
            </div>
            {address ? (
              <div className="text-xs text-cream/60 space-y-1.5 leading-relaxed">
                <p className="font-semibold text-cream">{address.full_name}</p>
                <p>{address.line1}</p>
                {address.line2 && <p>{address.line2}</p>}
                {address.landmark && <p className="text-cream/40">Landmark: {address.landmark}</p>}
                <p>{address.city}, {address.state} — {address.pincode}</p>
              </div>
            ) : (
              <div className="text-xs text-cream/30 italic">No delivery address provided.</div>
            )}
          </div>

          {/* Invoice Card */}
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/5 rounded-lg text-cream/40">
                <CreditCard size={16} />
              </div>
              <h3 className="text-[10px] font-semibold text-cream uppercase tracking-widest leading-none">Payment & Billing</h3>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                   <p className="text-[9px] uppercase text-cream/30 font-semibold tracking-tighter">Gateway</p>
                   <p className="text-xs text-cream/80">{payment?.provider || 'Razorpay'}</p>
                </div>
                <div className="space-y-1">
                   <p className="text-[9px] uppercase text-cream/30 font-semibold tracking-tighter">Status</p>
                   <p className="text-xs text-cream/80 capitalize">{order.payment_status || 'Pending'}</p>
                </div>
              </div>

              {invoice?.id ? (
                <div className="pt-2">
                  <a
                    href={`/api/invoices/${invoice.id}/download`}
                    className="flex items-center justify-center h-10 w-full rounded-xl border border-accent/20 bg-accent/5 text-[10px] uppercase tracking-widest text-accent font-semibold transition hover:bg-accent hover:text-ink hover:border-accent"
                  >
                    View PDF Invoice
                  </a>
                </div>
              ) : (
                <div className="pt-2">
                  <AdminActionButton 
                    action={generateInvoiceAction} 
                    formData={{ id: order.id }}
                    variant="secondary"
                    className="h-10 w-full text-[10px] uppercase tracking-widest font-semibold"
                  >
                    Generate Invoice
                  </AdminActionButton>
                </div>
              )}
            </div>
          </div>

          {/* Record Deletion */}
          <AdminOrderDangerZone orderId={order.id} orderCode={order.order_code || order.id.slice(0, 8)} />
        </div>
      </div>
    </div>
  );
}
