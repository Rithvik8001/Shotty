import { Router } from "express";
import signupRoute from "./signup.ts";
import loginRoute from "./login.ts";
import logoutRoute from "./logout.ts";
const router = Router();

router.use("/auth", signupRoute);
router.use("/auth", loginRoute);
router.use("/auth", logoutRoute);

export default router;
