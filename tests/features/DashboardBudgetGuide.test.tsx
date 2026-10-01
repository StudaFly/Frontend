import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import type { ReactElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import DashboardPage from "@/features/dashboard/pages/DashboardPage";
import BudgetPage from "@/features/budget/pages/BudgetPage";
import GuidePage from "@/features/guide/pages/GuidePage";

const active = vi.hoisted(() => ({ value: {} as Record<string, unknown> }));
vi.mock("@/core/hooks/useActiveMobility", () => ({ useActiveMobility: () => active.value }));
vi.mock("@/contexts/AuthContext", () => ({ useAuth: () => ({ user: { firstName: "Lucas" } }) }));
vi.mock("@/core/api/mobilities", () => ({ getProgress: vi.fn() }));
vi.mock("@/core/api/destinations", () => ({ getDestinationBudget: vi.fn(), getDestinationGuide: vi.fn() }));

import { getProgress } from "@/core/api/mobilities";
import { getDestinationBudget, getDestinationGuide } from "@/core/api/destinations";

const inDays = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

const mobility = { id: "m1", type: "erasmus", destinationId: "d1", departureDate: inDays(47), returnDate: inDays(47 + 183), school: null, daysUntilDeparture: 47, stayMonths: 6 };

function renderPage(ui: ReactElement) {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    return render(
        <QueryClientProvider client={queryClient}>
            <MemoryRouter>{ui}</MemoryRouter>
        </QueryClientProvider>,
    );
}

describe("student pages", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        active.value = {
            mobility,
            destination: { id: "d1", city: "Barcelone", country: "Espagne" },
            isLoading: false,
            hasNoMobility: false,
        };
    });

    it("dashboard shows countdown, progress and next deadlines", async () => {
        vi.mocked(getProgress).mockResolvedValue({
            data: {
                data: {
                    mobilityId: "m1",
                    totalTasks: 3,
                    completedTasks: 1,
                    percent: 33,
                    daysUntilDeparture: 47,
                    overdueTasks: 0,
                    byCategory: [
                        { category: "admin", label: "Admin", done: 1, total: 2 },
                        { category: "housing", label: "Logement", done: 0, total: 1 },
                    ],
                    nextTasks: [
                        { id: "t2", title: "Dossier visa", category: "admin", deadline: inDays(5), daysUntilDeadline: 5, isCompleted: false, priority: 1 },
                        { id: "t3", title: "Logement", category: "housing", deadline: inDays(30), daysUntilDeadline: 30, isCompleted: false, priority: 1 },
                    ],
                },
            },
        } as never);
        renderPage(<DashboardPage />);

        expect(await screen.findByText("Dossier visa")).toBeInTheDocument();
        expect(screen.getByRole("heading", { name: "Lucas !" })).toBeInTheDocument();
        expect(screen.getByText("Barcelone · Erasmus")).toBeInTheDocument();
        expect(screen.getByText("47 j")).toBeInTheDocument();
        expect(screen.getByText("33%")).toBeInTheDocument();
        expect(screen.getByText("Dans 5 jours")).toBeInTheDocument();
        expect(screen.queryByText("Passeport")).not.toBeInTheDocument();
    });

    it("invites to create a mobility when there is none", () => {
        active.value = { hasNoMobility: true };
        renderPage(<DashboardPage />);
        expect(screen.getByRole("link", { name: "Créer ma mobilité" })).toHaveAttribute("href", "/mobility/new");
    });

    it("budget page shows the reference budget of the destination", async () => {
        vi.mocked(getDestinationBudget).mockResolvedValue({
            data: {
                data: {
                    destinationId: "d1",
                    city: "Barcelone",
                    country: "Espagne",
                    monthlyTotalMin: 900,
                    monthlyTotalMax: 1300,
                    currency: "EUR",
                    breakdown: [{ key: "housing", label: "Logement", amountMin: 500, amountMax: 850, currency: "EUR" }],
                    tips: [],
                },
            },
        } as never);
        renderPage(<BudgetPage />);

        expect(await screen.findByText("Logement")).toBeInTheDocument();
        expect(getDestinationBudget).toHaveBeenCalledWith("d1");
        expect(screen.getByText(/sur 6 mois/)).toBeInTheDocument();
    });

    it("guide page shows sections and callable contacts", async () => {
        vi.mocked(getDestinationGuide).mockResolvedValue({
            data: {
                data: {
                    destinationId: "d1",
                    city: "Barcelone",
                    country: "Espagne",
                    sections: [{ key: "transport", title: "Transports", content: "T-Casual" }],
                    tips: ["Menu del día"],
                    keySteps: [{ title: "Visa", description: "Préparer le dossier", timing: "-4 mois" }],
                    emergencyContacts: { urgences: "112" },
                    usefulApps: [],
                },
            },
        } as never);
        renderPage(<GuidePage />);

        expect(await screen.findByText("Transports")).toBeInTheDocument();
        expect(screen.getByText("Menu del día")).toBeInTheDocument();
        expect(screen.getByRole("link", { name: /112/ })).toHaveAttribute("href", "tel:112");
        expect(screen.getByText("Préparer le dossier")).toBeInTheDocument();
    });
});
