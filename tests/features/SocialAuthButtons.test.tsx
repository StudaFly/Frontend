import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AuthProvider } from "@/contexts/AuthProvider";
import { SocialAuthButtons } from "@/features/auth/components/SocialAuthButtons";
import { tokenStorage } from "@/core/auth/tokenStorage";

const toast = vi.hoisted(() => ({ success: vi.fn(), error: vi.fn(), info: vi.fn() }));
vi.mock("sonner", () => ({ toast }));
vi.mock("@/core/api/auth", () => ({ oauthGoogle: vi.fn(), logout: vi.fn() }));
vi.mock("@/core/auth/googleIdentity", () => ({ requestGoogleAuthCode: vi.fn() }));
import { oauthGoogle } from "@/core/api/auth";
import { requestGoogleAuthCode } from "@/core/auth/googleIdentity";

const user = { id: "u1", email: "lucas@gmail.com", name: "Lucas Martin", role: "student" };

function renderButtons() {
    return render(
        <AuthProvider>
            <MemoryRouter initialEntries={["/login"]}>
                <Routes>
                    <Route path="/login" element={<SocialAuthButtons />} />
                    <Route path="/dashboard" element={<p>dashboard</p>} />
                    <Route path="/mobility/new" element={<p>onboarding</p>} />
                </Routes>
            </MemoryRouter>
        </AuthProvider>
    );
}

async function clickGoogle() {
    await userEvent.setup({ delay: null }).click(screen.getByRole("button", { name: /google/i }));
}

describe("SocialAuthButtons — Google", () => {
    beforeEach(() => {
        localStorage.clear();
        sessionStorage.clear();
        vi.clearAllMocks();
    });

    it("sends the Google authorization code and opens the session", async () => {
        vi.mocked(requestGoogleAuthCode).mockResolvedValue("google-code");
        vi.mocked(oauthGoogle).mockResolvedValue({
            data: { data: { accessToken: "a", refreshToken: "r", user, isNewUser: false } },
        } as never);
        renderButtons();

        await clickGoogle();

        await waitFor(() => expect(screen.getByText("dashboard")).toBeInTheDocument());
        expect(oauthGoogle).toHaveBeenCalledWith({ code: "google-code" });
        expect(tokenStorage.getRefreshToken()).toBe("r");
    });

    it("sends a new Google user to the mobility onboarding", async () => {
        vi.mocked(requestGoogleAuthCode).mockResolvedValue("google-code");
        vi.mocked(oauthGoogle).mockResolvedValue({
            data: { data: { accessToken: "a", refreshToken: "r", user, isNewUser: true } },
        } as never);
        renderButtons();

        await clickGoogle();

        await waitFor(() => expect(screen.getByText("onboarding")).toBeInTheDocument());
    });

    it("does nothing when the popup is closed", async () => {
        vi.mocked(requestGoogleAuthCode).mockResolvedValue(null);
        renderButtons();

        await clickGoogle();

        await waitFor(() => expect(screen.getByRole("button", { name: /google/i })).toBeEnabled());
        expect(oauthGoogle).not.toHaveBeenCalled();
        expect(toast.error).not.toHaveBeenCalled();
    });

    it("shows the error when the Google popup fails", async () => {
        vi.mocked(requestGoogleAuthCode).mockRejectedValue(new Error("La fenêtre Google a été bloquée."));
        renderButtons();

        await clickGoogle();

        await waitFor(() => expect(toast.error).toHaveBeenCalledWith("La fenêtre Google a été bloquée."));
        expect(oauthGoogle).not.toHaveBeenCalled();
    });

    it("announces Apple and Microsoft as coming soon", async () => {
        renderButtons();
        const u = userEvent.setup({ delay: null });

        await u.click(screen.getByRole("button", { name: /apple/i }));
        await u.click(screen.getByRole("button", { name: /microsoft/i }));

        expect(toast.info).toHaveBeenCalledTimes(2);
    });
});
