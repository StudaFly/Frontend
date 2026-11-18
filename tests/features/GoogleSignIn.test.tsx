import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AxiosError, AxiosHeaders } from "axios";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AuthProvider } from "@/contexts/AuthProvider";
import LoginPage from "@/features/auth/pages/LoginPage";
import { tokenStorage } from "@/core/auth/tokenStorage";

const toast = vi.hoisted(() => ({ success: vi.fn(), error: vi.fn() }));
vi.mock("sonner", () => ({ toast }));
vi.mock("@/core/api/auth", () => ({ login: vi.fn(), logout: vi.fn(), oauthGoogle: vi.fn() }));
vi.mock("@/core/auth/googleIdentity", async (importOriginal) => {
    const actual = await importOriginal<typeof import("@/core/auth/googleIdentity")>();
    return {
        ...actual,
        GOOGLE_CLIENT_ID: "web-client-id",
        loadGoogleIdentity: vi.fn().mockResolvedValue({}),
        requestGoogleAuthCode: vi.fn(),
    };
});
import { oauthGoogle } from "@/core/api/auth";
import { GoogleSignInCancelledError, requestGoogleAuthCode } from "@/core/auth/googleIdentity";

const API_USER = { id: "u1", email: "lucas@gmail.com", name: "Lucas Martin", role: "student" };

function authResponse(isNewUser: boolean) {
    return {
        data: { data: { accessToken: "a", refreshToken: "r", isNewUser, user: API_USER }, message: "OK" },
    } as Awaited<ReturnType<typeof oauthGoogle>>;
}

function renderLogin() {
    return render(
        <AuthProvider>
            <MemoryRouter initialEntries={["/login"]}>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/dashboard" element={<p>dashboard</p>} />
                    <Route path="/mobility/new" element={<p>new mobility</p>} />
                </Routes>
            </MemoryRouter>
        </AuthProvider>
    );
}

async function clickGoogle() {
    const user = userEvent.setup({ delay: null });
    await user.click(screen.getByRole("button", { name: /google/i }));
}

describe("Google sign-in", () => {
    beforeEach(() => {
        localStorage.clear();
        sessionStorage.clear();
        vi.clearAllMocks();
    });

    it("sends the authorization code and opens the dashboard for an existing user", async () => {
        vi.mocked(requestGoogleAuthCode).mockResolvedValue("auth-code");
        vi.mocked(oauthGoogle).mockResolvedValue(authResponse(false));
        renderLogin();

        await clickGoogle();

        expect(await screen.findByText("dashboard")).toBeInTheDocument();
        expect(oauthGoogle).toHaveBeenCalledWith({ code: "auth-code" });
        expect(tokenStorage.getAccessToken()).toBe("a");
        expect(tokenStorage.getRefreshToken()).toBe("r");
        expect(toast.success).toHaveBeenCalled();
    });

    it("sends a new user to the mobility creation", async () => {
        vi.mocked(requestGoogleAuthCode).mockResolvedValue("auth-code");
        vi.mocked(oauthGoogle).mockResolvedValue(authResponse(true));
        renderLogin();

        await clickGoogle();

        expect(await screen.findByText("new mobility")).toBeInTheDocument();
    });

    it("stays silent when the popup is closed", async () => {
        vi.mocked(requestGoogleAuthCode).mockRejectedValue(new GoogleSignInCancelledError());
        renderLogin();

        await clickGoogle();

        await waitFor(() => expect(screen.getByRole("button", { name: /google/i })).toBeEnabled());
        expect(oauthGoogle).not.toHaveBeenCalled();
        expect(toast.error).not.toHaveBeenCalled();
        expect(tokenStorage.hasSession()).toBe(false);
    });

    it("shows the API error message", async () => {
        vi.mocked(requestGoogleAuthCode).mockResolvedValue("auth-code");
        vi.mocked(oauthGoogle).mockRejectedValue(
            new AxiosError("401", "ERR", undefined, undefined, {
                status: 401,
                statusText: "Unauthorized",
                headers: {},
                config: { headers: new AxiosHeaders() },
                data: { error: { code: "UNAUTHORIZED", message: "Invalid or expired Google token" } },
            })
        );
        renderLogin();

        await clickGoogle();

        await waitFor(() => expect(toast.error).toHaveBeenCalledWith("Invalid or expired Google token"));
        expect(tokenStorage.hasSession()).toBe(false);
    });

    it("shows a popup error", async () => {
        vi.mocked(requestGoogleAuthCode).mockRejectedValue(new Error("Autorise les popups"));
        renderLogin();

        await clickGoogle();

        await waitFor(() => expect(toast.error).toHaveBeenCalledWith("Autorise les popups"));
    });
});
