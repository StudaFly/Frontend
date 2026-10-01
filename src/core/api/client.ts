/// <reference types="vite/client" />
import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { tokenStorage } from "@/core/auth/tokenStorage";

export const API_BASE_URL: string = import.meta.env.VITE_API_URL ?? "http://localhost:8080/api/v1";

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: { "Content-Type": "application/json" },
});

type RetriableConfig = InternalAxiosRequestConfig & { _retry?: boolean };

const sessionExpiredListeners = new Set<() => void>();

/** Called when the session cannot be refreshed anymore (tokens are already cleared). */
export function onSessionExpired(listener: () => void): () => void {
    sessionExpiredListeners.add(listener);
    return () => sessionExpiredListeners.delete(listener);
}

// A single refresh in flight: concurrent 401s wait for the same rotation,
// because the backend revokes the previous refresh token on each refresh.
let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
    const refreshToken = tokenStorage.getRefreshToken();
    if (!refreshToken) throw new Error("No refresh token");
    const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken });
    tokenStorage.updateTokens(data.data.accessToken, data.data.refreshToken);
    return data.data.accessToken;
}

apiClient.interceptors.request.use((config) => {
    const token = tokenStorage.getAccessToken();
    if (token && !config.headers.Authorization) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const config = error.config as RetriableConfig | undefined;
        const isAuthCall = config?.url?.startsWith("/auth/") ?? false;
        if (error.response?.status !== 401 || !config || config._retry || isAuthCall) {
            return Promise.reject(error);
        }

        config._retry = true;
        try {
            refreshPromise ??= refreshAccessToken().finally(() => {
                refreshPromise = null;
            });
            const accessToken = await refreshPromise;
            config.headers.Authorization = `Bearer ${accessToken}`;
            return apiClient(config);
        } catch {
            tokenStorage.clear();
            sessionExpiredListeners.forEach((listener) => listener());
            return Promise.reject(error);
        }
    }
);

export default apiClient;
