import { getCustomers } from '@/lib/customers/queries';
import Button from '@/components/ui/Button';
import { Search, Users, ChevronLeft, ChevronRight, Mail, Phone, Calendar } from 'lucide-react';
import Link from 'next/link';
import EmptyState from '@/components/admin/EmptyState';

export const metadata = {
  title: 'Admin | Customers',
  description: 'Manage your customer base and contact information.'
};

export const dynamic = 'force-dynamic';

const formatDate = (date: string) => new Date(date).toLocaleDateString('en-IN', {
  day: 'numeric',
  month: 'short',
  year: 'numeric'
});

export default async function AdminCustomersPage({
  searchParams
}: {
  searchParams: { q?: string; page?: string };
}) {
  const query = searchParams.q ?? '';
  const page = parseInt(searchParams.page ?? '1');
  const pageSize = 20;

  const { data: customers, count } = await getCustomers({
    q: query,
    page,
    pageSize
  });

  const totalPages = Math.ceil(count / pageSize);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  const getPageUrl = (p: number) => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    params.set('page', p.toString());
    return `/admin/customers?${params.toString()}`;
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-cream">Customer Relations</h1>
          <div className="flex items-center gap-2">
            <p className="text-[10px] text-cream/40 uppercase tracking-widest font-medium">Verified Profiles</p>
            <span className="h-1 w-1 rounded-full bg-white/10" />
            <p className="text-[10px] text-accent font-mono">{count} Total Records</p>
          </div>
        </div>
      </div>

      {/* Search Card */}
      <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
        <form className="flex flex-col gap-6" method="get">
          <div className="max-w-md space-y-2">
            <label className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-cream/40 font-semibold">
              <Search size={12} /> Search
            </label>
            <div className="flex gap-2">
              <input
                name="q"
                defaultValue={query}
                placeholder="Name, email, or phone..."
                className="flex-1 rounded-xl border border-white/5 bg-ink/50 px-4 py-2.5 text-sm text-cream placeholder:text-cream/20 focus:border-accent/40 focus:outline-none transition-colors"
              />
              <Button type="submit" className="h-11 px-6 text-[10px] uppercase tracking-widest">Search</Button>
            </div>
          </div>
        </form>
      </div>

      <div className="space-y-4">
        {customers.length === 0 ? (
          <EmptyState 
            icon={Users}
            title="No Customers Found"
            description={query ? `No matching records for "${query}"` : "Your customer list is currently empty."}
            actionLabel={query ? "Reset Search" : undefined}
            onAction={query ? () => {} : undefined}
          />
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02]">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/5 bg-white/[0.02] text-[10px] uppercase tracking-widest text-cream/40 font-semibold">
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Contact</th>
                    <th className="px-6 py-4 text-right">Registered</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 border-b border-white/5">
                  {customers.map((customer) => (
                    <tr key={customer.id} className="group transition-colors hover:bg-white/[0.01]">
                      <td className="px-6 py-5">
                        <div className="flex flex-col">
                          <span className="font-semibold text-cream text-sm">{customer.full_name || 'Anonymous'}</span>
                          <span className="text-[10px] text-cream/30 font-mono mt-0.5">{customer.id.slice(0, 8)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2 text-xs text-cream/60">
                            <Mail size={12} className="text-cream/20" />
                            {customer.email}
                          </div>
                          {customer.phone && (
                            <div className="flex items-center gap-2 text-xs text-cream/60">
                              <Phone size={12} className="text-cream/20" />
                              {customer.phone}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <span className="text-xs text-cream/40 font-medium">{formatDate(customer.created_at)}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="grid gap-4 md:hidden">
              {customers.map((customer) => (
                <div key={customer.id} className="rounded-2xl border border-white/5 bg-white/[0.02] p-5 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-cream">{customer.full_name || 'Anonymous'}</h3>
                      <p className="text-[10px] uppercase tracking-widest text-cream/30 font-mono mt-0.5">ID: {customer.id.slice(0, 8)}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 pt-2 border-t border-white/5">
                    <div className="flex items-center gap-3 text-xs text-cream/60">
                      <Mail size={14} className="text-accent/40" />
                      {customer.email}
                    </div>
                    {customer.phone && (
                      <div className="flex items-center gap-3 text-xs text-cream/60">
                        <Phone size={14} className="text-accent/40" />
                        {customer.phone}
                      </div>
                    )}
                    <div className="flex items-center gap-3 text-xs text-cream/40">
                      <Calendar size={14} className="text-cream/10" />
                      Joined {formatDate(customer.created_at)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-2 pt-4">
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
          </>
        )}
      </div>
    </div>
  );
}
