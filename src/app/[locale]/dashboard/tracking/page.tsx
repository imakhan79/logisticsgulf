import { createClient } from "@/lib/supabase/server";
import { can } from "@/lib/permissions";
import { NoAccess } from "@/components/no-access";
import { MapLocationEmbed } from "@/components/map-embed";

export default async function TrackingPage() {
  if (!(await can("vehicles.view"))) return <NoAccess module="tracking" />;

  const supabase = await createClient();
  const { data: vehicles } = await supabase
    .from("vehicles")
    .select("id, plate_no, status, last_lat, last_lng, last_location_at")
    .order("plate_no")
    .limit(50);

  const withLocation = (vehicles ?? []).filter((v) => v.last_lat != null && v.last_lng != null);
  const withoutLocation = (vehicles ?? []).filter((v) => v.last_lat == null || v.last_lng == null);

  return (
    <div className="p-8">
      <h1 className="mb-2 text-2xl font-semibold">Live tracking</h1>
      <p className="mb-6 max-w-lg text-sm text-neutral-500">
        Vehicles report position by writing to <code>vehicles.last_lat</code>/
        <code>last_lng</code> (Realtime-enabled). No GPS device feed is connected yet, so this
        page will fill in once one starts writing updates.
      </p>

      {withLocation.length > 0 && (
        <div className="mb-8 grid gap-4 md:grid-cols-2">
          {withLocation.map((v) => (
            <div key={v.id} className="rounded-lg border p-3">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-medium">{v.plate_no}</span>
                <span className="text-neutral-500">{v.status}</span>
              </div>
              <MapLocationEmbed lat={v.last_lat!} lng={v.last_lng!} label={v.plate_no} className="h-48 w-full rounded-md border" />
              <p className="mt-1 text-xs text-neutral-400">
                Updated {v.last_location_at ? new Date(v.last_location_at).toLocaleString() : "-"}
              </p>
            </div>
          ))}
        </div>
      )}

      {withoutLocation.length > 0 && (
        <div>
          <h2 className="mb-2 text-sm font-medium text-neutral-700">No location data yet</h2>
          <ul className="space-y-1 text-sm text-neutral-500">
            {withoutLocation.map((v) => (
              <li key={v.id} className="rounded border px-3 py-2">
                {v.plate_no} — {v.status}
              </li>
            ))}
          </ul>
        </div>
      )}

      {!vehicles?.length && <p className="text-sm text-neutral-400">No vehicles yet.</p>}
    </div>
  );
}
