import { cookies } from 'next/headers';
import Container from '@/components/layout/Container';
import Section from '@/components/layout/Section';
import AdminLoginForm from '@/components/admin/AdminLoginForm';
import Button from '@/components/ui/Button';
import TextArea from '@/components/ui/TextArea';
import OrderStatusSelect from '@/components/admin/OrderStatusSelect';
import PaymentStatusSelect from '@/components/admin/PaymentStatusSelect';
import OrderNotificationButton from '@/components/admin/OrderNotificationButton';
import { getOrderById, getNotificationStatus } from '@/lib/orders/queries';
import { formatPrice } from '@/lib/products/helpers';
import { addOrderNote, generateInvoiceAction, quickConfirmOrder, quickMarkAsPaid } from '@/app/actions/orders';
import AdminActionButton from '@/components/admin/AdminActionButton';
import AdminNoteForm from '@/components/admin/AdminNoteForm';

export const metadata = {
  title: 'Admin | Order Details',
  description: 'Order detail view.'
};

const ADMIN_COOKIE = 'admin_session';

export default async function AdminOrderDetailPage({ params }: { params: { id: string } }) {
  const isAdmin = cookies().get(ADMIN_COOKIE)?.value === '1';

  if (!isAdmin) {
    return (
      <Section className="pt-16">
        <Container>
          <AdminLoginForm />
        </Container>
      </Section>
    );
  }

  const data = await getOrderById(params.id);
  if (!data) {
    return (
      <Section className="pt-16">
        <Container>
          <div className="lux-surface p-6">Order not found.</div>
        </Container>
      </Section>
    );
  }

  const { order, items, address, payment, invoice, notes } = data;
  const isPrebook = order.type === 'prebook';

  return (
    <Section className="pt-12">
      <Container>
        <div className="space-y-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <a href="/admin/orders" className="text-xs uppercase tracking-[0.3em] text-cream/50">
                Back to Orders
              </a>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-semibold md:text-4xl">{order.order_code ?? order.id}</h1>
                <span className={`px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-bold ${
                  isPrebook ? 'bg-accent/20 text-accent' : 'bg-cream/10 text-cream/40'
                }`}>
                  {isPrebook ? 'Pre-order' : 'Direct Order'}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <OrderNotificationButton 
                orderId={order.id}
                customerName={order.customer_name ?? 'Customer'}
                customerPhone={order.customer_phone ?? ''}
                productName={items[0]?.product_name ?? 'Tea Order'}
                status={order.status ?? 'new'}
                isInitiated={(await getNotificationStatus(order.id)).some(n => n.status === order.status)}
              />
              <OrderStatusSelect id={order.id} current={order.status ?? 'pending'} />
              <PaymentStatusSelect id={order.id} current={order.payment_status ?? 'pending'} />
            </div>
          </div>

          {isPrebook && (
            <div className="lux-surface p-6 bg-accent/[0.03] border-accent/20">
               <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-xs uppercase tracking-[0.3em] text-accent/60 font-bold">Quick Actions</p>
                    <p className="text-sm text-cream/70 italic">Convert this pre-order lead into a confirmed sale.</p>
                  </div>
                  <div className="flex gap-3">
                    {order.status !== 'confirmed' && (
                      <AdminActionButton 
                        action={quickConfirmOrder} 
                        formData={{ id: order.id }}
                        size="sm"
                      >
                        Confirm Reservation
                      </AdminActionButton>
                    )}
                    {order.payment_status !== 'paid' && (
                      <AdminActionButton 
                        action={quickMarkAsPaid} 
                        formData={{ id: order.id }}
                        variant="secondary" 
                        size="sm"
                      >
                        Mark as Paid
                      </AdminActionButton>
                    )}
                  </div>
               </div>
            </div>
          )}

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lux-surface p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-cream/50">Customer</p>
              <p className="mt-3 text-sm text-cream">{order.customer_name}</p>
              <p className="text-sm text-cream/70">{order.customer_email}</p>
              <p className="text-sm text-cream/70">{order.customer_phone}</p>
            </div>
            <div className="lux-surface p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-cream/50">Shipping</p>
              {address ? (
                <div className="mt-3 text-sm text-cream/70 space-y-1">
                  <p>{address.line1}</p>
                  {address.line2 && <p>{address.line2}</p>}
                  {address.landmark && <p>{address.landmark}</p>}
                  <p>
                    {address.city}, {address.state} {address.pincode}
                  </p>
                </div>
              ) : (
                <p className="mt-3 text-sm text-cream/60">No address recorded.</p>
              )}
            </div>
            <div className="lux-surface p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-cream/50">Payment</p>
              <p className="mt-3 text-sm text-cream/70">{payment?.provider ?? 'Razorpay'}</p>
              <p className="text-sm text-cream/70">Status: {payment?.status ?? 'pending'}</p>
              {payment?.provider_payment_id && (
                <p className="text-sm text-cream/70">Payment ID: {payment.provider_payment_id}</p>
              )}
            </div>
          </div>

          {order.notes ? (
            <div className="lux-surface p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-cream/50">Customer Notes</p>
              <p className="mt-3 text-sm text-cream/70">{order.notes}</p>
            </div>
          ) : null}

          <div className="lux-surface p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-cream/50">Items</p>
            <div className="mt-4 space-y-3 text-sm text-cream/70">
              {items.map((item, index) => (
                <div key={`${item.product_name}-${index}`} className="flex justify-between">
                  <span>
                    {item.product_name} {item.variant_label ? `(${item.variant_label})` : ''} x{item.qty}
                  </span>
                  <span>{formatPrice(item.line_total_inr ?? 0)}</span>
                </div>
              ))}
              <div className="lux-divider" />
              <div className="flex justify-between text-base text-cream">
                <span>Total</span>
                <span>{formatPrice(order.total_inr ?? 0)}</span>
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="lux-surface p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-cream/50">Admin Notes</p>
              <AdminNoteForm orderId={order.id} />
              <div className="mt-6 space-y-3 text-sm text-cream/70">
                {notes.length === 0 ? (
                  <p>No notes yet.</p>
                ) : (
                  notes.map((note) => (
                    <div key={note.id} className="rounded-2xl border border-white/10 bg-charcoal/60 p-4">
                      <p>{note.note}</p>
                      <p className="mt-2 text-xs text-cream/40">
                        {new Date(note.created_at).toLocaleString('en-IN')}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="lux-surface p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-cream/50">Invoice</p>
              <p className="mt-3 text-sm text-cream/70">
                Status: {invoice?.status ?? 'not generated'}
              </p>
              {invoice?.id ? (
                <a
                  href={`/api/invoices/${invoice.id}/download`}
                  className="mt-4 inline-block rounded-full border border-accent/60 px-4 py-2 text-xs uppercase tracking-[0.2em] text-accent transition hover:border-accent hover:bg-accent hover:text-ink"
                >
                  Download Invoice
                </a>
              ) : (
                <AdminActionButton 
                  action={generateInvoiceAction} 
                  formData={{ id: order.id }}
                  variant="secondary"
                  className="mt-4"
                >
                  Generate Invoice
                </AdminActionButton>
              )}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
