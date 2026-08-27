"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

async function loadShipment(supabase: Awaited<ReturnType<typeof createClient>>, shipmentId: string) {
  const { data: shipment } = await supabase.from("shipments").select("*").eq("id", shipmentId).single();
  return shipment;
}

export async function dispatchShipment(
  shipmentId: string,
  locale: string,
  input: { vehicle_id: string; driver_id: string; route_id: string },
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const shipment = await loadShipment(supabase, shipmentId);
  if (!shipment) return { error: "Shipment not found" };

  const { data: allowed } = await supabase.rpc("has_permission", {
    target_company_id: shipment.company_id,
    permission_key: "shipments.dispatch",
  });
  if (!allowed) return { error: "You don't have permission to dispatch shipments." };

  const { error } = await supabase
    .from("shipments")
    .update({
      vehicle_id: input.vehicle_id || null,
      driver_id: input.driver_id || null,
      route_id: input.route_id || null,
      status: "in_transit",
      updated_by: user.id,
    })
    .eq("id", shipmentId);
  if (error) return { error: error.message };

  revalidatePath(`/${locale}/dashboard/shipments/${shipmentId}`);
  return { error: null };
}

export async function markDelivered(shipmentId: string, locale: string, photoPath?: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const shipment = await loadShipment(supabase, shipmentId);
  if (!shipment) return { error: "Shipment not found" };

  const { data: allowed } = await supabase.rpc("has_permission", {
    target_company_id: shipment.company_id,
    permission_key: "deliveries.create",
  });
  if (!allowed) return { error: "You don't have permission to record deliveries." };

  const { error: deliveryError } = await supabase.from("deliveries").insert({
    company_id: shipment.company_id,
    shipment_id: shipment.id,
    driver_id: shipment.driver_id,
    status: "delivered",
    photo_url: photoPath || null,
    created_by: user.id,
    updated_by: user.id,
  });
  if (deliveryError) return { error: deliveryError.message };

  const { error: shipmentError } = await supabase
    .from("shipments")
    .update({ status: "delivered", updated_by: user.id })
    .eq("id", shipmentId);
  if (shipmentError) return { error: shipmentError.message };

  revalidatePath(`/${locale}/dashboard/shipments/${shipmentId}`);
  return { error: null };
}

export async function generateInvoice(shipmentId: string, locale: string, amount: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const shipment = await loadShipment(supabase, shipmentId);
  if (!shipment) return { error: "Shipment not found" };

  const { data: allowed } = await supabase.rpc("has_permission", {
    target_company_id: shipment.company_id,
    permission_key: "invoices.create",
  });
  if (!allowed) return { error: "You don't have permission to create invoices." };

  const parsedAmount = Number(amount);
  if (!parsedAmount || parsedAmount <= 0) return { error: "Enter a valid amount." };

  const { data: invoice, error } = await supabase
    .from("invoices")
    .insert({
      company_id: shipment.company_id,
      country_id: shipment.country_id,
      customer_id: shipment.customer_id,
      shipment_id: shipment.id,
      invoice_number: `INV-${shipment.shipment_no}`,
      amount: parsedAmount,
      status: "unpaid",
      created_by: user.id,
      updated_by: user.id,
    })
    .select("id")
    .single();
  if (error) return { error: error.message };

  redirect(`/${locale}/dashboard/invoices/${invoice.id}`);
}
