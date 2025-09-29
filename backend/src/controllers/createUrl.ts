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
import {
  validateRedirectUrl,
  type UrlValidationResult,
} from "../utils/urlSecurity.ts";

const generateShortUrl = (): string => {
  const characters =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

const redirectWithWarning = (
  req: Request,
  res: Response,
  targetUrl: string,
  validation: UrlValidationResult,
) => {
  // Create a warning page HTML response
  const warningPage = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>External Link Warning - Shotty</title>
        <style>
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                line-height: 1.6;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f5f5f5;
            }
            .warning-container {
                background: white;
                border-radius: 8px;
                padding: 30px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                border-left: 4px solid #ff6b35;
            }
            .warning-icon {
                font-size: 48px;
                text-align: center;
                margin-bottom: 20px;
            }
            .warning-title {
                color: #d63384;
                font-size: 24px;
                font-weight: bold;
                text-align: center;
                margin-bottom: 20px;
            }
            .warning-text {
                color: #666;
                margin-bottom: 20px;
                text-align: center;
            }
            .url-display {
                background: #f8f9fa;
                padding: 15px;
                border-radius: 4px;
                font-family: monospace;
                word-break: break-all;
                margin: 20px 0;
                border: 1px solid #dee2e6;
            }
            .warnings-list {
                background: #fff3cd;
                border: 1px solid #ffeaa7;
                border-radius: 4px;
                padding: 15px;
                margin: 20px 0;
            }
            .warnings-list ul {
                margin: 0;
                padding-left: 20px;
            }
            .warnings-list li {
                color: #856404;
                margin-bottom: 5px;
            }
            .button-container {
                text-align: center;
                margin-top: 30px;
            }
            .btn {
                display: inline-block;
                padding: 12px 24px;
                margin: 0 10px;
                border: none;
                border-radius: 4px;
                text-decoration: none;
                font-weight: bold;
                cursor: pointer;
                transition: background-color 0.2s;
            }
            .btn-danger {
                background-color: #dc3545;
                color: white;
            }
            .btn-danger:hover {
                background-color: #c82333;
            }
            .btn-secondary {
                background-color: #6c757d;
                color: white;
            }
            .btn-secondary:hover {
                background-color: #5a6268;
            }
            .risk-level {
                display: inline-block;
                padding: 4px 8px;
                border-radius: 12px;
                font-size: 12px;
                font-weight: bold;
                text-transform: uppercase;
            }
            .risk-medium {
                background-color: #fff3cd;
                color: #856404;
            }
            .risk-high {
                background-color: #f8d7da;
                color: #721c24;
            }
        </style>
    </head>
    <body>
        <div class="warning-container">
            <div class="warning-icon">⚠️</div>
            <h1 class="warning-title">External Link Warning</h1>
            <p class="warning-text">
                You are about to visit an external website. This link has been flagged with potential security concerns.
            </p>

            <div class="url-display">
                <strong>Destination:</strong><br>
                ${targetUrl}
            </div>

            <div class="warnings-list">
                <strong>Security Warnings:</strong>
                <ul>
                    ${validation.warnings.map((warning) => `<li>${warning}</li>`).join("")}
                </ul>
                <p>Risk Level: <span class="risk-level risk-${validation.riskLevel}">${validation.riskLevel}</span></p>
            </div>

            <p class="warning-text">
                <strong>Be cautious if:</strong><br>
                • You don't recognize this website<br>
                • You weren't expecting to visit this link<br>
                • The link was shared by someone you don't trust
            </p>

            <div class="button-container">
                <a href="${targetUrl}" class="btn btn-danger" onclick="return confirm('Are you sure you want to proceed to this potentially unsafe website?')">
                    Continue Anyway
                </a>
                <a href="javascript:history.back()" class="btn btn-secondary">
                    Go Back
                </a>
            </div>
        </div>
    </body>
    </html>
  `;

  return res.status(200).send(warningPage);
};

export const getAllUrls = async (req: Request, res: Response) => {
  try {
    const urls = await Url.find({ userId: req.user?.userId })
      .select("originalUrl shortUrl clicks createdAt updatedAt")
      .sort({ createdAt: -1 });

    return sendSuccessResponse(
      res,
      200,
      createSuccessResponse("URLs retrieved successfully", urls, urls.length),
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
        "URL_NOT_FOUND",
      );
      return sendErrorResponse(res, 404, apiError);
    }

    return sendSuccessResponse(
      res,
      200,
      createSuccessResponse("URL deleted successfully"),
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
      { new: true, select: "originalUrl shortUrl clicks createdAt updatedAt" },
    );

    if (!updatedUrl) {
      const apiError = createErrorResponse(
        "URL not found or you don't have permission to edit it",
        "URL_NOT_FOUND",
      );
      return sendErrorResponse(res, 404, apiError);
    }

    return sendSuccessResponse(
      res,
      200,
      createSuccessResponse("URL updated successfully", updatedUrl),
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
      { new: true },
    );

    if (!urlDoc) {
      const apiError = createErrorResponse(
        "Short URL not found",
        "SHORT_URL_NOT_FOUND",
      );
      return sendErrorResponse(res, 404, apiError);
    }

    // Validate the URL before redirecting
    const validation = validateRedirectUrl(urlDoc.originalUrl);

    if (!validation.isValid) {
      const apiError = createErrorResponse(
        "Invalid redirect URL detected",
        "INVALID_REDIRECT_URL",
      );
      return sendErrorResponse(res, 400, apiError);
    }

    // If URL is trusted, redirect immediately
    if (validation.isTrusted) {
      return res.redirect(urlDoc.originalUrl);
    }

    // For untrusted URLs with warnings, show a warning page
    if (
      validation.warnings.length > 0 ||
      validation.riskLevel === "medium" ||
      validation.riskLevel === "high"
    ) {
      return redirectWithWarning(req, res, urlDoc.originalUrl, validation);
    }

    // For low-risk external URLs, redirect with a small delay
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
        "SHORT_URL_GENERATION_FAILED",
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
      }),
    );
  } catch (error) {
    const apiError = handleDatabaseError(error);
    return sendErrorResponse(res, 500, apiError);
  }
};
