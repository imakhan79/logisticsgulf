import { Ship, Container, Truck, LogIn } from "lucide-react";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import type { DashboardContext } from "./types";

const TYPE_LABEL: Record<string, string> = {
  vessel_booking: "Vessel booking",
  container_movement: "Container movement",
  gate_entry: "Gate entry",
  gate_exit: "Gate exit",
};

export async function PortOperationsDashboard({ ctx }: { ctx: DashboardContext }) {
  const { supabase, companyId } = ctx;

  const { data: activities } = await supabase
    .from("port_activities")
    .select("id, activity_type, reference_no, status, scheduled_at")
    .eq("company_id", companyId)
    .order("created_at", { ascending: false });

  const byType = (type: string) => (activities ?? []).filter((a) => a.activity_type === type).length;

  return (
    <>
      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <KpiCard label="Vessel bookings" value={byType("vessel_booking")} icon={<Ship className="h-4 w-4" />} accent="navy" />
        <KpiCard label="Container movements" value={byType("container_movement")} icon={<Container className="h-4 w-4" />} accent="ocean" />
        <KpiCard label="Gate entries" value={byType("gate_entry")} icon={<LogIn className="h-4 w-4" />} accent="teal" />
        <KpiCard label="Gate exits" value={byType("gate_exit")} icon={<Truck className="h-4 w-4" />} accent="gold" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Port activity</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
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
        </CardContent>
      </Card>
    </>
  );
}
