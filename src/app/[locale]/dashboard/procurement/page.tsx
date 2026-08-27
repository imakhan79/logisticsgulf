import { createClient } from "@/lib/supabase/server";
import { can } from "@/lib/permissions";
import { NoAccess } from "@/components/no-access";
import { StatusBadge } from "@/components/ui/status-badge";

export default async function ProcurementPage() {
  if (!(await can("procurement.view"))) return <NoAccess module="procurement" />;

  const supabase = await createClient();
  const [{ data: suppliers, error }, { data: orders }] = await Promise.all([
    supabase.from("suppliers").select("id, name, category, contact_email, status").order("name"),
    supabase.from("purchase_orders").select("id, po_number, amount, status, suppliers(name)").order("created_at", { ascending: false }),
  ]);

  return (
    <div className="space-y-8 p-8">
      <div>
        <h1 className="mb-4 text-2xl font-semibold">Suppliers</h1>
        {error && <p className="text-sm text-red-600">{error.message}</p>}
        <div className="overflow-hidden rounded-xl border border-border-subtle bg-surface-raised">
          <table className="w-full text-sm">
            <thead className="border-b border-border-subtle text-left text-xs text-foreground-muted">
              <tr>
                <th className="px-5 py-2 font-medium">Name</th>
                <th className="px-5 py-2 font-medium">Category</th>
                <th className="px-5 py-2 font-medium">Contact</th>
                <th className="px-5 py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {(suppliers ?? []).map((s) => (
                <tr key={s.id} className="border-b border-border-subtle last:border-0">
                  <td className="px-5 py-2.5 font-medium">{s.name}</td>
                  <td className="px-5 py-2.5 text-foreground-muted">{s.category ?? "-"}</td>
                  <td className="px-5 py-2.5 text-foreground-muted">{s.contact_email ?? "-"}</td>
                  <td className="px-5 py-2.5"><StatusBadge status={s.status} /></td>
                </tr>
              ))}
              {!suppliers?.length && (
                <tr>
                  <td colSpan={4} className="px-5 py-6 text-center text-foreground-muted">No suppliers yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-xl font-semibold">Purchase orders</h2>
        <div className="overflow-hidden rounded-xl border border-border-subtle bg-surface-raised">
          <table className="w-full text-sm">
            <thead className="border-b border-border-subtle text-left text-xs text-foreground-muted">
              <tr>
                <th className="px-5 py-2 font-medium">PO #</th>
                <th className="px-5 py-2 font-medium">Supplier</th>
                <th className="px-5 py-2 font-medium">Amount</th>
                <th className="px-5 py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {(orders ?? []).map((o) => {
                const s = o.suppliers as unknown as { name: string } | null;
                return (
                  <tr key={o.id} className="border-b border-border-subtle last:border-0">
                    <td className="px-5 py-2.5 font-medium">{o.po_number}</td>
                    <td className="px-5 py-2.5 text-foreground-muted">{s?.name ?? "-"}</td>
                    <td className="px-5 py-2.5 tabular-nums">{o.amount}</td>
                    <td className="px-5 py-2.5"><StatusBadge status={o.status} /></td>
                  </tr>
                );
              })}
              {!orders?.length && (
                <tr>
                  <td colSpan={4} className="px-5 py-6 text-center text-foreground-muted">No purchase orders yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
