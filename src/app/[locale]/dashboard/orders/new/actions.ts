"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { orderSchema } from "./schema";

export async function createOrder(locale: string, values: unknown) {
  const parsed = orderSchema.safeParse(values);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { data: membership } = await supabase
    .from("user_companies")
    .select("company_id, country_id")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .limit(1)
    .single();

  if (!membership) return { error: "No company membership found for this user" };

  const { weight, volume, ...rest } = parsed.data;

  const { error } = await supabase.from("orders").insert({
    ...rest,
    weight: weight ? Number(weight) : null,
    volume: volume ? Number(volume) : null,
    company_id: membership.company_id,
    country_id: membership.country_id,
    created_by: user.id,
    updated_by: user.id,
  });

  if (error) return { error: error.message };

  redirect(`/${locale}/dashboard/orders`);
}
