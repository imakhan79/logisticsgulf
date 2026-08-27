-- Branch-level hierarchy (company > country > branch), and a reusable
-- permission-check function for the module.action permission model.

create table branches (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references companies(id) on delete cascade,
  country_id uuid not null references countries(id) on delete restrict,
  city_id uuid references cities(id) on delete set null,
  name text not null,
  is_active boolean not null default true,
  created_by uuid references users(id),
  updated_by uuid references users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index branches_company_id_idx on branches(company_id);

alter table branches enable row level security;
create policy branches_tenant on branches for all
  using (company_id in (select auth_user_company_ids()) or auth_is_super_admin())
  with check (company_id in (select auth_user_company_ids()) or auth_is_super_admin());
create trigger set_updated_at before update on branches for each row execute function set_updated_at();

-- Branch-scoping columns on the tables a Branch Manager operates against.
-- RLS stays company-scoped for now (a user with company access still sees
-- all branches); branch_id is available for filtering in queries/reports.
-- Branch-level row isolation (a Branch Manager restricted to only their
-- branch) is not enforced yet — needs a user_branches membership table,
-- analogous to user_companies, before that's safe to turn on.
alter table warehouses add column if not exists branch_id uuid references branches(id) on delete set null;
alter table customers add column if not exists branch_id uuid references branches(id) on delete set null;
alter table drivers add column if not exists branch_id uuid references branches(id) on delete set null;
alter table vehicles add column if not exists branch_id uuid references branches(id) on delete set null;
alter table orders add column if not exists branch_id uuid references branches(id) on delete set null;
alter table shipments add column if not exists branch_id uuid references branches(id) on delete set null;
alter table expenses add column if not exists branch_id uuid references branches(id) on delete set null;

create index warehouses_branch_id_idx on warehouses(branch_id);
create index customers_branch_id_idx on customers(branch_id);
create index drivers_branch_id_idx on drivers(branch_id);
create index vehicles_branch_id_idx on vehicles(branch_id);
create index orders_branch_id_idx on orders(branch_id);
create index shipments_branch_id_idx on shipments(branch_id);
create index expenses_branch_id_idx on expenses(branch_id);

-- Permission check: does the current user's role in `target_company_id`
-- grant `permission_key` (e.g. 'shipments.dispatch')? Super admins bypass.
create or replace function has_permission(target_company_id uuid, permission_key text)
returns boolean
language sql
security definer
stable
as $$
  select
    auth_is_super_admin()
    or exists (
      select 1
      from user_companies uc
      join role_permissions rp on rp.role_id = uc.role_id
      join permissions p on p.id = rp.permission_id
      where uc.user_id = auth.uid()
        and uc.company_id = target_company_id
        and uc.is_active = true
        and p.key = permission_key
    );
$$;
