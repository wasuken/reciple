import { useEffect, useState } from "react";
import { createFileRoute, useNavigate, redirect } from "@tanstack/react-router";
import axios from "axios";
import { useAuth } from "@/auth";

export const Route = createFileRoute("/oauth/redirect")({
	component: OAuth,
});

function OAuth() {
	const { login, fetchUserProfile } = useAuth();
	const navigate = useNavigate({ from: "/oauth/redirect" });
	const [code, setCode] = useState<string | null>(null);
	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		const code = params.get("code");
		setCode(code);
	}, []);
	// oauth2コールバック後処理
	useEffect(() => {
		// 二度実行されないための対応
		let ignore = false;

		const fetchAccessToken = async (code: string) => {
			if (ignore) return;
			try {
				const params = new URLSearchParams();
				params.append("code", code);

				const response = await axios.post("/api/login/google", params, {
					headers: {
						"Content-Type": "application/x-www-form-urlencoded",
					},
					withCredentials: true,
				});

				console.log(response.data);
				await fetchUserProfile();
			} catch (error) {
				console.error("Failed to fetch access token:", error);
				navigate({ to: "/" });
			}
		};

		if (code) {
			fetchAccessToken(code);
		}
		// 二度実行されないための対応
		return () => {
			ignore = true;
		};
	}, [code]);

	return (
		<div className="p-2">
			<h3>Welcome Home!</h3>
			<div style={{ width: "300px" }}></div>
			<button onClick={login}>Google Login</button>
		</div>
	);
}
