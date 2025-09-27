import { Router } from "express";
import { createUrl, getAllUrls } from "../../controllers/createUrl.ts";
import { userAuth } from "../../middlewares/userAuth.ts";
const router: Router = Router();

router.post("/create", userAuth, createUrl);
router.get("/all", userAuth, getAllUrls);

export default router;
