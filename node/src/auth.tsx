import React, { useEffect, useState } from "react";
import {
	createFileRoute,
	Link,
	Outlet,
	redirect,
	useNavigate,
	useRouter,
} from "@tanstack/react-router";
import axios from "axios";

export interface AuthContext {
	isAuthenticated: boolean;
	login: () => void;
	logout: () => Promise<void>;
	user: string | null;
	fetchUserProfile: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContext | null>(null);

const clientId = import.meta.env.VITE_APP_GOOGLE_CLIENT_ID;
const redirectUri = import.meta.env.VITE_APP_GOOGLE_CLIENT_REDIRECT;

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<string | null>(null);
	const isAuthenticated = !!user;

	const logout = React.useCallback(async () => {
		const res = await axios.get(`/api/auth/logout`, {
			withCredentials: true,
		});
		if (res.status === 200) {
			setUser(null);
		}
	}, [setUser]);

	const loginWithGoogle = (): void => {
		const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=profile email`;
		window.location.href = authUrl;
	};

	const fetchUserProfile = async () => {
		const res = await axios.get(`/api/auth/check`, {
			withCredentials: true,
		});
		if (res.status === 200) {
			setUser(res.data.name);
			console.log("success");
		}
	};
	useEffect(() => {
		fetchUserProfile().then(() => console.log("fetched"));
	}, []);

	return (
		<AuthContext.Provider
			value={{
				isAuthenticated,
				user,
				login: loginWithGoogle,
				logout,
				fetchUserProfile,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = React.useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}
