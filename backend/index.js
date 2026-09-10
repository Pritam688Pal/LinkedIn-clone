import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import PostRoutes from "./routes/post.route.js";
import UserRoutes from "./routes/user.route.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/api/posts", PostRoutes);
app.use("/api/users", UserRoutes);

app.get("/", (req, res) => {
	res.send("Fuck the World!");
});

const start = async () => {
	const mongoUri = process.env.MONGODB_URI;
	if (!mongoUri) {
		throw new Error("MONGODB_URI is not configured. Add it to backend/.env.");
	}

	await mongoose.connect(mongoUri);
	app.listen(process.env.PORT, () => {
		console.log(`Server is running on port ${process.env.PORT}`);
	});
};

start();
