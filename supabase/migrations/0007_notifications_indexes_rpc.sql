-- Notifications
create table notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  type text not null,
  title text not null,
  message text,
  read boolean not null default false,
  created_at timestamptz not null default now()
);
create index notifications_user_id_idx on notifications(user_id);

alter table notifications enable row level security;
create policy notifications_self on notifications for select using (user_id = auth.uid());
create policy notifications_self_update on notifications for update using (user_id = auth.uid());

alter publication supabase_realtime add table notifications;

-- Search indexes called out explicitly in the spec
create index if not exists shipments_shipment_no_idx on shipments(shipment_no);
create index if not exists vehicles_plate_no_idx on vehicles(plate_no);
create index if not exists customers_name_idx on customers(name);
create index if not exists drivers_name_idx on drivers(name);

-- RPCs for dashboard/report aggregation (analytics belongs in the DB, not
-- pulled row-by-row into the client).
create or replace function get_dashboard_stats(target_company_id uuid)
returns jsonb
language sql
security definer
stable
as $$
  select jsonb_build_object(
    'shipments_total', (select count(*) from shipments where company_id = target_company_id),
    'shipments_in_transit', (select count(*) from shipments where company_id = target_company_id and status = 'in_transit'),
    'orders_total', (select count(*) from orders where company_id = target_company_id),
    'revenue_unpaid', (select coalesce(sum(amount), 0) from invoices where company_id = target_company_id and status = 'unpaid'),
    'revenue_paid', (select coalesce(sum(amount), 0) from invoices where company_id = target_company_id and status = 'paid'),
    'active_vehicles', (select count(*) from vehicles where company_id = target_company_id and status = 'active'),
    'active_drivers', (select count(*) from drivers where company_id = target_company_id and status = 'active')
  )
  where target_company_id in (select auth_user_company_ids()) or auth_is_super_admin();
$$;

create or replace function driver_performance(target_company_id uuid)
returns table (driver_id uuid, driver_name text, deliveries_completed bigint, deliveries_total bigint)
language sql
security definer
stable
as $$
  select
    d.id,
    d.name,
    count(*) filter (where del.status = 'delivered') as deliveries_completed,
    count(*) as deliveries_total
  from drivers d
  left join deliveries del on del.driver_id = d.id
  where d.company_id = target_company_id
    and (target_company_id in (select auth_user_company_ids()) or auth_is_super_admin())
  group by d.id, d.name;
$$;

create or replace function calculate_route_cost(target_route_id uuid)
returns numeric
language sql
security definer
stable
as $$
  select coalesce(sum(e.amount), 0)
  from expenses e
  join shipments s on s.id = e.shipment_id
  where s.route_id = target_route_id
    and (e.company_id in (select auth_user_company_ids()) or auth_is_super_admin());
$$;
