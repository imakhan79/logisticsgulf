import { FileText, TrendingUp, Percent } from "lucide-react";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import type { DashboardContext } from "./types";

const PIPELINE = ["draft", "pending_approval", "approved", "accepted", "converted"];

export async function SalesDashboard({ ctx }: { ctx: DashboardContext }) {
  const { supabase, companyId } = ctx;

  const { data: quotes } = await supabase
    .from("quotes")
    .select("id, quote_no, status, amount, customers(name), created_at")
    .eq("company_id", companyId)
    .order("created_at", { ascending: false });

  const counts = PIPELINE.reduce<Record<string, number>>((acc, status) => {
    acc[status] = (quotes ?? []).filter((q) => q.status === status).length;
    return acc;
  }, {});
  const converted = counts.converted ?? 0;
  const total = quotes?.length ?? 0;
  const conversionRate = total ? Math.round((converted / total) * 100) : 0;
  const pipelineValue = (quotes ?? [])
    .filter((q) => !["converted", "rejected"].includes(q.status))
    .reduce((sum, q) => sum + Number(q.amount ?? 0), 0);

  return (
    <>
      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-3">
        <KpiCard label="Total quotes" value={total} icon={<FileText className="h-4 w-4" />} accent="navy" />
        <KpiCard label="Pipeline value" value={pipelineValue} icon={<TrendingUp className="h-4 w-4" />} accent="teal" />
        <KpiCard label="Conversion rate" value={conversionRate} suffix="%" icon={<Percent className="h-4 w-4" />} accent="gold" />
      </div>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Pipeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {PIPELINE.map((status) => (
              <div key={status} className="flex-1 min-w-[100px] rounded-lg border border-border-subtle p-3 text-center">
                <div className="text-xl font-semibold tabular-nums">{counts[status] ?? 0}</div>
                <div className="mt-1 text-xs capitalize text-foreground-muted">{status.replace(/_/g, " ")}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent quotes</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ul className="divide-y divide-border-subtle">
            {(quotes ?? []).slice(0, 8).map((q) => {
              const customer = q.customers as unknown as { name: string } | null;
              return (
                <li key={q.id} className="flex items-center justify-between px-5 py-2.5 text-sm">
                  <span>
                    <span className="font-medium">{q.quote_no}</span>
                    <span className="ml-2 text-foreground-muted">{customer?.name}</span>
                  </span>
                  <StatusBadge status={q.status} />
                </li>
              );
            })}
            {!quotes?.length && (
              <li className="px-5 py-6 text-center text-sm text-foreground-muted">No quotes yet.</li>
            )}
          </ul>
        </CardContent>
      </Card>
    </>
  );
}
