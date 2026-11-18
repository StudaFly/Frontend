import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MyOrganizationCard } from "@/features/profile/components/MyOrganizationCard";
import { renderWithProviders } from "../utils/providers";

const auth = vi.hoisted(() => ({
    user: {
        firstName: "Lucas",
        lastName: "Martin",
        email: "lucas@example.com",
        avatar: null,
        avatarType: "emoji" as const,
        organization: null as null | { id: string; name: string; slug: string; logoUrl: null; branding: Record<string, string> },
        premium: { active: false, source: null as string | null, until: null },
    },
    refreshUser: vi.fn().mockResolvedValue(undefined),
}));
vi.mock("@/contexts/AuthContext", () => ({ useAuth: () => auth }));
vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));
vi.mock("@/core/api/organizations", () => ({ previewByCode: vi.fn(), joinOrganization: vi.fn() }));
vi.mock("@/core/api/users", () => ({ leaveOrganization: vi.fn() }));

import { joinOrganization, previewByCode } from "@/core/api/organizations";
import { leaveOrganization } from "@/core/api/users";

const SCHOOL = { id: "o1", name: "École Démo", slug: "ecole-demo", logoUrl: null, branding: { primary_color: "#33518A" } };

describe("MyOrganizationCard", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        auth.user.organization = null;
        auth.user.premium = { active: false, source: null, until: null };
    });

    it("shows the consent screen before joining with a school code", async () => {
        vi.mocked(previewByCode).mockResolvedValue({
            data: { data: { organization: SCHOOL, sharedWithSchool: ["profile", "progress"], neverShared: ["document_content"] } },
        } as never);
        vi.mocked(joinOrganization).mockResolvedValue({ data: { data: SCHOOL } } as never);
        const user = userEvent.setup();
        renderWithProviders(<MyOrganizationCard />);

        await user.type(screen.getByLabelText("Code d'école"), "abcde-12345");
        await user.click(screen.getByRole("button", { name: "Continuer" }));

        expect(await screen.findByText("École Démo pourra voir :")).toBeInTheDocument();
        expect(screen.getByText(/Le contenu de tes documents/)).toBeInTheDocument();
        expect(joinOrganization).not.toHaveBeenCalled();

        await user.click(screen.getByRole("button", { name: /j'accepte et je rejoins/i }));

        await waitFor(() => expect(joinOrganization).toHaveBeenCalledWith("abcde-12345"));
        expect(auth.refreshUser).toHaveBeenCalled();
    });

    it("warns that leaving drops the school Premium", async () => {
        auth.user.organization = SCHOOL;
        auth.user.premium = { active: true, source: "organization", until: null };
        vi.mocked(leaveOrganization).mockResolvedValue({} as never);
        const user = userEvent.setup();
        renderWithProviders(<MyOrganizationCard />);

        await user.click(screen.getByRole("button", { name: "Quitter l'établissement" }));

        expect(screen.getByText(/Premium offert par ton école s'arrête immédiatement/)).toBeInTheDocument();
        await user.click(screen.getByRole("button", { name: "Quitter" }));
        await waitFor(() => expect(leaveOrganization).toHaveBeenCalled());
    });
});
