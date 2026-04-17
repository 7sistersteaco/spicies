import { createClient } from '@/lib/supabase/server';
import { formatPrice } from '@/lib/products/helpers';
import { TrendingUp, ShoppingBag, MessageSquare, Clock, AlertTriangle } from 'lucide-react';

export const metadata = {
  title: 'Admin | Analytics',
  description: 'Business metrics and demand signals.'
};

export const dynamic = 'force-dynamic';

export default async function AdminAnalyticsPage() {
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
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-700">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-cream">Business Analytics</h1>
          <p className="text-xs text-cream/50">Live demand signals and revenue performance.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          label="Total Revenue" 
          value={formatPrice(stats?.total_revenue_inr ?? 0)} 
          trend="Gross Sales" 
          icon={TrendingUp}
          color="text-accent"
        />
        <StatCard 
          label="Paid Orders" 
          value={stats?.total_paid_orders ?? 0} 
          trend="Confirmed" 
          icon={ShoppingBag}
          color="text-green-400"
        />
        <StatCard 
          label="Pre-book Leads" 
          value={stats?.total_prebook_requests ?? 0} 
          trend="Demand Signals" 
          icon={MessageSquare}
          color="text-accent"
        />
        <StatCard 
          label="Pending Action" 
          value={stats?.pending_count ?? 0} 
          trend="Awaiting Review" 
          icon={Clock}
          color="text-cream/40"
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Recent Activity */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-cream/40">Recent Activity</h2>
          </div>
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden">
            <div className="divide-y divide-white/5">
              {recentOrders?.map((order) => (
                <div key={order.id} className="flex items-center justify-between px-6 py-5 transition-colors hover:bg-white/[0.01]">
                  <div className="flex flex-col gap-1">
                    <p className="font-semibold text-cream text-sm">{order.customer_name ?? 'Guest'}</p>
                    <p className="text-[10px] text-cream/30 uppercase tracking-widest font-mono">{order.order_code}</p>
                  </div>
                  <div className="text-right flex flex-col gap-1">
                    <p className={`text-sm font-medium ${order.order_type === 'prebook' ? 'text-accent' : 'text-cream'}`}>
                      {order.order_type === 'prebook' ? 'Pre-book Lead' : formatPrice(order.total_inr)}
                    </p>
                    <p className="text-[10px] text-cream/40 uppercase tracking-tighter">{order.status}</p>
                  </div>
                </div>
              ))}
            </div>
            {(!recentOrders || recentOrders.length === 0) && (
              <div className="px-6 py-12 text-center text-xs text-cream/20 italic">No recent activity detected.</div>
            )}
          </div>
        </div>

        {/* Operational Alerts */}
        <div className="lg:col-span-4 space-y-6">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-cream/40">Inventory & Alerts</h2>
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-8">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-3 rounded-full bg-white/5 border border-white/5 text-cream/20">
                <AlertTriangle size={24} />
              </div>
              <div className="space-y-1">
                 <p className="text-xs font-medium text-cream/60">No Active Alerts</p>
                 <p className="text-[11px] leading-relaxed text-cream/30">System monitoring is healthy. No stock warnings at this time.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, trend, icon: Icon, color }: { label: string; value: string | number; trend: string; icon: any; color: string }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 space-y-4 transition-all hover:bg-white/[0.04]">
      <div className="flex items-center justify-between">
        <p className="text-[10px] uppercase tracking-widest font-semibold text-cream/30">{label}</p>
        <div className={`p-2 rounded-lg bg-white/5 border border-white/5 ${color}`}>
          <Icon size={16} />
        </div>
      </div>
      <div className="space-y-1">
        <p className="text-3xl font-semibold tracking-tight text-cream">{value}</p>
        <p className="text-[10px] uppercase tracking-widest text-accent font-medium">{trend}</p>
      </div>
    </div>
  );
}
