import { type Request, type Response } from "express";
import {
  sendErrorResponse,
  sendSuccessResponse,
  createSuccessResponse,
  createErrorResponse,
} from "../utils/errorHandler.ts";

export const logoutUser = async (req: Request, res: Response) => {
  if (!req.cookies.token) {
    const apiError = createErrorResponse(
      "No active session found. You are not currently logged in",
      "NOT_LOGGED_IN"
    );
    return sendErrorResponse(res, 400, apiError);
  }

  res.clearCookie("token");
  return sendSuccessResponse(
    res,
    200,
    createSuccessResponse("Logged out successfully")
  );
};
