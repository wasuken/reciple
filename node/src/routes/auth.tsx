import React, { useEffect, Suspense } from "react";
import {
  createFileRoute,
  Link,
  Outlet,
  redirect,
  useRouter,
} from "@tanstack/react-router";

import { useAuth } from "@/auth";
import styles from "./auth.module.css";
import authBeforeLoad from "./authBeforeLoad";
import {sleep} from "@/utils"

// 未認証であれば、ログインページへリダイレクト
export const Route = createFileRoute("/auth")({
  beforeLoad: authBeforeLoad,
  component: AuthLayout,
});

function AuthLayout() {
  const router = useRouter();
  const navigate = Route.useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    if (window.confirm("ログアウトしますか？")) {
      await logout();
      await sleep(250);
      navigate({ to: "/login" });
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>レシピ共有サイト</h1>
        <nav>
          <ul className={styles.navList}>
            <li>
              <Link to="/auth" className={styles.linkButton}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/auth/recipes" className={styles.linkButton}>
                Recipes
              </Link>
            </li>
            <li>
              <Link to="/auth/recipe/new" className={styles.linkButton}>
                Post Recipe
              </Link>
            </li>
            <li>
              <button
                type="button"
                className={styles.linkButton}
                onClick={handleLogout}
              >
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
      <footer className={styles.footer}>
        <p>© 2024 レシピ共有サイト. All rights reserved.</p>
      </footer>
    </div>
  );
}
