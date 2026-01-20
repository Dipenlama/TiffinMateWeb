import { z } from "zod";

// Register form schema
export const registerSchema = z
  .object({
    username: z
      .string()
      .min(2, { message: "Full name must be at least 2 characters" })
      .max(50, { message: "Full name must be less than 50 characters" }),
    email: z
      .string()
      .email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" })
      .max(100, { message: "Password must be less than 100 characters" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // error shows on confirmPassword
  });

// TypeScript type for your form
export type RegisterFormData = z.infer<typeof registerSchema>;
