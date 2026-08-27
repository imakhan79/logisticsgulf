import { z } from "zod";

export const shipmentSchema = z.object({
  tracking_number: z.string().min(3, "Tracking number is required"),
  origin_address: z.string().min(1, "Origin is required"),
  destination_address: z.string().min(1, "Destination is required"),
});

export type ShipmentInput = z.infer<typeof shipmentSchema>;
