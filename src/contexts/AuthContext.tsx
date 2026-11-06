import { useShallow } from "zustand/react/shallow";
import type { AuthPayload } from "@/core/api/auth";
import type { AccountType, OrgRole, OrganizationSummary, Premium } from "@/core/api/types";
import { useSessionStore } from "@/core/auth/sessionStore";

export interface User {
    id?: string;
    role?: "student" | "admin" | "superadmin";
    accountType?: AccountType;
    orgRole?: OrgRole | null;
    organization?: OrganizationSummary | null;
    premium?: Premium;
    mfaEnabled?: boolean;
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
    /** Platform admins: true once the TOTP step is done for this session. */
    mfaVerified: boolean;
    startSession: (auth: AuthPayload, options?: StartSessionOptions) => void;
    logout: () => void;
    updateUser: (userData: Partial<User>) => void;
    /** Reloads /users/me (after joining or leaving a school…). */
    refreshUser: () => Promise<void>;
}

/** Session state, backed by the Zustand session store. */
export function useAuth(): AuthContextType {
    const state = useSessionStore(
        useShallow((s) => ({
            user: s.user,
            isRestoring: s.isRestoring,
            mfaVerified: s.mfaVerified,
            startSession: s.startSession,
            logout: s.logout,
            updateUser: s.updateUser,
            refreshUser: s.refreshUser,
        })),
    );
    return { ...state, isAuthenticated: !!state.user };
}
