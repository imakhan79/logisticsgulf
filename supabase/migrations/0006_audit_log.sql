create table audit_log (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies(id) on delete cascade,
  table_name text not null,
  record_id uuid not null,
  action text not null,           -- 'insert' | 'update' | 'delete'
  changed_by uuid references users(id),
  changed_at timestamptz not null default now(),
  diff jsonb
);
create index audit_log_company_id_idx on audit_log(company_id);
create index audit_log_table_record_idx on audit_log(table_name, record_id);

alter table audit_log enable row level security;
create policy audit_log_tenant on audit_log for select
  using (company_id in (select auth_user_company_ids()) or auth_is_super_admin());

create or replace function log_audit_event()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  rec record;
  cid uuid;
begin
  rec := coalesce(new, old);
  cid := rec.company_id;

  insert into audit_log (company_id, table_name, record_id, action, changed_by, diff)
  values (
    cid,
    TG_TABLE_NAME,
    rec.id,
    lower(TG_OP),
    auth.uid(),
    case TG_OP
      when 'DELETE' then to_jsonb(old)
      when 'INSERT' then to_jsonb(new)
      else jsonb_build_object('before', to_jsonb(old), 'after', to_jsonb(new))
    end
  );

  return rec;
end;
$$;

do $$
declare t text;
begin
  foreach t in array array[
    'orders','shipments','deliveries','invoices','payments','expenses',
    'vehicles','drivers','customers','warehouses'
  ]
  loop
    execute format(
      'create trigger audit_%1$s after insert or update or delete on %1$I for each row execute function log_audit_event();',
      t
    );
  end loop;
end $$;
