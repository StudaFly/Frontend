import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

type InitConfig = { clientId: string; scope: string; redirectURI: string; state: string; nonce: string; usePopup: boolean };

let lastConfig: InitConfig | null = null;
const signIn = vi.fn();

async function loadModule(servicesId = "com.studafly.web", redirectUri = "https://app.studafly.com/auth/apple") {
    vi.resetModules();
    vi.stubEnv("VITE_APPLE_SERVICES_ID", servicesId);
    vi.stubEnv("VITE_APPLE_REDIRECT_URI", redirectUri);
    return import("@/core/auth/appleIdentity");
}

/** Apple answers with the state it was given at init. */
function answer(overrides: Record<string, unknown> = {}, user?: unknown) {
    signIn.mockImplementation(async () => ({
        authorization: { code: "apple-code", id_token: "apple-id-token", state: lastConfig?.state, ...overrides },
        user,
    }));
}

describe("appleIdentity", () => {
    beforeEach(() => {
        lastConfig = null;
        signIn.mockReset();
        window.AppleID = {
            auth: {
                init: (config: InitConfig) => {
                    lastConfig = config;
                },
                signIn,
            },
        } as unknown as Window["AppleID"];
    });

    afterEach(() => {
        delete window.AppleID;
        vi.unstubAllEnvs();
    });

    it("opens the popup with a hashed nonce and returns the raw one", async () => {
        const { requestAppleCredential, sha256Hex } = await loadModule();
        answer({}, { name: { firstName: "Lucas", lastName: "Martin" }, email: "lucas@icloud.com" });

        const credential = await requestAppleCredential();

        expect(lastConfig).toMatchObject({
            clientId: "com.studafly.web",
            scope: "name email",
            redirectURI: "https://app.studafly.com/auth/apple",
            usePopup: true,
        });
        expect(credential).toMatchObject({
            idToken: "apple-id-token",
            authorizationCode: "apple-code",
            firstName: "Lucas",
            lastName: "Martin",
        });
        expect(credential.nonce).toMatch(/^[0-9a-f]{64}$/);
        expect(lastConfig?.nonce).toBe(await sha256Hex(credential.nonce));
    });

    it("omits the name Apple only shares the first time", async () => {
        const { requestAppleCredential } = await loadModule();
        answer();

        const credential = await requestAppleCredential();

        expect(credential.firstName).toBeUndefined();
        expect(credential.lastName).toBeUndefined();
    });

    it("rejects an answer with another state", async () => {
        const { requestAppleCredential } = await loadModule();
        answer({ state: "forged" });

        await expect(requestAppleCredential()).rejects.toThrow("La connexion Apple a échoué");
    });

    it.each(["popup_closed_by_user", "user_cancelled_authorize"])("reports %s as a cancellation", async (error) => {
        const { requestAppleCredential, AppleSignInCancelledError } = await loadModule();
        signIn.mockRejectedValue({ error });

        await expect(requestAppleCredential()).rejects.toBeInstanceOf(AppleSignInCancelledError);
    });

    it("explains other failures", async () => {
        const { requestAppleCredential, AppleSignInCancelledError } = await loadModule();
        signIn.mockRejectedValue({ error: "popup_blocked_by_browser" });

        const error = await requestAppleCredential().catch((err: unknown) => err);

        expect(error).not.toBeInstanceOf(AppleSignInCancelledError);
        expect((error as Error).message).toContain("popups");
    });

    it("fails fast when Apple sign-in is not configured", async () => {
        const { requestAppleCredential } = await loadModule("");

        await expect(requestAppleCredential()).rejects.toThrow("pas configurée");
        expect(signIn).not.toHaveBeenCalled();
    });
});
