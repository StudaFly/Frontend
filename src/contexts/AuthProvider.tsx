import { useCallback, useEffect, useState, type ReactNode } from "react";
import { AuthContext, type StartSessionOptions, type User } from "./AuthContext";
import { toSessionUser } from "./sessionUser";
import { logout as apiLogout, type AuthPayload } from "@/core/api/auth";
import { onSessionExpired } from "@/core/api/client";
import { getMe } from "@/core/api/users";
import { tokenStorage } from "@/core/auth/tokenStorage";

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

export function AuthProvider({ children }: { children: ReactNode }) {
    // The user is only considered logged in when tokens exist.
    const [user, setUser] = useState<User | null>(readStoredUser);
    const [isRestoring, setIsRestoring] = useState(() => tokenStorage.hasSession() && !readStoredUser());

    const setAndPersist = useCallback((next: User | null) => {
        setUser(next);
        persistUser(next);
    }, []);

    // Refresh token rejected (expired, revoked): the API client already cleared the tokens.
    useEffect(() => onSessionExpired(() => setAndPersist(null)), [setAndPersist]);

    // Revalidate a stored session against the API on startup.
    useEffect(() => {
        if (!tokenStorage.hasSession()) {
            persistUser(null);
            return;
        }
        let cancelled = false;
        getMe()
            .then(({ data }) => {
                if (cancelled) return;
                setUser((previous) => {
                    const next = toSessionUser(data.data, previous);
                    persistUser(next);
                    return next;
                });
            })
            .catch(() => {
                // 401 → onSessionExpired already logged out; network error → keep the cached user.
            })
            .finally(() => {
                if (!cancelled) setIsRestoring(false);
            });
        return () => {
            cancelled = true;
        };
    }, []);

    const startSession = useCallback(
        (auth: AuthPayload, { remember = true, profile }: StartSessionOptions = {}) => {
            tokenStorage.setTokens(auth.accessToken, auth.refreshToken, remember);
            setAndPersist({ ...toSessionUser(auth.user), ...profile });
            setIsRestoring(false);
        },
        [setAndPersist],
    );

    const logout = useCallback(() => {
        const token = tokenStorage.getAccessToken();
        tokenStorage.clear();
        setAndPersist(null);
        if (token) {
            apiLogout(token).catch(() => {
                // The refresh token expires server-side anyway.
            });
        }
    }, [setAndPersist]);

    const updateUser = useCallback((userData: Partial<User>) => {
        setUser((prev) => {
            if (!prev) return prev;
            const updated = { ...prev, ...userData };
            persistUser(updated);
            return updated;
        });
    }, []);

    return (
        <AuthContext.Provider
            value={{ isAuthenticated: !!user, isRestoring, user, startSession, logout, updateUser }}
        >
            {children}
        </AuthContext.Provider>
    );
}
