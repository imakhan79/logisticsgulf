import { can } from "@/lib/permissions";
import { NoAccess } from "@/components/no-access";
import { ShipmentForm } from "./shipment-form";

export default async function NewShipmentPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!(await can("shipments.create"))) return <NoAccess module="new shipment" />;

  return (
    <div className="p-8">
      <h1 className="mb-4 text-2xl font-semibold">New shipment</h1>
      <ShipmentForm locale={locale} />
    </div>
  );
}
