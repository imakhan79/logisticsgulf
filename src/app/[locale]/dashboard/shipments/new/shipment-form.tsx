"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { shipmentSchema, type ShipmentInput } from "./schema";
import { createShipment } from "./actions";

export function ShipmentForm({ locale }: { locale: string }) {
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ShipmentInput>({
    resolver: zodResolver(shipmentSchema),
    defaultValues: { status: "pending" },
  });

  async function onSubmit(values: ShipmentInput) {
    setServerError(null);
    const result = await createShipment(locale, values);
    if (result?.error) setServerError(result.error);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md space-y-3">
      {serverError && <p className="text-sm text-red-600">{serverError}</p>}

      <div>
        <label className="block text-sm font-medium">Shipment number</label>
        <input {...register("shipment_no")} className="w-full rounded-md border px-3 py-2 text-sm" />
        {errors.shipment_no && <p className="text-xs text-red-600">{errors.shipment_no.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium">Status</label>
        <select {...register("status")} className="w-full rounded-md border px-3 py-2 text-sm">
          <option value="pending">Pending</option>
          <option value="in_transit">In transit</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium">ETA</label>
        <input type="datetime-local" {...register("eta")} className="w-full rounded-md border px-3 py-2 text-sm" />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-md bg-neutral-900 px-3 py-2 text-sm font-medium text-white disabled:opacity-50"
      >
        {isSubmitting ? "Saving..." : "Create shipment"}
      </button>
    </form>
  );
}
