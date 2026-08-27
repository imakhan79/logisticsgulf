import { Package, Truck, AlertTriangle, CalendarCheck } from "lucide-react";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import type { DashboardContext } from "./types";

export async function OperationsDashboard({ ctx }: { ctx: DashboardContext }) {
  const { supabase, companyId } = ctx;
  const today = new Date().toISOString().slice(0, 10);

  const [{ data: activeShipments }, { data: allShipments }, { count: availableVehicles }, { count: availableDrivers }] =
    await Promise.all([
      supabase
        .from("shipments")
        .select("id, shipment_no, status, eta, vehicles(plate_no), drivers(name)")
        .eq("company_id", companyId)
        .in("status", ["pending", "in_transit"])
        .order("created_at", { ascending: false })
        .limit(10),
      supabase.from("shipments").select("id, status, eta").eq("company_id", companyId),
      supabase.from("vehicles").select("*", { count: "exact", head: true }).eq("company_id", companyId).eq("status", "active"),
      supabase.from("drivers").select("*", { count: "exact", head: true }).eq("company_id", companyId).eq("status", "active"),
    ]);

  const deliveredToday = (allShipments ?? []).filter(
    (s) => s.status === "delivered",
  ).length;
  const delayed = (allShipments ?? []).filter(
    (s) => s.eta && new Date(s.eta) < new Date() && s.status !== "delivered",
  ).length;
  const active = (allShipments ?? []).filter((s) => s.status === "in_transit").length;

  return (
    <>
      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <KpiCard label="Active shipments" value={active} icon={<Package className="h-4 w-4" />} accent="navy" />
        <KpiCard label="Delivered" value={deliveredToday} icon={<CalendarCheck className="h-4 w-4" />} accent="teal" />
        <KpiCard label="Delayed" value={delayed} icon={<AlertTriangle className="h-4 w-4" />} accent="gold" />
        <KpiCard label="Available vehicles" value={availableVehicles ?? 0} icon={<Truck className="h-4 w-4" />} accent="ocean" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Control tower — active shipments</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead className="border-b border-border-subtle text-left text-xs text-foreground-muted">
              <tr>
                <th className="px-5 py-2 font-medium">Shipment</th>
                <th className="px-5 py-2 font-medium">Vehicle</th>
                <th className="px-5 py-2 font-medium">Driver</th>
                <th className="px-5 py-2 font-medium">Status</th>
                <th className="px-5 py-2 font-medium">ETA</th>
              </tr>
            </thead>
            <tbody>
              {(activeShipments ?? []).map((s) => {
                const v = s.vehicles as unknown as { plate_no: string } | null;
                const d = s.drivers as unknown as { name: string } | null;
                return (
                  <tr key={s.id} className="border-b border-border-subtle last:border-0">
                    <td className="px-5 py-2.5 font-medium">{s.shipment_no}</td>
                    <td className="px-5 py-2.5 text-foreground-muted">{v?.plate_no ?? "-"}</td>
                    <td className="px-5 py-2.5 text-foreground-muted">{d?.name ?? "-"}</td>
                    <td className="px-5 py-2.5"><StatusBadge status={s.status} /></td>
                    <td className="px-5 py-2.5 text-foreground-muted">
                      {s.eta ? new Date(s.eta).toLocaleString() : "-"}
                    </td>
                  </tr>
                );
              })}
              {!activeShipments?.length && (
                <tr>
                  <td colSpan={5} className="px-5 py-6 text-center text-foreground-muted">
                    No active shipments.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
      <p className="mt-2 text-xs text-foreground-muted">{availableDrivers ?? 0} drivers available.</p>
    </>
  );
}
