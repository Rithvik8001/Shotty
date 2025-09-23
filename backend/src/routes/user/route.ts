import { Router } from "express";
import signupRoute from "./signup.ts";

const router = Router();

router.use("/auth", signupRoute);

export default router;
