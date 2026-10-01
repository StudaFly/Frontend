import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ProfilePage from "@/features/profile/pages/ProfilePage";

const auth = vi.hoisted(() => ({
    user: {
        id: "u1",
        firstName: "Lucas",
        lastName: "Martin",
        email: "lucas@example.com",
        phone: "0612345678",
        avatar: "🚀",
        avatarType: "emoji" as const,
        cover: null,
    },
    updateUser: vi.fn(),
    logout: vi.fn(),
}));

vi.mock("@/contexts/AuthContext", () => ({ useAuth: () => auth }));
vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));
vi.mock("@/core/api/users", () => ({ updateMe: vi.fn(), deleteMe: vi.fn() }));
vi.mock("@/core/hooks/useActiveMobility", () => ({
    useActiveMobility: () => ({
        mobility: {
            id: "m1",
            type: "erasmus",
            destinationId: "d1",
            departureDate: "2027-01-15",
            returnDate: null,
            school: "Universitat de Barcelona",
        },
        destination: { id: "d1", city: "Barcelone", country: "Espagne" },
        isLoading: false,
    }),
}));

import { deleteMe, updateMe } from "@/core/api/users";

function renderProfilePage() {
    const queryClient = new QueryClient({ defaultOptions: { mutations: { retry: false } } });
    return render(
        <QueryClientProvider client={queryClient}>
            <MemoryRouter>
                <ProfilePage />
            </MemoryRouter>
        </QueryClientProvider>,
    );
}

describe("ProfilePage", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("shows the user and the real mobility", async () => {
        renderProfilePage();

        expect(screen.getByRole("heading", { name: "Lucas Martin" })).toBeInTheDocument();
        expect(screen.getByText("lucas@example.com")).toBeInTheDocument();
        expect(screen.getByText("0612345678")).toBeInTheDocument();
        expect(await screen.findByText("Erasmus")).toBeInTheDocument();
        expect(screen.getByText("Barcelone, Espagne")).toBeInTheDocument();
        expect(screen.getByText("15 janvier 2027")).toBeInTheDocument();
    });

    it("saves name, phone and avatar through the API", async () => {
        vi.mocked(updateMe).mockResolvedValue({
            data: { data: { id: "u1", name: "Lucas Durand", email: "lucas@example.com", phone: "0700000000", avatarEmoji: "🌍", role: "student" } },
        } as never);
        const user = userEvent.setup({ delay: null });
        renderProfilePage();

        await user.click(screen.getByRole("button", { name: /modifier le profil/i }));
        await user.clear(screen.getByLabelText("Nom"));
        await user.type(screen.getByLabelText("Nom"), "Durand");
        await user.clear(screen.getByLabelText("Téléphone"));
        await user.type(screen.getByLabelText("Téléphone"), "0700000000");
        await user.click(screen.getByRole("radio", { name: "Avatar 🌍" }));
        await user.click(screen.getByRole("button", { name: /enregistrer/i }));

        await waitFor(() =>
            expect(updateMe).toHaveBeenCalledWith({
                firstName: "Lucas",
                lastName: "Durand",
                phone: "0700000000",
                avatarEmoji: "🌍",
            }),
        );
        await waitFor(() =>
            expect(auth.updateUser).toHaveBeenCalledWith(expect.objectContaining({ lastName: "Durand", avatar: "🌍" })),
        );
    });

    it("deletes the account after confirmation and logs out", async () => {
        vi.spyOn(window, "confirm").mockReturnValue(true);
        vi.mocked(deleteMe).mockResolvedValue({} as never);
        const user = userEvent.setup({ delay: null });
        renderProfilePage();

        await user.click(screen.getByRole("button", { name: /supprimer mon compte/i }));

        await waitFor(() => expect(auth.logout).toHaveBeenCalled());
        expect(deleteMe).toHaveBeenCalled();
    });

    it("keeps the account when the confirmation is cancelled", async () => {
        vi.spyOn(window, "confirm").mockReturnValue(false);
        const user = userEvent.setup({ delay: null });
        renderProfilePage();

        await user.click(screen.getByRole("button", { name: /supprimer mon compte/i }));

        expect(deleteMe).not.toHaveBeenCalled();
    });
});
