const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

// "Se souvenir de moi" → localStorage (survives a browser restart);
// otherwise sessionStorage (cleared when the tab is closed).
function persistentStore(remember: boolean): Storage {
    return remember ? window.localStorage : window.sessionStorage;
}

function read(key: string): string | null {
    try {
        return window.localStorage.getItem(key) ?? window.sessionStorage.getItem(key);
    } catch {
        return null;
    }
}

function currentStore(): Storage {
    try {
        return window.sessionStorage.getItem(REFRESH_TOKEN_KEY) !== null
            ? window.sessionStorage
            : window.localStorage;
    } catch {
        return window.localStorage;
    }
}

export const tokenStorage = {
    getAccessToken: () => read(ACCESS_TOKEN_KEY),

    getRefreshToken: () => read(REFRESH_TOKEN_KEY),

    hasSession: () => read(REFRESH_TOKEN_KEY) !== null || read(ACCESS_TOKEN_KEY) !== null,

    /** Start a session (login / register). */
    setTokens(accessToken: string, refreshToken: string, remember = true) {
        tokenStorage.clear();
        try {
            const store = persistentStore(remember);
            store.setItem(ACCESS_TOKEN_KEY, accessToken);
            store.setItem(REFRESH_TOKEN_KEY, refreshToken);
        } catch {
            // Storage unavailable (private mode…): the session only lasts until reload.
        }
    },

    /** Store the rotated tokens returned by /auth/refresh, in the same storage. */
    updateTokens(accessToken: string, refreshToken: string) {
        try {
            const store = currentStore();
            store.setItem(ACCESS_TOKEN_KEY, accessToken);
            store.setItem(REFRESH_TOKEN_KEY, refreshToken);
        } catch {
            // ignore
        }
    },

    clear() {
        for (const store of [window.localStorage, window.sessionStorage]) {
            try {
                store.removeItem(ACCESS_TOKEN_KEY);
                store.removeItem(REFRESH_TOKEN_KEY);
            } catch {
                // ignore
            }
        }
    },
};
