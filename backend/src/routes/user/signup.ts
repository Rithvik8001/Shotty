// signup route

import { Router } from "express";
import { signupUser } from "../../controllers/signupUser.ts";
const router: Router = Router();

router.post("/signup", signupUser);

export default router;
