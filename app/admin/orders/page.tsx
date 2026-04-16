import { isAdmin } from '@/app/actions/admin';
import Container from '@/components/layout/Container';
import Section from '@/components/layout/Section';
import { createClient } from '@/lib/supabase/server';
import UnifiedOrderList from '@/components/admin/UnifiedOrderList';

export const metadata = {
  title: 'Admin | Orders & Pre-books',
  description: 'Manage all sales and reservations in one place.'
};

export const dynamic = 'force-dynamic';

export default async function AdminOrdersPage({
  searchParams
}: {
  searchParams: { q?: string; status?: string; type?: string };
}) {
  const isAuthorized = await isAdmin();
  if (!isAuthorized) return null; // Handled by layout

  const query = searchParams.q ?? '';
  const statusFilter = searchParams.status ?? 'all';
  const typeFilter = searchParams.type ?? 'all';

  const supabase = createClient();
  let request = supabase
    .from('orders')
    .select('*, customers(full_name, phone, email), addresses(*)')
    .order('created_at', { ascending: false });

  if (statusFilter !== 'all') {
    request = request.eq('status', statusFilter);
  }
  if (typeFilter !== 'all') {
    request = request.eq('order_type', typeFilter);
  }
  if (query) {
    request = request.or(`customer_name.ilike.%${query}%,order_code.ilike.%${query}%`);
  }

  const { data: orders, error } = await request;

  return (
    <Section className="pt-12">
      <Container>
        <div className="space-y-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.4em] text-cream/50">Admin</p>
              <h1 className="text-3xl font-semibold md:text-4xl">Orders & Pre-books</h1>
              <p className="text-sm text-cream/60">Unified management system.</p>
            </div>
            <div className="flex items-center gap-3">
              <a href="/admin/analytics" className="text-xs uppercase tracking-[0.2em] text-accent hover:underline">
                View Analytics
              </a>
            </div>
          </div>

          <form className="grid gap-4 rounded-2xl border border-white/10 bg-charcoal/60 p-5 md:grid-cols-4" method="get">
            <div className="md:col-span-2 space-y-2">
               <label className="text-xs uppercase tracking-[0.3em] text-cream/50">Search</label>
               <input
                name="q"
                defaultValue={query}
                placeholder="Search name or ID..."
                className="w-full rounded-lg border border-cream/10 bg-cream/90 px-4 py-3 text-sm text-ink focus:outline-none"
              />
            </div>
            <div className="space-y-2">
               <label className="text-xs uppercase tracking-[0.3em] text-cream/50">Status</label>
               <select name="status" defaultValue={statusFilter} className="w-full rounded-lg border border-cream/10 bg-cream/90 px-3 py-3 text-sm text-ink">
                 <option value="all">All Status</option>
                 <option value="pending">Pending</option>
                 <option value="paid">Paid</option>
                 <option value="shipped">Shipped</option>
                 <option value="cancelled">Cancelled</option>
               </select>
            </div>
            <div className="space-y-2">
               <label className="text-xs uppercase tracking-[0.3em] text-cream/50">Type</label>
               <select name="type" defaultValue={typeFilter} className="w-full rounded-lg border border-cream/10 bg-cream/90 px-3 py-3 text-sm text-ink">
                 <option value="all">All Types</option>
                 <option value="sale">Direct Sale</option>
                 <option value="prebook">Pre-book Lead</option>
               </select>
            </div>
            <button type="submit" className="md:col-span-4 bg-accent text-ink px-6 py-3 rounded-lg text-sm font-semibold uppercase tracking-wider">
              Apply Filters
            </button>
          </form>

          <UnifiedOrderList orders={orders ?? []} />
        </div>
      </Container>
    </Section>
  );
}
