import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { can } from "@/lib/permissions";
import { NoAccess } from "@/components/no-access";
import { QuoteActions } from "./quote-actions";

export default async function QuoteDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  if (!(await can("quotes.view"))) return <NoAccess module="quotes" />;

  const supabase = await createClient();
  const { data: quote } = await supabase
    .from("quotes")
    .select("id, quote_no, status, origin, destination, cargo_details, weight, volume, amount, customers(name)")
    .eq("id", id)
    .single();

  if (!quote) notFound();

  const [canApprove, canConvert, canEdit] = await Promise.all([
    can("quotes.approve"),
    can("quotes.convert"),
    can("quotes.edit"),
  ]);

  const customer = quote.customers as unknown as { name: string } | null;

  return (
    <div className="p-8">
      <div className="mb-1 flex items-center gap-3">
        <h1 className="text-2xl font-semibold">{quote.quote_no}</h1>
        <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-700">
          {quote.status}
        </span>
      </div>
      <p className="mb-6 text-sm text-neutral-500">
        {customer?.name ?? "No customer"} · {quote.origin} → {quote.destination}
      </p>

      <div className="mb-6 grid max-w-md grid-cols-2 gap-3 text-sm">
        <div>
          <div className="text-neutral-400">Weight</div>
          <div>{quote.weight ?? "-"} kg</div>
        </div>
        <div>
          <div className="text-neutral-400">Volume</div>
          <div>{quote.volume ?? "-"} m³</div>
        </div>
        <div>
          <div className="text-neutral-400">Amount</div>
          <div>{quote.amount ?? "-"}</div>
        </div>
      </div>
      {quote.cargo_details && (
        <p className="mb-6 max-w-md text-sm text-neutral-600">{quote.cargo_details}</p>
      )}

      <QuoteActions
        quoteId={quote.id}
        locale={locale}
        status={quote.status}
        perms={{ canApprove, canConvert, canEdit }}
      />
    </div>
  );
}
