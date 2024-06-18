import { createLazyFileRoute } from "@tanstack/react-router";
import { GoogleLogin } from "@react-oauth/google";

export const Route = createLazyFileRoute("/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  return <div className="p-2">loggedIn!</div>;
}
