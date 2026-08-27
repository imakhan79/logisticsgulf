-- Let company/country admins manage members and profiles within their own
-- company, not just super admins. Wrapped in security-definer functions to
-- avoid RLS self-recursion on user_companies.

create or replace function auth_is_admin_of(target_company_id uuid)
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from user_companies uc
    join roles r on r.id = uc.role_id
    where uc.user_id = auth.uid()
      and uc.company_id = target_company_id
      and uc.is_active = true
      and r.key in ('super_admin', 'company_admin', 'country_admin')
  );
$$;

create policy user_companies_admin_manage on user_companies
  for all
  using (auth_is_admin_of(company_id) or auth_is_super_admin())
  with check (auth_is_admin_of(company_id) or auth_is_super_admin());

create policy users_admin_view on users
  for select
  using (
    id in (
      select uc.user_id from user_companies uc
      where uc.company_id in (select auth_user_company_ids())
    )
    or auth_is_super_admin()
  );

-- These were never RLS-enabled, leaving them open to full anon read/write
-- via Postgres' default grants. Lock down writes to super admins; reads
-- stay public since they're shared reference data.
alter table roles enable row level security;
alter table permissions enable row level security;
alter table role_permissions enable row level security;
alter table countries enable row level security;
alter table cities enable row level security;

create policy roles_readable on roles for select using (true);
create policy roles_super_admin_write on roles for insert with check (auth_is_super_admin());
create policy roles_super_admin_update on roles for update using (auth_is_super_admin());
create policy roles_super_admin_delete on roles for delete using (auth_is_super_admin());

create policy permissions_readable on permissions for select using (true);
create policy permissions_super_admin_write on permissions for insert with check (auth_is_super_admin());
create policy permissions_super_admin_update on permissions for update using (auth_is_super_admin());
create policy permissions_super_admin_delete on permissions for delete using (auth_is_super_admin());

create policy role_permissions_readable on role_permissions for select using (true);
create policy role_permissions_super_admin_write on role_permissions for insert with check (auth_is_super_admin());
create policy role_permissions_super_admin_delete on role_permissions for delete using (auth_is_super_admin());

create policy countries_readable on countries for select using (true);
create policy countries_super_admin_write on countries for insert with check (auth_is_super_admin());
create policy countries_super_admin_update on countries for update using (auth_is_super_admin());
create policy countries_super_admin_delete on countries for delete using (auth_is_super_admin());

create policy cities_readable on cities for select using (true);
create policy cities_super_admin_write on cities for insert with check (auth_is_super_admin());
create policy cities_super_admin_update on cities for update using (auth_is_super_admin());
create policy cities_super_admin_delete on cities for delete using (auth_is_super_admin());

-- companies previously only had a SELECT policy: no one (not even an admin)
-- could create or edit a company through the app. Allow any authenticated
-- user to create one (onboarding), and admins of a company to update it.
create policy companies_insert_authenticated on companies
  for insert to authenticated with check (true);

create policy companies_admin_update on companies
  for update using (id in (select auth_user_company_ids()) or auth_is_super_admin());

-- Bootstrap: a user may add themself as company_admin of a company that
-- has no members yet (i.e. the company they just created).
create policy user_companies_bootstrap_self on user_companies
  for insert to authenticated
  with check (
    user_id = auth.uid()
    and role_id = (select id from roles where key = 'company_admin')
    and not exists (select 1 from user_companies existing where existing.company_id = user_companies.company_id)
  );
