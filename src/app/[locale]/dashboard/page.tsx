import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Package, Truck, ClipboardList, Wallet, IdCard, Ship } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { OverviewChart } from "./overview-chart";
import { CreateCompanyForm } from "./create-company-form";

type DashboardStats = {
  shipments_total: number;
  shipments_in_transit: number;
  orders_total: number;
  revenue_unpaid: number;
  revenue_paid: number;
  active_vehicles: number;
  active_drivers: number;
};

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect(`/${locale}/login`);

  const { data: memberships } = await supabase
    .from("user_companies")
    .select("company_id, companies(name), roles(name)")
    .eq("user_id", user.id);

  const t = await getTranslations("dashboard");

  if (!memberships?.length) {
    const { data: countries } = await supabase.from("countries").select("id, name").order("name");

    return (
      <div className="p-8">
        <h1 className="text-2xl font-semibold">{t("title")}</h1>
        <p className="mt-1 text-sm text-foreground-muted">{t("signedInAs", { email: user.email ?? "" })}</p>
        <div className="mt-6">
          <CreateCompanyForm countries={countries ?? []} />
        </div>
      </div>
    );
  }

  const company = memberships[0].companies as unknown as { name: string } | null;
  const role = memberships[0].roles as unknown as { name: string } | null;
  const companyId = memberships[0].company_id;

  const [{ data: statsRaw }, { data: shipments }] = await Promise.all([
    supabase.rpc("get_dashboard_stats", { target_company_id: companyId }),
    supabase.from("shipments").select("status"),
  ]);
  const stats = statsRaw as unknown as DashboardStats | null;

  const statusCounts = Object.entries(
    (shipments ?? []).reduce<Record<string, number>>((acc, s) => {
      acc[s.status] = (acc[s.status] ?? 0) + 1;
      return acc;
    }, {}),
  ).map(([status, count]) => ({ status, count }));

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">{t("title")}</h1>
        <p className="mt-1 text-sm text-foreground-muted">
          {company?.name} · {role?.name}
        </p>
      </div>

      {stats && (
        <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          <KpiCard label="Shipments" value={stats.shipments_total} icon={Package} accent="navy" />
          <KpiCard label="In transit" value={stats.shipments_in_transit} icon={Ship} accent="ocean" />
          <KpiCard label="Orders" value={stats.orders_total} icon={ClipboardList} accent="teal" />
          <KpiCard label="Active vehicles" value={stats.active_vehicles} icon={Truck} accent="navy" />
          <KpiCard label="Active drivers" value={stats.active_drivers} icon={IdCard} accent="ocean" />
          <KpiCard label="Revenue collected" value={stats.revenue_paid} icon={Wallet} accent="teal" />
          <KpiCard label="Revenue outstanding" value={stats.revenue_unpaid} icon={Wallet} accent="gold" />
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t("yourCompanies")}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1 text-sm">
              {memberships.map((m, i) => {
                const c = m.companies as unknown as { name: string } | null;
                const r = m.roles as unknown as { name: string } | null;
                return (
                  <li key={i} className="rounded-lg border border-border-subtle px-3 py-2">
                    {c?.name} — {r?.name}
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Shipments by status</CardTitle>
          </CardHeader>
          <CardContent>
            <OverviewChart data={statusCounts} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
