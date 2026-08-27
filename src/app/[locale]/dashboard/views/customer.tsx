import { Package, FileText, Receipt } from "lucide-react";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import type { DashboardContext } from "./types";

export async function CustomerDashboard({ ctx }: { ctx: DashboardContext }) {
  const { supabase, companyId } = ctx;

  const [{ data: shipments }, { data: quotes }, { data: invoices }] = await Promise.all([
    supabase.from("shipments").select("id, shipment_no, status, eta").eq("company_id", companyId).order("created_at", { ascending: false }).limit(10),
    supabase.from("quotes").select("id, quote_no, status").eq("company_id", companyId).order("created_at", { ascending: false }).limit(5),
    supabase.from("invoices").select("id, invoice_number, amount, status").eq("company_id", companyId).order("created_at", { ascending: false }).limit(5),
  ]);

  return (
    <>
      <p className="mb-4 text-xs text-foreground-muted">
        Showing your company&apos;s shipments — per-contact scoping isn&apos;t built yet, so this is company-wide rather than
        strictly &quot;your own&quot; orders.
      </p>

      <div className="mb-6 grid grid-cols-3 gap-4">
        <KpiCard label="Shipments" value={shipments?.length ?? 0} icon={<Package className="h-4 w-4" />} accent="navy" />
        <KpiCard label="Quotes" value={quotes?.length ?? 0} icon={<FileText className="h-4 w-4" />} accent="teal" />
        <KpiCard label="Invoices" value={invoices?.length ?? 0} icon={<Receipt className="h-4 w-4" />} accent="gold" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Track your logistics</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ul className="divide-y divide-border-subtle">
            {(shipments ?? []).map((s) => (
              <li key={s.id} className="flex items-center justify-between px-5 py-2.5 text-sm">
                <span className="font-medium">{s.shipment_no}</span>
                <StatusBadge status={s.status} />
              </li>
            ))}
            {!shipments?.length && (
              <li className="px-5 py-6 text-center text-sm text-foreground-muted">No shipments yet.</li>
            )}
          </ul>
        </CardContent>
      </Card>
    </>
  );
}
