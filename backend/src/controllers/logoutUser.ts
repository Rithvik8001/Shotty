import { type Request, type Response } from "express";

export const logoutUser = async (req: Request, res: Response) => {
  if (!req.cookies.token) {
    return res.status(400).json({ message: "User not logged in" });
  }

  res.clearCookie("token");
  return res.status(200).json({
    message: "Logged out successfully",
  });
};
