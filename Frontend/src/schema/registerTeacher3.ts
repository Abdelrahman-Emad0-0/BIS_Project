import { z } from "zod";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

export const teacherVerificationSchema = z.object({
  id_document: z.any().optional(),
  certificates: z.any().optional(),
  payment_method: z.string().optional().or(z.literal("")),
  iban: z.string().optional().or(z.literal("")),
});

export type TeacherVerificationFormData = z.infer<typeof teacherVerificationSchema>;