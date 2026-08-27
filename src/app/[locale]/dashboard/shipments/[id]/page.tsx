import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { can } from "@/lib/permissions";
import { NoAccess } from "@/components/no-access";
import { DispatchForm, MarkDeliveredButton, GenerateInvoiceForm } from "./shipment-actions";

export default async function ShipmentDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  if (!(await can("shipments.view"))) return <NoAccess module="shipments" />;

  const supabase = await createClient();
  const { data: shipment } = await supabase
    .from("shipments")
    .select(
      "id, shipment_no, status, eta, vehicle_id, driver_id, route_id, vehicles(plate_no), drivers(name), routes(origin, destination)",
    )
    .eq("id", id)
    .single();

  if (!shipment) notFound();

  const { data: invoice } = await supabase
    .from("invoices")
    .select("id, invoice_number")
    .eq("shipment_id", shipment.id)
    .maybeSingle();

  const [canDispatch, canMarkDelivered, canInvoice, { data: vehicles }, { data: drivers }, { data: routes }] =
    await Promise.all([
      can("shipments.dispatch"),
      can("deliveries.create"),
      can("invoices.create"),
      supabase.from("vehicles").select("id, plate_no").eq("status", "active"),
      supabase.from("drivers").select("id, name").eq("status", "active"),
      supabase.from("routes").select("id, origin, destination"),
    ]);

  const vehicle = shipment.vehicles as unknown as { plate_no: string } | null;
  const driver = shipment.drivers as unknown as { name: string } | null;
  const route = shipment.routes as unknown as { origin: string; destination: string } | null;

  return (
    <div className="p-8">
      <div className="mb-1 flex items-center gap-3">
        <h1 className="text-2xl font-semibold">{shipment.shipment_no}</h1>
        <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-700">
          {shipment.status}
        </span>
      </div>
      <p className="mb-6 text-sm text-neutral-500">
        {vehicle?.plate_no ?? "No vehicle"} · {driver?.name ?? "No driver"} ·{" "}
        {route ? `${route.origin} → ${route.destination}` : "No route"}
      </p>

      <div className="space-y-6">
        {shipment.status === "pending" && canDispatch && (
          <DispatchForm
            shipmentId={shipment.id}
            locale={locale}
            vehicles={(vehicles ?? []).map((v) => ({ id: v.id, label: v.plate_no }))}
            drivers={(drivers ?? []).map((d) => ({ id: d.id, label: d.name }))}
            routes={(routes ?? []).map((r) => ({ id: r.id, label: `${r.origin} → ${r.destination}` }))}
          />
        )}

        {shipment.status === "in_transit" && canMarkDelivered && (
          <MarkDeliveredButton shipmentId={shipment.id} locale={locale} />
        )}

        {shipment.status === "delivered" && !invoice && canInvoice && (
          <GenerateInvoiceForm shipmentId={shipment.id} locale={locale} />
        )}

        {invoice && (
          <p className="text-sm">
            Invoice:{" "}
            <Link href={`../invoices/${invoice.id}`} className="underline underline-offset-2">
              {invoice.invoice_number}
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
