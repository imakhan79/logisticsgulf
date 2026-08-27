import Link from "next/link";
import { ClipboardList, Truck, IdCard, AlertTriangle } from "lucide-react";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DashboardContext } from "./types";

export async function DispatcherDashboard({ ctx }: { ctx: DashboardContext }) {
  const { supabase, companyId, locale } = ctx;

  const [{ data: unassigned }, { count: availableVehicles }, { count: availableDrivers }, { data: delayed }] =
    await Promise.all([
      supabase
        .from("shipments")
        .select("id, shipment_no, status, created_at")
        .eq("company_id", companyId)
        .eq("status", "pending")
        .order("created_at", { ascending: false }),
      supabase.from("vehicles").select("*", { count: "exact", head: true }).eq("company_id", companyId).eq("status", "active"),
      supabase.from("drivers").select("*", { count: "exact", head: true }).eq("company_id", companyId).eq("status", "active"),
      supabase
        .from("shipments")
        .select("id")
        .eq("company_id", companyId)
        .eq("status", "in_transit")
        .lt("eta", new Date().toISOString()),
    ]);

  return (
    <>
      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <KpiCard label="Unassigned shipments" value={unassigned?.length ?? 0} icon={<ClipboardList className="h-4 w-4" />} accent="gold" />
        <KpiCard label="Available vehicles" value={availableVehicles ?? 0} icon={<Truck className="h-4 w-4" />} accent="navy" />
        <KpiCard label="Available drivers" value={availableDrivers ?? 0} icon={<IdCard className="h-4 w-4" />} accent="ocean" />
        <KpiCard label="Delayed trips" value={delayed?.length ?? 0} icon={<AlertTriangle className="h-4 w-4" />} accent="teal" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Awaiting dispatch</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ul className="divide-y divide-border-subtle">
            {(unassigned ?? []).map((s) => (
              <li key={s.id} className="flex items-center justify-between px-5 py-3 text-sm">
                <span className="font-medium">{s.shipment_no}</span>
                <Link
                  href={`/${locale}/dashboard/shipments/${s.id}`}
                  className="rounded-lg bg-navy-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-navy-800"
                >
                  Dispatch
                </Link>
              </li>
            ))}
            {!unassigned?.length && (
              <li className="px-5 py-6 text-center text-sm text-foreground-muted">
                Nothing waiting — all shipments are dispatched.
              </li>
            )}
          </ul>
        </CardContent>
      </Card>
    </>
  );
}
