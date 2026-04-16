import { redirect } from 'next/navigation';
import Container from '@/components/layout/Container';
import Section from '@/components/layout/Section';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { signOutUser } from '@/app/actions/auth';
import { getAccountDashboardData } from '@/app/actions/account';
import type { Metadata } from 'next';
import OrderTimeline from '@/components/account/OrderTimeline';
import { getStatusLabel, type OrderStatus } from '@/lib/orders/types';

export const metadata: Metadata = {
  title: 'My Account | 7 Sisters Tea & Co.',
  description: 'View your order history and account details.'
};

export default async function AccountPage() {
  const data = await getAccountDashboardData();

  if (!data.ok || !data.user) {
    redirect('/login');
  }

  const { customer, orders, user } = data;
  const whatsappNumber = '916001258891';
  const supportMessage = encodeURIComponent('Hi, I need help with my order.');

  return (
    <Section className="pt-24 pb-20 min-h-screen">
      <Container>
        <div className="space-y-12">
          {/* Dashboard Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tight text-cream">My Account</h1>
              <p className="text-cream/60">Welcome back, {customer?.full_name || user.email}</p>
            </div>
            <form action={signOutUser}>
              <Button variant="secondary" type="submit">Log Out</Button>
            </form>
          </div>

          <div className="grid gap-10 lg:grid-cols-[1fr_300px]">
            {/* Orders List */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-cream/90 flex items-center gap-3">
                Order History
                <span className="text-xs bg-cream/10 px-2 py-1 rounded-full text-cream/40">{orders?.length || 0}</span>
              </h2>

              {!orders || orders.length === 0 ? (
                <div className="lux-surface p-12 text-center space-y-6">
                  <div className="w-16 h-16 bg-cream/5 rounded-full flex items-center justify-center mx-auto text-cream/20">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <div className="space-y-1">
                    <p className="text-lg font-medium text-cream">No orders yet</p>
                    <p className="text-sm text-cream/40">When you place orders, they will appear here.</p>
                  </div>
                  <Link href="/products" className="inline-block">
                    <Button variant="secondary" className="px-8">Explore Collection</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="lux-surface p-6 flex flex-col md:flex-row justify-between gap-6 hover:border-accent/40 transition-colors">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <span className={`px-2 py-0.5 text-[10px] uppercase tracking-wider rounded-md font-bold ${
                            order.type === 'prebook' ? 'bg-accent/20 text-accent' : 'bg-cream/10 text-cream/60'
                          }`}>
                            {order.type === 'prebook' ? 'Pre-order' : 'Order'}
                          </span>
                          <span className="text-sm font-mono text-cream/40">{order.order_code}</span>
                        </div>
                        <div>
                          <p className="text-lg font-medium text-cream">
                            {new Date(order.created_at).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </p>
                          <p className="text-xs text-cream/40 mt-1">{order.product_summary}</p>
                        </div>
                        <div className="flex flex-wrap gap-x-6 gap-y-2 text-[10px] uppercase tracking-widest font-bold">
                           <div className="flex items-center gap-2">
                             <span className="text-cream/30">Payment:</span>
                             <span className={order.payment_status === 'paid' ? 'text-green-400' : 'text-accent'}>
                               {order.payment_status === 'paid' ? 'Received' : order.payment_status}
                             </span>
                           </div>
                           <div className="flex flex-col gap-4 w-full">
                             <div className="flex items-center gap-2">
                               <span className="text-cream/30">Status:</span>
                               <span className="text-cream/80 font-bold uppercase tracking-widest text-[10px]">
                                 {getStatusLabel(order.status, order.type === 'prebook')}
                               </span>
                             </div>
                             {/* Unified Visual Timeline */}
                             <div className="py-2">
                               <OrderTimeline 
                                 status={order.status as OrderStatus} 
                                 isPreOrder={order.type === 'prebook'} 
                                 history={order.history}
                               />
                             </div>
                           </div>
                        </div>
                      </div>
                      <div className="flex flex-col md:items-end justify-between gap-4">
                        <p className="text-2xl font-bold text-cream">
                          {order.total_inr > 0 ? `₹${order.total_inr}` : '--'}
                        </p>
                        <div className="flex gap-2">
                          {order.type === 'order' ? (
                            <Link href={`/order-success?token=${order.public_token}`}>
                              <Button variant="secondary" size="sm">Details</Button>
                            </Link>
                          ) : (
                            <a href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hi, checking status of my pre-order ${order.order_code}`)}`} target="_blank" rel="noopener noreferrer">
                              <Button variant="secondary" size="sm">Inquiry</Button>
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Account Details Sidebar */}
            <div className="space-y-8">
               <div className="lux-surface p-6 space-y-6">
                 <h3 className="text-sm uppercase tracking-[0.2em] text-cream/40 font-bold">Profile Details</h3>
                 <div className="space-y-4">
                   <div className="space-y-1">
                     <p className="text-[10px] uppercase text-cream/30 tracking-widest">Full Name</p>
                     <p className="text-cream/80">{customer?.full_name}</p>
                   </div>
                   <div className="space-y-1">
                     <p className="text-[10px] uppercase text-cream/30 tracking-widest">Email Address</p>
                     <p className="text-cream/80 truncate">{user.email}</p>
                   </div>
                   <div className="space-y-1">
                     <p className="text-[10px] uppercase text-cream/30 tracking-widest">Phone Number</p>
                     <p className="text-cream/80">{customer?.phone || 'Not set'}</p>
                   </div>
                 </div>
                 <Link href="/account/settings" className="block">
                   <Button variant="secondary" className="w-full text-xs">Edit Profile</Button> 
                 </Link>
               </div>

               <div className="p-6 border border-cream/5 rounded-3xl bg-cream/5 space-y-3">
                 <p className="text-xs text-cream/50 italic leading-relaxed">
                   Need help with an order? Contact our support team via WhatsApp for immediate assistance.
                 </p>
                 <a 
                   href={`https://wa.me/${whatsappNumber}?text=${supportMessage}`}
                   target="_blank"
                   rel="noopener noreferrer"
                   className="block"
                 >
                   <Button variant="secondary" className="w-full text-xs">Help & Support</Button>
                 </a>
               </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
