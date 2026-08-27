import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { can } from "@/lib/permissions";
import { NoAccess } from "@/components/no-access";
import { CustomersTable, type Customer } from "./customers-table";

export default async function CustomersPage() {
  if (!(await can("customers.view"))) return <NoAccess module="customers" />;

  const supabase = await createClient();
  const [{ data, error }, canCreate] = await Promise.all([
    supabase
      .from("customers")
      .select("id, name, email, phone, address")
      .order("name")
      .limit(100),
    can("customers.create"),
  ]);

  return (
    <div className="p-8">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Customers</h1>
        {canCreate && (
          <Link
            href="customers/new"
            className="rounded-md bg-neutral-900 px-3 py-2 text-sm font-medium text-white"
          >
            New customer
          </Link>
        )}
      </div>
      {error && <p className="text-sm text-red-600">{error.message}</p>}
      <CustomersTable data={(data as Customer[]) ?? []} />
    </div>
  );
}
