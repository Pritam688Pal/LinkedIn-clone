import mongoose from "mongoose";

const connectionSchema = new mongoose.Schema({
	connectedUserId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	connectionUserId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	status: {
		type: boolean,
		default: false,
	},
});

const Connection = mongoose.model("Connection", connectionSchema);

export default Connection;
