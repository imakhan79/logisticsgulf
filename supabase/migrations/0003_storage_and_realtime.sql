-- Storage buckets, scoped by company_id as the first path segment
-- (e.g. documents/<company_id>/file.pdf), enforced via storage RLS.

insert into storage.buckets (id, name, public) values
  ('documents', 'documents', false),
  ('pod', 'pod', false),
  ('vehicle_docs', 'vehicle_docs', false),
  ('driver_docs', 'driver_docs', false),
  ('customer_docs', 'customer_docs', false),
  ('logos', 'logos', true),
  ('invoices', 'invoices', false)
on conflict (id) do nothing;

create or replace function storage_path_company_id(object_name text)
returns uuid
language sql
immutable
as $$
  select nullif(split_part(object_name, '/', 1), '')::uuid;
$$;

do $$
declare b text;
begin
  foreach b in array array['documents','pod','vehicle_docs','driver_docs','customer_docs','invoices']
  loop
    execute format($p$
      create policy %I on storage.objects for all
        using (bucket_id = %L and (storage_path_company_id(name) in (select auth_user_company_ids()) or auth_is_super_admin()))
        with check (bucket_id = %L and (storage_path_company_id(name) in (select auth_user_company_ids()) or auth_is_super_admin()));
    $p$, b || '_tenant', b, b);
  end loop;
end $$;

-- Logos are public read (referenced directly in <img>), writes still tenant-scoped.
create policy logos_public_read on storage.objects for select
  using (bucket_id = 'logos');
create policy logos_tenant_write on storage.objects for insert
  with check (bucket_id = 'logos' and (storage_path_company_id(name) in (select auth_user_company_ids()) or auth_is_super_admin()));
create policy logos_tenant_update on storage.objects for update
  using (bucket_id = 'logos' and (storage_path_company_id(name) in (select auth_user_company_ids()) or auth_is_super_admin()));
create policy logos_tenant_delete on storage.objects for delete
  using (bucket_id = 'logos' and (storage_path_company_id(name) in (select auth_user_company_ids()) or auth_is_super_admin()));

-- ─────────────────────────────────────────────────────────────────────────
-- Realtime: shipment status, vehicle status/location, driver location,
-- and dashboard-relevant tables all stream via Supabase Realtime.
-- ─────────────────────────────────────────────────────────────────────────

alter table vehicles add column if not exists last_lat numeric;
alter table vehicles add column if not exists last_lng numeric;
alter table vehicles add column if not exists last_location_at timestamptz;

alter table drivers add column if not exists last_lat numeric;
alter table drivers add column if not exists last_lng numeric;
alter table drivers add column if not exists last_location_at timestamptz;

alter publication supabase_realtime add table shipments;
alter publication supabase_realtime add table vehicles;
alter publication supabase_realtime add table drivers;
alter publication supabase_realtime add table deliveries;
