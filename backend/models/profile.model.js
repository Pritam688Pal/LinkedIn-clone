import mongoose from "mongoose";

const educationSchema = new mongoose.Schema({
	degree: {
		type: String,
		required: true,
	},
	institution: {
		type: String,
		required: true,
	},
	fieldOfStudy: {
		type: String,
		required: true,
	},
});

const workSchema = new mongoose.Schema({
	company: {
		type: String,
		required: true,
	},
	position: {
		type: String,
		default: "",
	},
	years: {
		type: Number,
	},
});

const profileSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
	bio: {
		type: String,
		default: "",
	},
	currentPosition: {
		type: String,
		default: "",
	},
	pastWorkExperience: [workSchema],
	education: [educationSchema],
});

const Profile = mongoose.model("Profile", profileSchema);

export default Profile;
