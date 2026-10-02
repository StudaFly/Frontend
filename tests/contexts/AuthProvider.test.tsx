import { act, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AuthProvider } from "@/contexts/AuthProvider";
import { useAuth } from "@/contexts/AuthContext";
import { tokenStorage } from "@/core/auth/tokenStorage";
import type { ApiUser } from "@/core/api/users";

const sessionExpired = vi.hoisted(() => ({ listener: undefined as undefined | (() => void) }));

vi.mock("@/core/api/users", () => ({ getMe: vi.fn(), updateMe: vi.fn() }));
vi.mock("@/core/api/auth", () => ({ logout: vi.fn().mockResolvedValue({}) }));
vi.mock("@/core/api/client", () => ({
    onSessionExpired: (listener: () => void) => {
        sessionExpired.listener = listener;
        return () => undefined;
    },
}));

import { getMe } from "@/core/api/users";
import { logout as apiLogout } from "@/core/api/auth";

const apiUser: ApiUser = {
    id: "u1",
    email: "lucas@example.com",
    name: "Lucas Martin",
    role: "student",
    institutionId: null,
    isPremium: false,
    emailVerified: false,
    oauthProvider: null,
    avatarEmoji: "🚀",
    phone: null,
    enableNotifications: true,
    createdAt: "2026-09-30T00:00:00Z",
};

function Probe() {
    const { isAuthenticated, isRestoring, user, startSession, logout } = useAuth();
    return (
        <div>
            <p data-testid="state">{isRestoring ? "restoring" : isAuthenticated ? "in" : "out"}</p>
            <p data-testid="name">{user ? `${user.firstName}|${user.lastName}|${user.avatar}` : ""}</p>
            <button onClick={() => startSession({ user: apiUser, accessToken: "a", refreshToken: "r" }, { remember: false })}>
                start
            </button>
            <button onClick={logout}>logout</button>
        </div>
    );
}

const renderProbe = () => render(<AuthProvider><Probe /></AuthProvider>);

describe("AuthProvider", () => {
    beforeEach(() => {
        localStorage.clear();
        sessionStorage.clear();
        vi.mocked(getMe).mockReset();
    });

    it("is logged out without tokens, even if a user is cached", () => {
        localStorage.setItem("studafly_auth_user", JSON.stringify({ firstName: "Old" }));
        renderProbe();
        expect(screen.getByTestId("state")).toHaveTextContent("out");
        expect(getMe).not.toHaveBeenCalled();
    });

    it("restores a stored session from /users/me", async () => {
        tokenStorage.setTokens("a", "r");
        vi.mocked(getMe).mockResolvedValue({ data: { data: apiUser, message: "OK" } } as never);
        renderProbe();

        expect(screen.getByTestId("state")).toHaveTextContent("restoring");
        await waitFor(() => expect(screen.getByTestId("state")).toHaveTextContent("in"));
        expect(screen.getByTestId("name")).toHaveTextContent("Lucas|Martin|🚀");
    });

    it("starts a session and stores the tokens", async () => {
        renderProbe();
        await act(async () => screen.getByText("start").click());

        expect(screen.getByTestId("state")).toHaveTextContent("in");
        expect(sessionStorage.getItem("refreshToken")).toBe("r");
    });

    it("logs out when the session expires", async () => {
        renderProbe();
        await act(async () => screen.getByText("start").click());
        await act(async () => sessionExpired.listener?.());

        expect(screen.getByTestId("state")).toHaveTextContent("out");
        expect(localStorage.getItem("studafly_auth_user")).toBeNull();
    });

    it("logout clears tokens and revokes the refresh token server-side", async () => {
        renderProbe();
        await act(async () => screen.getByText("start").click());
        await act(async () => screen.getByText("logout").click());

        expect(screen.getByTestId("state")).toHaveTextContent("out");
        expect(tokenStorage.hasSession()).toBe(false);
        expect(apiLogout).toHaveBeenCalledWith("a");
    });
});
