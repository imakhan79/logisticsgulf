import { z } from "zod";

export const customerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  address: z.string().optional(),
});

export type CustomerInput = z.infer<typeof customerSchema>;
