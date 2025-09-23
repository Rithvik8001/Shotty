// login user controller

import { type Request, type Response } from "express";
import validateLogin from "../validations/loginValidation.ts";
import User from "../db/models/user.ts";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const loginUser = async (req: Request, res: Response) => {
  const result = validateLogin(req.body);
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

  try {
    const user = await User.findOne({ emailId: result.data.emailId });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }
    const isPasswordValid = await bcrypt.compare(
      result.data.password,
      user.password
    );
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid password" });
    }
    const resultData = {
      name: user.name,
      emailId: user.emailId,
    };

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET_KEY as string,
      {
        expiresIn: "1h",
      }
    );
    res.cookie("token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 8 * 3600000),
    });

    return res.status(200).json({
      message: "Login successful",
      data: resultData,
    });
  } catch (error) {
    return res
      .status(500)
      .json(error instanceof Error ? error.message : "Internal server error");
  }
};
