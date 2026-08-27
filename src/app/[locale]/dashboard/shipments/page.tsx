import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { can } from "@/lib/permissions";
import { ShipmentsTable, type Shipment } from "./shipments-table";

export default async function ShipmentsPage() {
  const supabase = await createClient();

  const [{ data, error }, canCreate] = await Promise.all([
    supabase
      .from("shipments")
      .select("id, shipment_no, status, eta, created_at")
      .order("created_at", { ascending: false })
      .limit(50),
    can("shipments.create"),
  ]);

  return (
    <div className="p-8">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Shipments</h1>
        {canCreate && (
          <Link
            href="shipments/new"
            className="rounded-md bg-neutral-900 px-3 py-2 text-sm font-medium text-white"
          >
            New shipment
          </Link>
        )}
      </div>

      {error && <p className="text-sm text-red-600">{error.message}</p>}

      <ShipmentsTable data={(data as Shipment[]) ?? []} />
    </div>
  );
}
