import { Router } from "express";
import signupRoute from "./signup.ts";
import loginRoute from "./login.ts";
const router = Router();

router.use("/auth", signupRoute);
router.use("/auth", loginRoute);

export default router;
