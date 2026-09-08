import { useEffect } from "react";

export default function Blog() {
	useEffect(() => {
		async function createPost() {
			const response = await fetch("/api/test", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					name: "Pritam",
					email: "pritam@example.com",
				}),
			});

			const data = await response.json();
			console.log(data);
		}

		createPost();
	}, []);

	return <div>Blog</div>;
}
