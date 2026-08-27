import { z } from "zod";

export const orderSchema = z.object({
  order_no: z.string().min(2, "Order number is required"),
  customer_id: z.string().min(1, "Customer is required"),
  origin: z.string().min(1, "Origin is required"),
  destination: z.string().min(1, "Destination is required"),
  weight: z.string().optional(),
  volume: z.string().optional(),
  status: z.enum(["pending", "confirmed", "cancelled"]),
});

export type OrderInput = z.infer<typeof orderSchema>;
