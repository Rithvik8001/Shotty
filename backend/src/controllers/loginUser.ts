// login user controller

import { type Request, type Response } from "express";
import validateLogin from "../validations/loginValidation.ts";
import User from "../db/models/user.ts";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  handleZodError,
  handleDatabaseError,
  sendErrorResponse,
  sendSuccessResponse,
  createSuccessResponse,
  createErrorResponse,
} from "../utils/errorHandler.ts";

export const loginUser = async (req: Request, res: Response) => {
  const result = validateLogin(req.body);
  if (!result.success) {
    const apiError = handleZodError(result.error);
    return sendErrorResponse(res, 400, apiError);
  }

  try {
    const user = await User.findOne({ emailId: result.data.emailId });
    if (!user) {
      const apiError = createErrorResponse(
        "No account found with this email address",
        "USER_NOT_FOUND"
      );
      return sendErrorResponse(res, 401, apiError);
    }
    const isPasswordValid = await bcrypt.compare(
      result.data.password,
      user.password
    );
    if (!isPasswordValid) {
      const apiError = createErrorResponse(
        "Invalid password. Please check your credentials and try again",
        "INVALID_CREDENTIALS"
      );
      return sendErrorResponse(res, 401, apiError);
    }
    const resultData = {
      userId: user._id,
      name: user.name,
      emailId: user.emailId,
    };

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET_KEY as string,
      {
        expiresIn: "1d",
      }
    );
    res.cookie("token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 8 * 3600000),
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    return sendSuccessResponse(
      res,
      200,
      createSuccessResponse("Login successful", resultData)
    );
  } catch (error) {
    const apiError = handleDatabaseError(error);
    return sendErrorResponse(res, 500, apiError);
  }
};
