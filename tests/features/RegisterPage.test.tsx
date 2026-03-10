import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import { AuthProvider } from "@/contexts/AuthProvider";
import RegisterPage from "@/features/auth/pages/RegisterPage";

function renderRegisterPage() {
    return render(
        <AuthProvider>
            <MemoryRouter>
                <RegisterPage />
            </MemoryRouter>
        </AuthProvider>
    );
}

describe("RegisterPage", () => {
    it("renders the first step of the registration form", () => {
        renderRegisterPage();

        expect(screen.getByRole("heading", { name: /Créer un compte/i })).toBeInTheDocument();
        // Uses placeholders for names
        expect(screen.getByPlaceholderText(/votre.email@exemple.com/i)).toBeInTheDocument();
        expect(screen.getAllByPlaceholderText(/••••••••/i).length).toBe(2);
        expect(screen.getByRole("button", { name: /continuer/i })).toBeInTheDocument();
    });

    it("advances to the second step when the first step is filled", async () => {
        const user = userEvent.setup({ delay: null });
        renderRegisterPage();

        // Fill out first step
        const emailInput = screen.getByPlaceholderText(/votre.email@exemple.com/i);
        const passwordInput = screen.getAllByPlaceholderText(/••••••••/i)[0];
        const confirmPasswordInput = screen.getAllByPlaceholderText(/••••••••/i)[1];
        const termsCheckbox = screen.getByRole("checkbox");

        await user.type(emailInput, "test@example.com");
        await user.type(passwordInput, "password123");
        await user.type(confirmPasswordInput, "password123");
        await user.click(termsCheckbox);

        // Click continuer
        const continueButton = screen.getByRole("button", { name: /continuer/i });
        await user.click(continueButton);

        // Should see the second step (First/Last name)
        expect(screen.queryByPlaceholderText(/votre.email@exemple.com/i)).not.toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Jean/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Dupont/i)).toBeInTheDocument();
    });

    it("has a link back to the login page", () => {
        renderRegisterPage();

        // Grabs the login link specifically by text to distinguish from TOC links
        const loginLink = screen.getByRole("link", { name: /se connecter/i });
        expect(loginLink).toHaveAttribute("href", "/login");
    });
});
