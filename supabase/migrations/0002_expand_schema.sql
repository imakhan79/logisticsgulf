-- Rebuild schema to match the full logistics data model (routes, inventory,
-- deliveries, payments, richer company/customer/vehicle/driver fields).
-- Safe as a clean rebuild: 0001 only just landed and holds no data yet.

drop table if exists expenses cascade;
drop table if exists payments cascade;
drop table if exists invoices cascade;
drop table if exists deliveries cascade;
drop table if exists inventory cascade;
drop table if exists shipments cascade;
drop table if exists orders cascade;
drop table if exists routes cascade;
drop table if exists vehicles cascade;
drop table if exists drivers cascade;
drop table if exists customers cascade;
drop table if exists warehouses cascade;
drop table if exists user_companies cascade;
drop table if exists users cascade;
drop table if exists role_permissions cascade;
drop table if exists permissions cascade;
drop table if exists roles cascade;
drop table if exists companies cascade;
drop table if exists cities cascade;
drop table if exists countries cascade;
drop function if exists auth_user_company_ids();
drop function if exists auth_is_super_admin();
drop function if exists set_updated_at();

-- ─────────────────────────────────────────────────────────────────────────
-- Reference / platform tables
-- ─────────────────────────────────────────────────────────────────────────

create table countries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  code text not null unique,        -- ISO 3166-1 alpha-2
  currency text not null,           -- ISO 4217, e.g. 'AED'
  language text not null default 'en',
  created_at timestamptz not null default now()
);

create table cities (
  id uuid primary key default gen_random_uuid(),
  country_id uuid not null references countries(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now()
);
create index cities_country_id_idx on cities(country_id);

create table companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo text,
  email text,
  phone text,
  currency text not null default 'AED',
  timezone text not null default 'Asia/Dubai',
  country_id uuid references countries(id) on delete restrict,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table roles (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,         -- e.g. 'super_admin', 'company_admin'
  name text not null,
  description text,
  created_at timestamptz not null default now()
);

create table permissions (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,         -- e.g. 'shipments.create'
  description text,
  created_at timestamptz not null default now()
);

create table role_permissions (
  role_id uuid not null references roles(id) on delete cascade,
  permission_id uuid not null references permissions(id) on delete cascade,
  primary key (role_id, permission_id)
);

-- Profile row mirroring auth.users, one-to-one.
create table users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  phone text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Membership: which companies a user belongs to, in which country, with which role.
create table user_companies (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  company_id uuid not null references companies(id) on delete cascade,
  country_id uuid references countries(id) on delete set null,
  role_id uuid not null references roles(id) on delete restrict,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (user_id, company_id, country_id)
);
create index user_companies_user_id_idx on user_companies(user_id);
create index user_companies_company_id_idx on user_companies(company_id);

-- ─────────────────────────────────────────────────────────────────────────
-- Business tables (every row: company_id, country_id, created_by, updated_by)
-- ─────────────────────────────────────────────────────────────────────────

create table warehouses (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references companies(id) on delete cascade,
  country_id uuid not null references countries(id) on delete restrict,
  name text not null,
  city_id uuid references cities(id) on delete set null,
  capacity numeric,
  is_active boolean not null default true,
  created_by uuid references users(id),
  updated_by uuid references users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table customers (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references companies(id) on delete cascade,
  country_id uuid not null references countries(id) on delete restrict,
  name text not null,
  email text,
  phone text,
  address text,
  city_id uuid references cities(id) on delete set null,
  created_by uuid references users(id),
  updated_by uuid references users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table drivers (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references companies(id) on delete cascade,
  country_id uuid not null references countries(id) on delete restrict,
  user_id uuid references users(id) on delete set null,
  name text not null,
  license_no text,
  phone text,
  status text not null default 'active',
  created_by uuid references users(id),
  updated_by uuid references users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table vehicles (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references companies(id) on delete cascade,
  country_id uuid not null references countries(id) on delete restrict,
  plate_no text not null,
  vehicle_type text,
  capacity numeric,
  status text not null default 'active',
  created_by uuid references users(id),
  updated_by uuid references users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table routes (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references companies(id) on delete cascade,
  country_id uuid not null references countries(id) on delete restrict,
  origin text not null,
  destination text not null,
  distance numeric,
  duration numeric,               -- minutes
  created_by uuid references users(id),
  updated_by uuid references users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table orders (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references companies(id) on delete cascade,
  country_id uuid not null references countries(id) on delete restrict,
  customer_id uuid references customers(id) on delete set null,
  order_no text not null,
  origin text,
  destination text,
  weight numeric,
  volume numeric,
  status text not null default 'pending',
  created_by uuid references users(id),
  updated_by uuid references users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (company_id, order_no)
);

create table shipments (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references companies(id) on delete cascade,
  country_id uuid not null references countries(id) on delete restrict,
  shipment_no text not null,
  order_id uuid references orders(id) on delete set null,
  customer_id uuid references customers(id) on delete set null,
  vehicle_id uuid references vehicles(id) on delete set null,
  driver_id uuid references drivers(id) on delete set null,
  route_id uuid references routes(id) on delete set null,
  status text not null default 'pending',
  eta timestamptz,
  created_by uuid references users(id),
  updated_by uuid references users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (company_id, shipment_no)
);

create table deliveries (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references companies(id) on delete cascade,
  shipment_id uuid not null references shipments(id) on delete cascade,
  driver_id uuid references drivers(id) on delete set null,
  status text not null default 'pending',
  signature_url text,
  photo_url text,
  created_by uuid references users(id),
  updated_by uuid references users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table inventory (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references companies(id) on delete cascade,
  warehouse_id uuid not null references warehouses(id) on delete cascade,
  sku text not null,
  product text not null,
  quantity numeric not null default 0,
  created_by uuid references users(id),
  updated_by uuid references users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (warehouse_id, sku)
);

create table invoices (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references companies(id) on delete cascade,
  country_id uuid not null references countries(id) on delete restrict,
  customer_id uuid references customers(id) on delete set null,
  shipment_id uuid references shipments(id) on delete set null,
  invoice_number text not null,
  amount numeric not null,
  status text not null default 'unpaid',
  due_date date,
  created_by uuid references users(id),
  updated_by uuid references users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (company_id, invoice_number)
);

create table payments (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references companies(id) on delete cascade,
  invoice_id uuid not null references invoices(id) on delete cascade,
  amount numeric not null,
  payment_method text not null,
  paid_at timestamptz not null default now(),
  created_by uuid references users(id),
  updated_by uuid references users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table expenses (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references companies(id) on delete cascade,
  country_id uuid not null references countries(id) on delete restrict,
  shipment_id uuid references shipments(id) on delete set null,
  vehicle_id uuid references vehicles(id) on delete set null,
  expense_type text not null,
  amount numeric not null,
  description text,
  incurred_at date not null default current_date,
  created_by uuid references users(id),
  updated_by uuid references users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index warehouses_company_id_idx on warehouses(company_id);
create index customers_company_id_idx on customers(company_id);
create index drivers_company_id_idx on drivers(company_id);
create index vehicles_company_id_idx on vehicles(company_id);
create index routes_company_id_idx on routes(company_id);
create index orders_company_id_idx on orders(company_id);
create index shipments_company_id_idx on shipments(company_id);
create index deliveries_company_id_idx on deliveries(company_id);
create index inventory_company_id_idx on inventory(company_id);
create index invoices_company_id_idx on invoices(company_id);
create index payments_company_id_idx on payments(company_id);
create index expenses_company_id_idx on expenses(company_id);

-- ─────────────────────────────────────────────────────────────────────────
-- Row Level Security
-- ─────────────────────────────────────────────────────────────────────────

create or replace function auth_user_company_ids()
returns setof uuid
language sql
security definer
stable
as $$
  select company_id from user_companies
  where user_id = auth.uid() and is_active = true;
$$;

create or replace function auth_is_super_admin()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from user_companies uc
    join roles r on r.id = uc.role_id
    where uc.user_id = auth.uid() and r.key = 'super_admin' and uc.is_active = true
  );
$$;

alter table users enable row level security;
alter table user_companies enable row level security;
alter table companies enable row level security;
alter table warehouses enable row level security;
alter table customers enable row level security;
alter table drivers enable row level security;
alter table vehicles enable row level security;
alter table routes enable row level security;
alter table orders enable row level security;
alter table shipments enable row level security;
alter table deliveries enable row level security;
alter table inventory enable row level security;
alter table invoices enable row level security;
alter table payments enable row level security;
alter table expenses enable row level security;

create policy users_self_or_super on users
  for select using (id = auth.uid() or auth_is_super_admin());
create policy users_self_update on users
  for update using (id = auth.uid() or auth_is_super_admin());

create policy user_companies_self_or_super on user_companies
  for select using (user_id = auth.uid() or auth_is_super_admin());

create policy companies_member_or_super on companies
  for select using (id in (select auth_user_company_ids()) or auth_is_super_admin());

create policy warehouses_tenant on warehouses for all
  using (company_id in (select auth_user_company_ids()) or auth_is_super_admin())
  with check (company_id in (select auth_user_company_ids()) or auth_is_super_admin());

create policy customers_tenant on customers for all
  using (company_id in (select auth_user_company_ids()) or auth_is_super_admin())
  with check (company_id in (select auth_user_company_ids()) or auth_is_super_admin());

create policy drivers_tenant on drivers for all
  using (company_id in (select auth_user_company_ids()) or auth_is_super_admin())
  with check (company_id in (select auth_user_company_ids()) or auth_is_super_admin());

create policy vehicles_tenant on vehicles for all
  using (company_id in (select auth_user_company_ids()) or auth_is_super_admin())
  with check (company_id in (select auth_user_company_ids()) or auth_is_super_admin());

create policy routes_tenant on routes for all
  using (company_id in (select auth_user_company_ids()) or auth_is_super_admin())
  with check (company_id in (select auth_user_company_ids()) or auth_is_super_admin());

create policy orders_tenant on orders for all
  using (company_id in (select auth_user_company_ids()) or auth_is_super_admin())
  with check (company_id in (select auth_user_company_ids()) or auth_is_super_admin());

create policy shipments_tenant on shipments for all
  using (company_id in (select auth_user_company_ids()) or auth_is_super_admin())
  with check (company_id in (select auth_user_company_ids()) or auth_is_super_admin());

create policy deliveries_tenant on deliveries for all
  using (company_id in (select auth_user_company_ids()) or auth_is_super_admin())
  with check (company_id in (select auth_user_company_ids()) or auth_is_super_admin());

create policy inventory_tenant on inventory for all
  using (company_id in (select auth_user_company_ids()) or auth_is_super_admin())
  with check (company_id in (select auth_user_company_ids()) or auth_is_super_admin());

create policy invoices_tenant on invoices for all
  using (company_id in (select auth_user_company_ids()) or auth_is_super_admin())
  with check (company_id in (select auth_user_company_ids()) or auth_is_super_admin());

create policy payments_tenant on payments for all
  using (company_id in (select auth_user_company_ids()) or auth_is_super_admin())
  with check (company_id in (select auth_user_company_ids()) or auth_is_super_admin());

create policy expenses_tenant on expenses for all
  using (company_id in (select auth_user_company_ids()) or auth_is_super_admin())
  with check (company_id in (select auth_user_company_ids()) or auth_is_super_admin());

-- ─────────────────────────────────────────────────────────────────────────
-- updated_at maintenance
-- ─────────────────────────────────────────────────────────────────────────

create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
declare t text;
begin
  foreach t in array array[
    'companies','users','warehouses','customers','drivers','vehicles','routes',
    'orders','shipments','deliveries','inventory','invoices','payments','expenses'
  ]
  loop
    execute format('create trigger set_updated_at before update on %I for each row execute function set_updated_at();', t);
  end loop;
end $$;

-- ─────────────────────────────────────────────────────────────────────────
-- Seed reference data
-- ─────────────────────────────────────────────────────────────────────────

insert into roles (key, name, description) values
  ('super_admin', 'Super Admin', 'Full platform access across all companies and countries'),
  ('company_admin', 'Company Admin', 'Full access within their company'),
  ('country_admin', 'Country Admin', 'Full access within their company, scoped to a country'),
  ('operations_manager', 'Operations Manager', 'Manages day-to-day operations'),
  ('dispatcher', 'Dispatcher', 'Assigns drivers/vehicles to shipments'),
  ('fleet_manager', 'Fleet Manager', 'Manages vehicles and drivers'),
  ('warehouse_manager', 'Warehouse Manager', 'Manages warehouse inventory and operations'),
  ('finance', 'Finance', 'Manages invoices, payments and expenses'),
  ('driver', 'Driver', 'Executes assigned shipments'),
  ('customer', 'Customer', 'Views their own orders and shipments');

insert into countries (name, code, currency, language) values
  ('United Arab Emirates', 'AE', 'AED', 'en'),
  ('Saudi Arabia', 'SA', 'SAR', 'ar'),
  ('Qatar', 'QA', 'QAR', 'ar'),
  ('Kuwait', 'KW', 'KWD', 'ar'),
  ('Oman', 'OM', 'OMR', 'ar'),
  ('Bahrain', 'BH', 'BHD', 'ar');
