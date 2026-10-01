import { createContext, useContext } from "react";
import type { AuthPayload } from "@/core/api/auth";

export interface User {
    id?: string;
    role?: "student" | "admin" | "superadmin";
    firstName: string;
    lastName: string;
    email: string;
    phone?: string | null;
    avatar: string | null;
    avatarType: "image" | "emoji";
    // Local-only profile fields (not stored by the backend yet).
    age?: string;
    city?: string;
    destinations?: string[];
    period?: string;
    budget?: string;
    cover?: string | null;
}

export interface StartSessionOptions {
    /** "Se souvenir de moi": keep the session after the browser is closed. */
    remember?: boolean;
    /** Extra profile fields known by the client (avatar picked at sign-up…). */
    profile?: Partial<User>;
}

export interface AuthContextType {
    isAuthenticated: boolean;
    /** True while a stored session is being checked against the API. */
    isRestoring: boolean;
    user: User | null;
    startSession: (auth: AuthPayload, options?: StartSessionOptions) => void;
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
