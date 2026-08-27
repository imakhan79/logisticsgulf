import { Users, IdCard, UserCheck } from "lucide-react";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DashboardContext } from "./types";

export async function HrDashboard({ ctx }: { ctx: DashboardContext }) {
  const { supabase, companyId } = ctx;

  const [{ data: members }, { data: drivers }] = await Promise.all([
    supabase
      .from("user_companies")
      .select("id, is_active, created_at, users(email, full_name), roles(name)")
      .eq("company_id", companyId)
      .order("created_at", { ascending: false }),
    supabase.from("drivers").select("id, status").eq("company_id", companyId),
  ]);

  const active = (members ?? []).filter((m) => m.is_active).length;
  const activeDrivers = (drivers ?? []).filter((d) => d.status === "active").length;

  return (
    <>
      <p className="mb-4 text-xs text-foreground-muted">
        Team roster from company membership. Contracts, training, and document tracking aren&apos;t modeled yet.
      </p>

      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-3">
        <KpiCard label="Team members" value={members?.length ?? 0} icon={<Users className="h-4 w-4" />} accent="navy" />
        <KpiCard label="Active" value={active} icon={<UserCheck className="h-4 w-4" />} accent="teal" />
        <KpiCard label="Active drivers" value={activeDrivers} icon={<IdCard className="h-4 w-4" />} accent="ocean" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Team</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead className="border-b border-border-subtle text-left text-xs text-foreground-muted">
              <tr>
                <th className="px-5 py-2 font-medium">Name</th>
                <th className="px-5 py-2 font-medium">Email</th>
                <th className="px-5 py-2 font-medium">Role</th>
                <th className="px-5 py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {(members ?? []).map((m) => {
                const u = m.users as unknown as { email: string; full_name: string | null } | null;
                const r = m.roles as unknown as { name: string } | null;
                return (
                  <tr key={m.id} className="border-b border-border-subtle last:border-0">
                    <td className="px-5 py-2.5 font-medium">{u?.full_name || "-"}</td>
                    <td className="px-5 py-2.5 text-foreground-muted">{u?.email}</td>
                    <td className="px-5 py-2.5 text-foreground-muted">{r?.name}</td>
                    <td className="px-5 py-2.5">{m.is_active ? "Active" : "Inactive"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </>
  );
}
