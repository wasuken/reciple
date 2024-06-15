import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import axios from "axios";

export const Route = createFileRoute("/oauth/redirect")({
  component: OAuth,
});

function OAuth() {
  const navigate = useNavigate({ from: "/oauth/redirect" });
  const [code, setCode] = useState<string | null>(null);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    setCode(code);
  }, []);
  useEffect(() => {
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
        navigate({ to: "/" });
      } catch (error) {
        console.error("Failed to fetch access token:", error);
      }
    };

    if (code) {
      fetchAccessToken(code);
    }
    return () => {
      ignore = true;
    };
  }, [code]);

  return <div>Loading...</div>;
  return (
    <div className="p-2">
      <h3>Welcome Home!</h3>
      <div style={{ width: "300px" }}></div>
      <button onClick={loginWithGoogle}>Google Login</button>
    </div>
  );
}
