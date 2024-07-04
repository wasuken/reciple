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

export const Route = createFileRoute("/auth")({
	beforeLoad: async ({ context, location }) => {
		if (!context.auth.isAuthenticated) {
			throw redirect({
				to: "/",
				search: {
					redirect: location.href,
				},
			});
		}
	},
	component: AuthLayoutSuspense,
});

function AuthLayoutSuspense() {
	return (
		<Suspense fallback={<>Loading...</>}>
			<AuthLayout />
		</Suspense>
	);
}

function AuthLayout() {
	const router = useRouter();
	const navigate = Route.useNavigate();
	const { logout } = useAuth();

	const handleLogout = () => {
		if (window.confirm("Are you sure you want to logout?")) {
			logout().then(() => {
				router.invalidate().then(() => navigate({ to: "/" }));
			});
		}
	};

	return (
		<div className={styles.container}>
			<header className={styles.header}>
				<h1>レシピ共有サイト</h1>
				<nav>
					<ul className={styles.navList}>
						<li>
							<Link to="/" className={styles.linkButton}>
								Home
							</Link>
						</li>
						<li>
							<Link to="/about" className={styles.linkButton}>
								About
							</Link>
						</li>
						<li>
							<Link to="/auth/recipes" className={styles.linkButton}>
								Recipes
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
