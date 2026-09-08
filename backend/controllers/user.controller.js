import User from "../models/user.model.js";
import Profile from "../models/profile.model.js";
import bcrypt from "bcrypt";
import crypto from "node:crypto";

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
