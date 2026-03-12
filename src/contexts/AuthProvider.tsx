import { useState, ReactNode } from "react";
import { AuthContext, type User } from "./AuthContext";
import { logout as apiLogout } from "@/core/api/auth";

export function AuthProvider({ children }: { children: ReactNode }) {
    const AUTH_STORAGE_KEY = "studafly_auth_user";
    // Initialize from localStorage if available
    const [user, setUser] = useState<User | null>(() => {
        try {
            const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);
            return storedUser ? JSON.parse(storedUser) : null;
        } catch {
            return null;
        }
    });

    // Derived state
    const isAuthenticated = !!user;

    const login = (userData: User) => {
        setUser(userData);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData));
    };

    const logout = () => {
        const token = localStorage.getItem("accessToken");
        setUser(null);
        localStorage.removeItem(AUTH_STORAGE_KEY);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        if (token) {
            void apiLogout(token);
        }
    };

    const updateUser = (userData: Partial<User>) => {
        setUser((prev) => {
            if (!prev) return prev;
            const updated = { ...prev, ...userData };
            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updated));
            return updated;
        });
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
}
