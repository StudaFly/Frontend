import { useEffect, useState, type ReactNode } from "react";
import { onSessionExpired } from "@/core/api/client";
import { getMe } from "@/core/api/users";
import { useSessionStore } from "@/core/auth/sessionStore";
import { tokenStorage } from "@/core/auth/tokenStorage";

/** Boots the session store: reads the stored session, then revalidates it against the API. */
export function AuthProvider({ children }: { children: ReactNode }) {
    useState(() => {
        useSessionStore.getState().hydrate();
        return true;
    });

    // Refresh token rejected (expired, revoked): the API client already cleared the tokens.
    useEffect(() => onSessionExpired(() => useSessionStore.getState().clear()), []);

    useEffect(() => {
        const store = useSessionStore.getState();
        if (!tokenStorage.hasSession()) {
            store.clear();
            return;
        }
        let cancelled = false;
        getMe()
            .then(({ data }) => {
                if (!cancelled) useSessionStore.getState().setApiUser(data.data);
            })
            .catch(() => {
                // 401 → onSessionExpired already logged out; network error → keep the cached user.
            })
            .finally(() => {
                if (!cancelled) useSessionStore.getState().finishRestoring();
            });
        return () => {
            cancelled = true;
        };
    }, []);

    return <>{children}</>;
}
