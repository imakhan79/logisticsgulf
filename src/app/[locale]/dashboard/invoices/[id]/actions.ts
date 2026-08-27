"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function recordPayment(
  invoiceId: string,
  locale: string,
  input: { amount: string; payment_method: string },
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { data: invoice } = await supabase.from("invoices").select("*").eq("id", invoiceId).single();
  if (!invoice) return { error: "Invoice not found" };

  const { data: allowed } = await supabase.rpc("has_permission", {
    target_company_id: invoice.company_id,
    permission_key: "payments.create",
  });
  if (!allowed) return { error: "You don't have permission to record payments." };

  const amount = Number(input.amount);
  if (!amount || amount <= 0) return { error: "Enter a valid amount." };
  if (!input.payment_method) return { error: "Select a payment method." };

  const { error: paymentError } = await supabase.from("payments").insert({
    company_id: invoice.company_id,
    invoice_id: invoice.id,
    amount,
    payment_method: input.payment_method,
    created_by: user.id,
    updated_by: user.id,
  });
  if (paymentError) return { error: paymentError.message };

  const { data: payments } = await supabase
    .from("payments")
    .select("amount")
    .eq("invoice_id", invoice.id);
  const totalPaid = (payments ?? []).reduce((sum, p) => sum + Number(p.amount), 0);

  if (totalPaid >= Number(invoice.amount)) {
    await supabase.from("invoices").update({ status: "paid", updated_by: user.id }).eq("id", invoice.id);
  }

  revalidatePath(`/${locale}/dashboard/invoices/${invoiceId}`);
  return { error: null };
}
