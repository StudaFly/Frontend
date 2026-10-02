import axios, { AxiosError, type AxiosAdapter, type InternalAxiosRequestConfig } from "axios";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import apiClient, { onSessionExpired } from "@/core/api/client";
import { tokenStorage } from "@/core/auth/tokenStorage";

function respond(config: InternalAxiosRequestConfig, status: number, data: unknown = {}) {
    const response = { data, status, statusText: String(status), headers: {}, config };
    if (status >= 400) {
        return Promise.reject(new AxiosError("error", String(status), config, null, response));
    }
    return Promise.resolve(response);
}

/** Fake backend: 401 unless the request carries the expected access token. */
function backendAccepting(validToken: string) {
    const calls: string[] = [];
    const adapter: AxiosAdapter = (config) => {
        const auth = String(config.headers.Authorization ?? "");
        calls.push(`${config.url} ${auth}`);
        return auth === `Bearer ${validToken}` ? respond(config, 200, { data: "ok" }) : respond(config, 401);
    };
    return { adapter, calls };
}

describe("apiClient", () => {
    const originalAdapter = apiClient.defaults.adapter;

    beforeEach(() => {
        localStorage.clear();
        sessionStorage.clear();
    });

    afterEach(() => {
        apiClient.defaults.adapter = originalAdapter;
        vi.restoreAllMocks();
    });

    it("sends the stored access token", async () => {
        tokenStorage.setTokens("access-1", "refresh-1");
        const { adapter, calls } = backendAccepting("access-1");
        apiClient.defaults.adapter = adapter;

        await apiClient.get("/users/me");

        expect(calls).toEqual(["/users/me Bearer access-1"]);
    });

    it("refreshes on 401, stores the rotated tokens and replays the request", async () => {
        tokenStorage.setTokens("expired", "refresh-1");
        const { adapter } = backendAccepting("access-2");
        apiClient.defaults.adapter = adapter;
        const post = vi.spyOn(axios, "post").mockResolvedValue({
            data: { data: { accessToken: "access-2", refreshToken: "refresh-2" } },
        });

        const res = await apiClient.get("/users/me");

        expect(res.data).toEqual({ data: "ok" });
        expect(post).toHaveBeenCalledWith(expect.stringMatching(/\/auth\/refresh$/), { refreshToken: "refresh-1" });
        expect(tokenStorage.getAccessToken()).toBe("access-2");
        expect(tokenStorage.getRefreshToken()).toBe("refresh-2");
    });

    it("shares a single refresh between concurrent 401s", async () => {
        tokenStorage.setTokens("expired", "refresh-1");
        apiClient.defaults.adapter = backendAccepting("access-2").adapter;
        const post = vi.spyOn(axios, "post").mockResolvedValue({
            data: { data: { accessToken: "access-2", refreshToken: "refresh-2" } },
        });

        await Promise.all([apiClient.get("/a"), apiClient.get("/b"), apiClient.get("/c")]);

        expect(post).toHaveBeenCalledTimes(1);
    });

    it("clears the session and notifies listeners when the refresh fails", async () => {
        tokenStorage.setTokens("expired", "revoked");
        apiClient.defaults.adapter = backendAccepting("never").adapter;
        vi.spyOn(axios, "post").mockRejectedValue(new Error("401"));
        const listener = vi.fn();
        const unsubscribe = onSessionExpired(listener);

        await expect(apiClient.get("/users/me")).rejects.toBeInstanceOf(AxiosError);

        expect(listener).toHaveBeenCalledOnce();
        expect(tokenStorage.hasSession()).toBe(false);
        unsubscribe();
    });

    it("does not try to refresh on auth endpoints (wrong password)", async () => {
        apiClient.defaults.adapter = backendAccepting("never").adapter;
        const post = vi.spyOn(axios, "post");

        await expect(apiClient.post("/auth/login", {})).rejects.toBeInstanceOf(AxiosError);

        expect(post).not.toHaveBeenCalled();
    });
});
