import { z } from "zod";

export const shipmentSchema = z.object({
  shipment_no: z.string().min(3, "Shipment number is required"),
  status: z.enum(["pending", "in_transit", "delivered", "cancelled"]),
  eta: z.string().optional(),
});

export type ShipmentInput = z.infer<typeof shipmentSchema>;
