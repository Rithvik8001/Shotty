// signup user controller

import { type Request, type Response } from "express";
import validateSignup from "../validations/signupValidation.ts";
import User from "../db/models/user.ts";
import bcrypt from "bcrypt";

export const signupUser = async (req: Request, res: Response) => {
  const result = validateSignup(req.body);
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
    if (user) {
      return res.status(400).json({ error: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(result.data.password, 10);
    const newUser = await User.create({
      name: result.data.name,
      emailId: result.data.emailId,
      password: hashedPassword,
    });
    return res.status(201).json({
      message: "User created successfully",
      data: {
        name: newUser.name,
        emailId: newUser.emailId,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json(error instanceof Error ? error.message : "Internal server error");
  }
};
