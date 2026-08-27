import { createClient } from "@/lib/supabase/server";
import { can } from "@/lib/permissions";
import { NoAccess } from "@/components/no-access";
import { InvoicesTable, type Invoice } from "./invoices-table";

export default async function InvoicesPage() {
  if (!(await can("invoices.view"))) return <NoAccess module="invoices" />;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("invoices")
    .select("id, invoice_number, amount, status, due_date, customers(name)")
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <div className="p-8">
      <h1 className="mb-4 text-2xl font-semibold">Invoices</h1>
      {error && <p className="text-sm text-red-600">{error.message}</p>}
      <InvoicesTable data={(data as unknown as Invoice[]) ?? []} />
    </div>
  );
}
