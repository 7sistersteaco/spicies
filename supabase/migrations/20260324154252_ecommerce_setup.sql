-- 7 Sisters Tea Co. - Ecommerce upgrade (free-tier optimized)

create extension if not exists "pgcrypto";

-- Enums
do $$
begin
  if not exists (select 1 from pg_type where typname = 'order_status') then
    create type order_status as enum (
      'pending',
      'payment_pending',
      'paid',
      'packed',
      'shipped',
      'delivered',
      'cancelled',
      'refunded'
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'payment_status') then
    create type payment_status as enum ('pending', 'paid', 'failed', 'refunded');
  end if;

  if not exists (select 1 from pg_type where typname = 'invoice_status') then
    create type invoice_status as enum ('issued', 'void');
  end if;
end $$;

-- Sequencers for human-friendly codes
create sequence if not exists public.order_code_seq;
create sequence if not exists public.invoice_code_seq;

create or replace function public.generate_order_code()
returns text
language sql
as $$
  select to_char(now(), 'YYYYMMDD') || '-' || lpad(nextval('public.order_code_seq')::text, 6, '0');
$$;

create or replace function public.generate_invoice_code()
returns text
language sql
as $$
  select to_char(now(), 'YYYYMMDD') || '-' || lpad(nextval('public.invoice_code_seq')::text, 6, '0');
$$;

-- Addresses
create table if not exists public.addresses (
  id uuid primary key default gen_random_uuid(),
  full_name text,
  phone text,
  email text,
  line1 text not null,
  line2 text,
  landmark text,
  city text not null,
  state text not null,
  pincode text not null,
  country text default 'IN',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Payments
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete cascade,
  provider text not null,
  provider_order_id text,
  provider_payment_id text,
  provider_signature text,
  amount_inr int not null default 0,
  currency text default 'INR',
  status payment_status not null default 'pending',
  captured_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (provider, provider_payment_id)
);

-- Invoices
create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete cascade,
  invoice_code text unique default public.generate_invoice_code(),
  status invoice_status not null default 'issued',
  issued_at timestamptz not null default now(),
  total_inr int not null default 0,
  currency text default 'INR',
  pdf_path text,
  created_at timestamptz not null default now()
);

-- Admin notes
create table if not exists public.admin_order_notes (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete cascade,
  note text not null,
  created_at timestamptz not null default now()
);

-- Order status history
create table if not exists public.order_status_history (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete cascade,
  old_status order_status,
  new_status order_status not null,
  note text,
  created_at timestamptz not null default now()
);

-- Webhook event de-dup
create table if not exists public.payment_events (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  provider_event_id text unique,
  payload jsonb,
  created_at timestamptz not null default now()
);

-- Orders upgrades
alter table public.orders add column if not exists order_code text unique default public.generate_order_code();
alter table public.orders add column if not exists public_token uuid default gen_random_uuid();
alter table public.orders add column if not exists payment_status payment_status default 'pending';
alter table public.orders add column if not exists tax_inr int default 0;
alter table public.orders add column if not exists discount_inr int default 0;
alter table public.orders add column if not exists shipping_address_id uuid references public.addresses(id);
alter table public.orders add column if not exists billing_address_id uuid references public.addresses(id);
alter table public.orders add column if not exists notes text;
alter table public.orders add column if not exists placed_at timestamptz;

-- Convert status to enum if needed
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'orders' and column_name = 'status' and data_type = 'text'
  ) then
    alter table public.orders alter column status drop default;
    alter table public.orders
      alter column status type order_status using status::order_status;
    alter table public.orders alter column status set default 'pending';
  end if;
end $$;

-- Updated_at triggers for new tables
create trigger set_addresses_updated_at
before update on public.addresses
for each row execute function public.set_updated_at();

create trigger set_payments_updated_at
before update on public.payments
for each row execute function public.set_updated_at();

-- Indexes
create index if not exists addresses_city_idx on public.addresses (city);
create index if not exists payments_order_idx on public.payments (order_id);
create index if not exists payments_provider_order_idx on public.payments (provider_order_id);
create index if not exists payments_provider_payment_idx on public.payments (provider_payment_id);
create index if not exists invoices_order_idx on public.invoices (order_id);
create index if not exists order_status_history_order_idx on public.order_status_history (order_id, created_at desc);
create unique index if not exists orders_public_token_idx on public.orders (public_token);
create index if not exists orders_payment_status_idx on public.orders (payment_status);

-- RLS (secure, server-side writes only)
alter table public.addresses enable row level security;
alter table public.payments enable row level security;
alter table public.invoices enable row level security;
alter table public.admin_order_notes enable row level security;
alter table public.order_status_history enable row level security;
alter table public.payment_events enable row level security;

drop policy if exists "Insert customers" on public.customers;
drop policy if exists "Insert orders" on public.orders;
drop policy if exists "Insert order items" on public.order_items;

create policy "Server-only customers"
on public.customers for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

create policy "Server-only orders"
on public.orders for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

create policy "Server-only order items"
on public.order_items for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

create policy "Server-only addresses"
on public.addresses for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

create policy "Server-only payments"
on public.payments for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

create policy "Server-only invoices"
on public.invoices for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

create policy "Server-only admin notes"
on public.admin_order_notes for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

create policy "Server-only order history"
on public.order_status_history for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

create policy "Server-only payment events"
on public.payment_events for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');
