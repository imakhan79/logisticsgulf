import { createClient } from "@/lib/supabase/server";
import { DriversTable, type Driver } from "./drivers-table";

export default async function DriversPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("drivers")
    .select("id, name, license_no, phone, status")
    .order("name")
    .limit(100);

  return (
    <div className="p-8">
      <h1 className="mb-4 text-2xl font-semibold">Drivers</h1>
      {error && <p className="text-sm text-red-600">{error.message}</p>}
      <DriversTable data={(data as Driver[]) ?? []} />
    </div>
  );
}
