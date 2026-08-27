import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { can } from "@/lib/permissions";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";
import { NAV_GROUPS } from "@/components/dashboard/nav-config";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect(`/${locale}/login`);

  const permissionKeys = Array.from(
    new Set(NAV_GROUPS.flatMap((g) => g.items.map((i) => i.permission).filter(Boolean) as string[])),
  );

  const [results, { data: notifications }] = await Promise.all([
    Promise.all(permissionKeys.map((key) => can(key))),
    supabase
      .from("notifications")
      .select("id, type, title, message, read, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20),
  ]);

  const visiblePermissions = new Set(permissionKeys.filter((_, i) => results[i]));

  return (
    <div className="flex min-h-screen">
      <Sidebar locale={locale} visiblePermissions={visiblePermissions} />
      <div className="flex flex-1 flex-col">
        <Topbar locale={locale} userEmail={user.email ?? ""} notifications={notifications ?? []} />
        <div className="flex-1 bg-surface">{children}</div>
      </div>
    </div>
  );
}
