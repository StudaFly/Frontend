import { createContext, useContext, useState, ReactNode } from "react";

interface User {
    firstName: string;
    lastName: string;
    email: string;
    avatar: string | null;
    avatarType: "image" | "emoji";
    age?: string;
    city?: string;
    destinations?: string[];
    period?: string;
    budget?: string;
    cover?: string | null;
}

interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    login: (userData: User) => void;
    logout: () => void;
    updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = "studafly_auth_user";

export function AuthProvider({ children }: { children: ReactNode }) {
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
        setUser(null);
        localStorage.removeItem(AUTH_STORAGE_KEY);
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

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
