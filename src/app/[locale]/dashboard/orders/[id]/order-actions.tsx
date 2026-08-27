"use client";

import { useState } from "react";
import { createShipmentFromOrder } from "./actions";

export function OrderActions({ orderId, locale }: { orderId: string; locale: string }) {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onClick() {
    setPending(true);
    setError(null);
    const result = await createShipmentFromOrder(orderId, locale);
    setPending(false);
    if (result?.error) setError(result.error);
  }

  return (
    <div>
      {error && <p className="mb-2 text-sm text-red-600">{error}</p>}
      <button
        disabled={pending}
        onClick={onClick}
        className="rounded-md bg-neutral-900 px-3 py-2 text-sm font-medium text-white disabled:opacity-50"
      >
        {pending ? "Creating..." : "Create shipment"}
      </button>
    </div>
  );
}
