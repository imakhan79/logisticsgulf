"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function createShipmentFromOrder(orderId: string, locale: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { data: order } = await supabase.from("orders").select("*").eq("id", orderId).single();
  if (!order) return { error: "Order not found" };

  const { data: allowed } = await supabase.rpc("has_permission", {
    target_company_id: order.company_id,
    permission_key: "shipments.create",
  });
  if (!allowed) return { error: "You don't have permission to create shipments." };

  const { data: shipment, error } = await supabase
    .from("shipments")
    .insert({
      company_id: order.company_id,
      country_id: order.country_id,
      customer_id: order.customer_id,
      order_id: order.id,
      shipment_no: `SHP-${order.order_no}`,
      status: "pending",
      created_by: user.id,
      updated_by: user.id,
    })
    .select("id")
    .single();
  if (error) return { error: error.message };

  await supabase.from("orders").update({ status: "processing", updated_by: user.id }).eq("id", order.id);

  redirect(`/${locale}/dashboard/shipments/${shipment.id}`);
}
