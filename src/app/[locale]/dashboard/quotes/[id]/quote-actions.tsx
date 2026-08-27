"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { submitQuote, approveQuote, acceptQuote, convertQuoteToOrder } from "./actions";

type Perms = { canApprove: boolean; canConvert: boolean; canEdit: boolean };

export function QuoteActions({
  quoteId,
  locale,
  status,
  perms,
}: {
  quoteId: string;
  locale: string;
  status: string;
  perms: Perms;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function run(action: () => Promise<{ error: string | null } | void>) {
    setPending(true);
    setError(null);
    const result = await action();
    setPending(false);
    if (result?.error) setError(result.error);
    else router.refresh();
  }

  const buttonClass = "rounded-md bg-neutral-900 px-3 py-2 text-sm font-medium text-white disabled:opacity-50";
  const outlineClass = "rounded-md border px-3 py-2 text-sm font-medium disabled:opacity-50";

  return (
    <div className="space-y-3">
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex flex-wrap gap-2">
        {status === "draft" && perms.canEdit && (
          <button disabled={pending} className={buttonClass} onClick={() => run(() => submitQuote(quoteId, locale))}>
            Submit for approval
          </button>
        )}
        {status === "pending_approval" && perms.canApprove && (
          <>
            <button disabled={pending} className={buttonClass} onClick={() => run(() => approveQuote(quoteId, locale, true))}>
              Approve
            </button>
            <button disabled={pending} className={outlineClass} onClick={() => run(() => approveQuote(quoteId, locale, false))}>
              Reject
            </button>
          </>
        )}
        {status === "approved" && perms.canEdit && (
          <button disabled={pending} className={buttonClass} onClick={() => run(() => acceptQuote(quoteId, locale))}>
            Mark accepted by customer
          </button>
        )}
        {status === "accepted" && perms.canConvert && (
          <button disabled={pending} className={buttonClass} onClick={() => run(() => convertQuoteToOrder(quoteId, locale))}>
            Convert to order
          </button>
        )}
        {status === "converted" && <span className="text-sm text-neutral-500">Converted to an order.</span>}
        {status === "rejected" && <span className="text-sm text-neutral-500">Rejected.</span>}
      </div>
    </div>
  );
}
