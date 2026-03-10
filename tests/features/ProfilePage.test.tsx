import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";
import ProfilePage from "@/features/profile/pages/ProfilePage";

// Mock the AuthContext completely
vi.mock("@/contexts/AuthContext", () => ({
    useAuth: () => ({
        user: {
            firstName: "Joffrey",
            lastName: "Joffrey",
            email: "joffrey@exemple.com",
            age: "24",
            city: "Montpellier",
            destinations: ["Espagne", "Italie"],
            period: "S1 2025",
            budget: "800",
            avatar: null,
            avatarType: "emoji",
            cover: null,
        },
        updateUser: vi.fn(),
    })
}));

function renderProfilePage() {
    return render(
        <MemoryRouter>
            <ProfilePage />
        </MemoryRouter>
    );
}

describe("ProfilePage", () => {
    it("renders user information correctly", async () => {
        renderProfilePage();

        // Check if default mock user data is rendered
        expect(screen.getByText("Joffrey Joffrey")).toBeInTheDocument();
        expect(screen.getByText("joffrey@exemple.com")).toBeInTheDocument();
        expect(screen.getByText("24")).toBeInTheDocument();
        expect(screen.getByText("Montpellier")).toBeInTheDocument();
    });

    it("enters edit mode when 'Modifier le profil' is clicked", async () => {
        const user = userEvent.setup();
        renderProfilePage();

        const editButton = screen.getByRole("button", { name: /modifier le profil/i });
        await user.click(editButton);

        // Inputs should appear
        expect(screen.getAllByRole("textbox").length).toBeGreaterThan(0);

        // The button should now say "Enregistrer"
        expect(screen.getByRole("button", { name: /enregistrer/i })).toBeInTheDocument();
    });

    it("can edit user age and city", async () => {
        const user = userEvent.setup();
        renderProfilePage();

        // Click edit
        await user.click(screen.getByRole("button", { name: /modifier le profil/i }));

        // Find the inputs (since we use InfoItem, they don't have explicit accessible names unless linked by ID, so we grab by display value)
        const ageInput = screen.getByDisplayValue("24");
        const cityInput = screen.getByDisplayValue("Montpellier");

        // Change values
        await user.clear(ageInput);
        await user.type(ageInput, "25");

        await user.clear(cityInput);
        await user.type(cityInput, "Paris");

        // Save
        await user.click(screen.getByRole("button", { name: /enregistrer/i }));

        // The values should now be updated and inputs should be gone
        expect(screen.getByText("25")).toBeInTheDocument();
        expect(screen.getByText("Paris")).toBeInTheDocument();
        expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
    });
});
