import { ShipmentForm } from "./shipment-form";

export default async function NewShipmentPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div className="p-8">
      <h1 className="mb-4 text-2xl font-semibold">New shipment</h1>
      <ShipmentForm locale={locale} />
    </div>
  );
}
