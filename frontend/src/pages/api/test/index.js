export default function handler(req, res) {
	if (req.method !== "POST") {
		res.setHeader("Allow", ["POST"]);
		return res.status(405).json({ message: "Method not allowed" });
	}

	const { name, email } = req.body;

	return res.status(201).json({
		message: "Post received successfully",
		data: { name, email },
	});
}
