import Container from '@/components/layout/Container';
import Section from '@/components/layout/Section';
import AdminLoginForm from '@/components/admin/AdminLoginForm';
import StatusSelect from '@/components/admin/StatusSelect';
import { getPrebookRequests } from '@/lib/prebook/queries';
import { logoutAdmin, isAdmin } from '@/app/actions/admin';
import Button from '@/components/ui/Button';

export const metadata = {
  title: 'Admin | Prebook Requests',
  description: 'Internal dashboard for prebook requests.'
};

const formatDate = (value: string) =>
  new Date(value).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });

type AdminPageProps = {
  searchParams?: { status?: string; fulfillment_method?: string; q?: string };
};

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const isAuthorized = await isAdmin();

  if (!isAuthorized) {
    return (
      <Section className="pt-16">
        <Container>
          <AdminLoginForm />
        </Container>
      </Section>
    );
  }

  const statusFilter = searchParams?.status ?? 'all';
  const fulfillmentFilter = searchParams?.fulfillment_method ?? 'all';
  const query = searchParams?.q ?? '';

  const { data: requests, error } = await getPrebookRequests({
    status: statusFilter,
    fulfillment_method: fulfillmentFilter,
    query
  });

  return (
    <Section className="pt-12">
      <Container>
        <div className="space-y-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.4em] text-cream/50">Admin</p>
              <h1 className="text-3xl font-semibold md:text-4xl">Pre-book Requests</h1>
              <p className="text-sm text-cream/60">Sorted by latest.</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="/admin/branding"
                className="rounded-full border border-accent/60 px-5 py-2 text-xs uppercase tracking-[0.2em] text-accent transition hover:border-accent hover:bg-accent hover:text-ink"
              >
                Branding
              </a>
              <a
                href="/admin/products"
                className="rounded-full border border-accent/60 px-5 py-2 text-xs uppercase tracking-[0.2em] text-accent transition hover:border-accent hover:bg-accent hover:text-ink"
              >
                Products
              </a>
              <a
                href="/admin/orders"
                className="rounded-full border border-accent/60 px-5 py-2 text-xs uppercase tracking-[0.2em] text-accent transition hover:border-accent hover:bg-accent hover:text-ink"
              >
                Orders
              </a>
              <div className="flex items-center gap-2">
                <a
                  href="/admin/export"
                  className="rounded-full border border-white/20 px-5 py-2 text-xs uppercase tracking-[0.2em] text-cream/60 transition hover:border-white/40 hover:text-cream"
                >
                  Export CSV
                </a>
                <form action={logoutAdmin}>
                  <Button variant="secondary" className="h-9 px-4 text-xs font-semibold">Logout</Button>
                </form>
              </div>
            </div>
          </div>

          <form className="grid gap-4 rounded-2xl border border-white/10 bg-charcoal/60 p-5 md:grid-cols-4" method="get">
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs uppercase tracking-[0.3em] text-cream/50">Search</label>
              <input
                name="q"
                defaultValue={query}
                placeholder="Search by name, phone, product"
                className="w-full rounded-lg border border-cream/10 bg-cream/90 px-4 py-3 text-sm text-ink placeholder:text-ink/40 focus:border-accent focus:outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-[0.3em] text-cream/50">Status</label>
              <select
                name="status"
                defaultValue={statusFilter}
                className="w-full rounded-lg border border-cream/10 bg-cream/90 px-3 py-3 text-sm text-ink focus:border-accent focus:outline-none"
              >
                <option value="all">All</option>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="confirmed">Confirmed</option>
                <option value="fulfilled">Fulfilled</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-[0.3em] text-cream/50">Fulfillment</label>
              <select
                name="fulfillment_method"
                defaultValue={fulfillmentFilter}
                className="w-full rounded-lg border border-cream/10 bg-cream/90 px-3 py-3 text-sm text-ink focus:border-accent focus:outline-none"
              >
                <option value="all">All</option>
                <option value="pickup_from_7_sisters_restro">Pickup</option>
                <option value="local_delivery">Local Delivery</option>
                <option value="shipping_inquiry">Shipping Inquiry</option>
              </select>
            </div>
            <div className="md:col-span-4 flex flex-col gap-3 md:flex-row md:items-center">
              <Button type="submit">Apply Filters</Button>
              <a
                href="/admin"
                className="text-xs uppercase tracking-[0.3em] text-cream/60 hover:text-cream"
              >
                Clear
              </a>
            </div>
          </form>

          {error && (
            <div className="rounded-2xl border border-accent/40 bg-ink p-4 text-sm text-cream">
              {error}
            </div>
          )}

          <div className="overflow-hidden rounded-2xl border border-white/10 bg-charcoal/60">
            <div className="hidden grid-cols-7 gap-4 border-b border-white/10 px-6 py-4 text-xs uppercase tracking-[0.2em] text-cream/60 md:grid">
              <span className="col-span-2">Customer</span>
              <span>Product</span>
              <span>Weight</span>
              <span>Qty</span>
              <span>Fulfillment</span>
              <span>Status</span>
            </div>
            <div className="divide-y divide-white/10">
              {requests.length === 0 ? (
                <div className="px-6 py-8 text-sm text-cream/60">
                  {query || statusFilter !== 'all' || fulfillmentFilter !== 'all'
                    ? 'No pre-book requests match the current filters.'
                    : 'No pre-book requests yet.'}
                </div>
              ) : (
                requests.map((request) => (
                  <div
                    key={request.id}
                    className="grid grid-cols-1 gap-4 px-6 py-5 text-sm text-cream/80 md:grid-cols-7"
                  >
                    <div className="md:col-span-2">
                      <p className="text-[10px] uppercase tracking-[0.3em] text-cream/40 md:hidden">Customer</p>
                      <p className="font-semibold text-cream">{request.full_name}</p>
                      <p className="text-xs text-cream/50">{request.phone}</p>
                      <p className="text-[11px] text-cream/40">{formatDate(request.created_at)}</p>
                    </div>
                    <div className="text-sm">
                      <p className="text-[10px] uppercase tracking-[0.3em] text-cream/40 md:hidden">Product</p>
                      {request.product_name}
                    </div>
                    <div className="text-sm">
                      <p className="text-[10px] uppercase tracking-[0.3em] text-cream/40 md:hidden">Weight</p>
                      {request.selected_weight}
                    </div>
                    <div className="text-sm">
                      <p className="text-[10px] uppercase tracking-[0.3em] text-cream/40 md:hidden">Qty</p>
                      {request.quantity}
                    </div>
                    <div className="text-xs uppercase tracking-[0.2em] text-cream/60">
                      <p className="text-[10px] uppercase tracking-[0.3em] text-cream/40 md:hidden">Fulfillment</p>
                      {request.fulfillment_method.replace(/_/g, ' ')}
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.3em] text-cream/40 md:hidden">Status</p>
                      <StatusSelect id={request.id} status={request.status} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
