import React, { useEffect, Suspense } from "react";
import {
	createFileRoute,
	Link,
	Outlet,
	redirect,
	useRouter,
} from "@tanstack/react-router";

import { useAuth } from "@/auth";

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
		<div className="p-2 h-full">
			<h1>Authenticated Route</h1>
			<p>This route's content is only visible to authenticated users.</p>
			<ul className="py-2 flex gap-2">
				<li>
					<button
						type="button"
						className="hover:underline"
						onClick={handleLogout}
					>
						Logout
					</button>
				</li>
			</ul>
			<hr />
			<Outlet />
		</div>
	);
}
