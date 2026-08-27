-- Schema for the roles that had no real data to back a dashboard yet:
-- Customs, Port Operations, Customer Service, Procurement, plus
-- compliance expiry tracking on vehicles/drivers. HR reuses the
-- existing user_companies roster rather than a parallel employee table.

create table customs_declarations (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references companies(id) on delete cascade,
  country_id uuid not null references countries(id) on delete restrict,
  shipment_id uuid references shipments(id) on delete set null,
  declaration_no text not null,
  status text not null default 'draft', -- draft, submitted, under_inspection, cleared, held
  notes text,
  created_by uuid references users(id),
  updated_by uuid references users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (company_id, declaration_no)
);
create index customs_declarations_company_id_idx on customs_declarations(company_id);
create trigger set_updated_at before update on customs_declarations for each row execute function set_updated_at();

create table port_activities (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references companies(id) on delete cascade,
  country_id uuid not null references countries(id) on delete restrict,
  activity_type text not null, -- vessel_booking, container_movement, gate_entry, gate_exit
  reference_no text not null,
  status text not null default 'scheduled', -- scheduled, in_progress, completed, cancelled
  scheduled_at timestamptz,
  created_by uuid references users(id),
  updated_by uuid references users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index port_activities_company_id_idx on port_activities(company_id);
create trigger set_updated_at before update on port_activities for each row execute function set_updated_at();

create table support_tickets (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references companies(id) on delete cascade,
  customer_id uuid references customers(id) on delete set null,
  shipment_id uuid references shipments(id) on delete set null,
  subject text not null,
  status text not null default 'open', -- open, in_progress, resolved, closed
  priority text not null default 'medium', -- low, medium, high, urgent
  assigned_to uuid references users(id),
  created_by uuid references users(id),
  updated_by uuid references users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index support_tickets_company_id_idx on support_tickets(company_id);
create trigger set_updated_at before update on support_tickets for each row execute function set_updated_at();

create table suppliers (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references companies(id) on delete cascade,
  name text not null,
  category text,
  contact_email text,
  contact_phone text,
  status text not null default 'active',
  created_by uuid references users(id),
  updated_by uuid references users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index suppliers_company_id_idx on suppliers(company_id);
create trigger set_updated_at before update on suppliers for each row execute function set_updated_at();

create table purchase_orders (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references companies(id) on delete cascade,
  supplier_id uuid references suppliers(id) on delete set null,
  po_number text not null,
  amount numeric not null,
  status text not null default 'draft', -- draft, sent, received, paid
  created_by uuid references users(id),
  updated_by uuid references users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (company_id, po_number)
);
create index purchase_orders_company_id_idx on purchase_orders(company_id);
create trigger set_updated_at before update on purchase_orders for each row execute function set_updated_at();

-- Compliance expiry tracking (nullable: "not tracked yet" is an honest state).
alter table vehicles add column if not exists insurance_expiry date;
alter table vehicles add column if not exists registration_expiry date;
alter table drivers add column if not exists license_expiry date;

-- RLS: same has_permission(company_id, 'module.action') pattern as 0009.
do $$
declare
  t record;
begin
  for t in
    select * from (values
      ('customs_declarations', 'customs'),
      ('port_activities', 'ports'),
      ('support_tickets', 'support'),
      ('suppliers', 'procurement'),
      ('purchase_orders', 'procurement')
    ) as x(table_name, module_name)
  loop
    execute format('alter table %I enable row level security;', t.table_name);
    execute format(
      'create policy %I on %I for select using (has_permission(company_id, %L));',
      t.table_name || '_view', t.table_name, t.module_name || '.view'
    );
    execute format(
      'create policy %I on %I for insert with check (has_permission(company_id, %L));',
      t.table_name || '_create', t.table_name, t.module_name || '.create'
    );
    execute format(
      'create policy %I on %I for update using (has_permission(company_id, %L)) with check (has_permission(company_id, %L));',
      t.table_name || '_edit', t.table_name, t.module_name || '.edit', t.module_name || '.edit'
    );
    execute format(
      'create policy %I on %I for delete using (has_permission(company_id, %L));',
      t.table_name || '_delete', t.table_name, t.module_name || '.delete'
    );
  end loop;
end $$;
