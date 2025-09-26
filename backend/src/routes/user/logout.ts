// logout route

import { Router } from "express";
import { logoutUser } from "../../controllers/logoutUser.ts";
const router: Router = Router();

router.post("/logout", logoutUser);

export default router;
