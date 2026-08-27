import { Building2, ClipboardList, Wallet } from "lucide-react";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import type { DashboardContext } from "./types";

export async function ProcurementDashboard({ ctx }: { ctx: DashboardContext }) {
  const { supabase, companyId } = ctx;

  const [{ data: suppliers }, { data: orders }] = await Promise.all([
    supabase.from("suppliers").select("id, name, category, status").eq("company_id", companyId),
    supabase.from("purchase_orders").select("id, po_number, amount, status, suppliers(name)").eq("company_id", companyId).order("created_at", { ascending: false }),
  ]);

  const totalSpend = (orders ?? []).reduce((sum, o) => sum + Number(o.amount), 0);
  const pending = (orders ?? []).filter((o) => o.status === "sent").length;

  return (
    <>
      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-3">
        <KpiCard label="Suppliers" value={suppliers?.length ?? 0} icon={<Building2 className="h-4 w-4" />} accent="navy" />
        <KpiCard label="Pending orders" value={pending} icon={<ClipboardList className="h-4 w-4" />} accent="gold" />
        <KpiCard label="Total spend" value={totalSpend} icon={<Wallet className="h-4 w-4" />} accent="teal" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Purchase orders</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ul className="divide-y divide-border-subtle">
            {(orders ?? []).map((o) => {
              const s = o.suppliers as unknown as { name: string } | null;
              return (
                <li key={o.id} className="flex items-center justify-between px-5 py-2.5 text-sm">
                  <span>
                    <span className="font-medium">{o.po_number}</span>
                    {s && <span className="ml-2 text-foreground-muted">{s.name}</span>}
                    <span className="ml-2 text-foreground-muted">{o.amount}</span>
                  </span>
                  <StatusBadge status={o.status} />
                </li>
              );
            })}
            {!orders?.length && (
              <li className="px-5 py-6 text-center text-sm text-foreground-muted">No purchase orders yet.</li>
            )}
          </ul>
        </CardContent>
      </Card>
    </>
  );
}
