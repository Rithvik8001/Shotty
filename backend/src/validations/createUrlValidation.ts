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

export const editUrlValidation = z
  .object({
    originalUrl: z
      .url({ message: "Enter a valid Url address" })
      .regex(urlRegex, {
        message: "Enter a valid Url address with http or https",
      }),
  })
  .strict();

export type EditUrlData = z.infer<typeof editUrlValidation>;

const validateCreateUrl = (payload: unknown) => {
  const result = createUrlValidation.safeParse(payload);
  return result;
};

export const validateEditUrl = (payload: unknown) => {
  const result = editUrlValidation.safeParse(payload);
  return result;
};

export default validateCreateUrl;
