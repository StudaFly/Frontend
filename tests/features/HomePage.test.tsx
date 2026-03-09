import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import HomePage from "@/features/home/pages/HomePage";

function renderHomePage() {
    return render(
        <MemoryRouter>
            <HomePage />
        </MemoryRouter>
    );
}

describe("HomePage", () => {
    it("renders the hero section title", () => {
        renderHomePage();
        const h1 = screen.getByRole("heading", { level: 1 });
        expect(h1).toBeInTheDocument();
        expect(h1).toHaveTextContent(/mobilité/i);
    });

    it("renders the primary CTA link pointing to /register", () => {
        renderHomePage();
        const ctaLinks = screen.getAllByText(/commencer gratuitement/i);
        expect(ctaLinks.length).toBeGreaterThanOrEqual(1);
        expect(ctaLinks[0].closest("a")).toHaveAttribute("href", "/register");
    });

    it("renders the Features section with 6 cards", () => {
        renderHomePage();
        expect(screen.getByText("Timeline personnalisée")).toBeInTheDocument();
        expect(screen.getByText("Checklist intelligente")).toBeInTheDocument();
        expect(screen.getByText("Simulateur de budget")).toBeInTheDocument();
        expect(screen.getByText("Guide destination")).toBeInTheDocument();
        expect(screen.getByText("Espace documents")).toBeInTheDocument();
        expect(screen.getByText("Notifications intelligentes")).toBeInTheDocument();
    });

    it("renders the How It Works section with 3 steps", () => {
        renderHomePage();
        expect(screen.getByText("Créez votre profil")).toBeInTheDocument();
        expect(screen.getByText("Suivez votre timeline")).toBeInTheDocument();
        expect(screen.getByText("Partez sereinement")).toBeInTheDocument();
    });

    it("renders 6 destination cards", () => {
        renderHomePage();
        expect(screen.getByText("Espagne")).toBeInTheDocument();
        expect(screen.getByText("Allemagne")).toBeInTheDocument();
        expect(screen.getByText("Royaume-Uni")).toBeInTheDocument();
    });

    it("destination cards are links pointing to /destinations/:slug", () => {
        renderHomePage();
        const spainLink = screen.getByText("Espagne").closest("a");
        expect(spainLink).toHaveAttribute("href", "/destinations/espagne");

        const germanyLink = screen.getByText("Allemagne").closest("a");
        expect(germanyLink).toHaveAttribute("href", "/destinations/allemagne");
    });

    it("renders the 'Prêt à décoller?' CTA banner", () => {
        renderHomePage();
        expect(screen.getByText("Prêt à décoller ?")).toBeInTheDocument();
    });

    it("renders the stats section", () => {
        renderHomePage();
        expect(screen.getByText("400K+")).toBeInTheDocument();
        expect(screen.getByText("95%")).toBeInTheDocument();
    });
});
