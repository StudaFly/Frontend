import { beforeEach, describe, expect, it } from "vitest";
import { tokenStorage } from "@/core/auth/tokenStorage";

describe("tokenStorage", () => {
    beforeEach(() => {
        localStorage.clear();
        sessionStorage.clear();
    });

    it("keeps the session in localStorage when 'remember me' is checked", () => {
        tokenStorage.setTokens("a", "r", true);
        expect(localStorage.getItem("refreshToken")).toBe("r");
        expect(sessionStorage.getItem("refreshToken")).toBeNull();
    });

    it("keeps the session in sessionStorage otherwise", () => {
        tokenStorage.setTokens("a", "r", false);
        expect(sessionStorage.getItem("refreshToken")).toBe("r");
        expect(localStorage.getItem("refreshToken")).toBeNull();
        expect(tokenStorage.getAccessToken()).toBe("a");
    });

    it("writes rotated tokens to the storage already in use", () => {
        tokenStorage.setTokens("a", "r", false);
        tokenStorage.updateTokens("a2", "r2");
        expect(sessionStorage.getItem("accessToken")).toBe("a2");
        expect(sessionStorage.getItem("refreshToken")).toBe("r2");
        expect(localStorage.getItem("refreshToken")).toBeNull();
    });

    it("clears both storages", () => {
        tokenStorage.setTokens("a", "r", true);
        tokenStorage.clear();
        expect(tokenStorage.hasSession()).toBe(false);
    });
});
