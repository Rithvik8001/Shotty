import { type Request, type Response } from "express";
import validateCreateUrl, {
  validateEditUrl,
} from "../validations/createUrlValidation.ts";
import Url from "../db/models/url.ts";
import {
  handleZodError,
  handleDatabaseError,
  sendErrorResponse,
  sendSuccessResponse,
  createSuccessResponse,
  createErrorResponse,
} from "../utils/errorHandler.ts";

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
      .select("originalUrl shortUrl clicks createdAt updatedAt")
      .sort({ createdAt: -1 });

    return sendSuccessResponse(
      res,
      200,
      createSuccessResponse("URLs retrieved successfully", urls, urls.length)
    );
  } catch (error) {
    const apiError = handleDatabaseError(error);
    return sendErrorResponse(res, 500, apiError);
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
      const apiError = createErrorResponse(
        "URL not found or you don't have permission to delete it",
        "URL_NOT_FOUND"
      );
      return sendErrorResponse(res, 404, apiError);
    }

    return sendSuccessResponse(
      res,
      200,
      createSuccessResponse("URL deleted successfully")
    );
  } catch (error) {
    const apiError = handleDatabaseError(error);
    return sendErrorResponse(res, 500, apiError);
  }
};

export const editUrl = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = validateEditUrl(req.body);

    if (!result.success) {
      const apiError = handleZodError(result.error);
      return sendErrorResponse(res, 400, apiError);
    }

    const { originalUrl } = result.data;

    const updatedUrl = await Url.findOneAndUpdate(
      {
        _id: id,
        userId: req.user?.userId,
      },
      { originalUrl },
      { new: true, select: "originalUrl shortUrl clicks createdAt updatedAt" }
    );

    if (!updatedUrl) {
      const apiError = createErrorResponse(
        "URL not found or you don't have permission to edit it",
        "URL_NOT_FOUND"
      );
      return sendErrorResponse(res, 404, apiError);
    }

    return sendSuccessResponse(
      res,
      200,
      createSuccessResponse("URL updated successfully", updatedUrl)
    );
  } catch (error) {
    const apiError = handleDatabaseError(error);
    return sendErrorResponse(res, 500, apiError);
  }
};

export const redirectUrl = async (req: Request, res: Response) => {
  try {
    const { shortUrl } = req.params;

    const urlDoc = await Url.findOneAndUpdate(
      { shortUrl },
      { $inc: { clicks: 1 } },
      { new: true }
    );

    if (!urlDoc) {
      const apiError = createErrorResponse(
        "Short URL not found",
        "SHORT_URL_NOT_FOUND"
      );
      return sendErrorResponse(res, 404, apiError);
    }

    return res.redirect(urlDoc.originalUrl);
  } catch (error) {
    const apiError = handleDatabaseError(error);
    return sendErrorResponse(res, 500, apiError);
  }
};

export const createUrl = async (req: Request, res: Response) => {
  const result = validateCreateUrl(req.body);
  if (!result.success) {
    const apiError = handleZodError(result.error);
    return sendErrorResponse(res, 400, apiError);
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
      const apiError = createErrorResponse(
        "Unable to generate unique short URL. Please try again.",
        "SHORT_URL_GENERATION_FAILED"
      );
      return sendErrorResponse(res, 500, apiError);
    }

    const newUrl = await Url.create({
      originalUrl,
      shortUrl,
      userId: req.user?.userId,
    });

    return sendSuccessResponse(
      res,
      201,
      createSuccessResponse("URL created successfully", {
        shortUrl: newUrl.shortUrl,
        originalUrl: newUrl.originalUrl,
        clicks: newUrl.clicks,
      })
    );
  } catch (error) {
    const apiError = handleDatabaseError(error);
    return sendErrorResponse(res, 500, apiError);
  }
};
