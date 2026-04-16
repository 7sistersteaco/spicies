-- Add image_url to products
alter table public.products add column if not exists image_url text;

-- Create products bucket (Public)
insert into storage.buckets (id, name, public)
values ('products', 'products', true)
on conflict (id) do update set public = excluded.public;

-- RLS Policies for products bucket
drop policy if exists "Public access products select" on storage.objects;
drop policy if exists "Service role products insert" on storage.objects;
drop policy if exists "Service role products update" on storage.objects;
drop policy if exists "Service role products delete" on storage.objects;

create policy "Public access products select"
on storage.objects for select
using (bucket_id = 'products');

create policy "Service role products insert"
on storage.objects for insert
with check (auth.role() = 'service_role' and bucket_id = 'products');

create policy "Service role products update"
on storage.objects for update
using (auth.role() = 'service_role' and bucket_id = 'products')
with check (auth.role() = 'service_role' and bucket_id = 'products');

create policy "Service role products delete"
on storage.objects for delete
using (auth.role() = 'service_role' and bucket_id = 'products');
