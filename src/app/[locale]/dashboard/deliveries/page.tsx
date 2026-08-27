import { createClient } from "@/lib/supabase/server";
import { DeliveriesTable, type Delivery } from "./deliveries-table";

export default async function DeliveriesPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("deliveries")
    .select("id, status, signature_url, photo_url, shipments(shipment_no), drivers(name)")
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <div className="p-8">
      <h1 className="mb-4 text-2xl font-semibold">Deliveries</h1>
      {error && <p className="text-sm text-red-600">{error.message}</p>}
      <DeliveriesTable data={(data as unknown as Delivery[]) ?? []} />
    </div>
  );
}
