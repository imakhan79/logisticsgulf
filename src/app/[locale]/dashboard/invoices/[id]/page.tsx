import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { can } from "@/lib/permissions";
import { NoAccess } from "@/components/no-access";
import { PaymentForm } from "./payment-form";

export default async function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  if (!(await can("invoices.view"))) return <NoAccess module="invoices" />;

  const supabase = await createClient();
  const { data: invoice } = await supabase
    .from("invoices")
    .select("id, invoice_number, amount, status, due_date, customers(name)")
    .eq("id", id)
    .single();

  if (!invoice) notFound();

  const [{ data: payments }, canRecordPayment] = await Promise.all([
    supabase.from("payments").select("id, amount, payment_method, paid_at").eq("invoice_id", invoice.id).order("paid_at", { ascending: false }),
    can("payments.create"),
  ]);

  const customer = invoice.customers as unknown as { name: string } | null;
  const totalPaid = (payments ?? []).reduce((sum, p) => sum + Number(p.amount), 0);

  return (
    <div className="p-8">
      <div className="mb-1 flex items-center gap-3">
        <h1 className="text-2xl font-semibold">{invoice.invoice_number}</h1>
        <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-700">
          {invoice.status}
        </span>
      </div>
      <p className="mb-6 text-sm text-neutral-500">
        {customer?.name ?? "No customer"} · Amount {invoice.amount} · Paid {totalPaid}
      </p>

      {payments && payments.length > 0 && (
        <ul className="mb-6 max-w-sm space-y-1 text-sm">
          {payments.map((p) => (
            <li key={p.id} className="rounded border px-3 py-2">
              {p.amount} via {p.payment_method} — {new Date(p.paid_at).toLocaleDateString()}
            </li>
          ))}
        </ul>
      )}

      {invoice.status !== "paid" && canRecordPayment && (
        <PaymentForm invoiceId={invoice.id} locale={locale} />
      )}
    </div>
  );
}
