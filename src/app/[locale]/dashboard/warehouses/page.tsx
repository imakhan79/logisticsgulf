import { createClient } from "@/lib/supabase/server";
import { WarehousesTable, type Warehouse } from "./warehouses-table";

export default async function WarehousesPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("warehouses")
    .select("id, name, capacity, is_active")
    .order("name")
    .limit(100);

  return (
    <div className="p-8">
      <h1 className="mb-4 text-2xl font-semibold">Warehouses</h1>
      {error && <p className="text-sm text-red-600">{error.message}</p>}
      <WarehousesTable data={(data as Warehouse[]) ?? []} />
    </div>
  );
}
