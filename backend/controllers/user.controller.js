import dotenv from "dotenv";
dotenv.config();
import User from "../models/user.model.js";
import Profile from "../models/profile.model.js";
import bcrypt from "bcrypt";
import crypto from "node:crypto";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import path from "node:path";

const s3Client = new S3Client({
	region: process.env.AWS_REGION,
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	},
});

export const registertUser = async (req, res) => {
	try {
		const { name, username, email, password } = req.body;
		if (!name || !username || !email || !password) {
			return res.status(400).json({ message: "All fields are required" });
		}
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(400).json({ message: "User already exists" });
		}
		const hashedPassword = await bcrypt.hash(password, 10);
		const newUser = new User({
			name,
			username,
			email,
			password: hashedPassword,
		});
		await newUser.save();
		const profile = new Profile({ userId: newUser._id });
		await profile.save();
		return res.status(201).json({ message: "User registered successfully" });
	} catch (error) {
		return res.status(500).json({ message: "Internal server error" });
	}
};

export const logInUser = async (req, res) => {
	try {
		const { email, password } = req.body;
		if (!email || !password) {
			return res.status(400).json({ message: "All fields are required" });
		}

		const user = await User.findOne({ email });
		if (!user) {
			return res.status(400).json({ message: "Invalid email or password" });
		}

		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) {
			return res.status(400).json({ message: "Invalid email or password" });
		}

		const token = crypto.randomBytes(16).toString("hex");

		await User.findByIdAndUpdate(user._id, { token });

		return res
			.status(200)
			.json({ message: "User logged in successfully", token });
	} catch (error) {
		return res.status(500).json({ message: "Internal server error" });
	}
};

export const updateProfilePicture = async (req, res) => {
	const { token } = req.body;

	try {
		if (!req.file) {
			return res.status(400).json({
				message: "Profile picture is required",
			});
		}

		if (!process.env.S3_BUCKET_NAME || !process.env.AWS_REGION) {
			return res.status(500).json({
				message: "S3 configuration is missing",
			});
		}

		const user = await User.findOne({ token });

		if (!user) {
			return res.status(401).json({ message: "Unauthorized" });
		}

		const extension = path.extname(req.file.originalname);
		const key = `profile-pictures/${user._id}-${Date.now()}${extension}`;

		await s3Client.send(
			new PutObjectCommand({
				Bucket: process.env.S3_BUCKET_NAME,
				Key: key,
				Body: req.file.buffer,
				ContentType: req.file.mimetype,
			}),
		);

		const imageUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

		user.profilePicture = imageUrl;
		await user.save();

		return res.status(200).json({
			message: "Profile picture uploaded successfully",
			profilePicture: imageUrl,
		});
	} catch (error) {
		console.error("S3 upload failed:", error);
		return res.status(500).json({
			message: "Profile picture upload failed",
		});
	}
};
