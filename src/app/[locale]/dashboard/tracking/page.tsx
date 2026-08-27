import { ComingSoon } from "@/components/coming-soon";

export default function TrackingPage() {
  return (
    <ComingSoon
      title="Live tracking"
      note="A live map of vehicle/driver GPS positions needs a maps provider (Mapbox or Google Maps) and a device feed writing to vehicles.last_lat/last_lng, which are already wired into Realtime. Tell me which maps provider and API key to use and I'll build the map."
    />
  );
}
