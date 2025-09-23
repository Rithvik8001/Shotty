// login route

import { Router } from "express";
import { loginUser } from "../../controllers/loginUser.ts";
const router: Router = Router();

router.post("/login", loginUser);

export default router;
