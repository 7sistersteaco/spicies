-- Create branding bucket (Public)
insert into storage.buckets (id, name, public)
values ('branding', 'branding', true)
on conflict (id) do update set public = excluded.public;

-- RLS Policies for branding bucket
drop policy if exists "Public access branding select" on storage.objects;
drop policy if exists "Service role branding insert" on storage.objects;
drop policy if exists "Service role branding update" on storage.objects;
drop policy if exists "Service role branding delete" on storage.objects;

create policy "Public access branding select"
on storage.objects for select
using (bucket_id = 'branding');

create policy "Service role branding insert"
on storage.objects for insert
with check (auth.role() = 'service_role' and bucket_id = 'branding');

create policy "Service role branding update"
on storage.objects for update
using (auth.role() = 'service_role' and bucket_id = 'branding')
with check (auth.role() = 'service_role' and bucket_id = 'branding');

create policy "Service role branding delete"
on storage.objects for delete
using (auth.role() = 'service_role' and bucket_id = 'branding');
