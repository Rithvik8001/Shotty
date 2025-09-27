import { type Request, type Response } from "express";
import validateCreateUrl from "../validations/createUrlValidation.ts";
import Url from "../db/models/url.ts";

const generateShortUrl = (): string => {
  const characters =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

export const createUrl = async (req: Request, res: Response) => {
  const result = validateCreateUrl(req.body);
  if (!result.success) {
    return res.status(400).json({
      error: result.error.message,
      details: result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
        code: issue.code,
      })),
    });
  }
  const { originalUrl } = result.data;

  try {
    let shortUrl: string;
    let isUnique = false;
    let attempts = 0;
    const maxAttempts = 5;

    do {
      shortUrl = generateShortUrl();
      const existingUrl = await Url.findOne({ shortUrl });
      isUnique = !existingUrl;
      attempts++;
    } while (!isUnique && attempts < maxAttempts);

    if (!isUnique) {
      return res.status(500).json({
        error: "Unable to generate unique short URL. Please try again.",
      });
    }

    const newUrl = await Url.create({
      originalUrl,
      shortUrl,
      userId: req.user?.userId,
    });

    return res.status(201).json({
      message: "URL created successfully",
      data: {
        shortUrl: newUrl.shortUrl,
        originalUrl: newUrl.originalUrl,
        clicks: newUrl.clicks,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json(error instanceof Error ? error.message : "Internal server error");
  }
};
