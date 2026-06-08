import { z } from "zod";

export const professionalBioSchema = z.object({
  bio: z.string().trim().min(20, "Please enter at least 20 characters"),
  experience: z.string().trim().min(20, "Please enter at least 20 characters"),
  qualifications: z.string().trim().min(5, "Please enter your qualifications"),
});


export type ProfessionalBioFormData = z.infer<typeof professionalBioSchema>;