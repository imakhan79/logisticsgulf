import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { CreateCompanyForm } from "./create-company-form";
import type { DashboardContext } from "./views/types";
import { ManagementOverview } from "./views/management-overview";
import { SuperAdminDashboard } from "./views/super-admin";
import { OperationsDashboard } from "./views/operations";
import { DispatcherDashboard } from "./views/dispatcher";
import { FleetDashboard } from "./views/fleet";
import { DriverDashboard } from "./views/driver";
import { WarehouseDashboard } from "./views/warehouse";
import { FinanceDashboard } from "./views/finance";
import { SalesDashboard } from "./views/sales";
import { CustomerDashboard } from "./views/customer";
import { AuditorDashboard } from "./views/auditor";

const ROLE_VIEW: Record<string, string> = {
  super_admin: "super_admin",
  operations_manager: "operations",
  dispatcher: "dispatcher",
  fleet_manager: "fleet",
  maintenance_manager: "fleet",
  maintenance_technician: "fleet",
  transport_manager: "fleet",
  driver: "driver",
  warehouse_manager: "warehouse",
  warehouse_staff: "warehouse",
  finance: "finance",
  accountant: "finance",
  sales_manager: "sales",
  sales_executive: "sales",
  freight_forwarding_manager: "sales",
  customer: "customer",
  supplier_vendor: "customer",
  viewer_auditor: "auditor",
  platform_support_admin: "auditor",
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
    .select("company_id, country_id, companies(name), roles(key, name)")
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

  const primary = memberships[0];
  const company = primary.companies as unknown as { name: string } | null;
  const role = primary.roles as unknown as { key: string; name: string } | null;

  const ctx: DashboardContext = {
    supabase,
    locale,
    userId: user.id,
    userEmail: user.email ?? "",
    companyId: primary.company_id,
    countryId: primary.country_id,
    companyName: company?.name ?? "",
    roleKey: role?.key ?? "",
    roleName: role?.name ?? "",
    memberships: memberships.map((m) => ({
      companyName: (m.companies as unknown as { name: string } | null)?.name ?? "",
      roleName: (m.roles as unknown as { name: string } | null)?.name ?? "",
    })),
  };

  const view = ROLE_VIEW[ctx.roleKey];

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">{t("title")}</h1>
        <p className="mt-1 text-sm text-foreground-muted">
          {ctx.companyName} · {ctx.roleName}
        </p>
      </div>

      {view === "super_admin" && <SuperAdminDashboard ctx={ctx} />}
      {view === "operations" && <OperationsDashboard ctx={ctx} />}
      {view === "dispatcher" && <DispatcherDashboard ctx={ctx} />}
      {view === "fleet" && <FleetDashboard ctx={ctx} />}
      {view === "driver" && <DriverDashboard ctx={ctx} />}
      {view === "warehouse" && <WarehouseDashboard ctx={ctx} />}
      {view === "finance" && <FinanceDashboard ctx={ctx} />}
      {view === "sales" && <SalesDashboard ctx={ctx} />}
      {view === "customer" && <CustomerDashboard ctx={ctx} />}
      {view === "auditor" && <AuditorDashboard ctx={ctx} />}
      {!view && <ManagementOverview ctx={ctx} />}
    </div>
  );
}
