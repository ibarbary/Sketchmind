import { z } from "zod";

export const addPlanSchema = z.object({
  name: z.string(),
  price: z.number(),
  popular: z.boolean().optional(),
  credits: z.number(),
  description: z.string(),
});

export const buyCreditsSchema = z.object({
  planId: z.string(),
});
