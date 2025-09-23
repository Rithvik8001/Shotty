// Signup Validation

import { z } from "zod";

export const signupValidation = z
  .object({
    name: z.string().min(4).max(20),
    emailId: z.email(),
    password: z
      .string()
      .min(8)
      .max(20)
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
      ),
  })
  .strict();

export type SignupData = z.infer<typeof signupValidation>;

export const validateSignup = (payload: unknown) => {
  const result = signupValidation.safeParse(payload);
  return result;
};

export default validateSignup;
