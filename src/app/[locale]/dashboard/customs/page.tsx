import { createClient } from "@/lib/supabase/server";
import { can } from "@/lib/permissions";
import { NoAccess } from "@/components/no-access";
import { StatusBadge } from "@/components/ui/status-badge";

export default async function CustomsPage() {
  if (!(await can("customs.view"))) return <NoAccess module="customs" />;

  const supabase = await createClient();
  const { data: declarations, error } = await supabase
    .from("customs_declarations")
    .select("id, declaration_no, status, notes, shipments(shipment_no)")
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <div className="p-8">
      <h1 className="mb-4 text-2xl font-semibold">Customs declarations</h1>
      {error && <p className="text-sm text-red-600">{error.message}</p>}
      <div className="overflow-hidden rounded-xl border border-border-subtle bg-surface-raised">
        <table className="w-full text-sm">
          <thead className="border-b border-border-subtle text-left text-xs text-foreground-muted">
            <tr>
              <th className="px-5 py-2 font-medium">Declaration #</th>
              <th className="px-5 py-2 font-medium">Shipment</th>
              <th className="px-5 py-2 font-medium">Status</th>
              <th className="px-5 py-2 font-medium">Notes</th>
            </tr>
          </thead>
          <tbody>
            {(declarations ?? []).map((d) => {
              const s = d.shipments as unknown as { shipment_no: string } | null;
              return (
                <tr key={d.id} className="border-b border-border-subtle last:border-0">
                  <td className="px-5 py-2.5 font-medium">{d.declaration_no}</td>
                  <td className="px-5 py-2.5 text-foreground-muted">{s?.shipment_no ?? "-"}</td>
                  <td className="px-5 py-2.5"><StatusBadge status={d.status} /></td>
                  <td className="px-5 py-2.5 text-foreground-muted">{d.notes ?? "-"}</td>
                </tr>
              );
            })}
            {!declarations?.length && (
              <tr>
                <td colSpan={4} className="px-5 py-6 text-center text-foreground-muted">
                  No declarations yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
