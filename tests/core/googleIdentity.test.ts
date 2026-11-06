import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

type CodeClientConfig = {
    client_id: string;
    scope: string;
    ux_mode: string;
    callback: (response: { code?: string; error?: string; error_description?: string }) => void;
    error_callback?: (error: { type: string }) => void;
};

let lastConfig: CodeClientConfig | null = null;
const requestCode = vi.fn();

async function loadModule(clientId = "web-client-id") {
    vi.resetModules();
    vi.stubEnv("VITE_GOOGLE_CLIENT_ID", clientId);
    return import("@/core/auth/googleIdentity");
}

describe("googleIdentity", () => {
    beforeEach(() => {
        lastConfig = null;
        requestCode.mockReset();
        window.google = {
            accounts: {
                oauth2: {
                    initCodeClient: (config: CodeClientConfig) => {
                        lastConfig = config;
                        return { requestCode };
                    },
                },
            },
        } as unknown as Window["google"];
    });

    afterEach(() => {
        delete window.google;
        vi.unstubAllEnvs();
    });

    it("opens the popup with the right config and resolves the code", async () => {
        const { requestGoogleAuthCode } = await loadModule();

        const promise = requestGoogleAuthCode();
        await vi.waitFor(() => expect(requestCode).toHaveBeenCalled());
        expect(lastConfig).toMatchObject({
            client_id: "web-client-id",
            scope: "openid email profile",
            ux_mode: "popup",
        });
        lastConfig!.callback({ code: "auth-code" });

        await expect(promise).resolves.toBe("auth-code");
    });

    it("rejects with a cancellation when the popup is closed", async () => {
        const { requestGoogleAuthCode, GoogleSignInCancelledError } = await loadModule();

        const promise = requestGoogleAuthCode();
        await vi.waitFor(() => expect(requestCode).toHaveBeenCalled());
        lastConfig!.error_callback!({ type: "popup_closed" });

        await expect(promise).rejects.toBeInstanceOf(GoogleSignInCancelledError);
    });

    it("rejects with a cancellation when the user denies access", async () => {
        const { requestGoogleAuthCode, GoogleSignInCancelledError } = await loadModule();

        const promise = requestGoogleAuthCode();
        await vi.waitFor(() => expect(requestCode).toHaveBeenCalled());
        lastConfig!.callback({ error: "access_denied" });

        await expect(promise).rejects.toBeInstanceOf(GoogleSignInCancelledError);
    });

    it("rejects with a readable error when the popup is blocked", async () => {
        const { requestGoogleAuthCode, GoogleSignInCancelledError } = await loadModule();

        const promise = requestGoogleAuthCode();
        await vi.waitFor(() => expect(requestCode).toHaveBeenCalled());
        lastConfig!.error_callback!({ type: "popup_failed_to_open" });

        await expect(promise).rejects.toThrow(/popups/);
        await expect(promise).rejects.not.toBeInstanceOf(GoogleSignInCancelledError);
    });

    it("fails fast when Google sign-in is not configured", async () => {
        const { requestGoogleAuthCode } = await loadModule("");

        await expect(requestGoogleAuthCode()).rejects.toThrow(/pas configurée/);
        expect(requestCode).not.toHaveBeenCalled();
    });
});
