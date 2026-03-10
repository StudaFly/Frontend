import { createContext, useContext } from "react";

export interface User {
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

export interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    login: (userData: User) => void;
    logout: () => void;
    updateUser: (userData: Partial<User>) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
