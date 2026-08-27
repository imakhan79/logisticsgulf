import { createClient } from "@/lib/supabase/server";
import { can } from "@/lib/permissions";
import { NoAccess } from "@/components/no-access";
import { CustomersTable, type Customer } from "./customers-table";

export default async function CustomersPage() {
  if (!(await can("customers.view"))) return <NoAccess module="customers" />;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("customers")
    .select("id, name, email, phone, address")
    .order("name")
    .limit(100);

  return (
    <div className="p-8">
      <h1 className="mb-4 text-2xl font-semibold">Customers</h1>
      {error && <p className="text-sm text-red-600">{error.message}</p>}
      <CustomersTable data={(data as Customer[]) ?? []} />
    </div>
  );
}
