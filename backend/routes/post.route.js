import { Router } from "express";
import { activeCheck } from "../controllers/post.controller.js";

const router = Router();

router.get("/active", activeCheck);

export default router;
