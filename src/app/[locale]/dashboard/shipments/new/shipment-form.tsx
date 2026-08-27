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
  } = useForm<ShipmentInput>({ resolver: zodResolver(shipmentSchema) });

  async function onSubmit(values: ShipmentInput) {
    setServerError(null);
    const result = await createShipment(locale, values);
    if (result?.error) setServerError(result.error);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md space-y-3">
      {serverError && <p className="text-sm text-red-600">{serverError}</p>}

      <div>
        <label className="block text-sm font-medium">Tracking number</label>
        <input {...register("tracking_number")} className="w-full rounded-md border px-3 py-2 text-sm" />
        {errors.tracking_number && (
          <p className="text-xs text-red-600">{errors.tracking_number.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">Origin address</label>
        <input {...register("origin_address")} className="w-full rounded-md border px-3 py-2 text-sm" />
        {errors.origin_address && (
          <p className="text-xs text-red-600">{errors.origin_address.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">Destination address</label>
        <input {...register("destination_address")} className="w-full rounded-md border px-3 py-2 text-sm" />
        {errors.destination_address && (
          <p className="text-xs text-red-600">{errors.destination_address.message}</p>
        )}
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
