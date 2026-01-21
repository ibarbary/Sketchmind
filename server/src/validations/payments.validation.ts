import { z } from "zod";

export const createOrderSchema = z.object({
  planId: z.string("Pricing Plan is missing"),
});

export const captureOrderSchema = z.object({
  planId: z.string("Pricing Plan is missing"),
  token: z.string("Payment token is missing"),
});
