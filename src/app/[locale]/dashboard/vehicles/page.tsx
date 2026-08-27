import { createClient } from "@/lib/supabase/server";
import { VehiclesTable, type Vehicle } from "./vehicles-table";

export default async function VehiclesPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("vehicles")
    .select("id, plate_no, vehicle_type, capacity, status")
    .order("plate_no")
    .limit(100);

  return (
    <div className="p-8">
      <h1 className="mb-4 text-2xl font-semibold">Vehicles</h1>
      {error && <p className="text-sm text-red-600">{error.message}</p>}
      <VehiclesTable data={(data as Vehicle[]) ?? []} />
    </div>
  );
}
