-- 7 Sisters Tea Co. - Supabase schema + seed (free-tier optimized)

create extension if not exists "pgcrypto";

-- Updated-at trigger helper
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Categories
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  image_url text,
  sort_order int default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Products (variants and images kept in JSONB for simplicity)
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories(id) on delete restrict,
  name text not null,
  slug text not null unique,
  short_description text,
  description text,
  origin text,
  tags text[] default '{}',
  images jsonb default '[]'::jsonb,
  variants jsonb default '[]'::jsonb,
  featured_rank int,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Customers (basic)
create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  full_name text,
  email text unique,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Orders
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique,
  customer_id uuid references public.customers(id),
  customer_name text,
  customer_email text,
  customer_phone text,
  status text default 'pending',
  currency text default 'INR',
  subtotal_inr int,
  shipping_inr int default 0,
  total_inr int,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Order items
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete cascade,
  product_id uuid references public.products(id),
  product_name text,
  variant_label text,
  variant_sku text,
  unit_price_inr int,
  qty int,
  line_total_inr int,
  created_at timestamptz not null default now()
);

-- Indexes
create index if not exists categories_slug_idx on public.categories (slug);
create index if not exists products_slug_idx on public.products (slug);
create index if not exists products_category_idx on public.products (category_id);
create index if not exists products_active_idx on public.products (is_active);
create index if not exists orders_order_number_idx on public.orders (order_number);
create index if not exists orders_customer_email_idx on public.orders (customer_email);
create index if not exists order_items_order_id_idx on public.order_items (order_id);
create index if not exists customers_email_idx on public.customers (email);

-- Triggers for updated_at
create trigger set_categories_updated_at
before update on public.categories
for each row execute function public.set_updated_at();

create trigger set_products_updated_at
before update on public.products
for each row execute function public.set_updated_at();

create trigger set_customers_updated_at
before update on public.customers
for each row execute function public.set_updated_at();

create trigger set_orders_updated_at
before update on public.orders
for each row execute function public.set_updated_at();

-- RLS
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.customers enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- Public catalog read
create policy "Public read categories" on public.categories
for select using (is_active = true);

create policy "Public read products" on public.products
for select using (is_active = true);

-- Customer/order inserts (anon + authenticated allowed)
create policy "Insert customers" on public.customers
for insert with check (true);

create policy "Insert orders" on public.orders
for insert with check (true);

create policy "Insert order items" on public.order_items
for insert with check (true);

-- Seed categories
insert into public.categories (name, slug, description, image_url, sort_order)
values
  ('Tea', 'tea', 'Strong Assam CTC for the perfect daily chai.', '/images/tea-hero.svg', 1),
  ('Spices', 'spices', 'Essential blends and single spices with real aroma.', '/images/spice-hero.svg', 2)
on conflict (slug) do nothing;

-- Seed products
insert into public.products (
  category_id,
  name,
  slug,
  short_description,
  description,
  origin,
  tags,
  images,
  variants,
  featured_rank,
  is_active
)
values
(
  (select id from public.categories where slug = 'tea'),
  'Assam Strong CTC Tea',
  'assam-strong-ctc',
  'Bold, malty, and made for daily chai.',
  'A bold, malty Assam CTC crafted for everyday chai. Deep color, rich body, and a clean, satisfying finish.',
  'Barpeta Road, Assam',
  array['strong','daily-use','premium','assam','malty'],
  '[{"url":"/images/product-ctc.svg","alt":"Assam Strong CTC Tea pack"}]'::jsonb,
  '[
    {"id":"ctc-100","sku":"7S-CTC-100G","weight_label":"100g","weight_grams":100,"price_inr":199,"compare_at_inr":229,"stock_qty":48,"is_active":true},
    {"id":"ctc-200","sku":"7S-CTC-200G","weight_label":"200g","weight_grams":200,"price_inr":349,"compare_at_inr":399,"stock_qty":42,"is_active":true},
    {"id":"ctc-1000","sku":"7S-CTC-1KG","weight_label":"1kg","weight_grams":1000,"price_inr":1499,"compare_at_inr":1699,"stock_qty":18,"is_active":true}
  ]'::jsonb,
  1,
  true
),
(
  (select id from public.categories where slug = 'tea'),
  'Assam Premium Leaf Tea',
  'assam-premium-leaf',
  'Elegant whole-leaf Assam with a smooth finish.',
  'Premium whole-leaf Assam tea with a smooth, aromatic finish. Crafted for a lighter, refined cup with layered depth.',
  'Barpeta Road, Assam',
  array['premium','assam','aromatic','daily-use'],
  '[{"url":"/images/product-ctc.svg","alt":"Assam premium leaf tea pack"}]'::jsonb,
  '[
    {"id":"leaf-100","sku":"7S-LEAF-100G","weight_label":"100g","weight_grams":100,"price_inr":249,"compare_at_inr":279,"stock_qty":36,"is_active":true},
    {"id":"leaf-200","sku":"7S-LEAF-200G","weight_label":"200g","weight_grams":200,"price_inr":449,"compare_at_inr":499,"stock_qty":28,"is_active":true},
    {"id":"leaf-1000","sku":"7S-LEAF-1KG","weight_label":"1kg","weight_grams":1000,"price_inr":1699,"compare_at_inr":1899,"stock_qty":12,"is_active":true}
  ]'::jsonb,
  2,
  true
),
(
  (select id from public.categories where slug = 'spices'),
  'Assam Turmeric Powder',
  'turmeric-powder',
  'Golden, fragrant, and kitchen-ready.',
  'Golden, fragrant turmeric that lifts everyday cooking with warm, earthy depth.',
  'Assam, India',
  array['fresh','aromatic','premium','daily-use'],
  '[{"url":"/images/product-turmeric.svg","alt":"Assam turmeric powder pack"}]'::jsonb,
  '[
    {"id":"tur-100","sku":"7S-TUR-100G","weight_label":"100g","weight_grams":100,"price_inr":89,"stock_qty":64,"is_active":true},
    {"id":"tur-200","sku":"7S-TUR-200G","weight_label":"200g","weight_grams":200,"price_inr":159,"stock_qty":48,"is_active":true},
    {"id":"tur-1000","sku":"7S-TUR-1KG","weight_label":"1kg","weight_grams":1000,"price_inr":599,"stock_qty":20,"is_active":true}
  ]'::jsonb,
  3,
  true
),
(
  (select id from public.categories where slug = 'spices'),
  'Kashmiri Chilli Powder',
  'kashmiri-chilli',
  'Vibrant color with balanced heat.',
  'Vibrant red color with balanced heat for gravies and marinades.',
  'North India',
  array['balanced-heat','daily-use','premium','aromatic'],
  '[{"url":"/images/product-chilli.svg","alt":"Kashmiri chilli powder pack"}]'::jsonb,
  '[
    {"id":"chi-100","sku":"7S-CHI-100G","weight_label":"100g","weight_grams":100,"price_inr":129,"stock_qty":64,"is_active":true},
    {"id":"chi-200","sku":"7S-CHI-200G","weight_label":"200g","weight_grams":200,"price_inr":229,"stock_qty":48,"is_active":true},
    {"id":"chi-1000","sku":"7S-CHI-1KG","weight_label":"1kg","weight_grams":1000,"price_inr":799,"stock_qty":20,"is_active":true}
  ]'::jsonb,
  4,
  true
),
(
  (select id from public.categories where slug = 'spices'),
  'Garam Masala',
  'garam-masala',
  'Warm, layered, and restaurant-worthy.',
  'A warm, layered blend that brings restaurant-style depth to home kitchens.',
  'Assam-inspired blend',
  array['premium','aromatic','blend','restaurant-tested'],
  '[{"url":"/images/product-garam.svg","alt":"Garam masala pack"}]'::jsonb,
  '[
    {"id":"gar-100","sku":"7S-GAR-100G","weight_label":"100g","weight_grams":100,"price_inr":149,"stock_qty":64,"is_active":true},
    {"id":"gar-200","sku":"7S-GAR-200G","weight_label":"200g","weight_grams":200,"price_inr":269,"stock_qty":48,"is_active":true},
    {"id":"gar-1000","sku":"7S-GAR-1KG","weight_label":"1kg","weight_grams":1000,"price_inr":899,"stock_qty":20,"is_active":true}
  ]'::jsonb,
  5,
  true
),
(
  (select id from public.categories where slug = 'spices'),
  'Assam Regional Blend',
  'assam-regional-blend',
  'Homestyle spice balance, straight from Assam.',
  'A homestyle spice mix inspired by Assamese kitchens - balanced, warm, and versatile.',
  'Barpeta Road, Assam',
  array['regional','authentic','daily-use','premium'],
  '[{"url":"/images/product-blend.svg","alt":"Assam regional blend pack"}]'::jsonb,
  '[
    {"id":"arb-100","sku":"7S-ARB-100G","weight_label":"100g","weight_grams":100,"price_inr":119,"stock_qty":64,"is_active":true},
    {"id":"arb-200","sku":"7S-ARB-200G","weight_label":"200g","weight_grams":200,"price_inr":219,"stock_qty":48,"is_active":true},
    {"id":"arb-1000","sku":"7S-ARB-1KG","weight_label":"1kg","weight_grams":1000,"price_inr":749,"stock_qty":20,"is_active":true}
  ]'::jsonb,
  6,
  true
)
on conflict (slug) do nothing;
