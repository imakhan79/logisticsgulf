import { FileCheck, Clock, Search, AlertOctagon } from "lucide-react";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import type { DashboardContext } from "./types";

export async function CustomsDashboard({ ctx }: { ctx: DashboardContext }) {
  const { supabase, companyId } = ctx;

  const { data: declarations } = await supabase
    .from("customs_declarations")
    .select("id, declaration_no, status, shipments(shipment_no)")
    .eq("company_id", companyId)
    .order("created_at", { ascending: false });

  const counts = (status: string) => (declarations ?? []).filter((d) => d.status === status).length;

  return (
    <>
      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <KpiCard label="Pending clearance" value={counts("submitted")} icon={<Clock className="h-4 w-4" />} accent="gold" />
        <KpiCard label="Under inspection" value={counts("under_inspection")} icon={<Search className="h-4 w-4" />} accent="ocean" />
        <KpiCard label="Cleared" value={counts("cleared")} icon={<FileCheck className="h-4 w-4" />} accent="teal" />
        <KpiCard label="Customs holds" value={counts("held")} icon={<AlertOctagon className="h-4 w-4" />} accent="navy" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Declarations</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ul className="divide-y divide-border-subtle">
            {(declarations ?? []).map((d) => {
              const s = d.shipments as unknown as { shipment_no: string } | null;
              return (
                <li key={d.id} className="flex items-center justify-between px-5 py-2.5 text-sm">
                  <span>
                    <span className="font-medium">{d.declaration_no}</span>
                    {s && <span className="ml-2 text-foreground-muted">{s.shipment_no}</span>}
                  </span>
                  <StatusBadge status={d.status} />
                </li>
              );
            })}
            {!declarations?.length && (
              <li className="px-5 py-6 text-center text-sm text-foreground-muted">No declarations yet.</li>
            )}
          </ul>
        </CardContent>
      </Card>
    </>
  );
}
