import * as React from "react";
import axios from "axios";

export interface AuthContext {
	isAuthenticated: boolean;
	login: () => void;
	logout: () => Promise<void>;
	user: string | null;
}

const AuthContext = React.createContext<AuthContext | null>(null);

const clientId = import.meta.env.VITE_APP_GOOGLE_CLIENT_ID;
const redirectUri = import.meta.env.VITE_APP_GOOGLE_CLIENT_REDIRECT;

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = React.useState<string | null>(null);
	const isAuthenticated = !!user;

	const logout = React.useCallback(async () => {
		setStoredUser(null);
		setUser(null);
	}, []);

	const loginWithGoogle = (): void => {
		const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=profile email`;
		window.location.href = authUrl;
	};

	const fetchUserProfile = async () => {
		const res = await axios.get(`/api/login/check`, {
			withCredentials: true,
		});
		setUser(res.name);
	};

	return (
		<AuthContext.Provider
			value={{ isAuthenticated, user, login: loginWithGoogle, logout }}
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
