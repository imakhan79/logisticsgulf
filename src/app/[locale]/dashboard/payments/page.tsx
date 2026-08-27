import { createClient } from "@/lib/supabase/server";
import { can } from "@/lib/permissions";
import { NoAccess } from "@/components/no-access";
import { PaymentsTable, type Payment } from "./payments-table";

export default async function PaymentsPage() {
  if (!(await can("payments.view"))) return <NoAccess module="payments" />;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("payments")
    .select("id, amount, payment_method, paid_at, invoices(invoice_number)")
    .order("paid_at", { ascending: false })
    .limit(100);

  return (
    <div className="p-8">
      <h1 className="mb-4 text-2xl font-semibold">Payments</h1>
      {error && <p className="text-sm text-red-600">{error.message}</p>}
      <PaymentsTable data={(data as unknown as Payment[]) ?? []} />
    </div>
  );
}
