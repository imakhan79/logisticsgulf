import { Building2, Users, Package, Truck, Wallet, Activity } from "lucide-react";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DashboardContext } from "./types";

export async function SuperAdminDashboard({ ctx }: { ctx: DashboardContext }) {
  const { supabase } = ctx;

  // No company_id filter: RLS's has_permission() bypasses for super_admin,
  // so these genuinely span every company on the platform.
  const [
    { count: companiesCount },
    { count: usersCount },
    { count: shipmentsCount },
    { count: activeVehicles },
    { data: payments },
    { data: companies },
  ] = await Promise.all([
    supabase.from("companies").select("*", { count: "exact", head: true }),
    supabase.from("users").select("*", { count: "exact", head: true }),
    supabase.from("shipments").select("*", { count: "exact", head: true }),
    supabase.from("vehicles").select("*", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("payments").select("amount"),
    supabase.from("companies").select("id, name, status, created_at").order("created_at", { ascending: false }).limit(8),
  ]);

  const totalRevenue = (payments ?? []).reduce((sum, p) => sum + Number(p.amount), 0);

  return (
    <>
      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        <KpiCard label="Companies" value={companiesCount ?? 0} icon={<Building2 className="h-4 w-4" />} accent="navy" />
        <KpiCard label="Platform users" value={usersCount ?? 0} icon={<Users className="h-4 w-4" />} accent="ocean" />
        <KpiCard label="Total shipments" value={shipmentsCount ?? 0} icon={<Package className="h-4 w-4" />} accent="teal" />
        <KpiCard label="Active vehicles" value={activeVehicles ?? 0} icon={<Truck className="h-4 w-4" />} accent="navy" />
        <KpiCard label="Platform revenue" value={totalRevenue} icon={<Wallet className="h-4 w-4" />} accent="gold" />
        <KpiCard label="System status" value={1} suffix=" healthy" icon={<Activity className="h-4 w-4" />} accent="teal" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Companies</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="divide-y divide-border-subtle">
            {(companies ?? []).map((c) => (
              <li key={c.id} className="flex items-center justify-between py-2.5 text-sm">
                <span className="font-medium">{c.name}</span>
                <span className="text-xs capitalize text-foreground-muted">{c.status}</span>
              </li>
            ))}
            {!companies?.length && <li className="py-4 text-sm text-foreground-muted">No companies yet.</li>}
          </ul>
        </CardContent>
      </Card>
    </>
  );
}
