import StatusSelect from '@/components/admin/StatusSelect';
import { getPrebookRequests } from '@/lib/prebook/queries';
import Button from '@/components/ui/Button';
import { Search, Filter, Download, MessageSquare, ChevronLeft, ChevronRight, User, Package, Calendar } from 'lucide-react';
import Link from 'next/link';
import EmptyState from '@/components/admin/EmptyState';

export const metadata = {
  title: 'Admin | Prebook Requests',
  description: 'Internal dashboard for prebook requests.'
};

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

type AdminPageProps = {
  searchParams?: { 
    status?: string; 
    fulfillment_method?: string; 
    q?: string;
    page?: string;
  };
};

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const statusFilter = searchParams?.status ?? 'all';
  const fulfillmentFilter = searchParams?.fulfillment_method ?? 'all';
  const query = searchParams?.q ?? '';
  const page = parseInt(searchParams?.page ?? '1');
  const pageSize = 20;

  const { data: requests, error, totalCount = 0 } = await getPrebookRequests({
    status: statusFilter,
    fulfillment_method: fulfillmentFilter,
    query,
    page,
    pageSize
  });

  const totalPages = Math.ceil(totalCount / pageSize);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  const getPageUrl = (p: number) => {
    const params = new URLSearchParams();
    if (statusFilter !== 'all') params.set('status', statusFilter);
    if (fulfillmentFilter !== 'all') params.set('fulfillment_method', fulfillmentFilter);
    if (query) params.set('q', query);
    params.set('page', p.toString());
    return `/admin?${params.toString()}`;
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-cream">Pre-book Requests</h1>
          <div className="flex items-center gap-2">
            <p className="text-[10px] text-cream/40 uppercase tracking-widest font-medium">Demand Signals</p>
            <span className="h-1 w-1 rounded-full bg-white/10" />
            <p className="text-[10px] text-accent font-mono">{totalCount} Total Inquiries</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <a
            href="/admin/export"
            className="flex items-center gap-2 rounded-xl border border-white/5 bg-white/5 px-4 py-2.5 text-xs font-medium text-cream/70 transition hover:bg-white/10 hover:text-cream"
          >
            <Download size={14} />
            Export CSV
          </a>
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
                placeholder="Name, phone, or product..."
                className="w-full rounded-xl border border-white/5 bg-ink/50 px-4 py-2.5 text-sm text-cream placeholder:text-cream/20 focus:border-accent/40 focus:outline-none transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-cream/40 font-semibold">
                <Filter size={12} /> Status
              </label>
              <select
                name="status"
                defaultValue={statusFilter}
                className="w-full rounded-xl border border-white/5 bg-ink/50 px-3 py-2.5 text-sm text-cream focus:border-accent/40 focus:outline-none appearance-none cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="confirmed">Confirmed</option>
                <option value="fulfilled">Fulfilled</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-cream/40 font-semibold">
                <Package size={12} /> Fulfillment
              </label>
              <select
                name="fulfillment_method"
                defaultValue={fulfillmentFilter}
                className="w-full rounded-xl border border-white/5 bg-ink/50 px-3 py-2.5 text-sm text-cream focus:border-accent/40 focus:outline-none appearance-none cursor-pointer"
              >
                <option value="all">All Methods</option>
                <option value="pickup_from_7_sisters_restro">Pickup</option>
                <option value="local_delivery">Local Delivery</option>
                <option value="shipping_inquiry">Shipping Inquiry</option>
              </select>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Button type="submit" className="h-10 px-6 text-[10px] uppercase tracking-widest">Apply Filters</Button>
            <Link
              href="/admin"
              className="text-[10px] uppercase tracking-widest text-cream/30 hover:text-cream transition-colors font-medium"
            >
              Reset Filters
            </Link>
          </div>
        </form>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-xs text-red-400">
          {error}
        </div>
      ) : requests.length === 0 ? (
        <EmptyState 
           icon={MessageSquare}
           title="No Requests Found"
           description={query || statusFilter !== 'all' || fulfillmentFilter !== 'all' 
             ? "No pre-book requests match your current filters." 
             : "You haven't received any pre-book inquiries yet."}
           actionLabel={query || statusFilter !== 'all' || fulfillmentFilter !== 'all' ? "Clear Filters" : undefined}
           onAction={query || statusFilter !== 'all' || fulfillmentFilter !== 'all' ? () => {} : undefined}
        />
      ) : (
        <div className="space-y-6">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02]">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02] text-[10px] uppercase tracking-widest text-cream/40 font-semibold">
                  <th className="px-6 py-4 font-semibold">Customer</th>
                  <th className="px-6 py-4 font-semibold">Inquiry Details</th>
                  <th className="px-6 py-4 font-semibold">Fulfillment</th>
                  <th className="px-6 py-4 text-right font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {requests.map((request) => (
                  <tr key={request.id} className="group transition-colors hover:bg-white/[0.01]">
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-semibold text-cream text-sm">{request.full_name}</span>
                        <span className="text-[11px] text-cream/50">{request.phone}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-1">
                        <p className="text-sm text-cream/80">{request.product_name}</p>
                        <p className="text-[10px] uppercase tracking-widest text-cream/40">
                          {request.quantity} × {request.selected_weight}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-1.5">
                        <span className="inline-block self-start rounded-md bg-white/5 px-2 py-1 text-[9px] font-bold uppercase tracking-widest text-cream/50 border border-white/5">
                          {request.fulfillment_method.replace(/_/g, ' ')}
                        </span>
                        <p className="text-[10px] text-cream/20 flex items-center gap-1.5 font-mono">
                          <Calendar size={10} /> {formatDate(request.created_at)}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex justify-end">
                        <StatusSelect id={request.id} status={request.status} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Stacks */}
          <div className="grid gap-4 md:hidden">
            {requests.map((request) => (
              <div key={request.id} className="rounded-2xl border border-white/5 bg-white/[0.02] p-5 space-y-4">
                <div className="flex items-start justify-between">
                   <div className="space-y-1">
                      <h3 className="font-semibold text-cream">{request.full_name}</h3>
                      <p className="text-xs text-cream/50">{request.phone}</p>
                   </div>
                   <span className="text-[10px] text-cream/20 font-mono">
                      {formatDate(request.created_at).split(',')[0]}
                   </span>
                </div>

                <div className="rounded-xl bg-white/5 p-4 space-y-3">
                   <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-accent/10 text-accent">
                         <Package size={16} />
                      </div>
                      <div>
                         <p className="text-sm font-medium text-cream">{request.product_name}</p>
                         <p className="text-[10px] uppercase tracking-widest text-cream/40">
                            {request.quantity} × {request.selected_weight}
                         </p>
                      </div>
                   </div>
                   <div className="pt-2 border-t border-white/5">
                      <p className="text-[9px] uppercase tracking-[0.2em] text-cream/30 mb-1">Fulfillment</p>
                      <p className="text-[10px] text-cream/60">{request.fulfillment_method.replace(/_/g, ' ')}</p>
                   </div>
                </div>

                <div className="pt-2">
                   <StatusSelect id={request.id} status={request.status} />
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
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
      )}
    </div>
  );
}
