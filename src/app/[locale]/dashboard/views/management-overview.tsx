import { Package, Truck, ClipboardList, Wallet, IdCard, Ship } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { OverviewChart } from "../overview-chart";
import type { DashboardContext } from "./types";

type DashboardStats = {
  shipments_total: number;
  shipments_in_transit: number;
  orders_total: number;
  revenue_unpaid: number;
  revenue_paid: number;
  active_vehicles: number;
  active_drivers: number;
};

export async function ManagementOverview({ ctx }: { ctx: DashboardContext }) {
  const { supabase, companyId } = ctx;

  const [{ data: statsRaw }, { data: shipments }] = await Promise.all([
    supabase.rpc("get_dashboard_stats", { target_company_id: companyId }),
    supabase.from("shipments").select("status"),
  ]);
  const stats = statsRaw as unknown as DashboardStats | null;

  const statusCounts = Object.entries(
    (shipments ?? []).reduce<Record<string, number>>((acc, s) => {
      acc[s.status] = (acc[s.status] ?? 0) + 1;
      return acc;
    }, {}),
  ).map(([status, count]) => ({ status, count }));

  return (
    <>
      {stats && (
        <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          <KpiCard label="Shipments" value={stats.shipments_total} icon={<Package className="h-4 w-4" />} accent="navy" />
          <KpiCard label="In transit" value={stats.shipments_in_transit} icon={<Ship className="h-4 w-4" />} accent="ocean" />
          <KpiCard label="Orders" value={stats.orders_total} icon={<ClipboardList className="h-4 w-4" />} accent="teal" />
          <KpiCard label="Active vehicles" value={stats.active_vehicles} icon={<Truck className="h-4 w-4" />} accent="navy" />
          <KpiCard label="Active drivers" value={stats.active_drivers} icon={<IdCard className="h-4 w-4" />} accent="ocean" />
          <KpiCard label="Revenue collected" value={stats.revenue_paid} icon={<Wallet className="h-4 w-4" />} accent="teal" />
          <KpiCard label="Revenue outstanding" value={stats.revenue_unpaid} icon={<Wallet className="h-4 w-4" />} accent="gold" />
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Your companies</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1 text-sm">
              {ctx.memberships.map((m, i) => (
                <li key={i} className="rounded-lg border border-border-subtle px-3 py-2">
                  {m.companyName} — {m.roleName}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Shipments by status</CardTitle>
          </CardHeader>
          <CardContent>
            <OverviewChart data={statusCounts} />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
