import { createClient } from "@/lib/supabase/server";
import { CustomersTable, type Customer } from "./customers-table";

export default async function CustomersPage() {
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
