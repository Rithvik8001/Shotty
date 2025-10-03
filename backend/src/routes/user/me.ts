import { Router } from "express";
import { getCurrentUser } from "../../controllers/getCurrentUser.ts";
import { userAuth } from "../../middlewares/userAuth.ts";

const router = Router();

router.get("/me", userAuth, getCurrentUser);

export default router;
