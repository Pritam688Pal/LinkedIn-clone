import { Router } from "express";
import multer from "multer";

import {
	registertUser,
	logInUser,
	updateProfilePicture,
	updateUserProfile,
	userProfile,
	updateUserProfileDetails,
	getAllUsersProfile,
	downloadProfile,
} from "../controllers/user.controller.js";

const router = Router();

const upload = multer({
	storage: multer.memoryStorage(),
	limits: {
		fileSize: 5 * 1024 * 1024,
	},
	fileFilter: (req, file, cb) => {
		if (!file.mimetype.startsWith("image/")) {
			return cb(new Error("Only image files are allowed"));
		}

		cb(null, true);
	},
});

router.post("/register", registertUser);
router.post("/login", logInUser);
router.post(
	"/update_profile_picture",
	upload.single("file"),
	updateProfilePicture,
);
router.post("/user_update", updateUserProfile);
router.post("/user_profile", userProfile);
router.post("/user_profile_update", updateUserProfileDetails);
router.get("/all_users_profile", getAllUsersProfile);
router.get("/download_profile/:userId", downloadProfile);

export default router;
