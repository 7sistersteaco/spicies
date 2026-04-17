import { getOrders } from '@/lib/orders/queries';
import UnifiedOrderList from '@/components/admin/UnifiedOrderList';
import Button from '@/components/ui/Button';
import { Search, Filter, ShoppingBag, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Admin | Orders & Pre-books',
  description: 'Manage all sales and reservations in one place.'
};

export const dynamic = 'force-dynamic';

export default async function AdminOrdersPage({
  searchParams
}: {
  searchParams: { q?: string; status?: string; type?: string; page?: string };
}) {
  const query = searchParams.q ?? '';
  const statusFilter = searchParams.status ?? 'all';
  const typeFilter = searchParams.type ?? 'all';
  const page = parseInt(searchParams.page ?? '1');
  const pageSize = 20;

  const { data: orders, count } = await getOrders({
    q: query,
    status: statusFilter === 'all' ? undefined : statusFilter,
    page,
    pageSize
  });

  const totalPages = Math.ceil(count / pageSize);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  const getPageUrl = (p: number) => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (statusFilter !== 'all') params.set('status', statusFilter);
    if (typeFilter !== 'all') params.set('type', typeFilter);
    params.set('page', p.toString());
    return `/admin/orders?${params.toString()}`;
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-cream">Orders & Pre-books</h1>
          <div className="flex items-center gap-2">
            <p className="text-[10px] text-cream/40 uppercase tracking-widest font-medium">Consolidated Audit</p>
            <span className="h-1 w-1 rounded-full bg-white/10" />
            <p className="text-[10px] text-accent font-mono">{count} Total Records</p>
          </div>
        </div>
      </div>

      {/* Filters Card */}
      <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
        <form className="flex flex-col gap-6" method="get">
          <div className="grid gap-6 md:grid-cols-4">
            <div className="space-y-2 md:col-span-2">
              <label className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-cream/40 font-semibold">
                <Search size={12} /> Search
              </label>
              <input
                name="q"
                defaultValue={query}
                placeholder="Order ID or customer name..."
                className="w-full rounded-xl border border-white/5 bg-ink/50 px-4 py-2.5 text-sm text-cream placeholder:text-cream/20 focus:border-accent/40 focus:outline-none transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-cream/40 font-semibold">
                <Filter size={12} /> Status
              </label>
              <div className="relative">
                <select
                  name="status"
                  defaultValue={statusFilter}
                  className="w-full rounded-xl border border-white/5 bg-ink/50 px-3 py-2.5 text-sm text-cream focus:border-accent/40 focus:outline-none appearance-none cursor-pointer"
                >
                  <option value="all">All Statuses</option>
                  <option value="new">New</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-cream/40 font-semibold">
                <ShoppingBag size={12} /> Type
              </label>
              <select
                name="type"
                defaultValue={typeFilter}
                className="w-full rounded-xl border border-white/5 bg-ink/50 px-3 py-2.5 text-sm text-cream focus:border-accent/40 focus:outline-none appearance-none cursor-pointer"
              >
                <option value="all">All Types</option>
                <option value="sale">Direct Sale</option>
                <option value="prebook">Pre-book Lead</option>
              </select>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Button type="submit" className="h-10 px-6 text-[10px] uppercase tracking-widest">Apply Filters</Button>
            <Link
              href="/admin/orders"
              className="text-[10px] uppercase tracking-widest text-cream/30 hover:text-cream transition-colors font-medium"
            >
              Reset Filters
            </Link>
          </div>
        </form>
      </div>

      <div className="space-y-4">
        <UnifiedOrderList orders={orders ?? []} />
        
        {/* Pagination UI */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-2 pt-4 border-t border-white/5">
            <p className="text-[10px] text-cream/30 uppercase tracking-widest font-medium">
              Page {page} of {totalPages}
            </p>
            <div className="flex gap-2">
              <Button 
                href={hasPrevPage ? getPageUrl(page - 1) : undefined}
                disabled={!hasPrevPage} 
                variant="outline" 
                className="h-9 w-9 p-0 border-white/5 flex items-center justify-center"
              >
                <ChevronLeft size={16} />
              </Button>
              
              <Button 
                href={hasNextPage ? getPageUrl(page + 1) : undefined}
                disabled={!hasNextPage} 
                variant="outline" 
                className="h-9 w-9 p-0 border-white/5 flex items-center justify-center"
              >
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
