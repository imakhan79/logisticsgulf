import { MapPin, Navigation } from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";
import { MarkDeliveredButton } from "../shipments/[id]/shipment-actions";
import type { DashboardContext } from "./types";

export async function DriverDashboard({ ctx }: { ctx: DashboardContext }) {
  const { supabase, companyId, userId, locale } = ctx;

  const { data: driver } = await supabase
    .from("drivers")
    .select("id")
    .eq("company_id", companyId)
    .eq("user_id", userId)
    .maybeSingle();

  const { data: trips } = driver
    ? await supabase
        .from("shipments")
        .select("id, shipment_no, status, eta, routes(origin, destination), vehicles(plate_no)")
        .eq("driver_id", driver.id)
        .in("status", ["pending", "in_transit"])
        .order("created_at", { ascending: false })
    : { data: [] };

  return (
    <div className="mx-auto max-w-md">
      <h2 className="mb-4 text-sm font-semibold text-foreground-muted">Your trips</h2>

      {!driver && (
        <p className="rounded-xl border border-border-subtle bg-surface-raised p-5 text-sm text-foreground-muted">
          No driver profile is linked to your account yet — ask your fleet manager to link it.
        </p>
      )}

      <div className="space-y-3">
        {(trips ?? []).map((trip) => {
          const route = trip.routes as unknown as { origin: string; destination: string } | null;
          const vehicle = trip.vehicles as unknown as { plate_no: string } | null;
          return (
            <div key={trip.id} className="rounded-2xl border border-border-subtle bg-surface-raised p-5 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-lg font-semibold">{trip.shipment_no}</span>
                <StatusBadge status={trip.status} />
              </div>

              {route && (
                <div className="mb-4 space-y-1.5 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-teal-500" />
                    {route.origin}
                  </div>
                  <div className="flex items-center gap-2">
                    <Navigation className="h-4 w-4 text-gold-500" />
                    {route.destination}
                  </div>
                </div>
              )}

              <div className="mb-4 flex items-center justify-between text-xs text-foreground-muted">
                <span>{vehicle?.plate_no ?? "No vehicle assigned"}</span>
                <span>{trip.eta ? new Date(trip.eta).toLocaleString() : "No ETA"}</span>
              </div>

              {trip.status === "in_transit" && (
                <MarkDeliveredButton shipmentId={trip.id} locale={locale} />
              )}
              {trip.status === "pending" && (
                <p className="text-xs text-foreground-muted">Waiting for dispatch.</p>
              )}
            </div>
          );
        })}

        {driver && !trips?.length && (
          <p className="rounded-xl border border-border-subtle bg-surface-raised p-5 text-center text-sm text-foreground-muted">
            No active trips right now.
          </p>
        )}
      </div>
    </div>
  );
}
