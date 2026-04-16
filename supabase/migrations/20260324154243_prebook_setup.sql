-- Pre-booking requests (testing demand)

create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.prebook_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  full_name text not null,
  phone text not null,
  email text,
  product_name text not null,
  category text not null,
  selected_weight text not null,
  quantity int not null default 1,
  fulfillment_method text not null,
  note text,
  source_page text,
  status text not null default 'new',
  constraint prebook_status_check
    check (status in ('new','contacted','confirmed','cancelled','fulfilled'))
);

create index if not exists prebook_requests_created_at_idx on public.prebook_requests (created_at);
create index if not exists prebook_requests_status_idx on public.prebook_requests (status);
create index if not exists prebook_requests_phone_idx on public.prebook_requests (phone);

create trigger set_prebook_requests_updated_at
before update on public.prebook_requests
for each row execute function public.set_updated_at();

alter table public.prebook_requests enable row level security;

create policy "Insert prebook requests" on public.prebook_requests
for insert with check (true);
