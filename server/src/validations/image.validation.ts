import { z } from "zod";

export const generateImageSchema = z.object({
  prompt: z.string().min(1).max(1000),
});
