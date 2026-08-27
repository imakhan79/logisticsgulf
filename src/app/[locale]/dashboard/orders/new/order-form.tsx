"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { orderSchema, type OrderInput } from "./schema";
import { createOrder } from "./actions";

export function OrderForm({
  locale,
  customers,
}: {
  locale: string;
  customers: { id: string; name: string }[];
}) {
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OrderInput>({
    resolver: zodResolver(orderSchema),
    defaultValues: { status: "pending" },
  });

  async function onSubmit(values: OrderInput) {
    setServerError(null);
    const result = await createOrder(locale, values);
    if (result?.error) setServerError(result.error);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md space-y-3">
      {serverError && <p className="text-sm text-red-600">{serverError}</p>}

      <div>
        <label className="block text-sm font-medium">Order number</label>
        <input {...register("order_no")} className="w-full rounded-md border px-3 py-2 text-sm" />
        {errors.order_no && <p className="text-xs text-red-600">{errors.order_no.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium">Customer</label>
        <select {...register("customer_id")} className="w-full rounded-md border px-3 py-2 text-sm">
          <option value="">Select a customer</option>
          {customers.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        {errors.customer_id && <p className="text-xs text-red-600">{errors.customer_id.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium">Origin</label>
        <input {...register("origin")} className="w-full rounded-md border px-3 py-2 text-sm" />
        {errors.origin && <p className="text-xs text-red-600">{errors.origin.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium">Destination</label>
        <input {...register("destination")} className="w-full rounded-md border px-3 py-2 text-sm" />
        {errors.destination && <p className="text-xs text-red-600">{errors.destination.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium">Weight (kg)</label>
          <input type="number" step="any" {...register("weight")} className="w-full rounded-md border px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium">Volume (m³)</label>
          <input type="number" step="any" {...register("volume")} className="w-full rounded-md border px-3 py-2 text-sm" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium">Status</label>
        <select {...register("status")} className="w-full rounded-md border px-3 py-2 text-sm">
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-md bg-neutral-900 px-3 py-2 text-sm font-medium text-white disabled:opacity-50"
      >
        {isSubmitting ? "Saving..." : "Create order"}
      </button>
    </form>
  );
}
