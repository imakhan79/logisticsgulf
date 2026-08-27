import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ShipmentsTable, type Shipment } from "./shipments-table";

export default async function ShipmentsPage() {
  const supabase = await createClient();

  // RLS scopes this to the caller's companies automatically.
  const { data, error } = await supabase
    .from("shipments")
    .select("id, tracking_number, status, origin_address, destination_address, created_at")
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <div className="p-8">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Shipments</h1>
        <Link
          href="shipments/new"
          className="rounded-md bg-neutral-900 px-3 py-2 text-sm font-medium text-white"
        >
          New shipment
        </Link>
      </div>

      {error && <p className="text-sm text-red-600">{error.message}</p>}

      <ShipmentsTable data={(data as Shipment[]) ?? []} />
    </div>
  );
}
