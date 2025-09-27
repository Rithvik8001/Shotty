import { Router } from "express";
import { createUrl, getAllUrls, deleteUrl, editUrl } from "../../controllers/createUrl.ts";
import { userAuth } from "../../middlewares/userAuth.ts";
const router: Router = Router();

router.post("/create", userAuth, createUrl);
router.get("/all", userAuth, getAllUrls);
router.delete("/:id", userAuth, deleteUrl);
router.put("/:id", userAuth, editUrl);

export default router;
