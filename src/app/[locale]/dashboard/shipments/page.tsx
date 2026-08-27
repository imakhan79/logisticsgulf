import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { can, getCurrentCompanyId } from "@/lib/permissions";
import { ShipmentsTable, type Shipment } from "./shipments-table";

export default async function ShipmentsPage() {
  const supabase = await createClient();

  const {
    data: { user: debugUser },
  } = await supabase.auth.getUser();
  const debugCompanyId = await getCurrentCompanyId();
  const canCreate = await can("shipments.create");

  const { data, error } = await supabase
    .from("shipments")
    .select("id, shipment_no, status, eta, created_at")
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <div className="p-8">
      <p className="mb-2 rounded bg-yellow-50 p-2 text-xs text-yellow-800">
        DEBUG user={debugUser?.email} company={debugCompanyId} canCreate={String(canCreate)}
      </p>
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
