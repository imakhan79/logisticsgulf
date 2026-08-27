"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type Context =
  | { error: string }
  | { error: null; supabase: Awaited<ReturnType<typeof createClient>>; user: { id: string }; quote: Record<string, any> };

async function getContext(quoteId: string): Promise<Context> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { data: quote } = await supabase.from("quotes").select("*").eq("id", quoteId).single();
  if (!quote) return { error: "Quote not found" };

  return { error: null, supabase, user, quote };
}

export async function submitQuote(quoteId: string, locale: string) {
  const ctx = await getContext(quoteId);
  if (ctx.error !== null) return { error: ctx.error };
  const { supabase, user, quote } = ctx;

  const { error } = await supabase
    .from("quotes")
    .update({ status: "pending_approval", updated_by: user.id })
    .eq("id", quote.id);
  if (error) return { error: error.message };

  revalidatePath(`/${locale}/dashboard/quotes/${quoteId}`);
  return { error: null };
}

export async function approveQuote(quoteId: string, locale: string, approve: boolean) {
  const ctx = await getContext(quoteId);
  if (ctx.error !== null) return { error: ctx.error };
  const { supabase, user, quote } = ctx;

  const { data: allowed } = await supabase.rpc("has_permission", {
    target_company_id: quote.company_id,
    permission_key: "quotes.approve",
  });
  if (!allowed) return { error: "You don't have permission to approve quotes." };

  const { error } = await supabase
    .from("quotes")
    .update({
      status: approve ? "approved" : "rejected",
      approved_by: user.id,
      approved_at: new Date().toISOString(),
      updated_by: user.id,
    })
    .eq("id", quote.id);
  if (error) return { error: error.message };

  revalidatePath(`/${locale}/dashboard/quotes/${quoteId}`);
  return { error: null };
}

export async function acceptQuote(quoteId: string, locale: string) {
  const ctx = await getContext(quoteId);
  if (ctx.error !== null) return { error: ctx.error };
  const { supabase, user, quote } = ctx;

  const { error } = await supabase
    .from("quotes")
    .update({ status: "accepted", updated_by: user.id })
    .eq("id", quote.id);
  if (error) return { error: error.message };

  revalidatePath(`/${locale}/dashboard/quotes/${quoteId}`);
  return { error: null };
}

export async function convertQuoteToOrder(quoteId: string, locale: string) {
  const ctx = await getContext(quoteId);
  if (ctx.error !== null) return { error: ctx.error };
  const { supabase, user, quote } = ctx;

  const { data: allowed } = await supabase.rpc("has_permission", {
    target_company_id: quote.company_id,
    permission_key: "quotes.convert",
  });
  if (!allowed) return { error: "You don't have permission to convert quotes." };

  if (quote.status !== "accepted") return { error: "Only an accepted quote can be converted to an order." };

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      company_id: quote.company_id,
      country_id: quote.country_id,
      customer_id: quote.customer_id,
      order_no: `ORD-${quote.quote_no}`,
      origin: quote.origin,
      destination: quote.destination,
      weight: quote.weight,
      volume: quote.volume,
      status: "confirmed",
      quote_id: quote.id,
      created_by: user.id,
      updated_by: user.id,
    })
    .select("id")
    .single();
  if (orderError) return { error: orderError.message };

  const { error: quoteError } = await supabase
    .from("quotes")
    .update({ status: "converted", updated_by: user.id })
    .eq("id", quote.id);
  if (quoteError) return { error: quoteError.message };

  redirect(`/${locale}/dashboard/orders/${order.id}`);
}
