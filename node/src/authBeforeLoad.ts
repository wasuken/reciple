import { redirect } from "@tanstack/react-router";

const authBeforeLoad = async ({ context }) => {
  // ログアウト後もなぜかtrueになっている
  if (!context.auth.isAuthenticated) {
    throw redirect({
      to: "/login",
    });
  }
};

export default authBeforeLoad;
