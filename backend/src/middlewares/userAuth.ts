// userAuth middleware

import { type Request, type Response, type NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../db/models/user.ts";
import {
  sendErrorResponse,
  createErrorResponse,
} from "../utils/errorHandler.ts";

export const userAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token;
  if (!token) {
    const apiError = createErrorResponse(
      "Authentication required. Please log in to access this resource",
      "AUTHENTICATION_REQUIRED"
    );
    return sendErrorResponse(res, 401, apiError);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as {
      userId: string;
    };

    const user = await User.findById(decoded.userId);
    if (!user) {
      const apiError = createErrorResponse(
        "Invalid authentication token. Please log in again",
        "INVALID_TOKEN"
      );
      return sendErrorResponse(res, 401, apiError);
    }

    req.user = {
      userId: user._id.toString(),
      name: user.name,
      emailId: user.emailId,
    };

    next();
  } catch (error) {
    let apiError;
    if (error instanceof jwt.JsonWebTokenError) {
      apiError = createErrorResponse(
        "Invalid authentication token. Please log in again",
        "INVALID_TOKEN"
      );
    } else if (error instanceof jwt.TokenExpiredError) {
      apiError = createErrorResponse(
        "Your session has expired. Please log in again",
        "TOKEN_EXPIRED"
      );
    } else {
      apiError = createErrorResponse(
        "Authentication failed. Please log in again",
        "AUTHENTICATION_FAILED"
      );
    }
    return sendErrorResponse(res, 401, apiError);
  }
};
