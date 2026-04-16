-- 7 Sisters Tea Co. - Functional Hardening Migration

-- 1. Enums for type and inventory
do $$
begin
  if not exists (select 1 from pg_type where typname = 'order_type') then
    create type order_type as enum ('sale', 'prebook');
  end if;

  if not exists (select 1 from pg_type where typname = 'inventory_status') then
    create type inventory_status as enum ('in_stock', 'out_of_stock', 'prebook_only');
  end if;
end $$;

-- 2. Orders Upgrades for Unification
alter table public.orders add column if not exists order_type order_type default 'sale';
alter table public.orders add column if not exists fulfillment_method text;
alter table public.orders add column if not exists is_prebook_converted boolean default false;

-- 3. Products Upgrades for Stock Control
alter table public.products add column if not exists inventory_status inventory_status default 'in_stock';
alter table public.products add column if not exists stock_warning_threshold int default 5;

-- 4. Secure DB Inserts (Audit Columns/Indices)
create index if not exists orders_type_idx on public.orders (order_type);
create index if not exists products_inventory_status_idx on public.products (inventory_status);

-- 5. Analytics View (Basic)
create or replace view public.analytics_summary as
select
  count(*) filter (where order_type = 'sale' and status = 'paid') as total_paid_orders,
  coalesce(sum(total_inr) filter (where order_type = 'sale' and status = 'paid'), 0) as total_revenue_inr,
  count(*) filter (where order_type = 'prebook') as total_prebook_requests,
  count(*) filter (where status = 'pending') as pending_count
from public.orders;

-- 6. RLS for Views (Admin only)
alter view public.analytics_summary set (security_invoker = on);

-- 7. Grant access to service role for migrations/admin operations
grant all on public.analytics_summary to service_role;
grant all on public.orders to service_role;
grant all on public.products to service_role;
