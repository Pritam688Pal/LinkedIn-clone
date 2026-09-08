import { Router } from "express";

import { registertUser, logInUser } from "../controllers/user.controller.js";

const router = Router();

router.post("/register", registertUser);
router.post("/login", logInUser);

export default router;
