import { Inbox, AlertTriangle, Clock3, PackageX } from "lucide-react";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import type { DashboardContext } from "./types";

export async function CustomerServiceDashboard({ ctx }: { ctx: DashboardContext }) {
  const { supabase, companyId } = ctx;

  const [{ data: tickets }, { data: delayedShipments }] = await Promise.all([
    supabase
      .from("support_tickets")
      .select("id, subject, status, priority, customers(name)")
      .eq("company_id", companyId)
      .order("created_at", { ascending: false }),
    supabase
      .from("shipments")
      .select("id")
      .eq("company_id", companyId)
      .eq("status", "in_transit")
      .lt("eta", new Date().toISOString()),
  ]);

  const open = (tickets ?? []).filter((t) => t.status === "open").length;
  const urgent = (tickets ?? []).filter((t) => t.priority === "urgent" && t.status !== "closed").length;

  return (
    <>
      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <KpiCard label="Open tickets" value={open} icon={<Inbox className="h-4 w-4" />} accent="navy" />
        <KpiCard label="Urgent tickets" value={urgent} icon={<AlertTriangle className="h-4 w-4" />} accent="gold" />
        <KpiCard label="Delayed shipments" value={delayedShipments?.length ?? 0} icon={<PackageX className="h-4 w-4" />} accent="ocean" />
        <KpiCard label="Total tickets" value={tickets?.length ?? 0} icon={<Clock3 className="h-4 w-4" />} accent="teal" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ticket queue</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ul className="divide-y divide-border-subtle">
            {(tickets ?? []).map((t) => {
              const c = t.customers as unknown as { name: string } | null;
              return (
                <li key={t.id} className="flex items-center justify-between px-5 py-2.5 text-sm">
                  <span>
                    <span className="font-medium">{t.subject}</span>
                    {c && <span className="ml-2 text-foreground-muted">{c.name}</span>}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs capitalize text-foreground-muted">{t.priority}</span>
                    <StatusBadge status={t.status} />
                  </div>
                </li>
              );
            })}
            {!tickets?.length && (
              <li className="px-5 py-6 text-center text-sm text-foreground-muted">No tickets yet.</li>
            )}
          </ul>
        </CardContent>
      </Card>
    </>
  );
}
