import { History } from "lucide-react";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DashboardContext } from "./types";

export async function AuditorDashboard({ ctx }: { ctx: DashboardContext }) {
  const { supabase, companyId } = ctx;

  const { data: entries } = await supabase
    .from("audit_log")
    .select("id, table_name, action, changed_at, users(email)")
    .eq("company_id", companyId)
    .order("changed_at", { ascending: false })
    .limit(25);

  return (
    <>
      <p className="mb-4 text-xs text-foreground-muted">Read-only. No editing controls.</p>
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <KpiCard label="Recent activity" value={entries?.length ?? 0} icon={<History className="h-4 w-4" />} accent="navy" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System activity</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead className="border-b border-border-subtle text-left text-xs text-foreground-muted">
              <tr>
                <th className="px-5 py-2 font-medium">Table</th>
                <th className="px-5 py-2 font-medium">Action</th>
                <th className="px-5 py-2 font-medium">Changed by</th>
                <th className="px-5 py-2 font-medium">When</th>
              </tr>
            </thead>
            <tbody>
              {(entries ?? []).map((e) => {
                const u = e.users as unknown as { email: string } | null;
                return (
                  <tr key={e.id} className="border-b border-border-subtle last:border-0">
                    <td className="px-5 py-2.5 font-medium">{e.table_name}</td>
                    <td className="px-5 py-2.5 capitalize">{e.action}</td>
                    <td className="px-5 py-2.5 text-foreground-muted">{u?.email ?? "-"}</td>
                    <td className="px-5 py-2.5 text-foreground-muted">{new Date(e.changed_at).toLocaleString()}</td>
                  </tr>
                );
              })}
              {!entries?.length && (
                <tr>
                  <td colSpan={4} className="px-5 py-6 text-center text-foreground-muted">
                    No activity yet.
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
