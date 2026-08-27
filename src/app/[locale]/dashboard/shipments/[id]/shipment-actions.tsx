"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { dispatchShipment, markDelivered, generateInvoice } from "./actions";
import { FileUpload } from "@/components/ui/file-upload";
import { useToast } from "@/components/ui/toast";

type Option = { id: string; label: string };

export function DispatchForm({
  shipmentId,
  locale,
  vehicles,
  drivers,
  routes,
}: {
  shipmentId: string;
  locale: string;
  vehicles: Option[];
  drivers: Option[];
  routes: Option[];
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [vehicleId, setVehicleId] = useState("");
  const [driverId, setDriverId] = useState("");
  const [routeId, setRouteId] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);
    const result = await dispatchShipment(shipmentId, locale, {
      vehicle_id: vehicleId,
      driver_id: driverId,
      route_id: routeId,
    });
    setPending(false);
    if (result?.error) setError(result.error);
    else router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="max-w-md space-y-3 rounded-lg border p-4">
      <h3 className="text-sm font-medium">Dispatch</h3>
      {error && <p className="text-sm text-red-600">{error}</p>}

      <select value={vehicleId} onChange={(e) => setVehicleId(e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm">
        <option value="">Select vehicle</option>
        {vehicles.map((v) => (
          <option key={v.id} value={v.id}>{v.label}</option>
        ))}
      </select>

      <select value={driverId} onChange={(e) => setDriverId(e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm">
        <option value="">Select driver</option>
        {drivers.map((d) => (
          <option key={d.id} value={d.id}>{d.label}</option>
        ))}
      </select>

      <select value={routeId} onChange={(e) => setRouteId(e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm">
        <option value="">Select route</option>
        {routes.map((r) => (
          <option key={r.id} value={r.id}>{r.label}</option>
        ))}
      </select>

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-neutral-900 px-3 py-2 text-sm font-medium text-white disabled:opacity-50"
      >
        {pending ? "Dispatching..." : "Dispatch"}
      </button>
    </form>
  );
}

export function MarkDeliveredButton({
  shipmentId,
  locale,
  companyId,
}: {
  shipmentId: string;
  locale: string;
  companyId?: string;
}) {
  const router = useRouter();
  const toast = useToast();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [photoPath, setPhotoPath] = useState<string | null>(null);

  async function onClick() {
    setPending(true);
    setError(null);
    const result = await markDelivered(shipmentId, locale, photoPath ?? undefined);
    setPending(false);
    if (result?.error) {
      setError(result.error);
    } else {
      toast({ title: "Delivery recorded", description: photoPath ? "Proof of delivery saved." : undefined, variant: "success" });
      router.refresh();
    }
  }

  return (
    <div className="max-w-sm space-y-3">
      {error && <p className="text-sm text-red-600">{error}</p>}
      {companyId && (
        <div>
          <p className="mb-1.5 text-xs font-medium text-foreground-muted">Proof of delivery (optional)</p>
          <FileUpload
            bucket="pod"
            companyId={companyId}
            accept="image/*"
            onUploaded={(path) => setPhotoPath(path)}
          />
        </div>
      )}
      <button
        disabled={pending}
        onClick={onClick}
        className="rounded-lg bg-navy-900 px-3 py-2 text-sm font-medium text-white transition-all hover:bg-navy-800 disabled:opacity-50"
      >
        {pending ? "Saving..." : "Mark delivered"}
      </button>
    </div>
  );
}

export function GenerateInvoiceForm({ shipmentId, locale }: { shipmentId: string; locale: string }) {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [amount, setAmount] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);
    const result = await generateInvoice(shipmentId, locale, amount);
    setPending(false);
    if (result?.error) setError(result.error);
  }

  return (
    <form onSubmit={onSubmit} className="flex max-w-sm items-end gap-2">
      <div className="flex-1">
        <label className="block text-sm font-medium">Invoice amount</label>
        <input
          type="number"
          step="any"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full rounded-md border px-3 py-2 text-sm"
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-neutral-900 px-3 py-2 text-sm font-medium text-white disabled:opacity-50"
      >
        {pending ? "Creating..." : "Generate invoice"}
      </button>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </form>
  );
}
