-- Quotes: entry point for the freight-forwarding path (Quote -> Booking ->
-- Shipment), matching Workflow 1-3 in the BRD. orders.quote_id links an
-- order ("booking") back to the quote it was converted from.

create table quotes (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references companies(id) on delete cascade,
  country_id uuid not null references countries(id) on delete restrict,
  quote_no text not null,
  customer_id uuid references customers(id) on delete set null,
  origin text,
  destination text,
  cargo_details text,
  weight numeric,
  volume numeric,
  amount numeric,
  status text not null default 'draft', -- draft, pending_approval, approved, rejected, accepted, converted
  requested_by uuid references users(id),
  approved_by uuid references users(id),
  approved_at timestamptz,
  created_by uuid references users(id),
  updated_by uuid references users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (company_id, quote_no)
);
create index quotes_company_id_idx on quotes(company_id);
create trigger set_updated_at before update on quotes for each row execute function set_updated_at();

alter table orders add column if not exists quote_id uuid references quotes(id) on delete set null;

alter table quotes enable row level security;
create policy quotes_view on quotes for select using (has_permission(company_id, 'quotes.view'));
create policy quotes_create on quotes for insert with check (has_permission(company_id, 'quotes.create'));
create policy quotes_edit on quotes for update using (has_permission(company_id, 'quotes.edit')) with check (has_permission(company_id, 'quotes.edit'));
create policy quotes_delete on quotes for delete using (has_permission(company_id, 'quotes.delete'));

alter publication supabase_realtime add table quotes;
