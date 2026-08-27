-- Replace the blanket "any company member can read/write" tenant policies
-- with module.action permission checks. has_permission() already verifies
-- company membership AND super_admin bypass, so this is a strict tightening,
-- not just an addition: a company member without e.g. invoices.view can no
-- longer read invoices for their own company, matching the BRD's explicit
-- requirement that module access isn't automatic.

do $$
declare
  t record;
begin
  for t in
    select * from (values
      ('warehouses', 'warehouses'),
      ('customers', 'customers'),
      ('drivers', 'drivers'),
      ('vehicles', 'vehicles'),
      ('routes', 'routes'),
      ('orders', 'orders'),
      ('shipments', 'shipments'),
      ('deliveries', 'deliveries'),
      ('inventory', 'inventory'),
      ('invoices', 'invoices'),
      ('payments', 'payments'),
      ('expenses', 'expenses')
    ) as x(table_name, module_name)
  loop
    execute format('drop policy if exists %I on %I;', t.table_name || '_tenant', t.table_name);

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

-- payments/deliveries reference company_id indirectly in a couple of flows
-- but do carry their own company_id column (added in 0002/0003), so the
-- generic loop above covers them correctly.
