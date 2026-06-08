import { z } from "zod";

export const registerChangeSchema2 = z.object({
  skills_offered: z.string().min(1, "Please select a skill"),
  skills_wanted: z.string().min(1, "Please select a skill"),
  payment_method: z.string().optional(),
  iban: z.string().optional(),
  id_document: z.any().optional(), 
});

export type RegisterChangeSchemaType2 = z.infer<typeof registerChangeSchema2>;