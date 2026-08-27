import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { can } from "@/lib/permissions";
import { NoAccess } from "@/components/no-access";
import { OrderActions } from "./order-actions";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  if (!(await can("orders.view"))) return <NoAccess module="orders" />;

  const supabase = await createClient();
  const { data: order } = await supabase
    .from("orders")
    .select("id, order_no, status, origin, destination, weight, volume, customers(name)")
    .eq("id", id)
    .single();

  if (!order) notFound();

  const { data: shipment } = await supabase
    .from("shipments")
    .select("id, shipment_no")
    .eq("order_id", order.id)
    .maybeSingle();

  const canCreateShipment = await can("shipments.create");
  const customer = order.customers as unknown as { name: string } | null;

  return (
    <div className="p-8">
      <div className="mb-1 flex items-center gap-3">
        <h1 className="text-2xl font-semibold">{order.order_no}</h1>
        <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-700">
          {order.status}
        </span>
      </div>
      <p className="mb-6 text-sm text-neutral-500">
        {customer?.name ?? "No customer"} · {order.origin} → {order.destination}
      </p>

      {shipment ? (
        <p className="text-sm">
          Shipment:{" "}
          <Link href={`../shipments/${shipment.id}`} className="underline underline-offset-2">
            {shipment.shipment_no}
          </Link>
        </p>
      ) : (
        canCreateShipment && <OrderActions orderId={order.id} locale={locale} />
      )}
    </div>
  );
}
