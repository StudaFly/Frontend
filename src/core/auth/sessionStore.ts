import { create } from "zustand";
import type { StartSessionOptions, User } from "@/contexts/AuthContext";
import { toSessionUser } from "@/contexts/sessionUser";
import { logout as apiLogout, type AuthPayload } from "@/core/api/auth";
import { getMe, type ApiUser } from "@/core/api/users";
import { readAccessClaims } from "./tokenClaims";
import { tokenStorage } from "./tokenStorage";

const AUTH_STORAGE_KEY = "studafly_auth_user";

function readStoredUser(): User | null {
    if (!tokenStorage.hasSession()) return null;
    try {
        const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);
        return storedUser ? (JSON.parse(storedUser) as User) : null;
    } catch {
        return null;
    }
}

function persistUser(user: User | null) {
    try {
        if (user) localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
        else localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch {
        // Storage unavailable: the user stays in memory only.
    }
}

interface SessionState {
    user: User | null;
    isRestoring: boolean;
    mfaVerified: boolean;
    hydrate: () => void;
    finishRestoring: () => void;
    setApiUser: (apiUser: ApiUser) => void;
    startSession: (auth: AuthPayload, options?: StartSessionOptions) => void;
    updateUser: (userData: Partial<User>) => void;
    refreshUser: () => Promise<void>;
    clear: () => void;
    logout: () => void;
}

export const useSessionStore = create<SessionState>((set, get) => ({
    user: null,
    isRestoring: false,
    mfaVerified: false,

    hydrate: () => {
        const user = readStoredUser();
        set({
            user,
            isRestoring: tokenStorage.hasSession() && !user,
            mfaVerified: readAccessClaims().mfa === true,
        });
    },

    finishRestoring: () => set({ isRestoring: false }),

    setApiUser: (apiUser) => {
        const next = toSessionUser(apiUser, get().user);
        persistUser(next);
        set({ user: next, mfaVerified: readAccessClaims().mfa === true });
    },

    startSession: (auth, { remember = true, profile } = {}) => {
        tokenStorage.setTokens(auth.accessToken, auth.refreshToken, remember);
        const next = { ...toSessionUser(auth.user), ...profile };
        persistUser(next);
        set({ user: next, isRestoring: false, mfaVerified: readAccessClaims(auth.accessToken).mfa === true });
    },

    updateUser: (userData) => {
        const previous = get().user;
        if (!previous) return;
        const updated = { ...previous, ...userData };
        persistUser(updated);
        set({ user: updated });
    },

    refreshUser: async () => {
        const { data } = await getMe();
        get().setApiUser(data.data);
    },

    clear: () => {
        persistUser(null);
        set({ user: null, mfaVerified: false, isRestoring: false });
    },

    logout: () => {
        const token = tokenStorage.getAccessToken();
        tokenStorage.clear();
        get().clear();
        if (token) {
            apiLogout(token).catch(() => {
                // The refresh token expires server-side anyway.
            });
        }
    },
}));
