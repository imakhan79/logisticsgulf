import { createClient } from "@/lib/supabase/server";
import { InventoryTable, type InventoryItem } from "./inventory-table";

export default async function InventoryPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("inventory")
    .select("id, sku, product, quantity, warehouses(name)")
    .order("product")
    .limit(100);

  return (
    <div className="p-8">
      <h1 className="mb-4 text-2xl font-semibold">Inventory</h1>
      {error && <p className="text-sm text-red-600">{error.message}</p>}
      <InventoryTable data={(data as unknown as InventoryItem[]) ?? []} />
    </div>
  );
}
