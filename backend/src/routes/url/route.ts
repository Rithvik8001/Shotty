import { Router } from "express";
import createUrlRoute from "./createUrl.ts";
const router: Router = Router();

router.use("/url", createUrlRoute);

export default router;
