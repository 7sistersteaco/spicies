import { isAdmin } from '@/app/actions/admin';
import Container from '@/components/layout/Container';
import Section from '@/components/layout/Section';
import { createClient } from '@/lib/supabase/server';
import { formatPrice } from '@/lib/products/helpers';

export const metadata = {
  title: 'Admin | Analytics',
  description: 'Business metrics and demand signals.'
};

export const dynamic = 'force-dynamic';

export default async function AdminAnalyticsPage() {
  const isAuthorized = await isAdmin();
  if (!isAuthorized) return null;

  const supabase = createClient();
  const { data: stats } = await supabase
    .from('analytics_summary')
    .select('*')
    .single();

  const { data: recentOrders } = await supabase
    .from('orders')
    .select('*, customers(full_name)')
    .order('created_at', { ascending: false })
    .limit(5);

  return (
    <Section className="pt-12">
      <Container>
        <div className="space-y-8">
           <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.4em] text-cream/50">Admin</p>
            <h1 className="text-3xl font-semibold md:text-4xl">Business Analytics</h1>
            <p className="text-sm text-cream/60">Live demand signals and revenue stats.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Total Revenue" value={formatPrice(stats?.total_revenue_inr ?? 0)} trend="Gross Sales" />
            <StatCard label="Paid Orders" value={stats?.total_paid_orders ?? 0} trend="Confirmed Sales" />
            <StatCard label="Pre-book Demand" value={stats?.total_prebook_requests ?? 0} trend="Leads Captured" />
            <StatCard label="Pending Orders" value={stats?.pending_count ?? 0} trend="Awaiting Action" />
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
             <div className="lg:col-span-2 space-y-4">
                <h2 className="text-lg font-semibold tracking-wide uppercase text-cream/60">Recent Activity</h2>
                <div className="rounded-2xl border border-white/10 bg-charcoal/60 overflow-hidden text-sm">
                   {recentOrders?.map((order) => (
                     <div key={order.id} className="flex items-center justify-between border-b border-white/5 px-6 py-4">
                        <div>
                           <p className="font-medium">{order.customer_name ?? 'Guest'}</p>
                           <p className="text-[10px] text-cream/40 uppercase tracking-widest">{order.order_code}</p>
                        </div>
                        <div className="text-right">
                           <p className={order.order_type === 'prebook' ? 'text-accent' : 'text-cream'}>
                             {order.order_type === 'prebook' ? 'Pre-book' : formatPrice(order.total_inr)}
                           </p>
                           <p className="text-[10px] text-cream/40 uppercase">{order.status}</p>
                        </div>
                     </div>
                   ))}
                </div>
             </div>

             <div className="space-y-4">
                <h2 className="text-lg font-semibold tracking-wide uppercase text-cream/60">Stock Alerts</h2>
                <div className="rounded-2xl border border-white/10 bg-charcoal/60 p-6">
                   <p className="text-sm text-cream/60 italic">Automated stock warnings will appear here based on your inventory thresholds.</p>
                </div>
             </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}

function StatCard({ label, value, trend }: { label: string; value: string | number; trend: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-charcoal/60 p-6 space-y-4">
      <p className="text-[10px] uppercase tracking-[0.3em] text-cream/40">{label}</p>
      <p className="text-3xl font-semibold">{value}</p>
      <p className="text-[10px] uppercase tracking-widest text-accent">{trend}</p>
    </div>
  );
}
