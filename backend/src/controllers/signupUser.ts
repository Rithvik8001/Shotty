// signup user controller

import { type Request, type Response } from "express";
import validateSignup from "../validations/signupValidation.ts";
import User from "../db/models/user.ts";
import bcrypt from "bcrypt";
import {
  handleZodError,
  handleDatabaseError,
  sendErrorResponse,
  sendSuccessResponse,
  createSuccessResponse,
  createErrorResponse,
} from "../utils/errorHandler.ts";

export const signupUser = async (req: Request, res: Response) => {
  const result = validateSignup(req.body);
  if (!result.success) {
    const apiError = handleZodError(result.error);
    return sendErrorResponse(res, 400, apiError);
  }
  try {
    const user = await User.findOne({ emailId: result.data.emailId });
    if (user) {
      const apiError = createErrorResponse(
        "An account with this email address already exists. Please try logging in instead",
        "EMAIL_ALREADY_EXISTS"
      );
      return sendErrorResponse(res, 409, apiError);
    }
    const hashedPassword = await bcrypt.hash(result.data.password, 10);
    const newUser = await User.create({
      name: result.data.name,
      emailId: result.data.emailId,
      password: hashedPassword,
    });
    return sendSuccessResponse(
      res,
      201,
      createSuccessResponse("Account created successfully", {
        name: newUser.name,
        emailId: newUser.emailId,
      })
    );
  } catch (error) {
    const apiError = handleDatabaseError(error);
    return sendErrorResponse(res, 500, apiError);
  }
};
