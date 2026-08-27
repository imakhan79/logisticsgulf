import { createClient } from "@/lib/supabase/server";
import { can } from "@/lib/permissions";
import { NoAccess } from "@/components/no-access";
import { StatusBadge } from "@/components/ui/status-badge";

const TYPE_LABEL: Record<string, string> = {
  vessel_booking: "Vessel booking",
  container_movement: "Container movement",
  gate_entry: "Gate entry",
  gate_exit: "Gate exit",
};

export default async function PortsPage() {
  if (!(await can("ports.view"))) return <NoAccess module="ports" />;

  const supabase = await createClient();
  const { data: activities, error } = await supabase
    .from("port_activities")
    .select("id, activity_type, reference_no, status, scheduled_at")
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <div className="p-8">
      <h1 className="mb-4 text-2xl font-semibold">Port activity</h1>
      {error && <p className="text-sm text-red-600">{error.message}</p>}
      <div className="overflow-hidden rounded-xl border border-border-subtle bg-surface-raised">
        <table className="w-full text-sm">
          <thead className="border-b border-border-subtle text-left text-xs text-foreground-muted">
            <tr>
              <th className="px-5 py-2 font-medium">Type</th>
              <th className="px-5 py-2 font-medium">Reference</th>
              <th className="px-5 py-2 font-medium">Status</th>
              <th className="px-5 py-2 font-medium">Scheduled</th>
            </tr>
          </thead>
          <tbody>
            {(activities ?? []).map((a) => (
              <tr key={a.id} className="border-b border-border-subtle last:border-0">
                <td className="px-5 py-2.5 font-medium">{TYPE_LABEL[a.activity_type] ?? a.activity_type}</td>
                <td className="px-5 py-2.5 text-foreground-muted">{a.reference_no}</td>
                <td className="px-5 py-2.5"><StatusBadge status={a.status} /></td>
                <td className="px-5 py-2.5 text-foreground-muted">
                  {a.scheduled_at ? new Date(a.scheduled_at).toLocaleString() : "-"}
                </td>
              </tr>
            ))}
            {!activities?.length && (
              <tr>
                <td colSpan={4} className="px-5 py-6 text-center text-foreground-muted">
                  No port activity yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
