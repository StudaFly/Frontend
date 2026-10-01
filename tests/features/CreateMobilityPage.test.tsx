import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import CreateMobilityPage from "@/features/mobility/pages/CreateMobilityPage";

vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));
vi.mock("@/core/api/destinations", () => ({ getDestinations: vi.fn() }));
vi.mock("@/core/api/mobilities", async (importOriginal) => ({
    ...(await importOriginal<typeof import("@/core/api/mobilities")>()),
    createMobility: vi.fn(),
}));

import { getDestinations } from "@/core/api/destinations";
import { createMobility } from "@/core/api/mobilities";

function renderPage() {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });
    return render(
        <QueryClientProvider client={queryClient}>
            <MemoryRouter initialEntries={["/mobility/new"]}>
                <Routes>
                    <Route path="/mobility/new" element={<CreateMobilityPage />} />
                    <Route path="/dashboard" element={<p>dashboard</p>} />
                </Routes>
            </MemoryRouter>
        </QueryClientProvider>,
    );
}

describe("CreateMobilityPage", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(getDestinations).mockResolvedValue({
            data: { data: [{ id: "d1", city: "Barcelone", country: "Espagne" }, { id: "d6", city: "Berlin", country: "Allemagne" }], message: "OK" },
        } as never);
        vi.mocked(createMobility).mockResolvedValue({ data: { data: { id: "m1" }, message: "OK" } } as never);
    });

    it("creates the mobility after the 4 steps then opens the dashboard", async () => {
        const user = userEvent.setup({ delay: null });
        renderPage();

        const next = () => user.click(screen.getByRole("button", { name: /continuer/i }));

        expect(screen.getByRole("button", { name: /continuer/i })).toBeDisabled();
        await user.click(await screen.findByRole("radio", { name: /stage/i }));
        await next();

        expect(screen.getByRole("button", { name: /continuer/i })).toBeDisabled();
        await user.click(await screen.findByRole("button", { name: /berlin/i }));
        expect(screen.getByRole("status")).toHaveTextContent("Berlin, Allemagne");
        await next();

        await user.type(screen.getByLabelText("Date de départ"), "2027-02-01");
        await next();

        await user.type(screen.getByLabelText(/école ou entreprise/i), "Siemens");
        await user.click(screen.getByRole("button", { name: /générer mon parcours/i }));

        await waitFor(() => expect(screen.getByText("dashboard")).toBeInTheDocument());
        expect(createMobility).toHaveBeenCalledWith({
            type: "stage",
            destinationId: "d6",
            departureDate: "2027-02-01",
            school: "Siemens",
        });
    });

    it("explains when no destination matches", async () => {
        vi.mocked(getDestinations).mockResolvedValue({ data: { data: [], message: "OK" } } as never);
        const user = userEvent.setup({ delay: null });
        renderPage();

        await user.click(await screen.findByRole("radio", { name: /erasmus/i }));
        await user.click(screen.getByRole("button", { name: /continuer/i }));

        expect(await screen.findByText(/aucune destination trouvée/i)).toBeInTheDocument();
    });
});
