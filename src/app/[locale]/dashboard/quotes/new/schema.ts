import { z } from "zod";

export const quoteSchema = z.object({
  quote_no: z.string().min(2, "Quote number is required"),
  customer_id: z.string().min(1, "Customer is required"),
  origin: z.string().min(1, "Origin is required"),
  destination: z.string().min(1, "Destination is required"),
  cargo_details: z.string().optional(),
  weight: z.string().optional(),
  volume: z.string().optional(),
  amount: z.string().optional(),
});

export type QuoteInput = z.infer<typeof quoteSchema>;
