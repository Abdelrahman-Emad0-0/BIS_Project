import { z } from "zod";

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, "Name is required")
      .max(255, "Name must be at most 255 characters"),

    email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email address"),

    phone: z
      .string()
      .regex(/^[0-9]{11}$/, "Phone number must be 11 digits"),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters"),

    confirmPassword: z
      .string()
      .min(1, "Confirm password is required"),

    gender: z.string().refine(
      (value) => ["male", "female"].includes(value),
      {
        message: "Please select a valid gender",
      }
    ),

    dateOfBirth: z
      .string()
      .min(1, "Date of birth is required")
      .refine(
        (date) => !isNaN(Date.parse(date)),
        "Invalid date"
      ),

    learning_goal: z
      .string()
      .max(255, "Learning goal must be at most 255 characters")
      .optional()
      .or(z.literal("")),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterSchemaType = z.infer<typeof registerSchema>;