import { Router } from "express";
import { createUrl } from "../../controllers/createUrl.ts";
import { userAuth } from "../../middlewares/userAuth.ts";
const router: Router = Router();

router.post("/create", userAuth, createUrl);

export default router;
