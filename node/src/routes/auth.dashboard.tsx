import { createFileRoute, Outlet } from "@tanstack/react-router";
import { GoogleLogin } from "@react-oauth/google";
import authBeforeLoad from "./authBeforeLoad";

export const Route = createFileRoute("/auth/dashboard")({
  beforeLoad: authBeforeLoad,
  component: Dashboard,
});

function Dashboard() {
  return (
    <>
      <div className="p-2">loggedIn!</div>
      <div className="col-span-3 py-2 px-4">
        <Outlet />
      </div>
    </>
  );
}
