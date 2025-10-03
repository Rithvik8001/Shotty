import { z } from "zod";

export const signupSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .min(4, "Name must be at least 4 characters")
    .max(20, "Name must be at most 20 characters"),
  emailId: z
    .string()
    .email("Enter a valid email address")
    .trim()
    .min(1, "Email is required"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters")
    .max(20, "Password must be at most 20 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must include uppercase, lowercase, number, and special character"
    ),
});

export const loginSchema = z.object({
  emailId: z
    .string()
    .email("Enter a valid email address")
    .trim()
    .min(1, "Email is required"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters")
    .max(20, "Password must be at most 20 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must include uppercase, lowercase, number, and special character"
    ),
});

export const createUrlSchema = z.object({
  originalUrl: z
    .string()
    .min(1, "URL is required")
    .refine((url) => {
      try {
        new URL(url.startsWith("http") ? url : `https://${url}`);
        return true;
      } catch {
        return false;
      }
    }, "Enter a valid URL address"),
});

export type SignupFormData = z.infer<typeof signupSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type CreateUrlFormData = z.infer<typeof createUrlSchema>;
