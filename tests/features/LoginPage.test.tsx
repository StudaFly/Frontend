import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import { AuthProvider } from "@/contexts/AuthProvider";
import LoginPage from "@/features/auth/pages/LoginPage";

function renderLoginPage() {
    return render(
        <AuthProvider>
            <MemoryRouter>
                <LoginPage />
            </MemoryRouter>
        </AuthProvider>
    );
}

describe("LoginPage", () => {
    it("renders the login form elements", () => {
        renderLoginPage();

        expect(screen.getByRole("heading", { name: /bon retour !/i })).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/votre.email@exemple.com/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/••••••••/i)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /se connecter/i })).toBeInTheDocument();
    });

    it("allows user to type into inputs", async () => {
        const user = userEvent.setup();
        renderLoginPage();

        const emailInput = screen.getByPlaceholderText(/votre.email@exemple.com/i);
        const passwordInput = screen.getByPlaceholderText(/••••••••/i);

        await user.type(emailInput, "test@example.com");
        await user.type(passwordInput, "password123");

        expect(emailInput).toHaveValue("test@example.com");
        expect(passwordInput).toHaveValue("password123");
    });

    it("has a link to the register page", () => {
        renderLoginPage();

        const registerLink = screen.getByRole("link", { name: /créer un compte/i });
        expect(registerLink).toHaveAttribute("href", "/register");
    });
});

