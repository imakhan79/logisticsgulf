import { Warehouse, Boxes, PackageCheck, Clock } from "lucide-react";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DashboardContext } from "./types";

export async function WarehouseDashboard({ ctx }: { ctx: DashboardContext }) {
  const { supabase, companyId } = ctx;

  const [{ data: warehouses }, { data: inventory }, { count: pendingDeliveries }] = await Promise.all([
    supabase.from("warehouses").select("id, name, capacity").eq("company_id", companyId),
    supabase.from("inventory").select("id, sku, product, quantity, warehouses(name)").eq("company_id", companyId).order("quantity"),
    supabase.from("deliveries").select("*", { count: "exact", head: true }).eq("company_id", companyId).eq("status", "pending"),
  ]);

  const totalStock = (inventory ?? []).reduce((sum, i) => sum + Number(i.quantity), 0);
  const lowStock = (inventory ?? []).filter((i) => Number(i.quantity) < 10);

  return (
    <>
      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <KpiCard label="Warehouses" value={warehouses?.length ?? 0} icon={<Warehouse className="h-4 w-4" />} accent="navy" />
        <KpiCard label="Total stock units" value={totalStock} icon={<Boxes className="h-4 w-4" />} accent="teal" />
        <KpiCard label="Pending deliveries" value={pendingDeliveries ?? 0} icon={<PackageCheck className="h-4 w-4" />} accent="ocean" />
        <KpiCard label="Low stock items" value={lowStock.length} icon={<Clock className="h-4 w-4" />} accent="gold" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Inventory</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead className="border-b border-border-subtle text-left text-xs text-foreground-muted">
              <tr>
                <th className="px-5 py-2 font-medium">SKU</th>
                <th className="px-5 py-2 font-medium">Product</th>
                <th className="px-5 py-2 font-medium">Warehouse</th>
                <th className="px-5 py-2 font-medium">Quantity</th>
              </tr>
            </thead>
            <tbody>
              {(inventory ?? []).map((i) => {
                const w = i.warehouses as unknown as { name: string } | null;
                return (
                  <tr key={i.id} className="border-b border-border-subtle last:border-0">
                    <td className="px-5 py-2.5 font-medium">{i.sku}</td>
                    <td className="px-5 py-2.5">{i.product}</td>
                    <td className="px-5 py-2.5 text-foreground-muted">{w?.name ?? "-"}</td>
                    <td className="px-5 py-2.5 tabular-nums">{i.quantity}</td>
                  </tr>
                );
              })}
              {!inventory?.length && (
                <tr>
                  <td colSpan={4} className="px-5 py-6 text-center text-foreground-muted">
                    No inventory yet.
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
