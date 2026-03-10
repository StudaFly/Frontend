import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import { Navbar } from "@/components/shared/Navbar";

import { AuthProvider } from "@/contexts/AuthProvider";

// Wrapper que tous les tests de ce fichier utilisent
function renderNavbar() {
    return render(
        <AuthProvider>
            <MemoryRouter>
                <Navbar />
            </MemoryRouter>
        </AuthProvider>
    );
}

describe("Navbar", () => {
    it("renders the StudaFly logo image", () => {
        renderNavbar();
        const logo = screen.getByAltText("StudaFly");
        expect(logo).toBeInTheDocument();
    });

    it("renders all navigation links on desktop", () => {
        renderNavbar();
        // All links are rendered (even if hidden via CSS on mobile)
        expect(screen.getAllByText("Accueil").length).toBeGreaterThanOrEqual(1);
        expect(screen.getAllByText("Destinations").length).toBeGreaterThanOrEqual(1);
        expect(screen.getAllByText("À propos").length).toBeGreaterThanOrEqual(1);
    });

    it("renders the login and signup action links", () => {
        renderNavbar();
        expect(screen.getAllByText("Connexion").length).toBeGreaterThanOrEqual(1);
        expect(screen.getAllByText("S'inscrire").length).toBeGreaterThanOrEqual(1);
    });

    it("home link points to /", () => {
        renderNavbar();
        const homeLinks = screen.getAllByText("Accueil");
        expect(homeLinks[0].closest("a")).toHaveAttribute("href", "/");
    });

    it("destinations link points to /destinations", () => {
        renderNavbar();
        const links = screen.getAllByText("Destinations");
        expect(links[0].closest("a")).toHaveAttribute("href", "/destinations");
    });

    it("about link points to /about", () => {
        renderNavbar();
        const links = screen.getAllByText("À propos");
        expect(links[0].closest("a")).toHaveAttribute("href", "/about");
    });

    it("login link points to /login", () => {
        renderNavbar();
        const links = screen.getAllByText("Connexion");
        expect(links[0].closest("a")).toHaveAttribute("href", "/login");
    });

    it("signup button points to /register", () => {
        renderNavbar();
        const links = screen.getAllByText("S'inscrire");
        expect(links[0].closest("a")).toHaveAttribute("href", "/register");
    });

    it("mobile menu is closed by default", () => {
        renderNavbar();
        // The mobile menu panel should not be visible initially
        expect(screen.queryByRole("button", { name: /fermer le menu/i })).not.toBeInTheDocument();
    });

    it("toggles the mobile menu open and closed on hamburger click", async () => {
        const user = userEvent.setup();
        renderNavbar();

        const openButton = screen.getByRole("button", { name: /ouvrir le menu/i });
        await user.click(openButton);

        // After click, button label should change to "close"
        expect(screen.getByRole("button", { name: /fermer le menu/i })).toBeInTheDocument();

        // Click again to close
        await user.click(screen.getByRole("button", { name: /fermer le menu/i }));
        expect(screen.getByRole("button", { name: /ouvrir le menu/i })).toBeInTheDocument();
    });
});
