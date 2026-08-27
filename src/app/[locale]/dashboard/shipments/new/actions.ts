"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { shipmentSchema } from "./schema";

export async function createShipment(locale: string, values: unknown) {
  const parsed = shipmentSchema.safeParse(values);
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

  const { data: allowed } = await supabase.rpc("has_permission", {
    target_company_id: membership.company_id,
    permission_key: "shipments.create",
  });
  if (!allowed) return { error: "You don't have permission to create shipments." };

  const { eta, ...rest } = parsed.data;

  const { error } = await supabase.from("shipments").insert({
    ...rest,
    eta: eta || null,
    company_id: membership.company_id,
    country_id: membership.country_id,
    created_by: user.id,
    updated_by: user.id,
  });

  if (error) return { error: error.message };

  redirect(`/${locale}/dashboard/shipments`);
}
