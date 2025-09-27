import { type Request, type Response } from "express";
import validateCreateUrl, {
  validateEditUrl,
} from "../validations/createUrlValidation.ts";
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

export const getAllUrls = async (req: Request, res: Response) => {
  try {
    const urls = await Url.find({ userId: req.user?.userId })
      .select("originalUrl shortUrl clicks createdAt")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "URLs retrieved successfully",
      data: urls,
      count: urls.length,
    });
  } catch (error) {
    return res
      .status(500)
      .json(error instanceof Error ? error.message : "Internal server error");
  }
};

export const deleteUrl = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deletedUrl = await Url.findOneAndDelete({
      _id: id,
      userId: req.user?.userId,
    });

    if (!deletedUrl) {
      return res.status(404).json({
        error: "URL not found or you don't have permission to delete it",
      });
    }

    return res.status(200).json({
      message: "URL deleted successfully",
    });
  } catch (error) {
    return res
      .status(500)
      .json(error instanceof Error ? error.message : "Internal server error");
  }
};

export const editUrl = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = validateEditUrl(req.body);

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

    const updatedUrl = await Url.findOneAndUpdate(
      {
        _id: id,
        userId: req.user?.userId,
      },
      { originalUrl },
      { new: true, select: "originalUrl shortUrl clicks createdAt" }
    );

    if (!updatedUrl) {
      return res.status(404).json({
        error: "URL not found or you don't have permission to edit it",
      });
    }

    return res.status(200).json({
      message: "URL updated successfully",
      data: updatedUrl,
    });
  } catch (error) {
    return res
      .status(500)
      .json(error instanceof Error ? error.message : "Internal server error");
  }
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
