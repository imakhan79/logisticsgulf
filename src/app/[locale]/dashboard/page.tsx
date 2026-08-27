import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OverviewChart } from "./overview-chart";

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

  const [{ data: memberships }, { data: shipments }] = await Promise.all([
    supabase
      .from("user_companies")
      .select("company_id, companies(name), roles(name)")
      .eq("user_id", user.id),
    supabase.from("shipments").select("status"),
  ]);

  const statusCounts = Object.entries(
    (shipments ?? []).reduce<Record<string, number>>((acc, s) => {
      acc[s.status] = (acc[s.status] ?? 0) + 1;
      return acc;
    }, {}),
  ).map(([status, count]) => ({ status, count }));

  const t = await getTranslations("dashboard");

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold">{t("title")}</h1>
      <p className="mt-1 text-sm text-neutral-500">{t("signedInAs", { email: user.email ?? "" })}</p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t("yourCompanies")}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1 text-sm">
              {memberships?.length ? (
                memberships.map((m, i) => (
                  <li key={i} className="rounded border px-3 py-2">
                    {JSON.stringify(m)}
                  </li>
                ))
              ) : (
                <li className="text-neutral-400">{t("noMembership")}</li>
              )}
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
