-- Storage bucket for invoices (private)
insert into storage.buckets (id, name, public)
values ('invoices', 'invoices', false)
on conflict (id) do update set public = excluded.public;

drop policy if exists "Service role invoices select" on storage.objects;
drop policy if exists "Service role invoices insert" on storage.objects;
drop policy if exists "Service role invoices update" on storage.objects;
drop policy if exists "Service role invoices delete" on storage.objects;

create policy "Service role invoices select"
on storage.objects for select
using (auth.role() = 'service_role' and bucket_id = 'invoices');

create policy "Service role invoices insert"
on storage.objects for insert
with check (auth.role() = 'service_role' and bucket_id = 'invoices');

create policy "Service role invoices update"
on storage.objects for update
using (auth.role() = 'service_role' and bucket_id = 'invoices')
with check (auth.role() = 'service_role' and bucket_id = 'invoices');

create policy "Service role invoices delete"
on storage.objects for delete
using (auth.role() = 'service_role' and bucket_id = 'invoices');
