import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { GoogleLogin } from "@react-oauth/google";

export const Route = createFileRoute("/login")({
  beforeLoad: async ({ context, location }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({
        to: "/auth",
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: Index,
});

const clientId = import.meta.env.VITE_APP_GOOGLE_CLIENT_ID;
const redirectUri = import.meta.env.VITE_APP_GOOGLE_CLIENT_REDIRECT;

const loginWithGoogle = (): void => {
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=profile email`;
  window.location.href = authUrl;
};

function Index() {
  return (
    <div className="p-2">
      <div className="p-2 flex gap-2">
        <Link to="/" className="[&.active]:font-bold">
          Home
        </Link>{" "}
        <Link to="/about" className="[&.active]:font-bold">
          About
        </Link>
      </div>
      <h3>Welcome Home!</h3>
      <div style={{ width: "300px" }}></div>
      <button onClick={loginWithGoogle}>Google Login</button>
    </div>
  );
}
