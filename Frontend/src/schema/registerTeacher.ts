import { z } from "zod";

export const registerSchemaTeacher = z
  .object({
    name: z
      .string()
      .min(3, "Name must be at least 3 characters"),

    email: z
      .string()
      .email("Invalid email"),

    phone: z
      .string()
      .min(11, "Phone number must be 11 digits"),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters"),

    confirmPassword: z
      .string()
      .min(1, "Confirm password is required"),

    gender: z
      .string()
      .refine(
        (value) => ["male", "female"].includes(value),
        {
          message: "Please select a valid gender",
        }
      ),
  })
  .refine(
    (data) => data.password === data.confirmPassword,
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }
  );

export type RegisterSchemaTypeTeacher =
  z.infer<typeof registerSchemaTeacher>;