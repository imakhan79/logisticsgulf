import { Truck, CheckCircle2, XCircle } from "lucide-react";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import type { DashboardContext } from "./types";

export async function FleetDashboard({ ctx }: { ctx: DashboardContext }) {
  const { supabase, companyId } = ctx;

  const { data: vehicles } = await supabase
    .from("vehicles")
    .select("id, plate_no, vehicle_type, capacity, status")
    .eq("company_id", companyId)
    .order("plate_no");

  const total = vehicles?.length ?? 0;
  const active = (vehicles ?? []).filter((v) => v.status === "active").length;
  const inactive = total - active;

  return (
    <>
      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-3">
        <KpiCard label="Total vehicles" value={total} icon={<Truck className="h-4 w-4" />} accent="navy" />
        <KpiCard label="Active" value={active} icon={<CheckCircle2 className="h-4 w-4" />} accent="teal" />
        <KpiCard label="Inactive" value={inactive} icon={<XCircle className="h-4 w-4" />} accent="gold" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Fleet</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead className="border-b border-border-subtle text-left text-xs text-foreground-muted">
              <tr>
                <th className="px-5 py-2 font-medium">Plate</th>
                <th className="px-5 py-2 font-medium">Type</th>
                <th className="px-5 py-2 font-medium">Capacity</th>
                <th className="px-5 py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {(vehicles ?? []).map((v) => (
                <tr key={v.id} className="border-b border-border-subtle last:border-0">
                  <td className="px-5 py-2.5 font-medium">{v.plate_no}</td>
                  <td className="px-5 py-2.5 text-foreground-muted">{v.vehicle_type ?? "-"}</td>
                  <td className="px-5 py-2.5 text-foreground-muted">{v.capacity ?? "-"}</td>
                  <td className="px-5 py-2.5"><StatusBadge status={v.status} /></td>
                </tr>
              ))}
              {!vehicles?.length && (
                <tr>
                  <td colSpan={4} className="px-5 py-6 text-center text-foreground-muted">
                    No vehicles yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
      <p className="mt-3 text-xs text-foreground-muted">
        Maintenance and fuel tracking need their own tables — not built yet, so not shown here rather than faked.
      </p>
    </>
  );
}
