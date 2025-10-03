// get current user controller

import { type Request, type Response } from "express";
import {
  sendSuccessResponse,
  createSuccessResponse,
} from "../utils/errorHandler.ts";

export const getCurrentUser = async (req: Request, res: Response) => {
  const userData = {
    userId: req.user!.userId,
    name: req.user!.name,
    emailId: req.user!.emailId,
  };

  return sendSuccessResponse(
    res,
    200,
    createSuccessResponse("User retrieved successfully", userData)
  );
};
