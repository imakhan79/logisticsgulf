"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { recordPayment } from "./actions";

export function PaymentForm({ invoiceId, locale }: { invoiceId: string; locale: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("bank_transfer");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);
    const result = await recordPayment(invoiceId, locale, { amount, payment_method: method });
    setPending(false);
    if (result?.error) setError(result.error);
    else {
      setAmount("");
      router.refresh();
    }
  }

  return (
    <form onSubmit={onSubmit} className="max-w-sm space-y-3 rounded-lg border p-4">
      <h3 className="text-sm font-medium">Record payment</h3>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div>
        <label className="block text-sm font-medium">Amount</label>
        <input
          type="number"
          step="any"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full rounded-md border px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Method</label>
        <select value={method} onChange={(e) => setMethod(e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm">
          <option value="bank_transfer">Bank transfer</option>
          <option value="card">Card</option>
          <option value="cash">Cash</option>
          <option value="cheque">Cheque</option>
        </select>
      </div>
      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-neutral-900 px-3 py-2 text-sm font-medium text-white disabled:opacity-50"
      >
        {pending ? "Saving..." : "Record payment"}
      </button>
    </form>
  );
}
