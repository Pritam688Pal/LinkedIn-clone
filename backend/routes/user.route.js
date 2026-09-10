import { Router } from "express";
import multer from "multer";

import {
	registertUser,
	logInUser,
	updateProfilePicture,
} from "../controllers/user.controller.js";

const router = Router();

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "uploads/");
	},
	filename: function (req, file, cb) {
		cb(null, Date.now() + "-" + file.originalname);
	},
});

const upload = multer({ storage: storage });

router.post("/register", registertUser);
router.post("/login", logInUser);
router.post(
	"/update_profile_picture",
	upload.single("file"),
	updateProfilePicture,
);

export default router;
