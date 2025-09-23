import { z } from "zod";

export const loginValidation = z
  .object({
    emailId: z
      .email({ message: "Enter a valid email address" })
      .trim()
      .min(1, { message: "Email is required" }),
    password: z
      .string()
      .min(1, { message: "Password is required" })
      .min(8, { message: "Password must be at least 8 characters" })
      .max(20, { message: "Password must be at most 20 characters" })
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        {
          message:
            "Password must include uppercase, lowercase, number, and special character",
        }
      ),
  })
  .strict();

export type LoginData = z.infer<typeof loginValidation>;

export const validateLogin = (payload: unknown) => {
  const result = loginValidation.safeParse(payload);
  return result;
};

export default validateLogin;
