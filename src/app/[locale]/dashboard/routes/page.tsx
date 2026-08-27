import { createClient } from "@/lib/supabase/server";
import { can } from "@/lib/permissions";
import { NoAccess } from "@/components/no-access";
import { RoutesTable, type Route } from "./routes-table";

export default async function RoutesPage() {
  if (!(await can("routes.view"))) return <NoAccess module="routes" />;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("routes")
    .select("id, origin, destination, distance, duration")
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <div className="p-8">
      <h1 className="mb-4 text-2xl font-semibold">Routes</h1>
      {error && <p className="text-sm text-red-600">{error.message}</p>}
      <RoutesTable data={(data as Route[]) ?? []} />
    </div>
  );
}
