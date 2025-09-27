import { z } from "zod";

const urlRegex =
  /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;

export const createUrlValidation = z
  .object({
    originalUrl: z
      .url({ message: "Enter a valid Url address" })
      .regex(urlRegex, {
        message: "Enter a valid Url address with http or https",
      }),
  })
  .strict();

export type CreateUrlData = z.infer<typeof createUrlValidation>;

const validateCreateUrl = (payload: unknown) => {
  const result = createUrlValidation.safeParse(payload);
  return result;
};

export default validateCreateUrl;
