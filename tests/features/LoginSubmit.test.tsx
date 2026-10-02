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
vi.mock("@/core/api/auth", () => ({ login: vi.fn(), logout: vi.fn() }));
import { login as apiLogin } from "@/core/api/auth";

function renderLogin() {
    return render(
        <AuthProvider>
            <MemoryRouter initialEntries={["/login"]}>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/dashboard" element={<p>home</p>} />
                </Routes>
            </MemoryRouter>
        </AuthProvider>
    );
}

async function submit(remember = false) {
    const user = userEvent.setup({ delay: null });
    await user.type(screen.getByPlaceholderText(/votre.email@exemple.com/i), "lucas@example.com");
    await user.type(screen.getByPlaceholderText(/••••••••/i), "password123");
    if (remember) await user.click(screen.getByRole("checkbox"));
    await user.click(screen.getByRole("button", { name: /se connecter/i }));
}

describe("LoginPage submit", () => {
    beforeEach(() => {
        localStorage.clear();
        sessionStorage.clear();
        vi.clearAllMocks();
    });

    it("starts a session and always keeps the refresh token", async () => {
        vi.mocked(apiLogin).mockResolvedValue({
            data: {
                data: {
                    accessToken: "a",
                    refreshToken: "r",
                    user: { id: "u1", email: "lucas@example.com", name: "Lucas Martin", role: "student" },
                },
            },
        } as never);
        renderLogin();

        await submit(false);

        await waitFor(() => expect(screen.getByText("home")).toBeInTheDocument());
        expect(tokenStorage.getRefreshToken()).toBe("r");
        expect(sessionStorage.getItem("refreshToken")).toBe("r");
    });

    it("shows the backend error message", async () => {
        const config = { headers: new AxiosHeaders() };
        vi.mocked(apiLogin).mockRejectedValue(
            new AxiosError("401", "ERR", config, null, {
                data: { error: { code: "UNAUTHORIZED", message: "Invalid email or password" } },
                status: 401,
                statusText: "",
                headers: {},
                config,
            }),
        );
        renderLogin();

        await submit();

        await waitFor(() => expect(toast.error).toHaveBeenCalledWith("Invalid email or password"));
        expect(tokenStorage.hasSession()).toBe(false);
    });
});
