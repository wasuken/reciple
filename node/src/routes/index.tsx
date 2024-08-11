import { createFileRoute, Link, redirect } from "@tanstack/react-router";

// 認証済であれば、認証済トップへリダイレクト
export const Route = createFileRoute("/")({
  beforeLoad: async ({ context }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({
        to: "/auth",
      });
    }
  },
  component: Index,
});

function Index() {
  return (
    <div className="p-2">
      <h3>Welcome No Login Home!</h3>
      <div style={{ width: "300px" }}></div>
      <Link to="/login">Login Page</Link>
    </div>
  );
}
